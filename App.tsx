import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useExpenses } from './hooks/useExpenses';
import { ExpenseItem } from './components/ExpenseItem';
import { AddExpenseModal } from './components/AddExpenseModal';
import { FilterBar } from './components/FilterBar';
import {
  Category,
  Expense,
  GroupMode,
  CATEGORY_LABELS,
  getMonthKey,
  formatMonthLabel,
} from './types';

function formatTotal(cents: number): string {
  return (cents / 100).toLocaleString('nl-BE', {
    style: 'currency',
    currency: 'EUR',
  });
}

interface Section {
  title: string;
  total: number;
  data: Expense[];
}

// Group a flat, already-filtered list of expenses into sections for
// SectionList, based on the chosen group mode. "date" mode returns a
// single section so the list still renders as one continuous feed.
function groupExpenses(expenses: Expense[], mode: GroupMode): Section[] {
  if (mode === 'date') {
    return [{ title: '', total: expenses.reduce((s, e) => s + e.amount, 0), data: expenses }];
  }

  const buckets = new Map<string, Expense[]>();

  for (const expense of expenses) {
    const key = mode === 'month' ? getMonthKey(expense.date) : expense.category;
    const bucket = buckets.get(key) ?? [];
    bucket.push(expense);
    buckets.set(key, bucket);
  }

  const keys = Array.from(buckets.keys()).sort((a, b) => (a < b ? 1 : -1));

  return keys.map((key) => {
    const data = buckets.get(key)!;
    const title = mode === 'month' ? formatMonthLabel(key) : CATEGORY_LABELS[key as Category];
    return { title, total: data.reduce((s, e) => s + e.amount, 0), data };
  });
}

export default function App() {
  const { expenses, isLoading, addExpense, removeExpense, total } = useExpenses();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [groupMode, setGroupMode] = useState<GroupMode>('date');

  const filteredExpenses = useMemo(() => {
    if (selectedCategory === 'all') return expenses;
    return expenses.filter((e) => e.category === selectedCategory);
  }, [expenses, selectedCategory]);

  const sections = useMemo(
    () => groupExpenses(filteredExpenses, groupMode),
    [filteredExpenses, groupMode]
  );

  const filteredTotal = useMemo(
    () => filteredExpenses.reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses]
  );

  const isFiltered = selectedCategory !== 'all';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <Text style={styles.headerLabel}>
            {isFiltered ? `Totaal ${CATEGORY_LABELS[selectedCategory as Category]}` : 'Totaal'}
          </Text>
          <Text style={styles.headerTotal}>
            {formatTotal(isFiltered ? filteredTotal : total)}
          </Text>
        </View>

        <FilterBar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          groupMode={groupMode}
          onChangeGroupMode={setGroupMode}
        />

        {!isLoading && filteredExpenses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {expenses.length === 0 ? 'Nog geen uitgaven.' : 'Geen uitgaven in dit filter.'}
            </Text>
            <Text style={styles.emptySubtext}>
              {expenses.length === 0
                ? 'Tik op + om je eerste uitgave toe te voegen.'
                : 'Kies "Alle" om alles weer te zien.'}
            </Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExpenseItem expense={item} onDelete={removeExpense} />
            )}
            renderSectionHeader={({ section }) =>
              section.title ? (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionTotal}>{formatTotal(section.total)}</Text>
                </View>
              ) : null
            }
            stickySectionHeadersEnabled
            contentContainerStyle={styles.list}
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        <AddExpenseModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={addExpense}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  headerTotal: {
    fontSize: 34,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  list: {
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  sectionTotal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '400',
  },
});
