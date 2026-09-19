import Decimal from 'decimal.js';
import { RLH_FEE_RATE } from '../../lib/fee.ts';

// Configure Decimal.js for strict financial precision
Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

export class Money {
  private d: Decimal;
  public readonly currency: string;

  constructor(amount: string | number | Decimal, currency = 'USD') {
    this.d = new Decimal(amount);
    this.currency = currency.toUpperCase();
  }

  static fromCents(cents: number | string, currency = 'USD'): Money {
    const d = new Decimal(cents).dividedBy(100);
    return new Money(d, currency);
  }

  static zero(currency = 'USD'): Money {
    return new Money(0, currency);
  }

  toCents(): number {
    return this.d.times(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
  }

  toDecimalString(): string {
    return this.d.toFixed(2);
  }

  toFormatted(locale = 'en-US'): string {
    const num = this.d.toNumber();
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  }

  add(other: Money | string | number): Money {
    const otherD = other instanceof Money ? other.d : new Decimal(other);
    return new Money(this.d.plus(otherD), this.currency);
  }

  subtract(other: Money | string | number): Money {
    const otherD = other instanceof Money ? other.d : new Decimal(other);
    return new Money(this.d.minus(otherD), this.currency);
  }

  multiply(multiplier: string | number | Decimal): Money {
    return new Money(this.d.times(new Decimal(multiplier)), this.currency);
  }

  divide(divisor: string | number | Decimal): Money {
    return new Money(this.d.dividedBy(new Decimal(divisor)), this.currency);
  }

  isGreaterThan(other: Money | string | number): boolean {
    const otherD = other instanceof Money ? other.d : new Decimal(other);
    return this.d.greaterThan(otherD);
  }

  isLessThan(other: Money | string | number): boolean {
    const otherD = other instanceof Money ? other.d : new Decimal(other);
    return this.d.lessThan(otherD);
  }

  isZero(): boolean {
    return this.d.isZero();
  }

  isPositive(): boolean {
    return this.d.isPositive() && !this.d.isZero();
  }

  /**
   * Calculates the exact 10% fee on attributable recovery
   * Fee = 10% × verified attributable recovered revenue
   */
  calculateRLHFee(): Money {
    const feeDecimal = this.d.times(RLH_FEE_RATE).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
    return new Money(feeDecimal, this.currency);
  }

  /**
   * Calculates net financial benefit (Recovered minus RLH fee)
   */
  calculateNetBenefit(): Money {
    return this.subtract(this.calculateRLHFee());
  }

  get rawDecimal(): Decimal {
    return this.d;
  }
}

/**
 * Format currency utility for client or server rendering
 */
export function formatMoney(amount: string | number | Decimal, currency = 'USD'): string {
  try {
    const m = new Money(amount, currency);
    return m.toFormatted();
  } catch {
    return `$${amount}`;
  }
}
