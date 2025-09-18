import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  Events,
  Collection,
  Message,
  ChatInputCommandInteraction,
  TextBasedChannel,
} from "discord.js";
import config from "./config";
import commands from "./commands";
import { SlashCommand, BotConfig } from "./types";

// Extend the Discord.js Client interface
declare module "discord.js" {
  interface Client {
    commands: Collection<string, SlashCommand>;
  }
}

// Helper function to get channel name safely
function getChannelName(channel: TextBasedChannel | null): string {
  if (!channel) return "Unknown";
  if ("name" in channel) return channel.name || "Unknown";
  return "DM";
}

// Validate required environment variables
if (!process.env.DISCORD_TOKEN) {
  console.error("❌ DISCORD_TOKEN environment variable is required");
  process.exit(1);
}

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
const { messagePatterns, allowedChannels, responses, logging }: BotConfig =
  config;

// Set up slash commands
client.commands = new Collection<string, SlashCommand>();
commands.forEach((command) => {
  client.commands.set(command.data.name, command);
});

// When the client is ready, run this code
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Listen for messages
client.on(Events.MessageCreate, async (message: Message) => {
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

// Handle slash command interactions
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);

    if (logging.logCommands) {
      console.log(
        `Slash command executed: /${interaction.commandName} by ${
          interaction.user.tag
        } in ${interaction.guild?.name || "DM"}#${getChannelName(
          interaction.channel
        )}`
      );
    }
  } catch (error) {
    console.error("Error executing slash command:", error);

    const errorMessage = {
      content: "There was an error while executing this command!",
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Handle commands
async function handleCommand(message: Message): Promise<void> {
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (!command) return;

  if (logging.logCommands) {
    console.log(
      `Command executed: ${config.prefix}${command} by ${
        message.author.tag
      } in ${message.guild?.name || "DM"}#${getChannelName(message.channel)}`
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
        `Bot: ${client.user?.tag}\nServer: ${
          message.guild?.name || "DM"
        }\nChannel: ${getChannelName(message.channel)}`
      );
      break;

    default:
      await message.reply(
        responses.commands.unknownCommand.replace("{command}", command)
      );
  }
}

// Check message against patterns
async function checkMessagePatterns(message: Message): Promise<void> {
  for (const pattern of messagePatterns) {
    if (pattern.test(message.content)) {
      if (logging.logPatternMatches) {
        console.log(
          `Pattern matched in ${message.guild?.name || "DM"}#${getChannelName(
            message.channel
          )}: ${pattern}`
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
