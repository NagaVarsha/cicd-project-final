import React, { useState, useEffect, useMemo } from 'react';
import * as api from './apiService'; // Using the real API service

// --- Reusable Components ---
const CurrencySelector = ({ currency, setCurrency }) => {
    const currencies = [
        { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
    ];
    return (
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent transition">
            {currencies.map(c => (<option key={c.code} value={c.code}>{c.name} ({c.symbol})</option>))}
        </select>
    );
};

// --- Page Components ---
const HomePage = ({ setPage }) => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center text-center p-4">
        <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-800 mb-4 tracking-tight">Stop Stressing About Shared Expenses.</h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">ExpenseShare is the simplest way to split bills with friends and family.</p>
            <div className="flex justify-center space-x-4">
                <button onClick={() => setPage('login')} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg">Sign In</button>
                <button onClick={() => setPage('signup')} className="bg-white text-blue-600 font-bold py-3 px-8 rounded-full hover:bg-gray-50 transition-transform transform hover:scale-105 shadow-lg border border-gray-200">Sign Up</button>
            </div>
        </div>
    </div>
);

const AuthForm = ({ isLogin, setPage, onSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const user = isLogin
                ? await api.login(email, password)
                : await api.signup(name, email, password, currency);
            
            setSuccess(isLogin ? 'Logged in successfully!' : 'Account created! Redirecting...');
            setTimeout(() => onSuccess(user), 1000);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h2>
                <p className="text-center text-gray-500 mb-6">{isLogin ? 'Sign in to manage your expenses.' : 'Join ExpenseShare today!'}</p>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center">{error}</p>}
                {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-center">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500" />}
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    {!isLogin && <CurrencySelector currency={currency} setCurrency={setCurrency} />}
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>
                <p className="text-center text-gray-500 mt-6">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setPage(isLogin ? 'signup' : 'login')} className="font-semibold text-blue-600 hover:underline">
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

const AddExpenseModal = ({ isOpen, onClose, onAddExpense, user }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [sharedWith, setSharedWith] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const sharedWithIds = sharedWith.split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id) && id > 0);

        onAddExpense({
            description,
            amount: parseFloat(amount),
            paidById: user.id,
            sharedWithIds: sharedWithIds,
        });
        
        setDescription('');
        setAmount('');
        setSharedWith('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md m-4">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Add a New Expense</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Expense Description (e.g., Dinner)" required className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Total Amount" required min="0.01" step="0.01" className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    <input 
                        type="text" 
                        value={sharedWith} 
                        onChange={e => setSharedWith(e.target.value)} 
                        placeholder="Shared with (comma-separated user IDs)" 
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500" 
                    />
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 font-semibold">Cancel</button>
                        <button type="submit" className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-semibold">Add Expense</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Dashboard = ({ user, onLogout }) => {
    const [expenses, setExpenses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    const userCurrencySymbol = currencySymbols[user.defaultCurrency] || '$';

    const loadExpenses = async () => {
        if (!user) return;
        try {
            const data = await api.getExpenses(user.id);
            setExpenses(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) { console.error("Error fetching expenses:", error); }
    };

    useEffect(() => {
        loadExpenses();
    }, [user]);
    
    const handleAddExpense = async (expenseData) => {
        try {
           await api.addExpense(expenseData);
           loadExpenses();
        } catch (error) { console.error("Error adding expense:", error); }
    };

    const { totalYouPaid, youOwe, youAreOwed } = useMemo(() => {
        let paid = 0;
        let owedToYou = 0;
        let owedByYou = 0;

        expenses.forEach(exp => {
            const myShare = exp.shares.find(s => s.user.id === user.id);
            
            if (exp.paidBy.id === user.id) {
                paid += exp.amount;
                if (myShare) {
                    owedToYou += exp.amount - myShare.shareAmount;
                }
            } else {
                if (myShare) {
                    owedByYou += myShare.shareAmount;
                }
            }
        });

        return { totalYouPaid: paid, youOwe: owedByYou, youAreOwed: owedToYou };
    }, [expenses, user.id]);

    return (
        <>
            <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddExpense={handleAddExpense} user={user} />
            <div className="bg-gray-100 min-h-screen">
                <header className="bg-white shadow-md">
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-blue-600">ExpenseShare</h1>
                        <div className="flex items-center space-x-4">
                            <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">Add Expense</button>
                            <div className="w-10 h-10 bg-gray-200 rounded-full text-gray-600 font-bold flex items-center justify-center">{user.fullName.charAt(0)}</div>
                            <button onClick={onLogout} className="font-semibold text-gray-600 hover:text-blue-600">Logout</button>
                        </div>
                    </nav>
                </header>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user.fullName}!</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                         <div className="bg-white p-6 rounded-2xl shadow"><h3 className="text-gray-500">Total You Paid</h3><p className="text-3xl font-bold text-blue-500">{userCurrencySymbol}{totalYouPaid.toFixed(2)}</p></div>
                         <div className="bg-white p-6 rounded-2xl shadow"><h3 className="text-gray-500">You Owe</h3><p className="text-3xl font-bold text-orange-500">{userCurrencySymbol}{youOwe.toFixed(2)}</p></div>
                         <div className="bg-white p-6 rounded-2xl shadow"><h3 className="text-gray-500">You Are Owed</h3><p className="text-3xl font-bold text-green-500">{userCurrencySymbol}{youAreOwed.toFixed(2)}</p></div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Group's Expenses</h3>
                         {expenses.length === 0 ? (
                             <div className="text-center bg-white p-8 rounded-lg shadow"><p className="text-gray-500">No expenses yet. Click "Add Expense" to get started!</p></div>
                         ) : (
                             <ul className="space-y-3">
                                 {expenses.map(exp => {
                                     const myShare = exp.shares.find(s => s.user.id === user.id);
                                     const isPayer = exp.paidBy.id === user.id;

                                     return (
                                        <li key={exp.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold">{exp.description}</p>
                                                <p className="text-sm text-gray-500">Paid by {isPayer ? "You" : exp.paidBy.fullName}</p>
                                            </div>
                                            <div className="text-right">
                                                 <p className="font-bold text-lg">{userCurrencySymbol}{exp.amount.toFixed(2)}</p>
                                                 {myShare && !isPayer && <p className="text-sm text-orange-600">You owe: {userCurrencySymbol}{myShare.shareAmount.toFixed(2)}</p>}
                                                 {myShare && isPayer && <p className="text-sm text-green-600">Your share: {userCurrencySymbol}{myShare.shareAmount.toFixed(2)}</p>}
                                            </div>
                                        </li>
                                     );
                                 })}
                             </ul>
                         )}
                    </div>
                </main>
            </div>
        </>
    );
};

// --- Main App Component ---
function App() {
    const [page, setPage] = useState('home');
    const [user, setUser] = useState(null);

    const handleLogin = (userData) => {
        setUser(userData);
        setPage('dashboard');
    };
    const handleLogout = () => {
        setUser(null);
        setPage('home');
    };

    const renderPage = () => {
        switch (page) {
            case 'login': return <AuthForm isLogin={true} setPage={setPage} onSuccess={handleLogin} />;
            case 'signup': return <AuthForm isLogin={false} setPage={setPage} onSuccess={handleLogin} />;
            case 'dashboard': return user ? <Dashboard user={user} onLogout={handleLogout} /> : <AuthForm isLogin={true} setPage={setPage} onSuccess={handleLogin} />;
            default: return <HomePage setPage={setPage} />;
        }
    };
    return <div>{renderPage()}</div>;
}

export default App;

