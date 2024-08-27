const { processMessages } = require("../queues/sqs-receivemessage");

const queueUrl = process.env.SQS_QUEUE_URL;

/**
 * Função para processar uma mensagem.
 * @param {object} message - Mensagem recebida do SQS.
 * @returns {Promise<void>}
 */
const processMessage = async (message) => {
  try {
    // Lógica para processar a mensagem
    console.log("Processing message:", message.Body);
    
    // Exemplo de processamento
    const data = JSON.parse(message.Body);
    // Adicione aqui a lógica para processar os dados

  } catch (error) {
    console.error("Error processing message:", error);
    throw error;
  }
};

// Função principal para iniciar o processamento de mensagens
const startProcessing = async () => {
  try {
    await processMessages(queueUrl, processMessage, 10, 20, 20);
    console.log("Finished processing messages.");
  } catch (error) {
    console.error("Error in message processing:", error);
  }
};

// Iniciar o processamento
startProcessing();
