/**
 * Reusable currency formatting utility for Indian Procurement Documents & Accounts Payable.
 */

/**
 * Formats a numeric value into INR currency string (₹).
 * @param amount Number or null to format
 * @param symbol Custom symbol (default: '₹')
 * @returns Formatted currency string (e.g. "₹220.76")
 */
export const formatCurrency = (amount?: number | null, symbol: string = '₹'): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${symbol}0.00`;
  }
  return `${symbol}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Convenience wrapper for INR currency formatting.
 */
export const formatINR = (amount?: number | null): string => {
  return formatCurrency(amount, '₹');
};
