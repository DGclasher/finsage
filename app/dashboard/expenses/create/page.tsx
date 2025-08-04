'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import api from '@/lib/api';

export default function CreateExpensePage() {
  const { token } = useAuth();
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState<number | ''>('');

  const handleSubmit = async () => {
    try {
      await api.post(
        '/api/v1/expenses',
        { category, amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      router.push('/dashboard/expenses');
    } catch (err) {
      console.error('Failed to create expense:', err);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Create Expense</h2>
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
      <Button onClick={handleSubmit}>Save</Button>
    </div>
  );
}