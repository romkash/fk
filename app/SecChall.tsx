import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const words = ['КОД', ];

export default function SecondChallenge({ onComplete }: { onComplete: () => void }) {
     const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState<string[][]>([]);

  const currentWord = words[currentIndex];

  const handleCheck = () => {
    if (input.length !== currentWord.length) return;

    const feedback = input.toUpperCase().split('').map((letter, i) => {
      if (currentWord[i] === letter) return 'green';
      else if (currentWord.includes(letter)) return 'orange';
      else return 'red';
    });

     setAttempts(prev => [...prev, feedback]);
        if (input.toUpperCase() === currentWord) {
          if (currentIndex === words.length - 1) {

            navigation.navigate('ThirdChallenge'); // Добавьте эту строку
          } else {
            setCurrentIndex(currentIndex + 1);
            setAttempts([]);
            setInput('');
          }
        } else {
          setInput('');
        }
      };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <Text style={styles.title}>Испытание 2: Разгадай слово №{currentIndex + 1}</Text>
      <View style={styles.grid}>
        {attempts.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {input.padEnd(currentWord.length).split('').map((_, i) => (
              <View
                key={i}
                style={[styles.cell, { backgroundColor: row[i] || 'lightgray' }]}
              />
            ))}
          </View>
        ))}
      </View>

      <TextInput
        value={input}
        onChangeText={setInput}
        maxLength={currentWord.length}
        placeholder="Введи слово"
        style={styles.input}
        autoCapitalize="characters"
      />

      <TouchableOpacity onPress={handleCheck} style={styles.button}>
        <Text style={styles.buttonText}>Проверить</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    padding: 20,
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center'
  },
  grid: {
    alignItems: 'center',
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5
  },
  cell: {
    width: 30,
    height: 30,
    marginHorizontal: 3,
    borderRadius: 4
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    fontSize: 18,
    backgroundColor: '#fff',
    marginBottom: 10,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
  }
});
