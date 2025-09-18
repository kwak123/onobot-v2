import "dotenv/config";
import { REST, Routes } from "discord.js";
import commands from "./commands";

// Check if required environment variables are set
if (!process.env.DISCORD_TOKEN) {
  console.error("❌ DISCORD_TOKEN is not set in .env file");
  process.exit(1);
}

if (!process.env.CLIENT_ID) {
  console.error("❌ CLIENT_ID is not set in .env file");
  process.exit(1);
}

if (!process.env.ALPHAVANTAGE_KEY) {
  console.error("❌ ALPHAVANTAGE_KEY is not set in .env file");
  process.exit(1);
}

// Extract command data for deployment
const commandData = commands.map((command) => command.data.toJSON());

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Deploy commands
(async (): Promise<void> => {
  try {
    console.log(
      `🚀 Started refreshing ${commandData.length} application (/) commands.`
    );

    let data: any[];

    if (process.env.GUILD_ID) {
      // Deploy to specific guild (faster for development)
      console.log(`📍 Deploying to guild: ${process.env.GUILD_ID}`);
      data = (await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID!,
          process.env.GUILD_ID
        ),
        { body: commandData }
      )) as any[];
    } else {
      // Deploy globally (takes up to 1 hour to propagate)
      console.log("🌍 Deploying globally (may take up to 1 hour to appear)");
      data = (await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID!),
        { body: commandData }
      )) as any[];
    }

    console.log(
      `✅ Successfully reloaded ${data.length} application (/) commands.`
    );

    // List deployed commands
    console.log("\n📋 Deployed commands:");
    data.forEach((command: any) => {
      console.log(`  • /${command.name} - ${command.description}`);
    });
  } catch (error) {
    console.error("❌ Error deploying commands:", error);

    if (error && typeof error === "object" && "code" in error) {
      const errorCode = (error as any).code;

      if (errorCode === 50001) {
        console.error(
          '💡 Make sure your bot has the "applications.commands" scope when inviting it to your server.'
        );
      } else if (errorCode === 10002) {
        console.error(
          "💡 Invalid CLIENT_ID. Make sure CLIENT_ID is set correctly in your .env file."
        );
      } else if (errorCode === 50035) {
        console.error(
          "💡 Invalid command structure. Check your command definitions."
        );
      }
    }
  }
})();
