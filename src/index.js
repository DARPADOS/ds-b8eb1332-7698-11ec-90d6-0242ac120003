////////////////////
const dotenv = require('dotenv')
dotenv.config()
////////////////////

const Discord = require("discord.js");
const { prefix, helpersCommands } = require('./utils/constants.js');
const { getSolanaMintCost, lamportsToSolana } = require('./utils/solanaTransaction.js');
const BOT_TOKEN = process.env.BOT_TOKEN;

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })
client.login(BOT_TOKEN);

const errorReply = (message, error) => {

  const msgReply = `❌ **${error}**`;
  const author = message.author.toString();
  const embed = new Discord.MessageEmbed()
    .setTitle('Error')
    .setColor('#FF0000')
    .setDescription(msgReply);
  message.channel.send({
    content: author,
    embeds: [embed]
  })
}

const transactionHandler = async (message, args) => {

  if (!(args.length === 2)) {
    errorReply(message, 'Number of incorrect arguments.');
    return;
  }

  const fee = Number(args[1] / 100);

  if (!(typeof fee === 'number')) {
    errorReply(message, 'The second argument is not a number.');
    return;
  }

  try {
    const {
      DetailsCostDataFinal,
      TotalCost,
      transactionType
    } = await getSolanaMintCost(args[0]);

    const minSellPrice = (TotalCost / (1 - fee));

    const msg = `✅**Tx type: ${transactionType}\n\n💸Tx cost: ${lamportsToSolana(TotalCost)} SOL\n\n💰 Min. sell price: ${lamportsToSolana(minSellPrice).toFixed(7)} SOL**`;
    const author = message.author.toString();

    const embed = new Discord.MessageEmbed()
      .setTitle('Result')
      .setColor('#379c6f')
      .setDescription(msg);

    message.channel.send({
      content: author,
      embeds: [embed]
    })

  } catch (error) {
    if (error.toString() === 'Error: failed to get confirmed transaction: Invalid param: Invalid' || error.toString() === 'Error: failed to get confirmed transaction: Invalid param: WrongSize') {
      errorReply(message, 'Invalid transaction hash');
      return;
    }
    errorReply(message, error);
  }
}

const helpHandler = (message, args) => {
  if (!(args.length === 0)) return;

  const msg = helpersCommands.map((value) => `**${value.command}**: ${value.explain}`)
    .join('\n');

  const embed = new Discord.MessageEmbed()
    .setTitle('Commands')
    .setColor('#379c6f')
    .setDescription(msg);
  message.channel.send({
    content: '\n',
    embeds: [embed]
  })
}

client.on("message", function async(message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ').filter(a => a !== '');
  const command = args.shift().toLowerCase();

  switch (command) {
    case 'tx':
      transactionHandler(message, args);
      break;
    case 'help':
      helpHandler(message, args);
    default:
      break;
  }
  return;
});