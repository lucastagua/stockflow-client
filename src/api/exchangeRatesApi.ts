import { axiosClient } from "./axiosClient";
import type {
  CreateExchangeRateRequest,
  ExchangeRate,
} from "../types/exchangeRate";

export async function getExchangeRates() {
  const response = await axiosClient.get<ExchangeRate[]>("/ExchangeRates");

  return response.data;
}

export async function getLatestExchangeRate() {
  const response = await axiosClient.get<ExchangeRate>("/ExchangeRates/latest");

  return response.data;
}

export async function createExchangeRate(exchangeRate: CreateExchangeRateRequest) {
  const response = await axiosClient.post<ExchangeRate>(
    "/ExchangeRates",
    exchangeRate
  );

  return response.data;
}