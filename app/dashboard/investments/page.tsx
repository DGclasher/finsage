"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  BarChart,
  PieChart,
  Target,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Investment = {
  id: string;
  type: string;
  symbol?: string;
  units?: number;
  buyPrice?: number;
  interestRate?: number;
  startDate?: string;
  endDate?: string;
  totalAmountInvested?: number;
  currentValue?: number;
};

export default function InvestmentsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await api.get("/api/v1/investments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvestments(res.data.content || []);
      } catch (err: unknown) {
        if (typeof err === "object" && err !== null && "response" in err) {
          const errorObj = err as {
            response?: { data?: { message?: string } };
          };
          setError(
            errorObj.response?.data?.message || "Failed to fetch investments"
          );
        } else {
          setError("Failed to fetch investments");
        }
      }
    };
    fetchInvestments();
  }, [token]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/v1/investments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvestments((prev) => prev.filter((inv) => inv.id !== id));
      setShowDialog(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Failed to delete investment:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex-shrink-0">
              <PieChart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 truncate">Investments</h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Manage your investment portfolio</p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/dashboard/investments/create")}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Investment
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {investments.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <PieChart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No investments yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start building your portfolio by adding your first investment
            </p>
            <Button
              onClick={() => router.push("/dashboard/investments/create")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Investment
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.map((inv) => {
              const gainLoss =
                (inv.currentValue || 0) - (inv.totalAmountInvested || 0);
              const gainLossPercent = inv.totalAmountInvested
                ? (gainLoss / inv.totalAmountInvested) * 100
                : 0;
              const isPositive = gainLoss >= 0;

              return (
                <Card
                  key={inv.id}
                  className="border-0 shadow-lg bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover-lift"
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            inv.type === "STOCK"
                              ? "bg-blue-100 text-blue-600"
                              : inv.type === "MUTUAL_FUND"
                              ? "bg-green-100 text-green-600"
                              : inv.type === "BOND"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {inv.type === "STOCK" ? (
                            <BarChart className="w-4 h-4" />
                          ) : inv.type === "MUTUAL_FUND" ? (
                            <Target className="w-4 h-4" />
                          ) : (
                            <DollarSign className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {inv.symbol || "N/A"}
                          </h3>
                          <p className="text-sm text-gray-500">{inv.type}</p>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            router.push(`/dashboard/investments/edit/${inv.id}`)
                          }
                          className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>

                        <Dialog
                          open={showDialog && deleteId === inv.id}
                          onOpenChange={(open) => setShowDialog(open)}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                              onClick={() => {
                                setDeleteId(inv.id);
                                setShowDialog(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Investment</DialogTitle>
                            </DialogHeader>
                            <p>
                              Are you sure you want to delete this investment?
                              This action cannot be undone.
                            </p>
                            <DialogFooter className="mt-4 flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => setShowDialog(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  deleteId && handleDelete(deleteId)
                                }
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {/* Investment Details */}
                    <div className="space-y-3">
                      {inv.units && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Units</span>
                          <span className="font-medium">{inv.units}</span>
                        </div>
                      )}

                      {inv.buyPrice && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">
                            Buy Price
                          </span>
                          <span className="font-medium">
                            ₹{inv.buyPrice.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {inv.interestRate && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">
                            Interest Rate
                          </span>
                          <span className="font-medium">
                            {inv.interestRate}%
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Invested</span>
                        <span className="font-medium">
                          ₹{(inv.totalAmountInvested || 0).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Current Value
                        </span>
                        <span className="font-medium">
                          ₹{(inv.currentValue || 0).toFixed(2)}
                        </span>
                      </div>

                      {/* Gain/Loss */}
                      <div className="pt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Gain/Loss
                          </span>
                          <div className="text-right">
                            <div
                              className={`font-semibold flex items-center gap-1 ${
                                isPositive ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {isPositive ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              ₹{Math.abs(gainLoss).toFixed(2)}
                            </div>
                            <div
                              className={`text-sm ${
                                isPositive ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {isPositive ? "+" : ""}
                              {gainLossPercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dates */}
                      {(inv.startDate || inv.endDate) && (
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {inv.startDate &&
                                new Date(inv.startDate).toLocaleDateString()}
                              {inv.startDate && inv.endDate && " - "}
                              {inv.endDate &&
                                new Date(inv.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
