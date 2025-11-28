import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  FlatList,
} from 'react-native';
import { Typography, BorderRadius, Spacing, Layout } from '../theme/designSystem';

const Dropdown = ({ options, value, onValueChange, placeholder, loading, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');

  React.useEffect(() => {
    if (value && options.length > 0) {
      const selected = options.find(opt => opt.value === value);
      setSelectedLabel(selected ? selected.label : '');
    } else {
      setSelectedLabel('');
    }
  }, [value, options]);

  const handleSelect = (option) => {
    onValueChange(option.value);
    setIsOpen(false);
  };

  // Web-compatible select for web platform
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <select
          value={value || ''}
          onChange={(e) => onValueChange(e.target.value)}
          disabled={loading}
          style={{
            width: '100%',
            padding: `${Math.round(14 * Layout.mobileScale)}px ${Math.round(16 * Layout.mobileScale)}px`,
            fontSize: `${Typography.fontSize.base}px`,
            borderRadius: `${BorderRadius.md}px`,
            border: '1px solid #e5e7eb',
            backgroundColor: '#fff',
            color: '#0f172a',
            cursor: loading ? 'not-allowed' : 'pointer',
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23374151\' d=\'M6 9L1 4h10z\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `right ${Math.round(16 * Layout.mobileScale)}px center`,
            paddingRight: `${Math.round(40 * Layout.mobileScale)}px`,
          }}
        >
          <option value="" disabled>{placeholder || 'Select an option'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </View>
    );
  }

  // Native dropdown using Modal
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[styles.dropdown, !value && styles.placeholder]}
        onPress={() => !loading && setIsOpen(true)}
        disabled={loading}
      >
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {loading ? 'Loading...' : (selectedLabel || placeholder || 'Select an option')}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    value === item.value && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === item.value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {value === item.value && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: Spacing.md,
    paddingVertical: Math.round(14 * Layout.mobileScale),
    minHeight: Math.round(56 * Layout.mobileScale),
  },
  placeholder: {
    borderColor: '#d1d5db',
  },
  dropdownText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: '#0f172a',
  },
  placeholderText: {
    color: '#9ca3af',
  },
  arrow: {
    fontSize: Typography.fontSize.xs,
    color: '#6b7280',
    marginLeft: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    width: '90%',
    maxWidth: 400,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Math.round(14 * Layout.mobileScale),
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  optionSelected: {
    backgroundColor: '#f0fdf4',
  },
  optionText: {
    fontSize: Typography.fontSize.base,
    color: '#374151',
  },
  optionTextSelected: {
    color: '#18743c',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: Typography.fontSize.lg,
    color: '#18743c',
    fontWeight: 'bold',
  },
});

export default Dropdown;

