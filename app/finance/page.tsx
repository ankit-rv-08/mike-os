'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Wallet, Target, Loader2 } from 'lucide-react';

const COLORS = ['#64c8ff', '#a78bfa', '#34d399', '#fbbf24', '#f87171', '#818cf8'];

interface FinanceData {
  income: { category: string; amount: number }[];
  expenses: { category: string; amount: number; percentage: number }[];
  monthly: { month: string; income: number; expense: number }[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  savingsRate: number;
}

export default function FinancePage() {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8787';
  const [data, setData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/finance`);
        if (res.ok) {
          const json = await res.json();
          setData(json.data || json);
        } else {
          // Fallback: try getting data from performance endpoint
          const perfRes = await fetch(`${API_BASE}/api/performance`);
          if (perfRes.ok) {
            const perfJson = await perfRes.json();
            const perf = perfJson.data || perfJson;
            setData({
              income: [
                { category: 'Allowance', amount: perf.income || 5000 },
                { category: 'Freelance', amount: perf.freelance || 0 },
                { category: 'Other', amount: perf.otherIncome || 0 },
              ],
              expenses: [
                { category: 'Food', amount: perf.foodExpense || 2000, percentage: 40 },
                { category: 'Transport', amount: perf.transportExpense || 500, percentage: 10 },
                { category: 'Entertainment', amount: perf.entertainmentExpense || 500, percentage: 10 },
                { category: 'Savings', amount: perf.savings || 2000, percentage: 40 },
              ],
              monthly: [],
              totalIncome: (perf.income || 5000) + (perf.freelance || 0),
              totalExpense: 3000,
              balance: 2000,
              savingsRate: 40,
            });
          } else {
            throw new Error('Could not fetch finance data');
          }
        }
      } catch (err) {
        setError('Finance tracking coming soon. Start logging your expenses!');
        setData({
          income: [{ category: 'Add your income', amount: 0 }],
          expenses: [{ category: 'Add expenses', amount: 0, percentage: 100 }],
          monthly: [],
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
          savingsRate: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, [API_BASE]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your finances...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-glow mb-2">Finance</h1>
        <p className="text-muted-foreground">Track income, expenses, and financial goals</p>
        {error && <p className="text-sm text-yellow-400 mt-2">{error}</p>}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: TrendingUp, label: 'Total Income', value: `₹${data.totalIncome.toLocaleString()}`, color: 'text-green-400' },
          { icon: Wallet, label: 'Total Expense', value: `₹${data.totalExpense.toLocaleString()}`, color: 'text-red-400' },
          { icon: DollarSign, label: 'Balance', value: `₹${data.balance.toLocaleString()}`, color: 'text-accent' },
          { icon: Target, label: 'Savings Rate', value: `${data.savingsRate}%`, color: 'text-blue-400' },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-panel p-6 hover-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{card.label}</h3>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Simple message when no data */}
      {data.totalIncome === 0 && (
        <div className="glass-panel p-12 text-center">
          <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No finance data yet</h3>
          <p className="text-muted-foreground">
            Ask MIKE to "log my expenses" or "track my income" to get started!
          </p>
        </div>
      )}

      {/* Charts - only show if there's data */}
      {data.totalIncome > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-8 hover-glow">
            <h2 className="text-xl font-semibold text-foreground mb-6">Income Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.income} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="amount">
                  {data.income.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel p-8 hover-glow">
            <h2 className="text-xl font-semibold text-foreground mb-6">Expense Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data.expenses} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="amount">
                  {data.expenses.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
