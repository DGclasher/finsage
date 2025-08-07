"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import api from "@/lib/api";
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
} from "lucide-react";
import Link from "next/link";

export default function CreateInvestment() {
  const { token } = useAuth();
  const router = useRouter();

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

  // Helper function to determine field requirements based on investment type
  const getFieldRequirements = (type: string) => {
    switch (type) {
      case "STOCK":
        return {
          required: ["symbol", "units", "startDate"],
          disabled: ["buyPrice", "currentPrice", "totalAmountInvested", "currentValue", "interestRate"],
          optional: ["endDate"]
        };
      case "ETF":
        return {
          required: ["symbol", "units", "startDate", "interestRate", "buyPrice"],
          disabled: ["currentPrice", "totalAmountInvested", "currentValue"],
          optional: ["endDate"]
        };
      case "MUTUAL_FUND":
        return {
          required: ["symbol", "units", "startDate", "interestRate", "buyPrice"],
          disabled: ["currentPrice", "totalAmountInvested", "currentValue"],
          optional: ["endDate"]
        };
      case "FD":
        return {
          required: ["symbol", "totalAmountInvested", "startDate", "endDate", "interestRate"],
          disabled: ["units", "buyPrice", "currentPrice", "currentValue"],
          optional: []
        };
      case "BOND":
        return {
          required: ["symbol", "units", "buyPrice", "startDate", "endDate", "interestRate"],
          disabled: ["currentPrice", "totalAmountInvested", "currentValue"],
          optional: []
        };
      default:
        return {
          required: [],
          disabled: [],
          optional: ["symbol", "units", "buyPrice", "currentPrice", "startDate", "endDate", "interestRate", "totalAmountInvested", "currentValue"]
        };
    }
  };

  const fieldRequirements = getFieldRequirements(form.type);

  const isFieldDisabled = (fieldName: string) => {
    return fieldRequirements.disabled.includes(fieldName);
  };

  const isFieldRequired = (fieldName: string) => {
    return fieldRequirements.required.includes(fieldName);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields based on investment type
    const requirements = getFieldRequirements(form.type);
    const missingFields = requirements.required.filter(field => !form[field as keyof typeof form]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);
    try {
      // Only send non-disabled fields to the API
      const formData = { ...form };
      requirements.disabled.forEach(field => {
        delete formData[field as keyof typeof formData];
      });

      await api.post(
        "/api/v1/investments",
        {
          ...formData,
          units: formData.units ? parseFloat(formData.units) : undefined,
          buyPrice: formData.buyPrice ? parseFloat(formData.buyPrice) : undefined,
          currentPrice: formData.currentPrice ? parseFloat(formData.currentPrice) : undefined,
          interestRate: formData.interestRate ? parseFloat(formData.interestRate) : undefined,
          totalAmountInvested: formData.totalAmountInvested ? parseFloat(formData.totalAmountInvested) : undefined,
          currentValue: formData.currentValue ? parseFloat(formData.currentValue) : undefined,
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
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Add Investment
              </h1>
              <p className="text-gray-600">Create a new investment record</p>
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
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      Symbol/Name {isFieldRequired("symbol") && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="symbol"
                        value={form.symbol}
                        onChange={handleChange}
                        disabled={isFieldDisabled("symbol")}
                        required={isFieldRequired("symbol")}
                        className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                          isFieldDisabled("symbol") ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                        placeholder="e.g., AAPL, NIFTY50"
                      />
                    </div>
                  </div>
                </div>

                {/* Quantity and Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Units/Quantity {isFieldRequired("units") && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="units"
                        value={form.units}
                        onChange={handleChange}
                        type="number"
                        step="0.001"
                        disabled={isFieldDisabled("units")}
                        required={isFieldRequired("units")}
                        className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                          isFieldDisabled("units") ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Buy Price (₹) {isFieldRequired("buyPrice") && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="buyPrice"
                        value={form.buyPrice}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        disabled={isFieldDisabled("buyPrice")}
                        required={isFieldRequired("buyPrice")}
                        className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                          isFieldDisabled("buyPrice") ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                        placeholder="150.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Current Price (₹) {isFieldRequired("currentPrice") && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="currentPrice"
                        value={form.currentPrice}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        disabled={isFieldDisabled("currentPrice")}
                        required={isFieldRequired("currentPrice")}
                        className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                          isFieldDisabled("currentPrice") ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                        placeholder="175.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Investment Amounts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Total Amount Invested (₹) {isFieldRequired("totalAmountInvested") && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="totalAmountInvested"
                        value={form.totalAmountInvested}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        disabled={isFieldDisabled("totalAmountInvested")}
                        required={isFieldRequired("totalAmountInvested")}
                        className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                          isFieldDisabled("totalAmountInvested") ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                        placeholder="15000.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Current Value (₹) {isFieldRequired("currentValue") && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="currentValue"
                        value={form.currentValue}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        disabled={isFieldDisabled("currentValue")}
                        required={isFieldRequired("currentValue")}
                        className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                          isFieldDisabled("currentValue") ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                        placeholder="17500.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Dates and Interest Rate */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Start Date {isFieldRequired("startDate") && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        disabled={isFieldDisabled("startDate")}
                        required={isFieldRequired("startDate")}
                        className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                          isFieldDisabled("startDate") ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      End Date {isFieldRequired("endDate") ? <span className="text-red-500">*</span> : "(Optional)"}
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        disabled={isFieldDisabled("endDate")}
                        required={isFieldRequired("endDate")}
                        className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                          isFieldDisabled("endDate") ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Interest Rate (%) {isFieldRequired("interestRate") && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        name="interestRate"
                        value={form.interestRate}
                        onChange={handleChange}
                        type="number"
                        step="0.01"
                        disabled={isFieldDisabled("interestRate")}
                        required={isFieldRequired("interestRate")}
                        className={`pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 ${
                          isFieldDisabled("interestRate") ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
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
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Create Investment
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
