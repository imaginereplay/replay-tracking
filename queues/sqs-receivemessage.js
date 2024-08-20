import sqs from "./config-sqs";

var queueURL = "process.env.SQS_QUEUE_URL";

const receiveMessages = async () => {
  const params = {
    AttributeNames: ["SentTimestamp"],
    MaxNumberOfMessages: 10, // TODO: Definir Número máximo de mensagens a serem recebidas
    MessageAttributeNames: ["All"],
    QueueUrl: queueURL,
    VisibilityTimeout: 20, // TODO Conferir Tempo que a mensagem fica invisível para outros consumidores
    WaitTimeSeconds: 20, // TODO: Conferir long polling
  };

  try {
    const data = await sqs.receiveMessage(params).promise();

    if (data.Messages) {
      console.log(`Received ${data.Messages.length} messages`);

      for (const message of data.Messages) {
        try {
          console.log("Processing message:", message.Body);

          // TODO: Processar mensagem recebida
          // const parsedMessage = JSON.parse(message.Body);

          await deleteMessage(message.ReceiptHandle);
        } catch (processError) {
          console.error("Error processing message:", processError);
        // TODO: Definir se caso falhar deve enviar para fila novamente ou não
        }
      }
    } else {
      console.log("No messages to process");
    }
  } catch (err) {
    console.error("Receive Error", err);
  }
};

const deleteMessage = async (receiptHandle) => {
  const params = {
    QueueUrl: queueURL,
    ReceiptHandle: receiptHandle,
  };

  try {
    await sqs.deleteMessage(params).promise();
    console.log("Message Deleted");
  } catch (err) {
    console.error("Delete Error", err);
  }
};
