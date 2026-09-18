import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useExpenses } from './hooks/useExpenses';
import { ExpenseItem } from './components/ExpenseItem';
import { AddExpenseModal } from './components/AddExpenseModal';

function formatTotal(cents: number): string {
  return (cents / 100).toLocaleString('nl-BE', {
    style: 'currency',
    currency: 'EUR',
  });
}

export default function App() {
  const { expenses, isLoading, addExpense, removeExpense, total } = useExpenses();
  const [modalVisible, setModalVisible] = useState(false);

  return (
 <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.headerLabel}>Totaal deze maand</Text>
        <Text style={styles.headerTotal}>{formatTotal(total)}</Text>
      </View>

      {!isLoading && expenses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nog geen uitgaven.</Text>
          <Text style={styles.emptySubtext}>
            Tik op + om je eerste uitgave toe te voegen.
          </Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExpenseItem expense={item} onDelete={removeExpense} />
          )}
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
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
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
