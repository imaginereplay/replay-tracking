const sendMessageToQueue = require("../queues/sqs-sendmessage");
const BigQueryRepository = require("../repositories/bigquery-repository");
const { v4: uuidv4 } = require('uuid');

const repository = new BigQueryRepository(process.env.DATASET_ID);

const chunkArray = (data, size) => {
  const chunks = [];
  for (let i = 0; i < data.length; i += size) {
    chunks.push(data.slice(i, i + size));
  }
  return chunks;
};

const processData = async (data) => {
  const jobId = uuidv4(); // Gera um Job ID único
  const chunks = chunkArray(data, 100);

  for (let i = 0; i < chunks.length; i++) {
    const chunkId = uuidv4(); // Gera um Chunk ID único
    const chunk = chunks[i];

    // Insere o chunk no BigQuery
    await sendToBlockchainJobs(chunk, jobId, chunkId);

    // Envia o chunk para a fila SQS
    await sendMessageToQueue({
      queueUrl: process.env.SQS_QUEUE_URL,
      data: chunk,
      jobId: jobId,
      chunkId: chunkId,
      delaySeconds: 0, // Opcional
      messageGroupId: jobId, // Opcional
      messageAttributes: {
        JobId: {
          DataType: "String",
          StringValue: jobId,
        },
        ChunkId: {
          DataType: "String",
          StringValue: chunkId,
        },
      },
    });

    console.log(`Job ID ${jobId}, Chunk ${i + 1} enqueued`);
  }
};

const sendToBlockchainJobs = async (chunk, jobId, chunkId) => {
  const rows = chunk.map((item) => ({
    job_uuid: jobId,
    status: "in_progress",
    start_time: new Date().toISOString(),
    end_time: "",
    error_message: "",
    retry_count: 0,
  }));

  try {
    await repository.insert("blockchainJobs", rows);
    console.log(`Chunk inserted successfully into blockchainJobs.`);
  } catch (error) {
    console.error(`Error inserting chunk into blockchainJobs:`, error);
  }
};


const sendCurrentBlockchainEntries = async (chunk) => {
  // Prepare rows for currentBlockchainEntries
  const currentBlockchainEntriesRows = chunk.map((item, chunkIndex) => ({
    job_uuid: "",
    chunk_number: index + 1,
    user_id: "",
    content_owner_id: "",
    rewards: "",
    retry_count: "",
  }));

  // Insert into currentBlockchainEntries
  try {
    // await repository.insert(
    //   "currentBlockchainEntries",
    //   currentBlockchainEntriesRows
    // );
    console.log(
      `Chunk ${index + 1} inserido com sucesso na currentBlockchainEntries.`
    );
  } catch (error) {
    console.error(
      `Erro ao inserir chunk ${index + 1} na currentBlockchainEntries:`,
      error
    );
  }
};

module.exports = processData;
