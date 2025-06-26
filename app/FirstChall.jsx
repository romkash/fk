import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Пример точек (4 пары = 8 точек)
const points = [
  { id: 'A1', pairId: 'A2', x: 60, y: 120 },
  { id: 'A2', pairId: 'A1', x: width - 80, y: 160 },
  { id: 'B1', pairId: 'B2', x: 50, y: height / 2 },
  { id: 'B2', pairId: 'B1', x: width - 70, y: height / 2 + 50 },
  { id: 'C1', pairId: 'C2', x: 100, y: height - 200 },
  { id: 'C2', pairId: 'C1', x: width - 120, y: height - 180 },
  { id: 'D1', pairId: 'D2', x: width / 3, y: height / 3 },
  { id: 'D2', pairId: 'D1', x: width / 1.5, y: height / 3.5 },
];

export default function FirstChallenge({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [connected, setConnected] = useState([]);

  const handlePress = (id, pairId) => {
    if (connected.includes(id) || connected.includes(pairId)) return;

    if (!selected) {
      setSelected(id);
    } else if (selected === pairId) {
      setConnected((prev) => [...prev, id, pairId]);
      setSelected(null);

      if (connected.length + 2 === points.length) {
        setTimeout(() => {
          alert('Это было просто!');
          onComplete();
        }, 800);
      }
    } else {
      setSelected(null);
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Испытание 1: Соедини пары точек</Text>

      {points.map((point) => {
        const isConnected = connected.includes(point.id);
        const isSelected = selected === point.id;
        return (
          <TouchableOpacity
            key={point.id}
            onPress={() => handlePress(point.id, point.pairId)}
            style={[
              styles.dot,
              {
                top: point.y,
                left: point.x,
                backgroundColor: isConnected ? 'green' : isSelected ? 'orange' : 'gray',
              },
            ]}
          />
        );
      })}
    </View>
  );
}



const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#FFF8F0',
    },
    title: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '600',
      marginTop: 40,
      marginBottom: 10,
      color: '#333',
    },
    dot: {
      position: 'absolute',
      width: 30,
      height: 30,
      borderRadius: 15,
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
