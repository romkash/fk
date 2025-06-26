import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');
const BOX_SIZE = 80;

const prizes = ['💍', '🌸', '🚗', '🎉', '🎁', '💎', '🍒', '🌈'];

export default function RouletteScreen({ onFinish }: { onFinish: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spinning, setSpinning] = useState(false);
 const [finalPrizeIndex, setFinalPrizeIndex] = useState(null);
 const spinInterval = useRef(null);


  const startSpinning = () => {
    if (spinning) return;
    setFinalPrizeIndex(null);
    setSpinning(true);

    let count = 0;
    const targetIndex = Math.floor(Math.random() * prizes.length);
    setFinalPrizeIndex(targetIndex); // сохраняем приз, чтобы потом сравнивать
    const totalSpins = 30 + targetIndex;

   spinInterval.current = setInterval(() => {
     setCurrentIndex((prev) => (prev + 1) % prizes.length);
     count++;
     if (count >= totalSpins) {
       clearInterval(spinInterval.current); // без !
       setSpinning(false);
       setCurrentIndex(targetIndex); // точно установить финальный индекс
     }
   }, 80);
}

  const handleTakePrize = () => {
    onFinish(); // переход к FirstChallenge
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Рулетка с призами 🎁</Text>

      <View style={styles.grid}>
        {prizes.map((item, index) => {
          const isActive = index === currentIndex;
          const isFinal = finalPrizeIndex !== null && index === finalPrizeIndex;

          return (
            <View
              key={index}
              style={[
                styles.box,
                isActive && styles.activeBox,
                isFinal && !spinning && styles.finalGlow
              ]}
            >
              <Text style={styles.emoji}>{item}</Text>
            </View>
          );
        })}
      </View>

      {finalPrizeIndex !== null && !spinning && (
        <Text style={styles.result}>🎊 Ты выиграл: {prizes[finalPrizeIndex]}</Text>
      )}

      <View style={styles.buttons}>
        {!spinning && finalPrizeIndex === null && (
          <TouchableOpacity style={styles.button} onPress={startSpinning}>
            <Text style={styles.buttonText}>Крутить 🎲</Text>
          </TouchableOpacity>
        )}

        {!spinning && finalPrizeIndex !== null && (
          <>
            <TouchableOpacity style={styles.button} onPress={startSpinning}>
              <Text style={styles.buttonText}>Крутить ещё раз 🔄</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.claimButton]}
              onPress={handleTakePrize}
            >
              <Text style={styles.buttonText}>Забрать приз ✅</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: BOX_SIZE * 4,
    marginBottom: 30
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderWidth: 2,
    borderColor: '#444',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#111'
  },
  activeBox: {
    borderColor: 'lime',
    backgroundColor: '#222'
  },
  finalGlow: {
    borderColor: 'gold',
    backgroundColor: '#333',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8
  },
  emoji: {
    fontSize: 32
  },
  result: {
    color: 'gold',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  buttons: {
    flexDirection: 'row',
    gap: 15,
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#4444ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 10
  },
  claimButton: {
    backgroundColor: '#33cc33'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  }
});
