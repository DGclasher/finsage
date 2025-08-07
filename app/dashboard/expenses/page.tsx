// app/dashboard/expenses/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  TrendingDown,
  DollarSign,
  Tag,
  BarChart3,
  ShoppingBag,
} from "lucide-react";

interface Expense {
  id: string;
  version: number;
  category: string;
  amount: number;
}

export default function ExpensesPage() {
  const { token } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const fetchExpenses = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data.content || []);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const deleteExpense = async (id: string) => {
    try {
      await api.delete(`/api/v1/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
      setDialogOpen(false);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex-shrink-0">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 truncate">
                Expenses
              </h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                Track and manage your expenses
              </p>
            </div>
          </div>
          <Link href="/dashboard/expenses/create" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-10 sm:h-auto bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-200">
              <Plus className="w-4 h-4 mr-2" />
              <span className="sm:inline">Add Expense</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {expenses.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-4">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No expenses recorded
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
              Start tracking your spending by adding your first expense
            </p>
            <Link href="/dashboard/expenses/create">
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Expense
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            {/* Summary */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-gray-700" />
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Expense Overview
                  </h2>
                </div>
                <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full w-fit">
                  {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Expenses</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹
                          {expenses
                            .reduce((sum, exp) => sum + exp.amount, 0)
                            .toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Average Amount</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹
                          {(
                            expenses.reduce((sum, exp) => sum + exp.amount, 0) /
                            expenses.length
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Categories</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {new Set(expenses.map((exp) => exp.category)).size}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Expenses List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expenses.map((exp) => {
                // Get category color
                const getCategoryColor = (category: string) => {
                  const colors = {
                    Food: {
                      bg: "bg-green-100",
                      text: "text-green-600",
                      icon: "🍽️",
                    },
                    Transport: {
                      bg: "bg-blue-100",
                      text: "text-blue-600",
                      icon: "🚗",
                    },
                    Entertainment: {
                      bg: "bg-purple-100",
                      text: "text-purple-600",
                      icon: "🎬",
                    },
                    Shopping: {
                      bg: "bg-pink-100",
                      text: "text-pink-600",
                      icon: "🛍️",
                    },
                    Bills: {
                      bg: "bg-orange-100",
                      text: "text-orange-600",
                      icon: "📄",
                    },
                    Healthcare: {
                      bg: "bg-red-100",
                      text: "text-red-600",
                      icon: "🏥",
                    },
                    Education: {
                      bg: "bg-indigo-100",
                      text: "text-indigo-600",
                      icon: "📚",
                    },
                    Travel: {
                      bg: "bg-teal-100",
                      text: "text-teal-600",
                      icon: "✈️",
                    },
                    Utilities: {
                      bg: "bg-yellow-100",
                      text: "text-yellow-600",
                      icon: "⚡",
                    },
                    Other: {
                      bg: "bg-gray-100",
                      text: "text-gray-600",
                      icon: "📦",
                    },
                  };
                  return (
                    colors[category as keyof typeof colors] || colors["Other"]
                  );
                };

                const categoryStyle = getCategoryColor(exp.category);

                return (
                  <Card
                    key={exp.id}
                    className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover-lift"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${categoryStyle.bg} ${categoryStyle.text}`}
                          >
                            <span className="text-lg">
                              {categoryStyle.icon}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {exp.category}
                            </h3>
                            <p className="text-2xl font-bold text-red-600">
                              ₹{exp.amount.toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                          onClick={() =>
                            router.push(`/dashboard/expenses/${exp.id}/edit`)
                          }
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>

                        <Dialog
                          open={dialogOpen && confirmId === exp.id}
                          onOpenChange={setDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                              onClick={() => setConfirmId(exp.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Expense</DialogTitle>
                            </DialogHeader>
                            <p>
                              Are you sure you want to delete this expense? This
                              action cannot be undone.
                            </p>
                            <DialogFooter className="pt-4">
                              <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteExpense(exp.id)}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
