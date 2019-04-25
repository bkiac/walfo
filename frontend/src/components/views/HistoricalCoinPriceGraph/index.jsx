import React, { useRef } from 'react';
import dayjs from 'dayjs';
import { Line } from 'react-chartjs-2';
import * as PropTypes from 'prop-types';
import { formatCurrency } from '../../../formats';
import Spinner from '../Spinner';

const dataSetDisplay = {
  fill: 'origin',
  pointBackgroundColor: '#fff',
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
};

function createData(historicalData) {
  const data = Object.values(historicalData);
  const labels = data.map(v => dayjs(v.date).format('YYYY-MM-DD'));
  const prices = data.map(v => v.price);
  return {
    labels,
    datasets: [
      {
        ...dataSetDisplay,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        data: prices,
      },
    ],
  };
}

function HistoricalCoinPriceGraph({ historicalPrices }) {
  const cacheData = useRef();

  if (cacheData.current === undefined && historicalPrices.isLoading) {
    return <Spinner />;
  }

  // Show previous results until loading if finished
  let data;
  if (!historicalPrices.isLoading) {
    data = createData(historicalPrices.data);
    cacheData.current = data;
  }

  return (
    <Line
      options={{
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                // Include a dollar sign in the ticks
                callback(value) {
                  return formatCurrency(value, 4);
                },
              },
            },
          ],
        },
      }}
      data={data || cacheData.current}
    />
  );
}

HistoricalCoinPriceGraph.propTypes = {
  historicalPrices: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        volume: PropTypes.number.isRequired,
      }),
    ),
  }).isRequired,
};

export default HistoricalCoinPriceGraph;
