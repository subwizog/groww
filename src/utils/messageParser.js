/**
 * Section 7 Message Reading Rules:
 * - Amount: Match "Rs", "Rs.", "INR", or "₹" followed by a number. Allow commas and decimals. Remove commas before using the number.
 * - Direction: If the text has "credited" or "received" and has no "debited", "paid", or "spent", reject it as money received.
 * - Shop name: The words after "to" or "at", up to "on", "via", "ref", "upi", or a full stop. If none is found, use "Unknown".
 * - Category from shop name (lowercase match):
 *   - Food: swiggy, zomato, mess, cafe, restaurant, dominos, canteen
 *   - Travel: uber, ola, rapido, irctc, metro, auto, redbus
 *   - Shopping: myntra, amazon, ajio, zara, nykaa
 *   - Groceries: blinkit, zepto, bigbasket, instamart
 *   - Anything else: Food, and the student can change it
 * - Type suggestion: Suggest Luxury for myntra, ajio, nykaa, zara, bookmyshow. Everything else starts as Everyday.
 */

const CATEGORY_KEYWORDS = {
  Food: ['swiggy', 'zomato', 'mess', 'cafe', 'restaurant', 'dominos', 'canteen'],
  Travel: ['uber', 'ola', 'rapido', 'irctc', 'metro', 'auto', 'redbus'],
  Shopping: ['myntra', 'amazon', 'ajio', 'zara', 'nykaa'],
  Groceries: ['blinkit', 'zepto', 'bigbasket', 'instamart']
};

const LUXURY_KEYWORDS = ['myntra', 'ajio', 'nykaa', 'zara', 'bookmyshow'];

export function parseBankMessage(rawText, shopMemory = {}) {
  const text = (rawText || '').trim();

  // 1. Empty check
  if (!text) {
    return {
      success: false,
      error: 'Paste a message first.'
    };
  }

  const lower = text.toLowerCase();

  // 2. Direction check
  const hasInbound = lower.includes('credited') || lower.includes('received');
  const hasOutbound = lower.includes('debited') || lower.includes('paid') || lower.includes('spent');

  if (hasInbound && !hasOutbound) {
    return {
      success: false,
      error: 'That looks like money received. Paste a payment message.'
    };
  }

  // 3. Amount check
  // Match "Rs", "Rs.", "INR", or "₹" followed by optional space and digits with optional commas and decimals
  const amountRegex = /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)/i;
  const matchAmount = text.match(amountRegex);

  if (!matchAmount || !matchAmount[1]) {
    return {
      success: false,
      error: 'Could not find an amount. Check the message.'
    };
  }

  const cleanAmountStr = matchAmount[1].replace(/,/g, '');
  const amount = Math.round(parseFloat(cleanAmountStr));

  if (isNaN(amount) || amount <= 0) {
    return {
      success: false,
      error: 'Could not find an amount. Check the message.'
    };
  }

  // 4. Shop name
  // The words after "to" or "at", up to "on", "via", "ref", "upi", or a full stop.
  let shopName = 'Unknown';
  const shopRegex = /(?:\bto\b|\bat\b)\s+([^.]+?)(?=\s+(?:on|via|ref|upi)\b|\.|$)/i;
  const matchShop = text.match(shopRegex);

  if (matchShop && matchShop[1]) {
    const rawShop = matchShop[1].trim();
    if (rawShop) {
      shopName = rawShop;
    }
  }

  const shopLower = shopName.toLowerCase();

  // Check shopMemory first
  if (shopMemory && shopMemory[shopLower]) {
    return {
      success: true,
      amount,
      shopName,
      category: shopMemory[shopLower].category || 'Food',
      type: shopMemory[shopLower].type || 'Everyday'
    };
  }

  // 5. Category inference
  let category = 'Food';
  let matchedCat = false;

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => shopLower.includes(k))) {
      category = cat;
      matchedCat = true;
      break;
    }
  }

  // 6. Type suggestion
  let type = 'Everyday';
  if (LUXURY_KEYWORDS.some((k) => shopLower.includes(k))) {
    type = 'Luxury';
  }

  return {
    success: true,
    amount,
    shopName,
    category,
    type
  };
}
