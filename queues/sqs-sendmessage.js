import sqs from "./config-sqs";

// Função para enviar mensagem para fila FIFO
const sendMessageToQueue = async (data) => {

  if (!data || !data.txnId || !data.userID) {
    throw new Error('Invalid data: txnId and userID are required.');
  }

  const messageBody = JSON.stringify(data);


  const messageDeduplicationId = `${data.txnId}-${Date.now()}`;
  const messageGroupId = 'Group1'; // TODO: Adicionar ID do grupo para manter a ordem das mensagens

  const params = {
    DelaySeconds: 0,
    MessageAttributes: {
      userID: {
        DataType: 'String',
        StringValue: data.userID,
      },
      movieId: {
        DataType: 'String',
        StringValue: data.movieId || '',
      },
      txnId: {
        DataType: 'String',
        StringValue: data.txnId,
      },
      amount: {
        DataType: 'Number',
        StringValue: data.amount.toString(),
      },
    },
    MessageBody: messageBody,
    MessageDeduplicationId: messageDeduplicationId,
    MessageGroupId: messageGroupId,
    QueueUrl: process.env.SQS_QUEUE_URL,
  };

  try {
    const result = await sqs.sendMessage(params).promise();
    console.log('Message sent successfully for Amazon SQS:', result.MessageId);
    return result.MessageId;
  } catch (error) {
    console.error('Error sending message to Amazon SQS:', error);
    throw error;
  }
};