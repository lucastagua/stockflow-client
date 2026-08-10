export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-AR");
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleString("es-AR");
}

export function formatCurrencyArs(value: number) {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCurrencyUsd(value: number) {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatNumber(value: number) {
  return value.toLocaleString("es-AR");
}