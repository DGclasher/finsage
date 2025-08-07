"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Wallet,
  BarChart3,
} from "lucide-react";

interface Income {
  id: string;
  version: number;
  annualPostTaxIncome: number;
  incomeYear: number;
}

export default function IncomePage() {
  const { token } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [form, setForm] = useState({
    id: "",
    annualPostTaxIncome: "",
    incomeYear: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

  const fetchIncomes = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/incomes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncomes(res.data.content || []);
    } catch (err) {
      console.error("Failed to fetch incomes:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        annualPostTaxIncome: parseFloat(form.annualPostTaxIncome),
        incomeYear: parseInt(form.incomeYear),
      };

      if (editing) {
        await api.put(`/api/v1/incomes/${form.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/api/v1/incomes", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await fetchIncomes();
      setForm({ id: "", annualPostTaxIncome: "", incomeYear: "" });
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (income: Income) => {
    setForm({
      id: income.id,
      annualPostTaxIncome: income.annualPostTaxIncome.toString(),
      incomeYear: income.incomeYear.toString(),
    });
    setEditing(true);
  };

  const handleDelete = async () => {
    if (!deleteDialogId) return;
    await api.delete(`/api/v1/incomes/${deleteDialogId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeleteDialogId(null);
    await fetchIncomes();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Income Tracking
            </h1>
            <p className="text-gray-600">Manage your annual income records</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        {/* Add Income Form */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editing ? "Edit Income" : "Add New Income"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Annual Post-Tax Income
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      name="annualPostTaxIncome"
                      value={form.annualPostTaxIncome}
                      onChange={handleChange}
                      type="number"
                      step="0.01"
                      required
                      className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Income Year
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      name="incomeYear"
                      value={form.incomeYear}
                      onChange={handleChange}
                      type="number"
                      min="2000"
                      max="2100"
                      required
                      className="pl-10 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                      placeholder="Enter year"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {editing ? "Updating..." : "Creating..."}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {editing ? (
                        <Edit className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      {editing ? "Update Income" : "Add Income"}
                    </div>
                  )}
                </Button>

                {editing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setForm({
                        id: "",
                        annualPostTaxIncome: "",
                        incomeYear: "",
                      });
                      setEditing(false);
                    }}
                    className="border-gray-200"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Income List */}
        {incomes.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No income records yet
            </h3>
            <p className="text-gray-600">
              Start tracking your income by adding your first record above
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">
                Income History
              </h2>
              <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                {incomes.length} record{incomes.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {incomes.map((income) => (
                <Card
                  key={income.id}
                  className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover-lift"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            ₹
                            {typeof income.annualPostTaxIncome === "number"
                              ? income.annualPostTaxIncome.toLocaleString(
                                  "en-IN"
                                )
                              : "N/A"}
                          </h3>
                          <p className="text-sm text-gray-500">Annual Income</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Year
                        </span>
                        <span className="font-medium">{income.incomeYear}</span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">
                          Monthly Average
                        </span>
                        <span className="font-medium text-green-600">
                          ₹
                          {(income.annualPostTaxIncome / 12).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 mt-4 border-t border-gray-100">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(income)}
                        className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteDialogId(income.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Income Record</DialogTitle>
                          </DialogHeader>
                          <p>
                            Are you sure you want to delete this income record?
                            This action cannot be undone.
                          </p>
                          <DialogFooter className="pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setDeleteDialogId(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
