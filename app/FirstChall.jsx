import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, StyleSheet, PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const BASKET_WIDTH = 80;
const BASKET_HEIGHT = 60;
const STAR_SIZE = 30;
const ASTEROID_SIZE = 40;
const TARGET_SCORE = 10;
const GAME_DURATION = 30000; // 60 секунд

export default function StarCatcher({ onComplete }) {
     const navigation = useNavigation();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [basketPosition, setBasketPosition] = useState(width / 2 - BASKET_WIDTH / 2);
  const [stars, setStars] = useState([]);
  const [asteroids, setAsteroids] = useState([]);
  const [levelCompleted, setLevelCompleted] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newPosition = gestureState.moveX - BASKET_WIDTH / 2;
        setBasketPosition(Math.max(0, Math.min(width - BASKET_WIDTH, newPosition)));
      },
    })
  ).current;

  // Таймер игры
  useEffect(() => {
    if (!gameStarted || gameOver || levelCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          handleGameOver();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, levelCompleted]);

  // Генерация звёзд и астероидов
  useEffect(() => {
    if (!gameStarted || gameOver || levelCompleted) return;

    const starInterval = setInterval(() => {
      setStars(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: Math.random() * (width - STAR_SIZE),
          y: -STAR_SIZE,
          speed: 1 + Math.random() * 3,
          type: Math.floor(Math.random() * 3),
        },
      ]);
    }, 800); // Звёзды появляются каждые 800ms

    const asteroidInterval = setInterval(() => {
      setAsteroids(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: Math.random() * (width - ASTEROID_SIZE),
          y: -ASTEROID_SIZE,
          speed: 1 + Math.random() * 2,
          rotation: Math.random() * 360,
        },
      ]);
    }, 1500); // Астероиды появляются каждые 1500ms

    return () => {
      clearInterval(starInterval);
      clearInterval(asteroidInterval);
    };
  }, [gameStarted, gameOver, levelCompleted]);

  // Движение объектов
  useEffect(() => {
    if (!gameStarted || gameOver || levelCompleted) return;

    const animationFrame = requestAnimationFrame(() => {
      setStars(prev =>
        prev
          .map(star => ({
            ...star,
            y: star.y + star.speed,
            rotation: star.rotation ? star.rotation + 0.5 : 0,
          }))
          .filter(star => star.y < height)
      );

      setAsteroids(prev =>
        prev
          .map(asteroid => ({
            ...asteroid,
            y: asteroid.y + asteroid.speed,
            rotation: asteroid.rotation + 1,
          }))
          .filter(asteroid => asteroid.y < height)
      );
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [stars, asteroids, gameStarted, gameOver, levelCompleted]);

  // Проверка столкновений
  useEffect(() => {
    if (!gameStarted || gameOver || levelCompleted) return;

    stars.forEach(star => {
      if (
        star.y + STAR_SIZE > height - BASKET_HEIGHT &&
        star.x + STAR_SIZE > basketPosition &&
        star.x < basketPosition + BASKET_WIDTH
      ) {
        // Поймали звезду
        setScore(prev => {
          const newScore = prev + 1;
          if (newScore >= TARGET_SCORE) {
             setTimeout(() => {
                         navigation.navigate('SecChall');
                       }, 1500); // Небольшая задержка перед переходом
                     }
                     return newScore;
                   });
        setStars(prev => prev.filter(s => s.id !== star.id));
      }
    });

    asteroids.forEach(asteroid => {
      if (
        asteroid.y + ASTEROID_SIZE > height - BASKET_HEIGHT &&
        asteroid.x + ASTEROID_SIZE > basketPosition &&
        asteroid.x < basketPosition + BASKET_WIDTH
      ) {
        // Попали астероидом
        handleGameOver();
      }
    });
  }, [stars, asteroids, basketPosition, gameStarted, gameOver, levelCompleted]);

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setLevelCompleted(false);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setStars([]);
    setAsteroids([]);
    setBasketPosition(width / 2 - BASKET_WIDTH / 2);
  };

  const handleGameOver = () => {
    setGameOver(true);
    setGameStarted(false);
  };

  const formatTime = (ms) => {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}`;
  };

  // Стили
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0a0a2a',
    },
    startContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    gameContainer: {
      flex: 1,
    },
    title: {
      color: '#fff',
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 20,
      textShadowColor: 'rgba(0, 200, 255, 0.7)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    },
    subtitle: {
      color: '#ccc',
      fontSize: 18,
      marginBottom: 30,
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#4a6fa5',
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 25,
      marginTop: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
    },
    scoreContainer: {
      position: 'absolute',
      top: 40,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    scoreText: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    timeText: {
      color: timeLeft < 10000 ? '#ff5555' : '#fff',
      fontSize: 24,
      fontWeight: 'bold',
    },
    basket: {
      position: 'absolute',
      bottom: 20,
      width: BASKET_WIDTH,
      height: BASKET_HEIGHT,
      backgroundColor: 'rgba(100, 200, 255, 0.7)',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    star: {
      position: 'absolute',
      width: STAR_SIZE,
      height: STAR_SIZE,
      justifyContent: 'center',
      alignItems: 'center',
    },
    asteroid: {
      position: 'absolute',
      width: ASTEROID_SIZE,
      height: ASTEROID_SIZE,
      borderRadius: ASTEROID_SIZE / 2,
      backgroundColor: '#777',
    },
    gameOverText: {
      color: '#fff',
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    levelCompleteText: {
      color: '#4aff72',
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
    },
  });

  const renderStar = (star) => {
    const starTypes = ['⭐', '🌟', '💫'];
    const starColors = ['#ffff00', '#ffcc00', '#ffaa00'];
    return (
      <Animated.View
        key={star.id}
        style={[
          styles.star,
          {
            left: star.x,
            top: star.y,
            transform: [{ rotate: `${star.rotation || 0}deg` }],
          },
        ]}
      >
        <Text style={{ fontSize: STAR_SIZE, color: starColors[star.type] }}>
          {starTypes[star.type]}
        </Text>
      </Animated.View>
    );
  };

  const renderAsteroid = (asteroid) => (
    <Animated.View
      key={asteroid.id}
      style={[
        styles.asteroid,
        {
          left: asteroid.x,
          top: asteroid.y,
          transform: [{ rotate: `${asteroid.rotation}deg` }],
        },
      ]}
    />
  );

  return (
    <View style={styles.container}>
      {!gameStarted ? (
        <View style={styles.startContainer}>
          <Text style={styles.title}>Ловец Звёзд</Text>
          <Text style={styles.subtitle}>
            {gameOver
              ? `Время вышло! Вы собрали ${score} из ${TARGET_SCORE} звёзд`
              : `Соберите ${TARGET_SCORE} звёзд за ${GAME_DURATION / 1000} секунд!`
            }
          </Text>
          <Text style={styles.subtitle}>Избегайте астероидов!</Text>
          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>
              {gameOver ? 'Играть снова' : 'Начать игру'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameContainer} {...panResponder.panHandlers}>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Звёзды: {score}/{TARGET_SCORE}</Text>
            <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
          </View>

          {stars.map(renderStar)}
          {asteroids.map(renderAsteroid)}

          <Animated.View
            style={[
              styles.basket,
              {
                left: basketPosition,
              },
            ]}
          />

          {levelCompleted && (
            <View style={[styles.startContainer, { position: 'absolute', width, height }]}>
              <Text style={styles.levelCompleteText}>Уровень пройден! 🎉</Text>
              <TouchableOpacity style={styles.button} onPress={handleStartGame}>
                <Text style={styles.buttonText}>Играть снова</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}