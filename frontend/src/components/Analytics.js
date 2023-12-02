import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from '../utils/axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/booking/fetchbookings');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Process the data for the first chart (counts per language)
  const languageCounts = data.reduce((acc, item) => {
    acc[item.language] = (acc[item.language] || 0) + 1;
    return acc;
  }, {});

  // Process the data for the second chart (unique users and refunds)
  const uniqueUsersSet = new Set();
  let refundCount = 0;
  data.forEach((item) => {
    uniqueUsersSet.add(item.userId);
    if (item.isRefunded) {
      refundCount++;
    }
  });

  // Chart data for the first chart
  const languageChartData = {
    labels: Object.keys(languageCounts),
    datasets: [
      {
        label: 'Number of Shows per Language',
        data: Object.values(languageCounts),
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        borderColor: 'rgba(0, 123, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart data for the second chart
  const userRefundChartData = {
    labels: ['Unique Users', 'Refunds'],
    datasets: [
      {
        label: 'Count',
        data: [uniqueUsersSet.size, refundCount],
        backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const theaterCounts = data.reduce((acc, item) => {
    acc[item.theater] = (acc[item.theater] || 0) + 1;
    return acc;
  }, {});

  // Prepare the data for the theater count chart
  const theaterChartData = {
    labels: Object.keys(theaterCounts),
    datasets: [
      {
        label: 'Number of Bookings per Theater',
        data: Object.values(theaterCounts),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options (can be shared or individual for each chart)
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className='w-3/6 m-auto'>
      <Bar data={languageChartData} options={options} />
      <Bar data={userRefundChartData} options={options} />
      <Bar data={theaterChartData} options={options} />
    </div>
  );
};

export default Analytics;
