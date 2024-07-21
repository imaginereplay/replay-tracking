const axios = require('axios');
const fs = require('fs');

const apiUrl = 'http://localhost:3000';
const testData = {
  address: '0xe0CCdBD21Fce0EC9eB4c23E4CbB3ac678cAf0Dd7',
  initialAmount: '100',
  updatedAmount: '200',
  month: 8,
  year: 2024,
  day: 10,
  movieId: '300',
  timeWatched: 120,
  amountEarned: 5,
  txnId: 'txn123',
  amount: '50',
  type: 'user',
  batchData: [
    {
      userID: '0xe0CCdBD21Fce0EC9eB4c23E4CbB3ac678cAf0Dd7',
      month: 12,
      year: 2024,
      day: 21,
      movieId: 'movie123',
      timeWatched: 30,
      amountEarned: 500
    },
    {
      userID: '0xe0CCdBD21Fce0EC9eB4c23E4CbB3ac678cAf0Dd7',
      month: 11,
      year: 2024,
      day: 19,
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
    data: { address: testData.address, amount: testData.initialAmount }
  },
  {
    name: 'Update Balance',
    method: 'POST',
    url: `${apiUrl}/updateBalance`,
    headers: { 'Content-Type': 'application/json' },
    data: { address: testData.address, amount: testData.updatedAmount }
  },
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
      txnId: testData.txnId,
      walletAddress: testData.address,
      amount: testData.amount,
      type_: testData.type
    }
  },
  {
    name: 'Emit Total Earned By All Users',
    method: 'POST',
    url: `${apiUrl}/emitTotalEarnedByAllUsers`,
    headers: { 'Content-Type': 'application/json' },
    data: { month: testData.month, year: testData.year }
  },
  {
    name: 'Emit Top Earners',
    method: 'POST',
    url: `${apiUrl}/emitTopEarners`,
    headers: { 'Content-Type': 'application/json' },
    data: { month: testData.month, year: testData.year }
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
  },
  {
    name: 'Add Admin',
    method: 'POST',
    url: `${apiUrl}/addAdmin`,
    headers: { 'Content-Type': 'application/json' },
    data: { newAdmin: testData.address }
  },
  {
    name: 'Remove Admin',
    method: 'POST',
    url: `${apiUrl}/removeAdmin`,
    headers: { 'Content-Type': 'application/json' },
    data: { adminToRemove: testData.address }
  },
  {
    name: 'Set Token Admin',
    method: 'POST',
    url: `${apiUrl}/setTokenAdmin`,
    headers: { 'Content-Type': 'application/json' },
    data: { newTokenAdmin: testData.address }
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
  fs.writeFileSync('tests/all.json', JSON.stringify(results, null, 2));
};

runTests();
