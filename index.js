require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");
const config = require("./config");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Get configuration
const { messagePatterns, allowedChannels, responses, logging } = config;

// When the client is ready, run this code
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Listen for messages
client.on(Events.MessageCreate, async (message) => {
  // Ignore messages from bots
  if (message.author.bot) return;

  // Check if bot should respond in this channel
  if (
    allowedChannels.length > 0 &&
    !allowedChannels.includes(message.channel.id)
  ) {
    return;
  }

  // Check for command prefix
  if (message.content.startsWith(config.prefix)) {
    await handleCommand(message);
    return;
  }

  // Check message against patterns
  await checkMessagePatterns(message);
});

// Handle commands
async function handleCommand(message) {
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (logging.logCommands) {
    console.log(
      `Command executed: ${config.prefix}${command} by ${message.author.tag} in ${message.guild?.name}#${message.channel.name}`
    );
  }

  switch (command) {
    case "ping":
      await message.reply(responses.commands.ping);
      break;

    case "help":
      await message.reply(responses.commands.help);
      break;

    case "info":
      await message.reply(
        `Bot: ${client.user.tag}\nServer: ${
          message.guild?.name || "DM"
        }\nChannel: ${message.channel.name || "DM"}`
      );
      break;

    default:
      await message.reply(
        responses.commands.unknownCommand.replace("{command}", command)
      );
  }
}

// Check message against patterns
async function checkMessagePatterns(message) {
  for (const pattern of messagePatterns) {
    if (pattern.test(message.content)) {
      if (logging.logPatternMatches) {
        console.log(
          `Pattern matched in ${message.guild?.name || "DM"}#${
            message.channel.name
          }: ${pattern}`
        );
      }

      // React with configured emoji
      if (responses.patternDetected.react) {
        await message.react(responses.patternDetected.react);
      }

      // Reply with configured message
      if (responses.patternDetected.reply) {
        await message.reply(responses.patternDetected.reply);
      }

      break; // Remove this if you want to check all patterns
    }
  }
}

// Error handling
client.on(Events.Error, (error) => {
  if (logging.logErrors) {
    console.error("Discord client error:", error);
  }
});

process.on("unhandledRejection", (error) => {
  if (logging.logErrors) {
    console.error("Unhandled promise rejection:", error);
  }
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
