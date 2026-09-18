export type Category =
  | 'food'
  | 'transport'
  | 'housing'
  | 'leisure'
  | 'shopping'
  | 'other';

export interface Expense {
  id: string;
  amount: number; // stored in cents to avoid floating point issues
  category: Category;
  note: string;
  date: string; // ISO string, e.g. new Date().toISOString()
}

export const CATEGORY_LABELS: Record<Category, string> = {
  food: 'Eten & drinken',
  transport: 'Vervoer',
  housing: 'Wonen',
  leisure: 'Vrije tijd',
  shopping: 'Shopping',
  other: 'Overig',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  food: '#F97316',
  transport: '#3B82F6',
  housing: '#8B5CF6',
  leisure: '#10B981',
  shopping: '#EC4899',
  other: '#6B7280',
};

export type GroupMode = 'date' | 'month' | 'category';

// "2026-09" — sortable as a plain string, unlike a locale-formatted label.
export function getMonthKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  const d = new Date(year, month - 1, 1);
  const label = d.toLocaleDateString('nl-BE', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
