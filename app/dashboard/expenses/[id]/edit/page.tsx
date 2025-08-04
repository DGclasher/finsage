'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import api from '@/lib/api';

export default function EditExpensePage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [version, setVersion] = useState<number>(0);

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
        console.error('Failed to fetch expense:', err);
      }
    };
    if (id) fetchExpense();
  }, [id, token]);

  const handleUpdate = async () => {
    try {
      await api.put(
        `/api/v1/expenses/${id}`,
        { category, amount: Number(amount), version },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push('/dashboard/expenses');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Edit Expense</h2>
      <div className="space-y-2">
        <Label>Category</Label>
        <Input value={category} onChange={e => setCategory(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Amount</Label>
        <Input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
        />
      </div>
      <Button onClick={handleUpdate}>Update</Button>
    </div>
  );
}
