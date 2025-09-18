# onobot-v2

A Discord bot designed to monitor specific channels for message patterns and respond to commands.

## Features

- **Pattern Matching**: Monitor messages for specific regex patterns
- **Commands**: Built-in command system with prefix support
- **Channel Filtering**: Optionally restrict bot to specific channels
- **Environment Configuration**: Secure configuration via environment variables
- **Error Handling**: Comprehensive error handling and logging

## Setup

### Prerequisites

- Node.js 16.0.0 or higher
- A Discord application and bot token

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

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

### Configuration

#### Message Patterns

Edit the `messagePatterns` array in `index.js` to add regex patterns:

```javascript
const messagePatterns = [
  /hello/i, // Case-insensitive "hello"
  /\b(help|support)\b/i, // "help" or "support" as whole words
  /urgent/i, // Case-insensitive "urgent"
];
```

#### Channel Filtering

Edit the `allowedChannels` array in `index.js` to restrict bot to specific channels:

```javascript
const allowedChannels = [
  "1234567890123456789", // Replace with actual channel IDs
  "9876543210987654321",
];
```

Leave empty to allow bot in all channels.

### Built-in Commands

- `!ping` - Test bot responsiveness
- `!help` - Show available commands
- `!info` - Display bot and server information

### Adding Custom Commands

Add new commands in the `handleCommand` function in `index.js`:

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

## Environment Variables

| Variable        | Description                       | Required | Default     |
| --------------- | --------------------------------- | -------- | ----------- |
| `DISCORD_TOKEN` | Your Discord bot token            | Yes      | -           |
| `NODE_ENV`      | Environment mode                  | No       | development |
| `BOT_PREFIX`    | Command prefix                    | No       | !           |
| `GUILD_ID`      | Specific guild ID for development | No       | -           |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC
