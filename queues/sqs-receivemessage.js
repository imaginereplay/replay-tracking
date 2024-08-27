const {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  DeleteMessageBatchCommand,
} = require("@aws-sdk/client-sqs");
const { v4: uuidv4 } = require("uuid");

const client = new SQSClient({ region: process.env.AWS_REGION });

/**
 * Recebe mensagens de uma fila SQS.
 *
 */
const receiveMessages = async (
  queueUrl,
  maxMessages = 10,
  waitTime = 20,
  visibilityTimeout = 20
) => {
  const command = new ReceiveMessageCommand({
    AttributeNames: ["SentTimestamp"],
    MaxNumberOfMessages: maxMessages,
    MessageAttributeNames: ["All"],
    QueueUrl: queueUrl,
    WaitTimeSeconds: waitTime,
    VisibilityTimeout: visibilityTimeout,
  });

  try {
    const response = await client.send(command);
    return response.Messages || [];
  } catch (error) {
    console.error("Error receiving messages from SQS:", error);
    throw error;
  }
};

/**
 * Exclui uma mensagem da fila SQS.
 *
 */
const deleteMessage = async (queueUrl, receiptHandle) => {
  const command = new DeleteMessageCommand({
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  });

  try {
    await client.send(command);
    console.log(`Message deleted successfully: ${receiptHandle}`);
  } catch (error) {
    console.error(
      `Error deleting message with handle ${receiptHandle}:`,
      error
    );
    throw error;
  }
};

/**
 * Exclui mensagens em lote da fila SQS.
 *
 */
const deleteMessagesBatch = async (queueUrl, receiptHandles) => {
  if (receiptHandles.length === 0) return;

  const entries = receiptHandles.map((handle) => ({
    Id: uuidv4(), // Gerar um ID único para cada entrada
    ReceiptHandle: handle,
  }));

  const command = new DeleteMessageBatchCommand({
    QueueUrl: queueUrl,
    Entries: entries,
  });

  try {
    const response = await client.send(command);
    if (response.Failed && response.Failed.length > 0) {
      console.error("Failed to delete some messages:", response.Failed);
    } else {
      console.log("Batch deletion successful.");
    }
  } catch (error) {
    console.error("Error deleting messages in batch:", error);
    throw error;
  }
};

/**
 * Função principal para processar mensagens da fila SQS.
 *
 */
const processMessages = async (
  queueUrl,
  processMessage,
  maxMessages = 10,
  waitTime = 20,
  visibilityTimeout = 20
) => {
  // Recebe mensagens da fila
  const messages = await receiveMessages(
    queueUrl,
    maxMessages,
    waitTime,
    visibilityTimeout
  );

  // Se não houver mensagens, sai da função
  if (messages.length === 0) return;

  // Armazena os handles de recibo das mensagens que foram processadas com sucesso
  const receiptHandles = [];

  // Itera sobre cada mensagem recebida
  for (const message of messages) {
    try {
      // Processa a mensagem
      await processMessage(message);
      // Se o processamento for bem-sucedido, adiciona o handle de recibo à lista
      receiptHandles.push(message.ReceiptHandle);
    } catch (error) {
      // Se houver um erro ao processar a mensagem, registra o erro e continua com a próxima mensagem
      console.error("Error processing message:", error);
    }
  }

  // Exclui as mensagens que foram processadas com sucesso
  if (receiptHandles.length > 0) {
    await deleteMessagesBatch(queueUrl, receiptHandles);
  }
};

module.exports = {
  receiveMessages,
  deleteMessage,
  deleteMessagesBatch,
  processMessages,
};
