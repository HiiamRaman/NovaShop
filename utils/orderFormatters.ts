// Convert stored minor units into display currency.
// Example: 14500000 becomes 145,000.
export function formatMoney(
  amountInMinorUnit: number
) {
  const safeAmount = Number.isFinite(
    amountInMinorUnit
  )
    ? amountInMinorUnit
    : 0;

  return new Intl.NumberFormat("en-NP", {
    maximumFractionDigits: 2,
  }).format(safeAmount / 100);
}

export function formatOrderDate(
  date: string
) {
  const parsedDate = new Date(date);

  if (
    Number.isNaN(parsedDate.getTime())
  ) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

export function formatOrderStatus(
  status: string
) {
  return status
    .replaceAll("_", " ")
    .replaceAll("-", " ");
}
