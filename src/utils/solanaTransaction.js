const web3 = require('@solana/web3.js');
const {
  MAGIC_EDEN_ACCOUNT_ADDRESS,
  METAPLEX_TOKEN_METADATA_PROGRAM,
} = require('./constants');

let connection = new web3.Connection(web3.clusterApiUrl('mainnet-beta'));

const lamportsToSolana = (amountInLamport) =>
  amountInLamport / web3.LAMPORTS_PER_SOL;

const someAccountKeys = (accountKeys, key) => accountKeys.some((value) => value.toString() === key);

const parseTransactionsCost = (metadata) => {
  const TotalCost = Math.abs(
    metadata.postBalances[0] - metadata.preBalances[0]
  );

  const DetailsCostData = metadata.postBalances
    .map((value, index) => {
      if (index !== 0) {
        const postBalance = value;
        const preBalance = metadata.preBalances[index];
        if (postBalance !== preBalance) {
          return {
            id: index,
            costName: 'Program Cost',
            costAmount: lamportsToSolana(postBalance - preBalance),
          };
        }
      }
    })
    .filter((value) => value !== undefined);

  const DetailsCostDataFinal = [
    ...DetailsCostData,
    {
      id: DetailsCostData.length + 1,
      costName: 'Transaction Fee',
      costAmount: lamportsToSolana(metadata.fee),
    },
  ];

  return {
    DetailsCostDataFinal,
    TotalCost,
  };
}

const getSolanaMintCost = async (txn) => {
  const response = await connection.getTransaction(txn);

  if (response === null) {
    throw "The transaction don't exist";
  }

  const accountKeys = response.transaction.message.accountKeys;

  const metadata = response.meta;

  if (someAccountKeys(accountKeys, METAPLEX_TOKEN_METADATA_PROGRAM)) {
    const transactionType = 'Minted on metaplex candy machine';
    return {
      ...parseTransactionsCost(metadata),
      transactionType,
    }
  }

  if (someAccountKeys(accountKeys, MAGIC_EDEN_ACCOUNT_ADDRESS)) {
    const transactionType = 'Purchased at Magic Eden';
    return {
      ...parseTransactionsCost(metadata),
      transactionType,
    }
  }

  throw "The Hash doesn't a mint o purchase transaction.";
};

module.exports = {
  getSolanaMintCost,
  lamportsToSolana
}