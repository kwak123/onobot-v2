# Examples

## Pattern Examples

Here are some common patterns you might want to add to your `config.js`:

### Basic Patterns

```javascript
messagePatterns: [
    /hello/i,                           // Matches "hello" (case-insensitive)
    /\b(help|support)\b/i,             // Matches "help" or "support" as whole words
    /urgent/i,                          // Matches "urgent" anywhere in message
    /\b\d{3}-\d{3}-\d{4}\b/,          // Matches phone numbers (XXX-XXX-XXXX)
    /@everyone|@here/,                  // Matches @everyone or @here mentions
]
```

### Advanced Patterns

```javascript
messagePatterns: [
    /\b(?:bug|error|issue|problem)\b/i,     // Bug reports
    /\b(?:feature|request|suggestion)\b/i,   // Feature requests
    /\b(?:thanks?|thank you)\b/i,           // Gratitude expressions
    /\b(?:https?:\/\/[^\s]+)/,              // URLs
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email addresses
]
```

## Configuration Examples

### Example 1: Support Bot

```javascript
// config.js
module.exports = {
    prefix: '!',
    
    messagePatterns: [
        /\b(?:help|support|stuck|problem|issue)\b/i,
        /\b(?:bug|error|broken|not working)\b/i,
    ],
    
    allowedChannels: [
        '1234567890123456789', // #support channel
        '9876543210987654321', // #help channel
    ],
    
    responses: {
        patternDetected: {
            react: '🆘',
            reply: 'I noticed you might need help! A support team member will be with you shortly.',
            log: true
        },
        // ... rest of config
    }
};
```

### Example 2: Moderation Bot

```javascript
// config.js
module.exports = {
    prefix: '!',
    
    messagePatterns: [
        /@everyone|@here/,                    // Mass mentions
        /\b(?:spam|scam|phishing)\b/i,       // Suspicious content
        /discord\.gg\/[a-zA-Z0-9]+/,         // Discord invite links
    ],
    
    allowedChannels: [], // Monitor all channels
    
    responses: {
        patternDetected: {
            react: '⚠️',
            reply: null, // Don't reply publicly
            log: true
        },
        // ... rest of config
    }
};
```

### Example 3: Welcome Bot

```javascript
// config.js
module.exports = {
    prefix: '!',
    
    messagePatterns: [
        /\b(?:hello|hi|hey|greetings)\b/i,
        /\b(?:new|newbie|beginner)\b/i,
    ],
    
    allowedChannels: [
        '1111111111111111111', // #general
        '2222222222222222222', // #introductions
    ],
    
    responses: {
        patternDetected: {
            react: '👋',
            reply: 'Welcome! Feel free to ask questions in our support channels.',
            log: true
        },
        // ... rest of config
    }
};
```

## Testing Your Bot

1. **Set up your environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your bot token
   ```

2. **Add test patterns**:
   ```javascript
   // In config.js
   messagePatterns: [
       /test/i,  // Simple test pattern
   ],
   ```

3. **Run the bot**:
   ```bash
   npm start
   ```

4. **Test in Discord**:
   - Send a message containing "test" to see if the bot reacts
   - Try commands like `!ping`, `!help`, `!info`

## Common Issues

### Bot not responding to patterns
- Check that the bot has "Message Content Intent" enabled in Discord Developer Portal
- Verify the pattern syntax is correct
- Make sure the bot is in the correct channels (check `allowedChannels`)

### Bot not responding to commands
- Verify the command prefix matches your configuration
- Check that the bot has permission to send messages
- Look at console logs for error messages

### Permission errors
- Ensure bot has these permissions:
  - Send Messages
  - Read Message History
  - Add Reactions (if using reactions)
  - Use External Emojis (if using custom emojis)
