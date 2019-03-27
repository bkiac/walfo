import React, { useRef, useState } from 'react';
import * as PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Line } from 'react-chartjs-2';
import { useApiOnMount } from '../../../hooks';
import { Spinner } from '../../views';
import { portfolioApi } from '../../../api';

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

function PortfolioGraph({ portfolioName }) {
  const cacheData = useRef();
  const [startDate, setStartDate] = useState(
    dayjs()
      .subtract(7, 'day')
      .format('YYYY-MM-DD'),
  );
  const [historicalPortfolio] = useApiOnMount(
    portfolioApi.getHistoricalPortfolio,
    portfolioName,
    startDate,
  );

  if (cacheData.current === undefined && historicalPortfolio.isLoading) {
    return <Spinner />;
  }

  if (!historicalPortfolio.isLoading) {
    cacheData.current = createData(historicalPortfolio.data);
  }
  const data = createData(historicalPortfolio.data);

  return (
    <div>
      <input
        type="date"
        value={startDate}
        onChange={e => {
          setStartDate(e.target.value);
        }}
      />

      <Line
        width={800}
        height={200}
        options={{
          legend: {
            display: false,
          },
        }}
        data={data || cacheData.current}
      />
    </div>
  );
}

PortfolioGraph.propTypes = {
  portfolioName: PropTypes.string.isRequired,
};

export default PortfolioGraph;
