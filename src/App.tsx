import React, { useState } from 'react';
import { BarChart2, ArrowLeft, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

const categories = ['Food', 'Travel', 'Bills', 'Entertainment', 'Shopping', 'Others'];

interface Expense {
  date: string;
  amount: number;
  category: string;
}

export default function KASH() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [dashboard, setDashboard] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');

  const handleAddExpense = () => {
    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) return;
    
    const entry: Expense = { 
      date: today, 
      amount: numericAmount, 
      category 
    };

    if (editIndex !== null) {
      const updated = [...expenses];
      updated[editIndex] = entry;
      setExpenses(updated);
      setEditIndex(null);
    } else {
      setExpenses([...expenses, entry]);
    }
    setAmount('');
  };

  const backgroundColor = '#f0f0f0';
  const cardColor = '#e8e8e8';
  const textColor = '#222';

  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const dailyTotals = expenses.reduce((acc: { [key: string]: number }, e) => {
    acc[e.date] = (acc[e.date] || 0) + e.amount;
    return acc;
  }, {});

  return (
    <div style={{ minHeight: '100vh', padding: '24px', backgroundColor, color: textColor }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        {dashboard ? (
          <button 
            onClick={() => setDashboard(false)}
            style={{ 
              background: 'transparent', 
              border: '1px solid #ddd', 
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ArrowLeft style={{ marginRight: '8px' }} /> Back
          </button>
        ) : (
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>KASH</h1>
        )}
        {!dashboard && (
          <button 
            onClick={() => setDashboard(true)}
            style={{ 
              background: '#2563eb', 
              color: 'white', 
              padding: '8px 16px', 
              border: 'none' 
            }}
          >
            Dashboard
          </button>
        )}
      </div>

      {!dashboard ? (
        <div style={{ backgroundColor: cardColor, padding: '24px', borderRadius: '8px' }}>
          <input
            type="number"
            step="0.01"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '16px',
              color: '#222'
            }}
          />
          <p style={{ marginBottom: '8px' }}>Select Category:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  background: category === cat ? '#2563eb' : 'white',
                  color: category === cat ? 'white' : '#222',
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <button 
            onClick={handleAddExpense}
            style={{ 
              background: '#2563eb', 
              color: 'white', 
              padding: '8px 16px', 
              width: '100%' 
            }}
          >
            {editIndex !== null ? 'Update' : 'Add'} Expense
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowChart(!showChart)}
              style={{
                background: 'transparent',
                border: '1px solid #ddd',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <BarChart2 style={{ marginRight: '8px' }} /> 
              {showChart ? 'Hide Chart' : 'Show Chart'}
            </button>
          </div>
          
          {!showChart ? (
            sortedExpenses.length === 0 ? (
              <div style={{ 
                backgroundColor: cardColor, 
                padding: '24px', 
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <p>No expenses recorded yet</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                {sortedExpenses.map((expense, index) => (
                  <div key={index} style={{ backgroundColor: cardColor, padding: '16px', borderRadius: '8px' }}>
                    <p style={{ fontWeight: '500' }}>{expense.date}</p>
                    <p>Category: {expense.category}</p>
                    <p style={{ fontSize: '20px', fontWeight: 'bold' }}>AED {expense.amount.toFixed(2)}</p>
                    <button 
                      onClick={() => {
                        setAmount(expense.amount.toString());
                        setCategory(expense.category);
                        setDashboard(false);
                        setEditIndex(index);
                      }}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        padding: '4px 8px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Edit2 style={{ marginRight: '4px' }} /> Edit
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div style={{ backgroundColor: cardColor, padding: '16px', borderRadius: '8px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Expenses Chart</h2>
              {Object.entries(dailyTotals).map(([date, total]) => (
                <div key={date} style={{ marginBottom: '12px' }}>
                  <p style={{ marginBottom: '4px' }}>{date}</p>
                  <div style={{ 
                    height: '6px',
                    background: '#2563eb',
                    width: `${Math.min(Number(total) * 0.5, 500)}px`,
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }} />
                  <p style={{ marginTop: '4px' }}>AED {Number(total).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}