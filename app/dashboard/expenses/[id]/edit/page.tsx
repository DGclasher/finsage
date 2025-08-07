"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
  ArrowLeft,
  Save,
  Edit,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

export default function EditExpensePage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [version, setVersion] = useState<number>(0);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await api.get(`/api/v1/expenses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { category, amount, version } = res.data;
        setCategory(category);
        setAmount(amount);
        setVersion(version);
      } catch (err) {
        console.error("Failed to fetch expense:", err);
      }
    };
    if (id) fetchExpense();
  }, [id, token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount) return;

    setLoading(true);
    try {
      await api.put(
        `/api/v1/expenses/${id}`,
        { category, amount: Number(amount), version },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push("/dashboard/expenses");
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/expenses">
            <Button variant="outline" size="sm" className="border-gray-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Expense</h1>
              <p className="text-gray-600">Update your expense details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                Expense Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Category
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="border-gray-200 focus:border-red-500 focus:ring-red-500/20">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <span>{cat.emoji}</span>
                            <span>{cat.label}</span>
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
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
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
                      className="pl-10 border-gray-200 focus:border-red-500 focus:ring-red-500/20"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                </div>

                {/* Preview Card */}
                {category && amount && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Preview
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {categories.find((c) => c.value === category)?.emoji}
                        </span>
                        <span className="font-medium">{category}</span>
                      </div>
                      <span className="text-lg font-bold text-red-600">
                        ₹{Number(amount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <Link href="/dashboard/expenses" className="flex-1">
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
                    disabled={loading || !category || !amount}
                    className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Updating...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Update Expense
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
