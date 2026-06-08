import { useCallback, useEffect, useState } from "react";
import {
  createExchangeRate,
  getExchangeRates,
  getLatestExchangeRate,
} from "../api/exchangeRatesApi";
import { getApiErrorMessage } from "../api/apiError";
import { recalculateProductPrices } from "../api/productsApi";
import type { ExchangeRate } from "../types/exchangeRate";
import { PageHeader } from "../components/PageHeader";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingState } from "../components/LoadingState";

export function ExchangeRatesPage() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [latestRate, setLatestRate] = useState<ExchangeRate | null>(null);
  const [newRateValue, setNewRateValue] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [error, setError] = useState("");

  const fetchExchangeRates = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const [history, latest] = await Promise.all([
        getExchangeRates(),
        getLatestExchangeRate(),
      ]);

      setRates(history);
      setLatestRate(latest);
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not load exchange rates."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  async function handleCreateExchangeRate(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (newRateValue <= 0) {
      setError("Exchange rate must be greater than zero.");
      return;
    }

    try {
      setIsCreating(true);
      setError("");
      setSuccessMessage("");

      await createExchangeRate({
        value: Number(newRateValue),
      });

      setNewRateValue(0);
      setSuccessMessage("Exchange rate created successfully.");
      await fetchExchangeRates();
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not create exchange rate."));
    } finally {
      setIsCreating(false);
    }
  }

  async function handleRecalculatePrices() {
    const confirmed = window.confirm(
      "This will update prices for all active products using the latest exchange rate. Continue?"
    );

    if (!confirmed) return;

    try {
      setIsRecalculating(true);
      setError("");
      setSuccessMessage("");

      const result = await recalculateProductPrices();

      setSuccessMessage(
        `Prices recalculated for ${result.updatedProducts} products using exchange rate ${result.exchangeRate}.`
      );
    } catch (error) {
      setError(getApiErrorMessage(error, "Could not recalculate prices."));
    } finally {
      setIsRecalculating(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Exchange Rates"
        description="Manage exchange rates used for product price calculation."
      />

      <ErrorMessage message={error} />

      {successMessage && <p className="success-message">{successMessage}</p>}

      <section className="summary-grid summary-grid-two">
        <div className="summary-card">
          <p className="summary-card-title">Latest Exchange Rate</p>
          <h3>
            {latestRate
              ? `$${latestRate.value.toLocaleString("es-AR")}`
              : "No rate"}
          </h3>
          <p className="summary-card-description">
            {latestRate
              ? new Date(latestRate.date).toLocaleString("es-AR")
              : "No exchange rate registered yet."}
          </p>
        </div>

        <div className="summary-card">
          <p className="summary-card-title">Price Recalculation</p>
          <h3>Update products</h3>
          <p className="summary-card-description">
            Recalculate active product prices using the latest exchange rate.
          </p>

          <button
            className="button button-primary"
            type="button"
            disabled={isRecalculating || !latestRate}
            onClick={handleRecalculatePrices}
          >
            {isRecalculating ? "Recalculating..." : "Recalculate Prices"}
          </button>
        </div>
      </section>

      <form className="form-card" onSubmit={handleCreateExchangeRate}>
        <h2>Create Exchange Rate</h2>

        <div className="form-grid form-grid-compact">
          <label className="form-field">
            <span>Exchange Rate Value</span>
            <input
              type="number"
              placeholder="Example: 1200"
              value={newRateValue}
              onChange={(event) => setNewRateValue(Number(event.target.value))}
              min="0"
              step="0.01"
              required
            />
          </label>
        </div>

        <button className="button button-primary" type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Exchange Rate"}
        </button>
      </form>

      {isLoading ? (
        <LoadingState message="Loading exchange rates..." />
      ) : (
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Value</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {rates.length === 0 ? (
                <tr>
                  <td colSpan={3}>No exchange rates found.</td>
                </tr>
              ) : (
                rates.map((rate) => (
                  <tr key={rate.id}>
                    <td>#{rate.id}</td>
                    <td>${rate.value.toLocaleString("es-AR")}</td>
                    <td>{new Date(rate.date).toLocaleString("es-AR")}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}