export function fmtKm(km: number): string {
  if (!Number.isFinite(km)) return "0.00";
  return km.toFixed(2);
}
