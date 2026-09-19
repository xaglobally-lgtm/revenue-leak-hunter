export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rateAgainstUSD: number;
  decimals: number;
}

export const supportedCurrencies: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateAgainstUSD: 1.0, decimals: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateAgainstUSD: 0.92, decimals: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateAgainstUSD: 0.78, decimals: 2 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateAgainstUSD: 152.0, decimals: 0 },
  THB: { code: 'THB', symbol: '฿', name: 'Thai Baht', rateAgainstUSD: 35.5, decimals: 0 },
  IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rateAgainstUSD: 15800.0, decimals: 0 },
  VND: { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', rateAgainstUSD: 25000.0, decimals: 0 },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rateAgainstUSD: 3.67, decimals: 2 },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won', rateAgainstUSD: 1350.0, decimals: 0 },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rateAgainstUSD: 7.22, decimals: 2 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rateAgainstUSD: 1.36, decimals: 2 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateAgainstUSD: 1.52, decimals: 2 },
};

export function formatConvertedMoney(
  rawUSDAmount: number | string | undefined | null,
  targetCurrencyCode: string = 'USD'
): string {
  if (rawUSDAmount === undefined || rawUSDAmount === null) return '$0.00';

  const numUSD = typeof rawUSDAmount === 'number' ? rawUSDAmount : parseFloat(String(rawUSDAmount));
  if (isNaN(numUSD)) return '$0.00';

  const curr = supportedCurrencies[targetCurrencyCode] || supportedCurrencies.USD;
  const converted = numUSD * curr.rateAgainstUSD;

  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: curr.decimals,
    maximumFractionDigits: curr.decimals,
  }).format(converted);

  if (curr.code === 'USD' || curr.code === 'CAD' || curr.code === 'AUD') {
    return `${curr.symbol}${formattedNumber}`;
  } else if (curr.code === 'EUR' || curr.code === 'GBP' || curr.code === 'JPY' || curr.code === 'THB' || curr.code === 'KRW' || curr.code === 'CNY') {
    return `${curr.symbol}${formattedNumber}`;
  } else if (curr.code === 'IDR') {
    return `Rp ${formattedNumber}`;
  } else if (curr.code === 'VND') {
    return `${formattedNumber} ₫`;
  } else if (curr.code === 'AED') {
    return `${formattedNumber} د.إ`;
  }

  return `${curr.symbol}${formattedNumber}`;
}
