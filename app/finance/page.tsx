'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Wallet, Target } from 'lucide-react';

const incomeData = [
  { category: 'Salary', amount: 8500 },
  { category: 'Freelance', amount: 2300 },
  { category: 'Investments', amount: 1200 },
];

const expenseData = [
  { category: 'Housing', amount: 2500, percentage: 35 },
  { category: 'Food', amount: 800, percentage: 11 },
  { category: 'Transportation', amount: 400, percentage: 6 },
  { category: 'Entertainment', amount: 500, percentage: 7 },
  { category: 'Utilities', amount: 300, percentage: 4 },
  { category: 'Savings', amount: 2700, percentage: 37 },
];

const monthlyData = [
  { month: 'Jan', income: 12000, expense: 7000 },
  { month: 'Feb', income: 11800, expense: 7200 },
  { month: 'Mar', income: 12500, expense: 6900 },
  { month: 'Apr', income: 13000, expense: 7500 },
  { month: 'May', income: 12000, expense: 7100 },
  { month: 'Jun', income: 13200, expense: 6800 },
];

const COLORS = ['#64c8ff', '#a78bfa', '#34d399', '#fbbf24', '#f87171', '#818cf8'];

export default function FinancePage() {
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-glow mb-2">Finance</h1>
        <p className="text-muted-foreground">Track income, expenses, and financial goals</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: TrendingUp, label: 'Total Income', value: `$${totalIncome.toLocaleString()}`, color: 'text-green-400' },
          { icon: Wallet, label: 'Total Expense', value: `$${totalExpense.toLocaleString()}`, color: 'text-red-400' },
          { icon: DollarSign, label: 'Balance', value: `$${balance.toLocaleString()}`, color: 'text-accent' },
          { icon: Target, label: 'Savings Rate', value: '42%', color: 'text-blue-400' },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-panel p-6 hover-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {card.label}
                </h3>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown */}
        <div className="glass-panel p-8 hover-glow">
          <h2 className="text-xl font-semibold text-foreground mb-6">Income Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="amount"
              >
                {incomeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(100, 200, 255, 0.3)',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-2 mt-6">
            {incomeData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-card/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="text-sm text-foreground">{item.category}</span>
                </div>
                <span className="text-sm font-semibold text-accent">${item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="glass-panel p-8 hover-glow">
          <h2 className="text-xl font-semibold text-foreground mb-6">Expense Breakdown</h2>

          <div className="space-y-4">
            {expenseData.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-sm font-medium text-foreground">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-accent">${item.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-card/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-primary"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Income vs Expense Trend */}
      <div className="glass-panel p-8 hover-glow">
        <h2 className="text-xl font-semibold text-foreground mb-6">Monthly Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 200, 255, 0.1)" />
            <XAxis dataKey="month" stroke="rgb(100, 150, 200)" />
            <YAxis stroke="rgb(100, 150, 200)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(100, 200, 255, 0.3)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="income" fill="rgb(52, 211, 153)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="rgb(248, 113, 113)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Financial Goals */}
      <div className="glass-panel-lg p-8 hover-glow">
        <h2 className="text-xl font-semibold text-foreground mb-6">Financial Goals</h2>

        <div className="space-y-4">
          {[
            { name: 'Emergency Fund', target: 15000, current: 12500, deadline: '3 months' },
            { name: 'Vacation Fund', target: 5000, current: 2800, deadline: '6 months' },
            { name: 'Investment Portfolio', target: 50000, current: 35400, deadline: '12 months' },
          ].map((goal, idx) => (
            <div key={idx} className="bg-card/30 border border-border/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{goal.name}</h4>
                  <p className="text-xs text-muted-foreground">Target: ${goal.target.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-accent">${goal.current.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{Math.round((goal.current / goal.target) * 100)}%</p>
                </div>
              </div>

              <div className="w-full h-2 bg-card/50 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-accent to-primary"
                  style={{ width: `${(goal.current / goal.target) * 100}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground">Complete by: {goal.deadline}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="glass-panel p-6 border-yellow-500/30">
        <h3 className="font-semibold text-foreground mb-3">Financial Insights</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>✓ Your savings rate is above average at 42%</li>
          <li>✓ Housing expenses are well-controlled at 35%</li>
          <li>✓ Monthly surplus shows upward trend</li>
          <li>⚠ Entertainment spending increased by 12% this month</li>
        </ul>
      </div>
    </div>
  );
}
