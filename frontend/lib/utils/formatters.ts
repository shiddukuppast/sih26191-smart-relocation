export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return "N/A";
  return new Intl.NumberFormat("en-IN").format(num);
}

export function formatPercentage(val: number | undefined | null, decimals = 1): string {
  if (val === undefined || val === null || isNaN(val)) return "N/A";
  return `${val.toFixed(decimals)}%`;
}

export function formatDistance(km: number | undefined | null): string {
  if (km === undefined || km === null || isNaN(km)) return "N/A";
  return `${km.toFixed(1)} km`;
}

export function formatScore(score: number | undefined | null): string {
  if (score === undefined || score === null || isNaN(score)) return "N/A";
  return `${Math.round(score)}/100`;
}
