import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from 'discord.js';
import AlphaVantageAPI from './alphavantage';
import { SlashCommand } from './types';

if (!process.env.ALPHAVANTAGE_KEY) {
    throw new Error('ALPHAVANTAGE_KEY environment variable is required');
}

const alphaVantage = new AlphaVantageAPI(process.env.ALPHAVANTAGE_KEY);

const commands: SlashCommand[] = [
    {
        data: new SlashCommandBuilder()
            .setName('onoprice')
            .setDescription('Get stock prices for one or more tickers')
            .addStringOption(option =>
                option.setName('tickers')
                    .setDescription('Comma-separated list of stock tickers (e.g., AAPL,MSFT,GOOGL)')
                    .setRequired(true)
            ),
        async execute(interaction: ChatInputCommandInteraction): Promise<void> {
            const tickersInput = interaction.options.getString('tickers', true);
            const tickers = tickersInput.split(',').map(t => t.trim().toUpperCase()).filter(t => t.length > 0);

            if (tickers.length === 0) {
                await interaction.reply({
                    content: '❌ Please provide at least one valid ticker symbol.',
                    ephemeral: true
                });
                return;
            }

            if (tickers.length > 5) {
                await interaction.reply({
                    content: '❌ Please limit your request to 5 tickers or fewer to avoid rate limits.',
                    ephemeral: true
                });
                return;
            }

            // Defer the reply since API calls might take time
            await interaction.deferReply();

            try {
                const { results, errors } = await alphaVantage.getMultipleQuotes(tickers);

                const embed = new EmbedBuilder()
                    .setTitle('📊 Stock Prices')
                    .setColor(0x00AE86)
                    .setTimestamp()
                    .setFooter({ text: 'Data provided by Alpha Vantage' });

                // Add successful results
                if (results.length > 0) {
                    results.forEach(quote => {
                        const field = alphaVantage.formatQuoteForDiscord(quote);
                        embed.addFields(field);
                    });
                }

                // Add error information
                if (errors.length > 0) {
                    const errorText = errors.map(err => `**${err.symbol}**: ${err.error}`).join('\n');
                    embed.addFields({
                        name: '❌ Errors',
                        value: errorText,
                        inline: false
                    });
                }

                if (results.length === 0 && errors.length > 0) {
                    embed.setColor(0xFF0000);
                    embed.setTitle('❌ No Stock Data Retrieved');
                }

                await interaction.editReply({ embeds: [embed] });

            } catch (error) {
                console.error('Error in onoprice command:', error);
                await interaction.editReply({
                    content: '❌ An error occurred while fetching stock data. Please try again later.',
                });
            }
        }
    }
];

export default commands;
