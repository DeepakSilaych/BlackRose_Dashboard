import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { updatePerformanceData, setWebSocketConnected, initializePerformanceData } from '../store/slices/dataSlice';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PerformanceChart = () => {
  const dispatch = useDispatch();
  const wsRef = useRef(null);
  const { timestamps, values, isConnected } = useSelector((state) => state.data.performanceData);

  useEffect(() => {
    // Initialize WebSocket connection
    wsRef.current = new WebSocket('ws://localhost:8000/ws/performance');

    wsRef.current.onopen = () => {
      dispatch(setWebSocketConnected(true));
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Check if it's an initial dataset or an update
      if (Array.isArray(data)) {
        // Initial dataset
        const formattedData = data.map(item => ({
          timestamp: new Date(item.timestamp).toLocaleTimeString(),
          value: item.value
        }));
        dispatch(initializePerformanceData(formattedData));
      } else {
        // Single update
        dispatch(updatePerformanceData({
          timestamp: new Date(data.timestamp).toLocaleTimeString(),
          value: data.value
        }));
      }
    };

    wsRef.current.onclose = () => {
      dispatch(setWebSocketConnected(false));
    };

    // Cleanup WebSocket connection on component unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [dispatch]);

  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'Performance',
        data: values,
        fill: true,
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => tooltipItems[0].label,
          label: (context) => `Value: ${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          maxTicksLimit: 10,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          padding: 10,
          callback: (value) => value.toFixed(2),
        },
        min: 0,
        max: 100,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px', position: 'relative' }}>
      {!isConnected && (
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            padding: '10px 20px',
            borderRadius: '4px',
            color: '#fff',
            zIndex: 1
          }}
        >
          Connecting to server...
        </div>
      )}
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PerformanceChart;
