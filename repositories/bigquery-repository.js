// The worker starts the job and adds an entry into blockchainJobs with status = in_progress.
const blockchainJobs = async () => {
  console.log("Inserting blockchain jobs");
};

// The worker pulls the past hour's data from BigQuery, chunks the data, and adds each entry into currentBlockchainEntries along with chunk_number.
const currentBlockchainEntries = async () => {
  console.log("Inserting current blockchain entries");
};
