'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import api from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Income {
  id: string;
  version: number;
  annualPostTaxIncome: number;
  incomeYear: number;
}

export default function IncomePage() {
  const { token } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [form, setForm] = useState({ id: '', annualPostTaxIncome: '', incomeYear: '' });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

  const fetchIncomes = async () => {
    const res = await api.get('/api/v1/incomes', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setIncomes(res.data.content || []);
  };

  useEffect(() => {
    fetchIncomes();
  }, [token]);

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
        await api.post('/api/v1/incomes', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      await fetchIncomes();
      setForm({ id: '', annualPostTaxIncome: '', incomeYear: '' });
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
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Incomes</h2>

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 max-w-xl">
        <div>
          <Label>Annual Post-Tax Income</Label>
          <Input
            name="annualPostTaxIncome"
            value={form.annualPostTaxIncome}
            onChange={handleChange}
            type="number"
            required
          />
        </div>
        <div>
          <Label>Income Year</Label>
          <Input
            name="incomeYear"
            value={form.incomeYear}
            onChange={handleChange}
            type="number"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {editing ? (loading ? 'Updating...' : 'Update Income') : (loading ? 'Creating...' : 'Create Income')}
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {incomes.map((income) => (
          <Card key={income.id}>
            <CardContent className="p-4 space-y-2">
              <p><strong>Amount:</strong> ₹{income.annualPostTaxIncome.toLocaleString()}</p>
              <p><strong>Year:</strong> {income.incomeYear}</p>
              <div className="flex gap-2 pt-2 text-black">
                <Button size="sm" onClick={() => handleEdit(income)}>Edit</Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteDialogId(income.id)}>
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this income?</p>
                    <DialogFooter className="pt-4">
                      <Button variant="outline" onClick={() => setDeleteDialogId(null)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        Confirm
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
  );
}
