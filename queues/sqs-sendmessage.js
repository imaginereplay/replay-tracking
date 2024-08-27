const { SendMessageCommand } = require("@aws-sdk/client-sqs");
const sqs = require("./config-sqs");
const { v4: uuidv4 } = require("uuid");


/**
 * Envia uma mensagem para a fila SQS.
 *
 * @param {Object} params - Parâmetros para o envio da mensagem.
 * @param {string} params.queueUrl - URL da fila SQS.
 * @param {Object} params.data - Dados a serem enviados na mensagem.
 * @param {string} params.jobId - ID do trabalho associado à mensagem.
 * @param {string} params.chunkId - ID do chunk associado à mensagem.
 * @param {number} [params.delaySeconds=0] - (Opcional) Número de segundos para atrasar o envio da mensagem.
 * @param {string} [params.messageGroupId] - (Opcional) Grupo de mensagens para garantir a ordem.
 * @param {Object} [params.messageAttributes={}] - (Opcional) Atributos da mensagem.
 * @returns {Promise<string>} - O ID da mensagem enviada.
 */
const sendMessageToQueue = async ({
  queueUrl,
  data,
  jobId,
  chunkId,
  delaySeconds = 0,
  messageGroupId,
  messageAttributes = {},
}) => {
  if (!queueUrl || !data || !jobId || !chunkId) {
    throw new Error("Invalid parameters: queueUrl, data, jobId, and chunkId are required.");
  }

  const messageBody = JSON.stringify({
    jobId,
    chunkId,
    data,
  });

  const messageDeduplicationId = uuidv4();
  const groupId = messageGroupId || jobId;

  const params = {
    QueueUrl: queueUrl,
    DelaySeconds: delaySeconds,
    MessageBody: messageBody,
    MessageDeduplicationId: messageDeduplicationId,
    MessageGroupId: groupId,
    MessageAttributes: messageAttributes,
  };

  try {
    const command = new SendMessageCommand(params);
    const response = await sqs.send(command);
    console.log(`Message sent successfully to SQS. Job ID: ${jobId}, Chunk ID: ${chunkId}, Message ID: ${response.MessageId}`);
    return response.MessageId;
  } catch (error) {
    console.error(`Error sending message to SQS. Job ID: ${jobId}, Chunk ID: ${chunkId}:`, error);
    throw error;
  }
};

module.exports = sendMessageToQueue;
