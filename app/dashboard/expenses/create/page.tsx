"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingDown,
  DollarSign,
  Tag,
  ArrowLeft,
  Save,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

export default function CreateExpensePage() {
  const { token } = useAuth();
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    setLoading(true);
    try {
      await api.post(
        "/api/v1/expenses",
        { category, amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push("/dashboard/expenses");
    } catch (err) {
      console.error("Failed to create expense:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "Food", emoji: "🍽️", label: "Food & Dining" },
    { value: "Transport", emoji: "🚗", label: "Transportation" },
    { value: "Entertainment", emoji: "🎬", label: "Entertainment" },
    { value: "Shopping", emoji: "🛍️", label: "Shopping" },
    { value: "Bills", emoji: "📄", label: "Bills & Utilities" },
    { value: "Healthcare", emoji: "🏥", label: "Healthcare" },
    { value: "Education", emoji: "📚", label: "Education" },
    { value: "Travel", emoji: "✈️", label: "Travel" },
    { value: "Utilities", emoji: "⚡", label: "Utilities" },
    { value: "Other", emoji: "📦", label: "Other" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/dashboard/expenses">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 min-w-[80px]"
            >
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex-shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 truncate">
                Add Expense
              </h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                Record a new expense
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <TrendingDown className="w-5 h-5" />
                Expense Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Category
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="border-gray-200 focus:border-red-500 focus:ring-red-500/20 h-12 text-base">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[60vh]">
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.value}
                          value={cat.value}
                          className="py-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{cat.emoji}</span>
                            <span className="text-base">{cat.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Amount (₹)
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={amount}
                      onChange={(e) =>
                        setAmount(
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                      className="pl-12 h-12 text-base border-gray-200 focus:border-red-500 focus:ring-red-500/20"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                </div>

                {/* Preview Card */}
                {category && amount && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Preview
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {categories.find((c) => c.value === category)?.emoji}
                        </span>
                        <span className="font-medium text-base">
                          {category}
                        </span>
                      </div>
                      <span className="text-lg sm:text-xl font-bold text-red-600">
                        ₹{Number(amount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-100">
                  <Link href="/dashboard/expenses" className="w-full sm:flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 border-gray-200 text-base"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={loading || !category || !amount}
                    className="w-full sm:flex-1 h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200 text-base font-medium"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Save className="w-5 h-5" />
                        <span>Save Expense</span>
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
