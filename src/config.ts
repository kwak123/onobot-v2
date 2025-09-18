import { BotConfig } from './types';

// Bot configuration
const config: BotConfig = {
    // Command prefix (can be overridden by BOT_PREFIX env var)
    prefix: process.env.BOT_PREFIX || '!',
    
    // Message patterns to watch for
    // Add your regex patterns here
    messagePatterns: [
        // Example patterns (uncomment and modify as needed):
        // /hello/i,                    // Case-insensitive "hello"
        // /\b(help|support)\b/i,      // "help" or "support" as whole words
        // /urgent/i,                   // Case-insensitive "urgent"
        // /\b\d{3}-\d{3}-\d{4}\b/,    // Phone number pattern
        // /@everyone|@here/,           // Mentions everyone/here
    ],
    
    // Allowed channels (channel IDs)
    // Leave empty array to allow bot in all channels
    allowedChannels: [
        // Example: '1234567890123456789',
        // Example: '9876543210987654321',
    ],
    
    // Bot responses configuration
    responses: {
        // Default responses for patterns
        patternDetected: {
            react: '👀',  // Emoji to react with when pattern is found
            reply: null,  // Message to reply with (null = no reply)
            log: true     // Whether to log pattern matches
        },
        
        // Command responses
        commands: {
            ping: 'Pong! 🏓',
            help: 'Available commands:\n`!ping` - Test bot responsiveness\n`!help` - Show this help message\n`!info` - Show bot information',
            unknownCommand: 'Unknown command: `{command}`. Use `!help` for available commands.'
        }
    },
    
    // Logging configuration
    logging: {
        logPatternMatches: true,
        logCommands: true,
        logErrors: true
    }
};

export default config;
