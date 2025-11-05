export enum Tab {
  Weather = 'WEATHER',
  Currency = 'CURRENCY',
  Quote = 'QUOTE',
}

export type WeatherIconType = 'SUN' | 'CLOUD' | 'RAIN' | 'WIND' | 'STORM' | 'FOG';

export interface WeatherData {
  location: string;
  temperatureCelsius: number;
  condition: string;
  icon: WeatherIconType;
  humidity: number;
  windSpeedKph: number;
}

export interface CurrencyRates {
  USD: number;
  EUR: number;
}

export interface QuoteData {
  quote: string;
  author: string;
}
