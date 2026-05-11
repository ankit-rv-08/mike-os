'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, Target, Plus, Trash2, RefreshCw, DollarSign, IndianRupee } from 'lucide-react'

interface FinanceItem { id: string; source?: string; category?: string; amount: number; color: string }
interface FinanceData { income: FinanceItem[]; expenses: FinanceItem[] }

export function FinanceView() {
  const [data, setData] = useState<FinanceData>({ income: [], expenses: [] })
  const [addingIncome, setAddingIncome] = useState(false)
  const [addingExpense, setAddingExpense] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newAmount, setNewAmount] = useState('')

  // Currency & Exchange Rate State
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')
  const [exchangeRate, setExchangeRate] = useState<number>(83.5) // Fallback rate
  const [isFetchingRate, setIsFetchingRate] = useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787'

  // Fetch Live Exchange Rate
  useEffect(() => {
    const fetchRate = async () => {
      setIsFetchingRate(true)
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD')
        const rateData = await res.json()
        if (rateData && rateData.rates && rateData.rates.INR) {
          setExchangeRate(rateData.rates.INR)
        }
      } catch (e) {
        console.error('Failed to fetch live exchange rate', e)
      } finally {
        setIsFetchingRate(false)
      }
    }
    fetchRate()
  }, [])

  const fetchFinance = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/finance`)
      setData(await res.json())
    } catch (e) { console.error(e) }
  }

  const saveFinance = async (newData: FinanceData) => {
    setData(newData)
    try {
      await fetch(`${API_BASE}/api/finance`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newData)
      })
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    fetchFinance()
    const int = setInterval(fetchFinance, 5000) // Poll for AI updates
    return () => clearInterval(int)
  }, [])

  // Smart Add: Converts input to INR if user is in USD mode
  const handleAdd = (e: React.FormEvent, type: 'income' | 'expenses') => {
    e.preventDefault()
    if (!newLabel || !newAmount) return

    let rawAmount = parseFloat(newAmount)
    if (currency === 'USD') {
      rawAmount = rawAmount * exchangeRate // Convert back to INR for database consistency
    }

    const newItem = {
      id: Date.now().toString(),
      [type === 'income' ? 'source' : 'category']: newLabel,
      amount: Math.round(rawAmount),
      color: type === 'income' ? '#06b6d4' : '#ef4444'
    } as FinanceItem
    
    saveFinance({ ...data, [type]: [...data[type], newItem] })
    setNewLabel(''); setNewAmount(''); setAddingIncome(false); setAddingExpense(false);
  }

  const handleDelete = (type: 'income' | 'expenses', id: string) => {
    saveFinance({ ...data, [type]: data[type].filter(i => i.id !== id) })
  }

  // Dynamic Money Formatter
  const formatMoney = (amountInINR: number, compact = false) => {
    if (currency === 'INR') {
      return compact ? `₹${(amountInINR / 1000).toFixed(1)}k` : `₹${amountInINR.toLocaleString('en-IN')}`
    } else {
      const amountInUSD = amountInINR / exchangeRate
      return compact ? `$${(amountInUSD / 1000).toFixed(1)}k` : `$${amountInUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  const totalIncome = data.income.reduce((s, i) => s + i.amount, 0)
  const totalExpense = data.expenses.reduce((s, e) => s + e.amount, 0)
  const netSavings = totalIncome - totalExpense

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar animate-in fade-in duration-300">
      
      {/* Header & Currency Toggle */}
      <div className="flex justify-end items-center gap-4">
        {isFetchingRate && <span className="text-xs text-slate-500 flex items-center gap-1"><RefreshCw size={12} className="animate-spin" /> Syncing Live Rates</span>}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 shadow-lg">
          <button 
            onClick={() => setCurrency('INR')} 
            className={`flex items-center gap-1 px-4 py-1.5 text-xs font-bold rounded transition-all ${currency === 'INR' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <IndianRupee size={12} /> INR
          </button>
          <button 
            onClick={() => setCurrency('USD')} 
            className={`flex items-center gap-1 px-4 py-1.5 text-xs font-bold rounded transition-all ${currency === 'USD' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <DollarSign size={12} /> USD
          </button>
        </div>
      </div>

      {/* Top Summary Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Income', value: formatMoney(totalIncome), color: 'text-emerald-400', icon: ArrowUpRight, border: 'border-t-emerald-500' },
          { label: 'Total Expenses', value: formatMoney(totalExpense), color: 'text-red-400', icon: ArrowDownRight, border: 'border-t-red-500' },
          { label: 'Net Savings', value: formatMoney(netSavings), color: 'text-cyan-400', icon: TrendingUp, border: 'border-t-cyan-500' },
          { label: 'Savings Rate', value: `${totalIncome ? Math.round((netSavings / totalIncome) * 100) : 0}%`, color: 'text-yellow-400', icon: Wallet, border: 'border-t-yellow-500' },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className={`bg-slate-900 border border-slate-800 p-5 rounded-xl border-t-4 ${s.border} shadow-lg relative overflow-hidden`}>
              <Icon size={24} className={`absolute top-4 right-4 opacity-20 ${s.color}`} />
              <div className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-xs text-slate-400 font-bold uppercase">{s.label}</div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-6 flex-1 min-h-[300px]">
        {/* Income Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2"><ArrowUpRight size={16} className="text-emerald-400"/> Income Stream</h3>
            <button onClick={() => setAddingIncome(!addingIncome)} className="text-emerald-400 hover:text-emerald-300"><Plus size={18} /></button>
          </div>
          
          {addingIncome && (
            <form onSubmit={e => handleAdd(e, 'income')} className="flex gap-2 mb-4 bg-slate-950 p-2 rounded-lg border border-slate-800">
              <input type="text" placeholder="Source..." value={newLabel} onChange={e => setNewLabel(e.target.value)} className="flex-1 bg-transparent text-sm text-white focus:outline-none px-2" />
              <div className="flex items-center bg-transparent border-l border-slate-800 px-2">
                <span className="text-slate-500 text-sm">{currency === 'INR' ? '₹' : '$'}</span>
                <input type="number" placeholder="Amount" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="w-20 bg-transparent text-sm text-white focus:outline-none px-1" />
              </div>
              <button type="submit" className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded font-bold">Add</button>
            </form>
          )}

          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {data.income.length === 0 ? <p className="text-sm text-slate-500 italic">No income logged.</p> : data.income.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-950 border-l-2 border-emerald-400 rounded group">
                <span className="text-sm text-slate-300 font-bold">{item.source}</span>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-emerald-400">{formatMoney(item.amount)}</span>
                  <button onClick={() => handleDelete('income', item.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2"><ArrowDownRight size={16} className="text-red-400"/> Expenses Tracking</h3>
            <button onClick={() => setAddingExpense(!addingExpense)} className="text-red-400 hover:text-red-300"><Plus size={18} /></button>
          </div>

          {addingExpense && (
            <form onSubmit={e => handleAdd(e, 'expenses')} className="flex gap-2 mb-4 bg-slate-950 p-2 rounded-lg border border-slate-800">
              <input type="text" placeholder="Category..." value={newLabel} onChange={e => setNewLabel(e.target.value)} className="flex-1 bg-transparent text-sm text-white focus:outline-none px-2" />
              <div className="flex items-center bg-transparent border-l border-slate-800 px-2">
                <span className="text-slate-500 text-sm">{currency === 'INR' ? '₹' : '$'}</span>
                <input type="number" placeholder="Amount" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="w-20 bg-transparent text-sm text-white focus:outline-none px-1" />
              </div>
              <button type="submit" className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded font-bold">Add</button>
            </form>
          )}

          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {data.expenses.length === 0 ? <p className="text-sm text-slate-500 italic">No expenses logged.</p> : data.expenses.map((e) => {
              const pct = totalExpense > 0 ? Math.round((e.amount / totalExpense) * 100) : 0
              return (
                <div key={e.id} className="p-3 bg-slate-950 border-l-2 border-red-500 rounded group relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-red-500/5" style={{ width: `${pct}%` }} />
                  <div className="relative flex items-center justify-between">
                    <span className="text-sm text-slate-300 font-bold">{e.category} <span className="text-[10px] text-slate-500 font-normal ml-2">{pct}% of spend</span></span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-red-400">{formatMoney(e.amount)}</span>
                      <button onClick={() => handleDelete('expenses', e.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}