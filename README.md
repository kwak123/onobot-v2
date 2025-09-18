# onobot-v2

A Discord bot designed to monitor specific channels for message patterns and respond to commands. Built with TypeScript for type safety and better development experience.

## Features

- **Pattern Matching**: Monitor messages for specific regex patterns
- **Commands**: Built-in command system with prefix support
- **Slash Commands**: Modern Discord slash commands with stock price functionality
- **Channel Filtering**: Optionally restrict bot to specific channels
- **Environment Configuration**: Secure configuration via environment variables
- **Error Handling**: Comprehensive error handling and logging
- **TypeScript**: Full TypeScript support for type safety and better development experience

## Setup

### Prerequisites

- Node.js 16.0.0 or higher
- TypeScript knowledge (optional but recommended)
- A Discord application and bot token
- Alpha Vantage API key (for stock price functionality)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kwak123/onobot-v2.git
   cd onobot-v2
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```
   DISCORD_TOKEN=your_discord_bot_token_here
   NODE_ENV=development
   BOT_PREFIX=!
   GUILD_ID=your_guild_id_here
   ```

### Discord Bot Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to the "Bot" section and create a bot
4. Copy the bot token and add it to your `.env` file
5. Under "Privileged Gateway Intents", enable:
   - Message Content Intent
   - Server Members Intent (if needed)
6. Generate an invite link with appropriate permissions:
   - Send Messages
   - Read Message History
   - Use Slash Commands (if implementing slash commands)

## Usage

### Running the Bot

Development mode (with TypeScript compilation):

```bash
npm run dev
```

Production mode (builds and runs):

```bash
npm start
```

Build only:

```bash
npm run build
```

Watch mode (auto-recompile on changes):

```bash
npm run watch
```

### Setting Up Slash Commands

Before using slash commands, you need to deploy them to Discord:

1. Add your Discord application's Client ID to your `.env` file:

   ```
   CLIENT_ID=your_discord_application_client_id_here
   ```

2. Deploy the slash commands:

   ```bash
   npm run deploy
   ```

3. For development, you can deploy to a specific guild for faster updates:
   ```
   GUILD_ID=your_test_server_guild_id_here
   ```

### Configuration

#### Message Patterns

Edit the `messagePatterns` array in `src/config.ts` to add regex patterns:

```javascript
const messagePatterns = [
  /hello/i, // Case-insensitive "hello"
  /\b(help|support)\b/i, // "help" or "support" as whole words
  /urgent/i, // Case-insensitive "urgent"
];
```

#### Channel Filtering

Edit the `allowedChannels` array in `src/config.ts` to restrict bot to specific channels:

```javascript
const allowedChannels = [
  "1234567890123456789", // Replace with actual channel IDs
  "9876543210987654321",
];
```

Leave empty to allow bot in all channels.

### Built-in Commands

#### Text Commands (Prefix: !)

- `!ping` - Test bot responsiveness
- `!help` - Show available commands
- `!info` - Display bot and server information

#### Slash Commands

- `/onoprice tickers:<symbols>` - Get stock prices for comma-separated ticker symbols (e.g., AAPL,MSFT,GOOGL)

### Adding Custom Commands

Add new commands in the `handleCommand` function in `src/index.ts`:

```javascript
case 'newcommand':
    await message.reply('Response to new command');
    break;
```

### Adding Pattern Responses

Customize pattern responses in the `checkMessagePatterns` function:

```javascript
async function checkMessagePatterns(message) {
  for (const pattern of messagePatterns) {
    if (pattern.test(message.content)) {
      // Add your response logic here
      await message.react("👍");
      await message.reply("Pattern detected!");
      break;
    }
  }
}
```

## TypeScript Development

This project is built with TypeScript for better type safety and development experience.

### Project Structure

```
src/
├── index.ts              # Main bot entry point
├── config.ts             # Bot configuration
├── commands.ts           # Slash command definitions
├── alphavantage.ts       # Alpha Vantage API wrapper
├── deploy-commands.ts    # Command deployment script
├── types.ts              # TypeScript type definitions
└── discord-extensions.d.ts # Discord.js type extensions
```

### Type Safety Features

- **Strict TypeScript configuration** with comprehensive type checking
- **Custom interfaces** for bot configuration, API responses, and commands
- **Discord.js type extensions** for enhanced client functionality
- **Environment variable validation** at startup
- **Compile-time error detection** for better code quality

### Development Workflow

1. **Make changes** to TypeScript files in the `src/` directory
2. **Use watch mode** for automatic recompilation: `npm run watch`
3. **Run in development** with `npm run dev` (uses ts-node)
4. **Build for production** with `npm run build`
5. **Deploy commands** with `npm run deploy`

## Environment Variables

| Variable           | Description                       | Required | Default     |
| ------------------ | --------------------------------- | -------- | ----------- |
| `DISCORD_TOKEN`    | Your Discord bot token            | Yes      | -           |
| `CLIENT_ID`        | Your Discord application ID       | Yes\*    | -           |
| `ALPHAVANTAGE_KEY` | Your Alpha Vantage API key        | Yes\*    | -           |
| `NODE_ENV`         | Environment mode                  | No       | development |
| `BOT_PREFIX`       | Command prefix                    | No       | !           |
| `GUILD_ID`         | Specific guild ID for development | No       | -           |

\*Required for slash commands and stock price functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC
