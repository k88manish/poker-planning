import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C', '#D0ED57'];

type ChartType = 'bar' | 'pie';
type SortType = 'value' | 'count';

interface VoteChartProps {
  users: { id: string; name: string; vote: string | null }[];
}

const VoteChart: React.FC<VoteChartProps> = ({ users }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [sortType, setSortType] = useState<SortType>('value');

  const prepareChartData = () => {
    const voteCounts: { [key: string]: number } = {};
    users.forEach(user => {
      if (user.vote) {
        voteCounts[user.vote] = (voteCounts[user.vote] || 0) + 1;
      }
    });

    let data = Object.entries(voteCounts).map(([vote, count]) => ({
      vote,
      count
    }));

    // Sort data
    data.sort((a, b) => {
      if (sortType === 'value') {
        return a.vote.localeCompare(b.vote, undefined, { numeric: true });
      } else {
        return b.count - a.count;
      }
    });

    return data;
  };

  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    const radius = 10;

    return (
      <g>
        <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" />
        <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle">
          {value}
        </text>
      </g>
    );
  };

  const renderChart = () => {
    const data = prepareChartData();

    if (data.length === 0) {
      return <p className="text-center text-xl">No votes cast yet.</p>;
    }

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="vote" stroke="#ffffff" />
            <YAxis stroke="#ffffff" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#000' }} />
            <Bar dataKey="count" fill="#8884d8" label={renderCustomizedLabel}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#000' }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label className="mr-2">Chart Type:</label>
          <select
            value={chartType}
            onChange={event => setChartType(event.target.value as ChartType)}
            className="bg-gray-200 border border-gray-400 rounded py-1 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Sort By:</label>
          <select
            value={sortType}
            onChange={event => setSortType(event.target.value as SortType)}
            className="bg-gray-200 border border-gray-400 rounded py-1 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          >
            <option value="value">Value</option>
            <option value="count">Count</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        {renderChart()}
      </div>
    </div>
  );
};

export default VoteChart;
