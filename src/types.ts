import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export interface BotConfig {
  prefix: string;
  messagePatterns: RegExp[];
  allowedChannels: string[];
  responses: {
    patternDetected: {
      react: string | null;
      reply: string | null;
      log: boolean;
    };
    commands: {
      ping: string;
      help: string;
      unknownCommand: string;
    };
  };
  logging: {
    logPatternMatches: boolean;
    logCommands: boolean;
    logErrors: boolean;
  };
}

export interface SlashCommand {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: string;
  volume: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  latestTradingDay: string;
}

export interface AlphaVantageQuoteResponse {
  "Global Quote": {
    "01. symbol": string;
    "02. open": string;
    "03. high": string;
    "04. low": string;
    "05. price": string;
    "06. volume": string;
    "07. latest trading day": string;
    "08. previous close": string;
    "09. change": string;
    "10. change percent": string;
  };
}

export interface AlphaVantageErrorResponse {
  "Error Message"?: string;
  Note?: string;
}

export interface StockQueryResult {
  results: StockQuote[];
  errors: Array<{ symbol: string; error: string }>;
}

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline: boolean;
}
