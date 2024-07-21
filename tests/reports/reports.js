const axios = require('axios');
const fs = require('fs');

const apiUrl = 'http://localhost:3000';
const testData = {
  address: '0xe0CCdBD21Fce0EC9eB4c23E4CbB3ac678cAf0Dd7',
  month: 7,
  year: 2024,
  day: 20,
  movieId: '300',
  timeWatched: 120,
  amountEarned: 5,
  batchData: [
    {
      userID: '0xe0CCdBD21Fce0EC9eB4c23E4CbB3ac678cAf0Dd7',
      month: 7,
      year: 2024,
      day: 20,
      movieId: 'movie123',
      timeWatched: 30,
      amountEarned: 500
    },
    {
      userID: '0xe0CCdBD21Fce0EC9eB4c23E4CbB3ac678cAf0Dd7',
      month: 7,
      year: 2024,
      day: 20,
      movieId: 'movie124',
      timeWatched: 60,
      amountEarned: 873
    }
  ]
};

const tests = [
  {
    name: 'Add Tokens',
    method: 'POST',
    url: `${apiUrl}/addTokens`,
    headers: { 'Content-Type': 'application/json' },
    data: { address: testData.address, amount: '100' }
  },
  // {
  //   name: 'Update Balance',
  //   method: 'POST',
  //   url: `${apiUrl}/updateBalance`,
  //   headers: { 'Content-Type': 'application/json' },
  //   data: { address: testData.address, amount: '200' }
  // },
  {
    name: 'Increment Record',
    method: 'POST',
    url: `${apiUrl}/incrementRecord`,
    headers: { 'Content-Type': 'application/json' },
    data: {
      userID: testData.address,
      month: testData.month,
      year: testData.year,
      day: testData.day,
      movieId: testData.movieId,
      timeWatched: testData.timeWatched,
      amountEarned: testData.amountEarned
    }
  },
  {
    name: 'Batch Increment Records',
    method: 'POST',
    url: `${apiUrl}/batchIncrementRecords`,
    headers: { 'Content-Type': 'application/json' },
    data: { data: testData.batchData }
  },
  {
    name: 'Add Transaction',
    method: 'POST',
    url: `${apiUrl}/addTransaction`,
    headers: { 'Content-Type': 'application/json' },
    data: {
      userID: testData.address,
      month: testData.month,
      year: testData.year,
      day: testData.day,
      txnId: 'txn123',
      walletAddress: testData.address,
      amount: '50',
      type_: 'user'
    }
  },
  {
    name: 'Get Consolidated By Movie',
    method: 'GET',
    url: `${apiUrl}/getConsolidatedByMovie?userID=${testData.address}&month=${testData.month}&year=${testData.year}&day=${testData.day}&movieId=${testData.movieId}`,
    headers: { 'Content-Type': 'application/json' }
  },
  {
    name: 'Get Consolidated By Month',
    method: 'GET',
    url: `${apiUrl}/getConsolidatedByMonth?userID=${testData.address}&month=${testData.month}&year=${testData.year}`,
    headers: { 'Content-Type': 'application/json' }
  },
  {
    name: 'Get Consolidated By Year',
    method: 'GET',
    url: `${apiUrl}/getConsolidatedByYear?userID=${testData.address}&year=${testData.year}`,
    headers: { 'Content-Type': 'application/json' }
  },
  {
    name: 'Get Transactions By Month',
    method: 'GET',
    url: `${apiUrl}/getTransactionsByMonth?userID=${testData.address}&month=${testData.month}&year=${testData.year}`,
    headers: { 'Content-Type': 'application/json' }
  },
  {
    name: 'Get Transactions By Year',
    method: 'GET',
    url: `${apiUrl}/getTransactionsByYear?userID=${testData.address}&year=${testData.year}`,
    headers: { 'Content-Type': 'application/json' }
  },
  {
    name: 'Get Daily Transactions',
    method: 'GET',
    url: `${apiUrl}/getDailyTransactions?userID=${testData.address}&month=${testData.month}&year=${testData.year}&day=${testData.day}`,
    headers: { 'Content-Type': 'application/json' }
  },
  {
    name: 'Get User Summary',
    method: 'GET',
    url: `${apiUrl}/getUserSummary?userID=${testData.address}&month=${testData.month}&year=${testData.year}`,
    headers: { 'Content-Type': 'application/json' }
  },
  {
    name: 'Get Total Transactions By User',
    method: 'GET',
    url: `${apiUrl}/getTotalTransactionsByUser?userID=${testData.address}&month=${testData.month}&year=${testData.year}`,
    headers: { 'Content-Type': 'application/json' }
  },
  {
    name: 'Get User Details',
    method: 'GET',
    url: `${apiUrl}/getUserDetails?userID=${testData.address}&topYear=${testData.year}`,
    headers: { 'Content-Type': 'application/json' }
  },
  {
    name: 'Get Monthly Yearly Report',
    method: 'GET',
    url: `${apiUrl}/getMonthlyYearlyReport?month=${testData.month}&year=${testData.year}`,
    headers: { 'Content-Type': 'application/json' }
  }
];

const runTests = async () => {
  const results = [];
  for (const test of tests) {
    try {
      const response = await axios({
        method: test.method,
        url: test.url,
        headers: test.headers,
        data: test.data
      });
      results.push({
        name: test.name,
        status: response.status,
        dataSent: test.data,
        dataReceived: response.data
      });
      console.log(`Test ${test.name} passed`);
    } catch (error) {
      results.push({ name: test.name, error: error.message });
      console.error(`Test ${test.name} failed: ${error.message}`);
    }
  }
  fs.writeFileSync('tests/reports/report.json', JSON.stringify(results, null, 2));
};

runTests();
