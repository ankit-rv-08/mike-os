'use client';

import { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, DollarSign, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Transaction {
  id: string;
  desc: string;
  amount: number;
  type: 'in' | 'out';
}

export default function CapitalPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<'in'|'out'>('out');

  useEffect(() => {
    const saved = localStorage.getItem('mike_finance');
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('mike_finance', JSON.stringify(transactions));
  }, [transactions]);

  const addTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !desc) return;
    setTransactions([{ id: Date.now().toString(), desc, amount: parseFloat(amount), type }, ...transactions]);
    setAmount('');
    setDesc('');
  };

  const balance = transactions.reduce((acc, curr) => curr.type === 'in' ? acc + curr.amount : acc - curr.amount, 0);

  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in duration-700 text-slate-200">
      <div className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white uppercase tracking-widest">
            <Wallet className="text-yellow-500 animate-pulse" /> Capital_Ledger
          </h1>
          <p className="text-cyan-500 font-mono text-xs mt-2 tracking-widest">LIQUIDITY & RESOURCE ALLOCATION</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-black/60 border-slate-800/80 backdrop-blur-xl md:col-span-2">
          <CardContent className="p-8 flex items-center justify-between">
            <div>
              <p className="font-mono text-xs text-slate-500 tracking-widest mb-2">NET LIQUIDITY</p>
              <h2 className={`text-5xl font-bold tracking-tight ${balance >= 0 ? 'text-white' : 'text-red-500'}`}>
                ${balance.toFixed(2)}
              </h2>
            </div>
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/30">
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/60 border-slate-800/80 backdrop-blur-xl">
          <CardContent className="p-6">
            <h3 className="font-mono text-xs text-cyan-400 mb-4 tracking-widest">LOG TRANSACTION</h3>
            <form onSubmit={addTx} className="space-y-3">
              <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white" />
              <div className="flex gap-2">
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="w-2/3 bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white" />
                <button type="button" onClick={() => setType(type === 'in' ? 'out' : 'in')} className={`w-1/3 text-xs font-bold rounded flex items-center justify-center ${type === 'in' ? 'bg-green-600/20 text-green-500 border border-green-500' : 'bg-red-600/20 text-red-500 border border-red-500'}`}>
                  {type === 'in' ? 'INCOME' : 'EXPENSE'}
                </button>
              </div>
              <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white p-2 rounded text-xs font-mono tracking-widest mt-2 border border-slate-600">CONFIRM</button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/60 border-slate-800/80 backdrop-blur-xl">
         <CardContent className="p-6">
           <h3 className="font-mono text-xs text-slate-400 mb-4 tracking-widest">TRANSACTION HISTORY</h3>
           {transactions.length === 0 ? (
              <p className="text-center text-slate-600 py-8 font-mono text-xs">NO LEDGER ENTRIES FOUND</p>
           ) : (
             <div className="space-y-2">
               {transactions.map(tx => (
                 <div key={tx.id} className="flex justify-between items-center bg-slate-900/40 p-3 rounded border border-slate-800">
                   <div className="flex items-center gap-3">
                     {tx.type === 'in' ? <ArrowUpRight className="text-green-500 w-4 h-4" /> : <ArrowDownRight className="text-red-500 w-4 h-4" />}
                     <span className="text-sm font-medium text-white">{tx.desc}</span>
                   </div>
                   <span className={`font-mono text-sm font-bold ${tx.type === 'in' ? 'text-green-500' : 'text-white'}`}>
                     {tx.type === 'in' ? '+' : '-'}${tx.amount.toFixed(2)}
                   </span>
                 </div>
               ))}
             </div>
           )}
         </CardContent>
      </Card>
    </div>
  );
}