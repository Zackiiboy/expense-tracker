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
