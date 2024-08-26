const {BigQuery} = require("@google-cloud/bigquery");

const bigquery = new BigQuery();

class BigQueryRepository {
  constructor(datasetId) {
    this.datasetId = datasetId;
  }

  async insert(tableId, rows) {
    const table = bigquery.dataset(this.datasetId).table(tableId);
    try {
      await table.insert(rows);
      console.log(`Inserted ${rows.length} rows into ${tableId}`);
    } catch (error) {
      console.error("Error inserting data:", error);
      throw error;
    }
  }

  async update(tableId, conditions, updateFields) {
    const query = `
      UPDATE \`${this.datasetId}.${tableId}\`
      SET ${Object.keys(updateFields)
        .map((field) => `${field} = @${field}`)
        .join(", ")}
      WHERE ${Object.keys(conditions)
        .map((field) => `${field} = @${field}`)
        .join(" AND ")};
    `;

    const options = {
      query,
      params: { ...updateFields, ...conditions },
    };

    try {
      const [job] = await bigquery.createQueryJob(options);
      await job.getQueryResults();
      console.log(`Updated records in ${tableId}`);
    } catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  }

  async delete(tableId, conditions) {
    const query = `
      DELETE FROM \`${this.datasetId}.${tableId}\`
      WHERE ${Object.keys(conditions)
        .map((field) => `${field} = @${field}`)
        .join(" AND ")};
    `;

    const options = {
      query,
      params: conditions,
    };

    try {
      const [job] = await bigquery.createQueryJob(options);
      await job.getQueryResults();
      console.log(`Deleted records from ${tableId}`);
    } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  }
}

module.exports = BigQueryRepository;