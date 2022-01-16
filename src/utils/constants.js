const prefix = '!'

const helpersCommands = [
  {
    command: `${prefix}tx <transaction hash> <NFT fee in %>`,
    explain: `Return a total cost of transaction and a minimum sell price.`
  },
  {
    command: `${prefix}help`,
    explain: 'List commands.'
  }
]

const METAPLEX_TOKEN_METADATA_PROGRAM =
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';
const MAGIC_EDEN_ACCOUNT_ADDRESS =
  '2NZukH2TXpcuZP4htiuT8CFxcaQSWzkkR6kepSWnZ24Q';

module.exports = {
  prefix,
  helpersCommands,
  METAPLEX_TOKEN_METADATA_PROGRAM,
  MAGIC_EDEN_ACCOUNT_ADDRESS
};