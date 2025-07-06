import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const BOX_SIZE = 80;
const prizes = ['💍', '🌸', '🚗', '📖', '💄', '👜', '🧸', '🌷', '🧁'];

export default function RouletteScreen() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [finalPrizeIndex, setFinalPrizeIndex] = useState(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const spinInterval = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const startSpinning = () => {
    if (spinning) return;
    setFinalPrizeIndex(null);
    setSpinning(true);
    let count = 0;
    const targetIndex = Math.floor(Math.random() * prizes.length);
    setFinalPrizeIndex(targetIndex);
    const totalSpins = 30 + targetIndex;

    spinInterval.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % prizes.length);
      count++;
      if (count >= totalSpins) {
        if (spinInterval.current) {
          clearInterval(spinInterval.current);
        }
        setSpinning(false);
        setCurrentIndex(targetIndex);
      }
    }, 80);
  };

  const handleTakePrize = () => {
    setShowChallengeModal(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const startChallenge = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowChallengeModal(false);
      navigation.navigate('FirstChall');
    });
  };

  const resetScale = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true
    }).start();
  };

  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale } }],
    { useNativeDriver: true }
  );

  const onPinchStateChange = ({ nativeEvent }: { nativeEvent: { state: number; scale: number } }) => {
    if (nativeEvent.state === State.END) {
      Animated.spring(scale, {
        toValue: nativeEvent.scale > 1.5 ? 2 : 1,
        useNativeDriver: true
      }).start();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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

      <Modal
        transparent={true}
        visible={showChallengeModal}
        animationType="fade"
      >
        <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Чтобы получить приз:</Text>
            <Text style={styles.modalText}>
              Тебе нужно пройти 3 увлекательных челленджа!
            </Text>
            <Text style={styles.modalSubtext}>
              Первый челлендж уже ждёт тебя 👇
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={startChallenge}
            >
              <Text style={styles.modalButtonText}>Начать челлендж!</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: width - 40,
    marginBottom: 30,
  },
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE8E8',
    borderRadius: 10,
  },
  activeBox: {
    backgroundColor: '#FFC0CB',
    transform: [{ scale: 1.1 }],
  },
  finalGlow: {
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  emoji: {
    fontSize: 30,
  },
  result: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF6B6B',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    margin: 10,
    minWidth: 150,
  },
  claimButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },
  modalSubtext: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#777',
    fontStyle: 'italic',
  },
  modalButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 15,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});