/**
 * Format number into Indian numbering system with ₹ symbol (e.g. ₹1,100, ₹8,000)
 * All numbers shown are rounded integers as specified in Section 8.
 */
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  const rounded = Math.round(Number(amount));
  const isNegative = rounded < 0;
  const abs = Math.abs(rounded);
  
  const formatted = abs.toLocaleString('en-IN');
  return `${isNegative ? '-' : ''}₹${formatted}`;
}
