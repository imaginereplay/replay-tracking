const { SendMessageCommand } = require("@aws-sdk/client-sqs");
const sqs = require("./config-sqs");
const { v4: uuidv4 } = require("uuid");


/**
 * Envia uma mensagem para a fila SQS.
 *
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
