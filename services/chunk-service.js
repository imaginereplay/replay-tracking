const BigQueryRepository = require("../repositories/bigquery-repository");

const repository = new BigQueryRepository(process.env.DATASET_ID);

const chunkData = async (array, chunkSize) => {
  const chunks = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }

  // Processar cada chunk de forma assíncrona
  await Promise.all(
    chunks.map(async (chunk, index) => {
      console.log(`Processando chunk ${index + 1}`);
      // Insira para cada chunk um registro na tabela blockchainJobs
      await sendToBlockchainJobs(chunk);
      // Insira para cada chunk um registro na tabela currentBlockchainEntries
      await sendCurrentBlockchainEntries(chunk);
    })
  );

  return chunks;
};

const sendToBlockchainJobs = async (chunk) => {
  const rows = chunk.map((item) => ({
    job_uuid: "default_uuid",
    status: "in_progress",
    start_time: "",
    end_time: "",
    error_message: "",
    retry_count: "",
  }));

  try {
    // await repository.insert("blockchainJobs", rows);

    console.log(`Chunk ${index + 1} inserido com sucesso.`);
  } catch (error) {
    console.error(`Erro ao inserir chunk ${index + 1}:`, error);
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

module.exports = chunkData;
