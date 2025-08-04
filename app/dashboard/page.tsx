'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

type InvestmentSummary = {
  totalInvested: number;
  currentValue: number;
  totalGainLoss: number;
  gainLossPercentage: number;
};

export default function Dashboard() {
  const [summary, setSummary] = useState<InvestmentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/api/v1/investments/summary');
        setSummary(res.data);
      } catch (err) {
        console.error('Failed to fetch summary:', err);
        logout(); // token invalid or expired
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [logout]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Error loading investment summary</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-black">Dashboard</h1>
        <nav className="space-x-4">
          <Link
            href="/dashboard/investments"
            className="text-blue-600 hover:underline font-medium"
          >
            Investments
          </Link>
          {/* Add more nav links below if needed */}
          {/* <Link href="/dashboard/income" className="text-blue-600 hover:underline font-medium">Income</Link> */}
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Invested" value={summary.totalInvested} color="blue" />
        <Card title="Current Value" value={summary.currentValue} color="green" />
        <Card
          title="Total Gain/Loss"
          value={summary.totalGainLoss}
          color={summary.totalGainLoss >= 0 ? 'green' : 'red'}
        />
        <Card
          title="Gain/Loss %"
          value={summary.gainLossPercentage}
          isPercent
          color={summary.gainLossPercentage >= 0 ? 'green' : 'red'}
        />
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  color,
  isPercent = false,
}: {
  title: string;
  value: number;
  color: 'green' | 'red' | 'blue';
  isPercent?: boolean;
}) {
  const colorMap = {
    green: 'text-green-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <p className="text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold ${colorMap[color]}`}>
        {isPercent ? `${value.toFixed(2)}%` : `₹${value.toFixed(2)}`}
      </h2>
    </div>
  );
}
