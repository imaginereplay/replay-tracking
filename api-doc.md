### Documentation for `/getTransactions` Endpoint

#### Description:

This endpoint retrieves transactions based on various query parameters such as `userID`, `assetID`, and date (`day`, `month`, `year`). It requires an API key for authentication.

#### Method:

**GET** `/getTransactions`

#### Query Parameters:

- **userID** (required for all requests): The ID of the user.
- **assetID** (optional): The ID of the asset.
- **day, month, year** (optional): Specific date to filter transactions.

#### Response:

- **200**: List of transactions (serialized).
- **400**: Invalid query parameters.
- **404**: No transactions found.
- **500**: Internal server error.

#### Sample Requests:

1. **Transactions by `userID`, `assetID`, and specific date** (most important):

   ```
   GET https://replay-smart-tracking-605f3b1c61cb.herokuapp.com/getTransactions?userID=65d1aa5090f536899ffd9baf&assetID=64653e1079cd3b7d4c055841&day=3&month=9&year=2024
   ```

2. **Transactions by `userID` only**:

   ```
   GET https://replay-smart-tracking-605f3b1c61cb.herokuapp.com/getTransactions?userID=6433052c79cd3b7d4c054d45
   ```

3. **Transactions by `userID` and `assetID`**:
   ```
   GET https://replay-smart-tracking-605f3b1c61cb.herokuapp.com/getTransactions?userID=65d1aa5090f536899ffd9baf&assetID=64653e1079cd3b7d4c055841
   ```

#### Authentication:

- Include an `x_api_key` header with the request. Example:
  ```
  x_api_key: your_api_key_here
  ```

#### Contract Address:

`0x34196d358ed65c56680b3C038faaA0DF04F254fE`
