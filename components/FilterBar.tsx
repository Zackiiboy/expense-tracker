import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Category, CATEGORY_LABELS, CATEGORY_COLORS, GroupMode } from '../types';

interface Props {
  selectedCategory: Category | 'all';
  onSelectCategory: (category: Category | 'all') => void;
  groupMode: GroupMode;
  onChangeGroupMode: (mode: GroupMode) => void;
}

const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

const GROUP_MODES: { key: GroupMode; label: string }[] = [
  { key: 'date', label: 'Per dag' },
  { key: 'month', label: 'Per maand' },
  { key: 'category', label: 'Per categorie' },
];

export function FilterBar({
  selectedCategory,
  onSelectCategory,
  groupMode,
  onChangeGroupMode,
}: Props) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        <TouchableOpacity
          onPress={() => onSelectCategory('all')}
          style={[styles.chip, selectedCategory === 'all' && styles.chipActive]}
        >
          <Text
            style={[
              styles.chipText,
              selectedCategory === 'all' && styles.chipTextActive,
            ]}
          >
            Alle
          </Text>
        </TouchableOpacity>

        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onSelectCategory(cat)}
              style={[
                styles.chip,
                isActive && { backgroundColor: CATEGORY_COLORS[cat] },
              ]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {CATEGORY_LABELS[cat]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.groupRow}>
        {GROUP_MODES.map(({ key, label }) => {
          const isActive = groupMode === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onChangeGroupMode(key)}
              style={[styles.groupButton, isActive && styles.groupButtonActive]}
            >
              <Text
                style={[
                  styles.groupButtonText,
                  isActive && styles.groupButtonTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
  },
  chipRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  chipActive: {
    backgroundColor: '#111827',
  },
  chipText: {
    fontSize: 13,
    color: '#374151',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  groupRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 10,
    gap: 6,
  },
  groupButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  groupButtonActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  groupButtonText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  groupButtonTextActive: {
    color: '#FFFFFF',
  },
});
