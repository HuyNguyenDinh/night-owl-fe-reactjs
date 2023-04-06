import numeral from 'numeral';

// ----------------------------------------------------------------------

export function kFormat(num) {
  if (num >= 1000) {
    const units = ["k", "M", "B", "T"];
    const unitIndex = Math.floor((num.toFixed(0).length - 1) / 3) - 1;
    const unitValue = 10 ** ((unitIndex + 1) * 3);
    const formattedNum = (num / unitValue).toFixed(1) + units[unitIndex];
    return formattedNum;
  }
  return num.toString();
}

export function fCurrency(number) {
  // return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
  return numeral(number).format('0,0');
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return numeral(number).format('0.00a').replace('.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}
