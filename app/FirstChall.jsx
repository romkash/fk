import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Примитивное определение пар (в реальности можно усложнить)
const pairs = [
  { id: 'a1', pairId: 'a2', x: 80, y: 150, color: '#6C63FF' },
  { id: 'a2', pairId: 'a1', x: width - 80, y: 150, color: '#6C63FF' },
  { id: 'b1', pairId: 'b2', x: 100, y: 300, color: '#FF6B6B' },
  { id: 'b2', pairId: 'b1', x: width - 100, y: 300, color: '#FF6B6B' },
  { id: 'c1', pairId: 'c2', x: 80, y: 450, color: '#00C896' },
  { id: 'c2', pairId: 'c1', x: width - 80, y: 450, color: '#00C896' },
];

export default function FirstChallenge({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [connected, setConnected] = useState<string[]>([]);

  const handlePress = (id: string, pairId: string) => {
    if (connected.includes(id) || connected.includes(pairId)) return;

    if (!selected) {
      setSelected(id);
    } else if (selected === pairId) {
      setConnected((prev) => [...prev, id, pairId]);
      setSelected(null);
    } else {
      setSelected(null); // неправильная пара
    }
  };

  const allConnected = connected.length === pairs.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Испытание 1: Соедини пары</Text>
      {pairs.map((point) => (
        <TouchableOpacity
          key={point.id}
          style={[
            styles.dot,
            {
              backgroundColor: connected.includes(point.id)
                ? 'gray'
                : point.color,
              left: point.x,
              top: point.y,
              borderWidth: selected === point.id ? 4 : 0,
            },
          ]}
          onPress={() => handlePress(point.id, point.pairId)}
        />
      ))}

      {allConnected && (
        <View style={styles.overlay}>
          <Text style={styles.success}>Это было просто 😉</Text>
          <TouchableOpacity style={styles.button} onPress={onComplete}>
            <Text style={styles.buttonText}>Ко 2 испытанию</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  dot: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  overlay: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
  },
  success: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
