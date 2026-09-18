import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Expense, CATEGORY_LABELS, CATEGORY_COLORS } from '../types';

interface Props {
  expense: Expense;
  onDelete: (id: string) => void;
}

function formatAmount(cents: number): string {
  return (cents / 100).toLocaleString('nl-BE', {
    style: 'currency',
    currency: 'EUR',
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('nl-BE', {
    day: 'numeric',
    month: 'short',
  });
}

export function ExpenseItem({ expense, onDelete }: Props) {
  return (
    <TouchableOpacity
      style={styles.row}
      onLongPress={() => onDelete(expense.id)}
      activeOpacity={0.7}
    >
      <View
        style={[styles.dot, { backgroundColor: CATEGORY_COLORS[expense.category] }]}
      />
      <View style={styles.middle}>
        <Text style={styles.note} numberOfLines={1}>
          {expense.note || CATEGORY_LABELS[expense.category]}
        </Text>
        <Text style={styles.meta}>
          {CATEGORY_LABELS[expense.category]} · {formatDate(expense.date)}
        </Text>
      </View>
      <Text style={styles.amount}>{formatAmount(expense.amount)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  middle: {
    flex: 1,
  },
  note: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  meta: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
