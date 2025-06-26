import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';

const emojis = ['🍒', '🍋', '🍇', '🍉', '🍓', '🍌', '7️⃣'];

export default function ThirdChallenge({ onNavigateToPhotos = () => {} }) {
  const [slots, setSlots] = useState(['❓', '❓', '❓']);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showLoseScreen, setShowLoseScreen] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const spinSlots = async () => {
    setSpinning(true);
    setMessage('');
    let tempSlots = [...slots];

    for (let i = 0; i < 10; i++) {
      tempSlots = [
        emojis[Math.floor(Math.random() * emojis.length)],
        emojis[Math.floor(Math.random() * emojis.length)],
        emojis[Math.floor(Math.random() * emojis.length)],
      ];
      setSlots([...tempSlots]);
      await new Promise((r) => setTimeout(r, 100 + i * 20));
    }

    if (step === 0) {
      setSlots(['🍇', '🍓', '🍋']);
      setMessage('Не повезло 😢 Попробуй ещё раз!');
      setStep(1);
    } else if (step === 1) {
      setSlots(['7️⃣','🍇', '🍓']);
      setMessage('Может сейчас?..');
      setStep(2);
    } else if (step === 2) {
      setSlots(['7️⃣', '7️⃣', '❓']);
      setMessage('🎭 Почти получилось!');
      setShowConfirmation(true);
    }

    setSpinning(false);
  };

  const handleConfirm = () => {
    if (confirmed) {
      setShowConfirmation(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowLoseScreen(true);
      });
    }
  };

  const handleGoToPhotos = () => {
    onNavigateToPhotos();
  };

  if (showLoseScreen) {
    return (
      <Animated.View style={[styles.loseContainer, { opacity: fadeAnim }]}>
        <Text style={styles.loseTitle}>К сожалению, вы проиграли</Text>
        <Text style={styles.loseText}>Лудоманы всегда проигрывают в долгосрочной перспективе</Text>
        <Text style={styles.loseSubtext}>Азартные игры вызывают зависимость</Text>

        <TouchableOpacity
          style={styles.photosButton}
          onPress={handleGoToPhotos}
        >
          <Text style={styles.photosButtonText}>Перейти к фотографиям</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎰 Испытание 3: Выбей 3 семёрки!</Text>

      <View style={styles.slotRow}>
        {slots.map((item, index) => (
          <View key={index} style={[styles.slotBox, item === '7️⃣' ? styles.highlight : null]}>
            <Text style={styles.slotText}>{item}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.message}>{message}</Text>

      {step < 3 && (
        <TouchableOpacity style={styles.button} onPress={spinSlots} disabled={spinning}>
          <Text style={styles.buttonText}>
            {step === 0 ? 'Крутить 🎲' : step === 1 ? 'Ещё раз 🔄' : 'Финальный шанс 🎯'}
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Подтверждение</Text>
            <Text style={styles.modalText}>Вы подтверждаете, что вы лудоман?</Text>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setConfirmed(!confirmed)}
            >
              <View style={[styles.checkbox, confirmed && styles.checkedBox]}>
                {confirmed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Да, я лудоман</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, !confirmed && styles.disabledButton]}
              onPress={handleConfirm}
              disabled={!confirmed}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 20,
  },
  loseTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 20,
    textAlign: 'center',
  },
  loseText: {
    fontSize: 20,
    color: '#D32F2F',
    marginBottom: 10,
    textAlign: 'center',
  },
  loseSubtext: {
    fontSize: 16,
    color: '#D32F2F',
    marginBottom: 40,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  photosButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
  },
  photosButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  slotRow: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  slotBox: {
    backgroundColor: '#eee',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    minWidth: 60,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
  },
  highlight: {
    borderColor: '#4CAF50',
    backgroundColor: '#eaffea',
  },
  slotText: {
    fontSize: 40,
  },
  message: {
    fontSize: 16,
    marginVertical: 15,
    textAlign: 'center',
    color: '#555',
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#767577',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkedBox: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
  },
  modalButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});