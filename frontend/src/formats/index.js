import numeral from 'numeral';
import dayjs from 'dayjs';

function joinZeros(decimals) {
  return Array.from(new Array(decimals))
    .map(() => '0')
    .join('');
}

export function formatCurrency(number, decimals = 2) {
  return numeral(number).format(`$0,0[.]${joinZeros(decimals)}`);
}

export function formatAmount(number, decimals = 2) {
  return numeral(number).format(`0,0.${joinZeros(decimals)}`);
}

export function formatPercentage(number, decimals = 2) {
  return numeral(number).format(`0.${joinZeros(decimals)}%`);
}

export function formatDate(date) {
  return dayjs(date).format('YYYY-MM-DD');
}
