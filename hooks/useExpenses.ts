import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '../types';

const STORAGE_KEY = 'expense-tracker:expenses';

// Small helper so we don't need a UUID library for a one-day project.
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted expenses once on mount.
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && isMounted) {
          setExpenses(JSON.parse(raw) as Expense[]);
        }
      } catch (error) {
        console.warn('Failed to load expenses from storage', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Persist to storage whenever the list changes, after the initial load.
  useEffect(() => {
    if (isLoading) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)).catch((error) =>
      console.warn('Failed to save expenses to storage', error)
    );
  }, [expenses, isLoading]);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    setExpenses((prev) => [{ ...expense, id: generateId() }, ...prev]);
  }, []);

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, []);

  const total = useMemo(
    () => expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [expenses]
  );

  return { expenses, isLoading, addExpense, removeExpense, total };
}
