"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  DollarSign,
  Calendar,
  TrendingUp,
  Building,
  ArrowLeft,
  Save,
  Edit,
} from "lucide-react";
import Link from "next/link";

export default function EditInvestment() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [form, setForm] = useState({
    type: "",
    symbol: "",
    units: "",
    buyPrice: "",
    currentPrice: "",
    startDate: "",
    endDate: "",
    interestRate: "",
    totalAmountInvested: "",
    currentValue: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        const res = await api.get(`/api/v1/investments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        setForm({
          type: data.type || "",
          symbol: data.symbol || "",
          units: data.units?.toString() || "",
          buyPrice: data.buyPrice?.toString() || "",
          currentPrice: data.currentPrice?.toString() || "",
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          interestRate: data.interestRate?.toString() || "",
          totalAmountInvested: data.totalAmountInvested?.toString() || "",
          currentValue: data.currentValue?.toString() || "",
        });
      } catch (err) {
        console.error("Error fetching investment:", err);
        router.push("/dashboard/investments");
      }
    };

    fetchInvestment();
  }, [id, token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(
        `/api/v1/investments/${id}`,
        {
          ...form,
          units: parseFloat(form.units),
          buyPrice: parseFloat(form.buyPrice),
          currentPrice: parseFloat(form.currentPrice),
          interestRate: parseFloat(form.interestRate),
          totalAmountInvested: parseFloat(form.totalAmountInvested),
          currentValue: parseFloat(form.currentValue),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      router.push("/dashboard/investments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/investments">
            <Button variant="outline" size="sm" className="border-gray-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Edit Investment
              </h1>
              <p className="text-gray-600">Update your investment details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Investment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Investment Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Investment Type
                    </Label>
                    <Select
                      value={form.type}
                      onValueChange={(value) =>
                        setForm({ ...form, type: value })
                      }
                    >
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                        <SelectValue placeholder="Select investment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STOCK">📈 Stock</SelectItem>
                        <SelectItem value="ETF">🔄 ETF</SelectItem>
                        <SelectItem value="MUTUAL_FUND">
                          📊 Mutual Fund
                        </SelectItem>
                        <SelectItem value="BOND">📋 Bond</SelectItem>
                        <SelectItem value="FD">🏦 Fixed Deposit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Symbol/Name
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="symbol"
                        value={form.symbol}
                        onChange={handleChange}
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        placeholder="e.g., AAPL, NIFTY50"
                      />
                    </div>
                  </div>
                </div>

                {/* Quantity and Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Units/Quantity
                    </Label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="units"
                        value={form.units}
                        onChange={handleChange}
                        type="number"
                        step="0.001"
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Buy Price (₹)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="buyPrice"
                        value={form.buyPrice}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        placeholder="150.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Current Price (₹)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="currentPrice"
                        value={form.currentPrice}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        placeholder="175.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Investment Amounts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Total Amount Invested (₹)
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="totalAmountInvested"
                        value={form.totalAmountInvested}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        placeholder="15000.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Current Value (₹)
                    </Label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="currentValue"
                        value={form.currentValue}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        placeholder="17500.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Dates and Interest Rate */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Start Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      End Date (Optional)
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Interest Rate (%)
                    </Label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="interestRate"
                        value={form.interestRate}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        placeholder="8.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <Link href="/dashboard/investments" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-gray-200"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Updating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Update Investment
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
