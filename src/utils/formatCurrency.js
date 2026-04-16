/**
 * Format a number as Indian currency (₹)
 * e.g., 150000 → "₹1,50,000"
 */
export function formatCurrency(amount) {
  if (!amount && amount !== 0) return '';
  const num = parseFloat(String(amount).replace(/,/g, ''));
  if (isNaN(num)) return '';
  return '₹' + num.toLocaleString('en-IN');
}

/**
 * Convert number to words (Indian numbering system)
 * e.g., 150000 → "One Lakh Fifty Thousand"
 */
export function numberToWords(num) {
  if (!num) return '';
  const n = parseInt(String(num).replace(/,/g, ''));
  if (isNaN(n)) return '';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function twoDigits(n) {
    if (n < 20) return ones[n];
    return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
  }

  function threeDigits(n) {
    if (n >= 100) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + twoDigits(n % 100) : '');
    return twoDigits(n);
  }

  if (n === 0) return 'Zero';

  let result = '';
  if (n >= 10000000) {
    result += threeDigits(Math.floor(n / 10000000)) + ' Crore ';
    const rem = n % 10000000;
    if (rem >= 100000) result += threeDigits(Math.floor(rem / 100000)) + ' Lakh ';
    if (rem % 100000 >= 1000) result += threeDigits(Math.floor((rem % 100000) / 1000)) + ' Thousand ';
    if (rem % 1000) result += threeDigits(rem % 1000);
  } else if (n >= 100000) {
    result += threeDigits(Math.floor(n / 100000)) + ' Lakh ';
    if (n % 100000 >= 1000) result += threeDigits(Math.floor((n % 100000) / 1000)) + ' Thousand ';
    if (n % 1000) result += threeDigits(n % 1000);
  } else if (n >= 1000) {
    result += threeDigits(Math.floor(n / 1000)) + ' Thousand ';
    if (n % 1000) result += threeDigits(n % 1000);
  } else {
    result = threeDigits(n);
  }

  return result.trim() + ' Only';
}

/**
 * Calculate estimated completion date given a start date and phase durations
 */
export function calcCompletionDate(startDate, phases) {
  if (!startDate) return '';
  const start = new Date(startDate);
  const totalDays = phases.reduce((sum, p) => sum + (parseInt(p.days) || 0), 0);
  const end = new Date(start);
  end.setDate(end.getDate() + totalDays);
  return end.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateStr) {
  if (!dateStr) return '________________';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}
