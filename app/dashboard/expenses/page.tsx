// app/dashboard/expenses/page.tsx
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

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

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/api/v1/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data.content || []);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [token]);

  const deleteExpense = async (id: string) => {
    try {
      await api.delete(`/api/v1/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
      setDialogOpen(false);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Expenses</h2>
        <Link href="/dashboard/expenses/create">
          <Button>Add Expense</Button>
        </Link>
      </div>
      <div className="grid gap-4">
        {expenses.map(exp => (
          <div key={exp.id} className="p-4 border rounded-lg shadow-sm space-y-2">
            <div className="font-medium text-lg">{exp.category}</div>
            <div className="text-sm">Amount: ₹{exp.amount}</div>
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/expenses/${exp.id}/edit`)}
              >
                Edit
              </Button>
              <Dialog open={dialogOpen && confirmId === exp.id} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" onClick={() => setConfirmId(exp.id)}>
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent className="space-y-4">
                  <h3 className="text-lg font-semibold">Confirm Delete</h3>
                  <p>Are you sure you want to delete this expense?</p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={() => deleteExpense(exp.id)}>
                      Confirm
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
