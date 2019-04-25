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
  const volumes = data.map(v => v.volume);
  return {
    labels,
    datasets: [
      {
        ...dataSetDisplay,
        backgroundColor: 'rgba(232, 195, 65, 0.4)',
        borderColor: 'rgba(232, 195, 65, 1)',
        pointBorderColor: 'rgba(232, 195, 65, 1)',
        pointHoverBackgroundColor: 'rgba(232, 195, 65, 1)',
        pointHoverBorderColor: 'rgba(232, 195, 65, 1)',
        pointBackgroundColor: '#fff',
        data: volumes,
      },
    ],
  };
}

function HistoricalCoinVolumeGraph({ historicalVolumes }) {
  const cacheData = useRef();

  if (cacheData.current === undefined && historicalVolumes.isLoading) {
    return <Spinner />;
  }

  // Show previous results until loading if finished
  let data;
  if (!historicalVolumes.isLoading) {
    data = createData(historicalVolumes.data);
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
                  return formatCurrency(value, 0);
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

HistoricalCoinVolumeGraph.propTypes = {
  historicalVolumes: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        volume: PropTypes.number.isRequired,
      }),
    ),
  }).isRequired,
};

export default HistoricalCoinVolumeGraph;
