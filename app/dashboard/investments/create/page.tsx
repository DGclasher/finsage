'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import api from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateInvestment() {
  const { token } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    type: '',
    symbol: '',
    units: '',
    buyPrice: '',
    currentPrice: '',
    startDate: '',
    endDate: '',
    interestRate: '',
    totalAmountInvested: '',
    currentValue: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post(
        '/api/v1/investments',
        {
          ...form,
          units: parseFloat(form.units),
          buyPrice: parseFloat(form.buyPrice),
          currentPrice: parseFloat(form.currentPrice),
          interestRate: parseFloat(form.interestRate),
          totalAmountInvested: parseFloat(form.totalAmountInvested),
          currentValue: parseFloat(form.currentValue),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      router.push('/dashboard/investments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Add New Investment</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-1 block">Type</Label>
          <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
            <SelectTrigger className="w-full bg-white text-black border border-gray-300 rounded-md shadow-sm">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black border border-gray-300 shadow-lg rounded-md">
              <SelectItem value="STOCK">STOCK</SelectItem>
              <SelectItem value="ETF">ETF</SelectItem>
              <SelectItem value="MUTUAL_FUND">MUTUAL FUND</SelectItem>
              <SelectItem value="BOND">BOND</SelectItem>
              <SelectItem value="FD">FD</SelectItem>
            </SelectContent>
          </Select>
        </div>


        <div>
          <Label>Symbol</Label>
          <Input name="symbol" value={form.symbol} onChange={handleChange} />
        </div>

        <div>
          <Label>Units</Label>
          <Input name="units" value={form.units} onChange={handleChange} />
        </div>

        <div>
          <Label>Buy Price</Label>
          <Input name="buyPrice" value={form.buyPrice} onChange={handleChange} />
        </div>

        <div>
          <Label>Current Price</Label>
          <Input name="currentPrice" value={form.currentPrice} onChange={handleChange} />
        </div>

        <div>
          <Label>Total Amount Invested</Label>
          <Input name="totalAmountInvested" value={form.totalAmountInvested} onChange={handleChange} />
        </div>

        <div>
          <Label>Current Value</Label>
          <Input name="currentValue" value={form.currentValue} onChange={handleChange} />
        </div>

        <div>
          <Label>Start Date</Label>
          <Input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>End Date</Label>
          <Input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Interest Rate</Label>
          <Input name="interestRate" value={form.interestRate} onChange={handleChange} />
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Create Investment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
