'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
        const res = await api.get('/api/v1/investments', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInvestments(res.data.content || []);
      } catch (err: unknown) {
        if (typeof err === 'object' && err !== null && 'response' in err) {
          const errorObj = err as { response?: { data?: { message?: string } } };
          setError(errorObj.response?.data?.message || 'Failed to fetch investments');
        } else {
          setError('Failed to fetch investments');
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
      setInvestments(prev => prev.filter(inv => inv.id !== id));
      setShowDialog(false);
      setDeleteId(null);
    } catch (err) {
      console.error('Failed to delete investment:', err);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Investments</h2>
        <Button onClick={() => router.push('/dashboard/investments/create')}>
          Add Investment
        </Button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {investments.map(inv => (
          <Card key={inv.id}>
            <CardContent className="p-4 space-y-1 relative">
              <p className="font-medium">{inv.symbol || 'N/A'}</p>
              <p>Type: {inv.type}</p>
              <p>Units: {inv.units ?? '—'}</p>
              <p>Buy Price: ₹{inv.buyPrice ?? '—'}</p>
              <p>Interest Rate: {inv.interestRate ?? '—'}%</p>
              <p>Start: {inv.startDate ?? '—'}</p>
              <p>End: {inv.endDate ?? '—'}</p>
              <p>Invested: ₹{inv.totalAmountInvested ?? '—'}</p>
              <p>Current Value: ₹{inv.currentValue ?? '—'}</p>

              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => router.push(`/dashboard/investments/edit/${inv.id}`)}
                >
                  <Pencil size={18} />
                </Button>

                <Dialog open={showDialog && deleteId === inv.id} onOpenChange={open => setShowDialog(open)}>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setDeleteId(inv.id);
                        setShowDialog(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Investment</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this investment?</p>
                    <DialogFooter className="mt-4 flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => setShowDialog(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteId && handleDelete(deleteId)}
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
  );
}
