import React, { useContext, useRef } from 'react';
import dayjs from 'dayjs';
import { Line } from 'react-chartjs-2';
import { formatCurrency } from '../../../formats';
import { useApiOnMount } from '../../../hooks';
import { Spinner } from '../../views';
import { portfolioApi } from '../../../api';
import { PortfolioContext } from '../../../contexts';

function createData(historicalData) {
  const values = Object.values(historicalData);
  const labels = values.map(v => dayjs(v.date).format('YYYY-MM-DD'));
  const data = values.map(v => v.value);
  return {
    labels,
    datasets: [
      {
        fill: 'origin',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data,
      },
    ],
  };
}

function PortfolioGraph() {
  const { portfolioName, queryTags, queryDate } = useContext(PortfolioContext);

  const cacheData = useRef();

  const [historicalPortfolio] = useApiOnMount(
    portfolioApi.getHistoricalPortfolio,
    portfolioName,
    queryDate,
    queryTags,
  );

  if (cacheData.current === undefined && historicalPortfolio.isLoading) {
    return <Spinner />;
  }

  // Show previous results until loading if finished
  let data;
  if (!historicalPortfolio.isLoading) {
    data = createData(historicalPortfolio.data);
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

export default PortfolioGraph;
