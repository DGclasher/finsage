'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export default function EditInvestment() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

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

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        const res = await api.get(`/api/v1/investments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        setForm({
          type: data.type || '',
          symbol: data.symbol || '',
          units: data.units?.toString() || '',
          buyPrice: data.buyPrice?.toString() || '',
          currentPrice: data.currentPrice?.toString() || '',
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          interestRate: data.interestRate?.toString() || '',
          totalAmountInvested: data.totalAmountInvested?.toString() || '',
          currentValue: data.currentValue?.toString() || '',
        });
      } catch (err) {
        console.error('Error fetching investment:', err);
        router.push('/dashboard/investments');
      }
    };

    fetchInvestment();
  }, [id, token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date) {
      setForm({ ...form, [field]: format(date, 'yyyy-MM-dd') });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/api/v1/investments/${id}`, {
        ...form,
        units: parseFloat(form.units),
        buyPrice: parseFloat(form.buyPrice),
        currentPrice: parseFloat(form.currentPrice),
        interestRate: parseFloat(form.interestRate),
        totalAmountInvested: parseFloat(form.totalAmountInvested),
        currentValue: parseFloat(form.currentValue),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      router.push('/dashboard/investments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Edit Investment</h2>
      <form onSubmit={handleUpdate} className="grid gap-4 sm:grid-cols-2">
        {/* Type dropdown */}
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

        {/* Other inputs */}
        {['symbol', 'units', 'buyPrice', 'currentPrice', 'totalAmountInvested', 'currentValue', 'interestRate'].map(field => (
          <div key={field}>
            <Label className="mb-1 block capitalize">{field}</Label>
            <Input name={field} value={form[field as keyof typeof form]} onChange={handleChange} />
          </div>
        ))}

        {/* Start Date */}
        <div>
          <Label className="mb-1 block">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.startDate ? form.startDate : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.startDate ? new Date(form.startDate) : undefined}
                onSelect={(date) => handleDateChange('startDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date */}
        <div>
          <Label className="mb-1 block">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.endDate ? form.endDate : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.endDate ? new Date(form.endDate) : undefined}
                onSelect={(date) => handleDateChange('endDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Submit button */}
        <div className="sm:col-span-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Update Investment'}
          </Button>
        </div>
      </form>
    </div>
  );
}
