"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
  BarChart3,
  RefreshCw,
} from "lucide-react";

type InvestmentSummary = {
  totalInvested: number;
  currentValue: number;
  totalGainLoss: number;
  gainLossPercentage: number;
};

export default function Dashboard() {
  const [summary, setSummary] = useState<InvestmentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshingCache, setRefreshingCache] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/api/v1/investments/summary");
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to fetch summary:", err);
        logout(); // token invalid or expired
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [logout]);

  const handleRefreshCache = async () => {
    setRefreshingCache(true);
    try {
      await api.post("/api/v1/cache/refresh");
      // Refetch summary data after cache refresh
      const res = await api.get("/api/v1/investments/summary");
      setSummary(res.data);
      alert("Cache refreshed successfully!");
    } catch (err) {
      console.error("Failed to refresh cache:", err);
      alert("Failed to refresh cache. Please try again.");
    } finally {
      setRefreshingCache(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 truncate">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block">
              Welcome back! Here&apos;s your financial overview
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshCache}
              disabled={refreshingCache}
              className="flex-1 sm:flex-none min-w-[120px]"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  refreshingCache ? "animate-spin" : ""
                }`}
              />
              <span className="hidden sm:inline">
                {refreshingCache ? "Refreshing..." : "Refresh Cache"}
              </span>
              <span className="sm:hidden">
                {refreshingCache ? "Refreshing..." : "Refresh"}
              </span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <BarChart3 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </Button>
            <Button className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add Investment</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <Link href="/dashboard/investments">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Manage</p>
                    <h3 className="text-xl font-semibold">Investments</h3>
                  </div>
                  <PieChart className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/income">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Track</p>
                    <h3 className="text-xl font-semibold">Income</h3>
                  </div>
                  <Wallet className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/expenses">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">
                      Monitor
                    </p>
                    <h3 className="text-xl font-semibold">Expenses</h3>
                  </div>
                  <Target className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Invested"
            value={summary.totalInvested}
            icon={<DollarSign className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Current Value"
            value={summary.currentValue}
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Total Gain/Loss"
            value={summary.totalGainLoss}
            icon={
              summary.totalGainLoss >= 0 ? (
                <ArrowUpRight className="w-6 h-6" />
              ) : (
                <ArrowDownRight className="w-6 h-6" />
              )
            }
            color={summary.totalGainLoss >= 0 ? "green" : "red"}
          />
          <StatCard
            title="Gain/Loss %"
            value={summary.gainLossPercentage}
            icon={
              summary.gainLossPercentage >= 0 ? (
                <TrendingUp className="w-6 h-6" />
              ) : (
                <TrendingDown className="w-6 h-6" />
              )
            }
            isPercent
            color={summary.gainLossPercentage >= 0 ? "green" : "red"}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  isPercent = false,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "green" | "red" | "blue";
  isPercent?: boolean;
}) {
  const colorMap = {
    green: {
      text: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-500",
    },
    red: {
      text: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-500",
    },
    blue: {
      text: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-500",
    },
  };

  return (
    <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-xl ${colorMap[color].bg} ${colorMap[color].border} border`}
          >
            <div className={colorMap[color].icon}>{icon}</div>
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h2 className={`text-2xl font-bold ${colorMap[color].text}`}>
            {isPercent ? `${value.toFixed(2)}%` : `₹${value.toFixed(2)}`}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}
