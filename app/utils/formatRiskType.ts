export function formatRiskType(riskType: string): string {
  return riskType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
