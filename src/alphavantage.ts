import axios, { AxiosResponse } from 'axios';
import { 
    StockQuote, 
    AlphaVantageQuoteResponse, 
    AlphaVantageErrorResponse, 
    StockQueryResult, 
    DiscordEmbedField 
} from './types';

class AlphaVantageAPI {
    private apiKey: string;
    private baseURL: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseURL = 'https://www.alphavantage.co/query';
    }

    async getQuote(symbol: string): Promise<StockQuote> {
        try {
            const response: AxiosResponse<AlphaVantageQuoteResponse & AlphaVantageErrorResponse> = await axios.get(this.baseURL, {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: symbol.toUpperCase(),
                    apikey: this.apiKey
                }
            });

            const data = response.data;
            
            // Check for API errors
            if (data['Error Message']) {
                throw new Error(`API Error: ${data['Error Message']}`);
            }
            
            if (data['Note']) {
                throw new Error('API rate limit exceeded. Please try again later.');
            }

            const quote = data['Global Quote'];
            if (!quote) {
                throw new Error(`No data found for symbol: ${symbol}`);
            }

            return {
                symbol: quote['01. symbol'],
                price: parseFloat(quote['05. price']),
                change: parseFloat(quote['09. change']),
                changePercent: quote['10. change percent'].replace('%', ''),
                volume: parseInt(quote['06. volume']),
                previousClose: parseFloat(quote['08. previous close']),
                open: parseFloat(quote['02. open']),
                high: parseFloat(quote['03. high']),
                low: parseFloat(quote['04. low']),
                latestTradingDay: quote['07. latest trading day']
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(`API request failed: ${error.response.status} ${error.response.statusText}`);
            }
            throw error;
        }
    }

    async getMultipleQuotes(symbols: string[]): Promise<StockQueryResult> {
        const results: StockQuote[] = [];
        const errors: Array<{ symbol: string; error: string }> = [];

        // Process symbols one by one to respect rate limits
        for (const symbol of symbols) {
            try {
                const quote = await this.getQuote(symbol.trim());
                results.push(quote);
                
                // Add delay between requests to respect rate limits (free tier: 5 requests per minute)
                if (symbols.length > 1) {
                    await new Promise(resolve => setTimeout(resolve, 12000)); // 12 second delay
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                errors.push({ symbol: symbol.trim(), error: errorMessage });
            }
        }

        return { results, errors };
    }

    formatQuoteForDiscord(quote: StockQuote): DiscordEmbedField {
        const changeEmoji = quote.change >= 0 ? '📈' : '📉';
        const changeColor = quote.change >= 0 ? '+' : '';
        
        return {
            name: `${quote.symbol} ${changeEmoji}`,
            value: `**$${quote.price.toFixed(2)}**\n` +
                   `${changeColor}$${quote.change.toFixed(2)} (${changeColor}${quote.changePercent}%)\n` +
                   `Open: $${quote.open.toFixed(2)} | High: $${quote.high.toFixed(2)} | Low: $${quote.low.toFixed(2)}\n` +
                   `Volume: ${quote.volume.toLocaleString()}\n` +
                   `Last Updated: ${quote.latestTradingDay}`,
            inline: true
        };
    }
}

export default AlphaVantageAPI;
