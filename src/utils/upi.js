/**
 * UPI link generator as per Section 6.4:
 * Shape: `upi://pay?pa=<id>&pn=<name>&am=<amount>&cu=INR&tn=<note>`
 */
export function buildUpiLink({ paymentId = '', name = '', amount = 0, note = 'Expense split' }) {
  const params = new URLSearchParams();
  if (paymentId) params.append('pa', paymentId.trim());
  if (name) params.append('pn', name.trim());
  if (amount > 0) params.append('am', Math.round(amount).toString());
  params.append('cu', 'INR');
  if (note) params.append('tn', note.trim());

  return `upi://pay?${params.toString()}`;
}
