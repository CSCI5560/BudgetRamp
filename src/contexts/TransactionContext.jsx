
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { transactions as initialTransactions, addTransaction as addTransactionUtil } from '@/data/newData';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
    const [transactions, setTransactions] = useState(initialTransactions);

    const addTransaction = useCallback((newTransaction) => {
        const updatedTransactions = addTransactionUtil(newTransaction);
        setTransactions(updatedTransactions);
    }, []);

    const value = useMemo(() => ({
        transactions,
        addTransaction
    }), [transactions, addTransaction]);

    return (
        <TransactionContext.Provider value={value}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};
