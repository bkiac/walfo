import numeral from 'numeral';
import dayjs from 'dayjs';

export function formatUnitPrice(number) {
  return numeral(number).format('$0,0.0000');
}

export function formatCurrency(number) {
  return numeral(number).format('$0,0.00');
}

export function formatAmount(number) {
  return numeral(number).format('0.00');
}

export function formatPercentage(number) {
  return numeral(number).format('0.00%');
}

export function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD');
}
