export interface ExchangeRate {
  id: number;
  value: number;
  date: string;
}

export interface CreateExchangeRateRequest {
  value: number;
}

export interface RecalculatePricesResponse {
  updatedProducts: number;
  exchangeRate: number;
  exchangeRateDate: string;
}