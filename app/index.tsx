import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView
} from 'react-native';
import {
  GestureHandlerRootView,
  PinchGestureHandler,
  State
} from 'react-native-gesture-handler';
import { Easing } from 'react-native-reanimated';
import RouletteScreen from './Rouletka';
import FirstChallenge from './FirstChall';
import ThirdChallenge from './ThirdChallenge';




const { width, height } = Dimensions.get('window');

const images = [
  require('../assets/images/hi1.jpg'),
  require('../assets/images/hi2.jpg'),
  require('../assets/images/hi3.jpg'),
  require('../assets/images/hi4.jpg'),
  require('../assets/images/hi5.jpg'),
  require('../assets/images/hi6.jpg'),
  require('../assets/images/hi7.jpg'),
  require('../assets/images/hi8.jpg'),
  require('../assets/images/hi9.jpg'),
  require('../assets/images/hi10.jpg'),
  require('../assets/images/hi11.jpg'),
  require('../assets/images/hi12.jpg'),
  require('../assets/images/hi13.jpg'),
  require('../assets/images/hi14.jpg'),
  require('../assets/images/hi15.jpg'),
  require('../assets/images/hi16.jpg'),
  require('../assets/images/hi18.jpg'),
  require('../assets/images/hi19.jpg'),
  require('../assets/images/hi20.jpg'),
  require('../assets/images/hi21.jpg'),
  require('../assets/images/hi22.jpg'),
  require('../assets/images/hi23.jpg'),
  require('../assets/images/hi24.jpg'),
  require('../assets/images/hi25.jpg'),
  require('../assets/images/hi26.jpg'),
  require('../assets/images/hi27.jpg'),
  require('../assets/images/hi28.jpg'),
  require('../assets/images/hi29.jpg'),
  require('../assets/images/hi30.jpg')
];

export default function App() {
  const [screen, setScreen] = useState<'start' | 'timer' | 'gallery' | 'final' | 'firstChallenge' | 'secondChallenge' | 'thirdChallenge'>('start');

  const [readyPresses, setReadyPresses] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsTogether, setSecondsTogether] = useState(0);
  const scale = useRef(new Animated.Value(1)).current;
  const timerScale = useRef(new Animated.Value(1)).current;
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [babiesBorn, setBabiesBorn] = useState(0);
const rocketY = useRef(new Animated.Value(0)).current;
const [showRocket, setShowRocket] = useState(false);
const [showBlackScreen, setShowBlackScreen] = useState(false);




const startRocketAnimation = () => {
  setShowRocket(true);

  Animated.timing(rocketY, {
    toValue: -height,
    duration: 3000,
    easing: Easing.out(Easing.quad),
    useNativeDriver: true
  }).start(() => {
    setShowRocket(false);
    setShowBlackScreen(true);

    setTimeout(() => {
      setShowBlackScreen(false);
      setScreen('gallery');
      rocketY.setValue(0);  // Сброс позиции ракеты для следующего запуска, если надо
    }, 1500); // Черный экран 1.5 секунды
  });

};




useEffect(() => {
  if (screen === 'timer') {
    const interval = setInterval(() => {
      const startDate = new Date(2024, 3, 12); // 12 апреля 2024
      const now = new Date();
      const diff = Math.floor((now - startDate) / 1000);

      const days = Math.floor(diff / (60 * 60 * 24));
      const hours = Math.floor((diff % (60 * 60 * 24)) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setTime({ days, hours, minutes, seconds });

      const estimatedBabies = Math.floor(diff * 4.3); // ~4.3 ребенка в секунду
      setBabiesBorn(estimatedBabies);

      Animated.sequence([
        Animated.timing(timerScale, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(timerScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();

    }, 1000);

    return () => clearInterval(interval);
  }
}, [screen]);



  const handleReadyPress = () => {
    const newCount = readyPresses + 1;
    setReadyPresses(newCount);
    if (newCount >= 15) {
      setScreen('timer');
    }
  };

  const handleShowGallery = () => {
    setScreen('gallery');
  };

  const goNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      resetScale();
    } else {
      setScreen('final');
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      resetScale();
    }
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

const handleClaimPrize = () => {
  setScreen('firstChallenge');
};


  const onPinchStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: nativeEvent.scale > 1.5 ? 2 : 1,
        useNativeDriver: true
      }).start();
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        {screen === 'start' && (
          <View style={styles.centered}>
            <TouchableOpacity onPress={handleReadyPress}>
              <Text style={styles.readyText}>Ready?</Text>
            </TouchableOpacity>
            {readyPresses >= 2 && readyPresses < 15 && (
              <Text style={styles.hintText}>
                А что, не переходит на следующую страницу?
                {'\n'}Нажми ещё {15 - readyPresses} раз и так уж и быть...
              </Text>
            )}
          </View>
        )}

{showRocket && (
  <Animated.View
    style={{
      position: 'absolute',
      bottom: 80,
      left: width / 2 - 25,
      transform: [{ translateY: rocketY }],
      zIndex: 10
    }}
  >
    <Text style={{ fontSize: 48, textAlign: 'center' }}>🚀</Text>
  </Animated.View>
)}


      {screen === 'timer' && (
        <View style={styles.centered}>
          <Text style={styles.readyText}>Мы вместе уже</Text>

          <Animated.View style={[styles.timerRow, { transform: [{ scale: timerScale }] }]}>
            <View style={styles.timerItem}>
              <Text style={styles.timerValue}>{time.days}</Text>
              <Text style={styles.timerLabel}>дней</Text>
            </View>
            <View style={styles.timerItem}>
              <Text style={styles.timerValue}>{time.hours}</Text>
              <Text style={styles.timerLabel}>часов</Text>
            </View>
            <View style={styles.timerItem}>
              <Text style={styles.timerValue}>{time.minutes}</Text>
              <Text style={styles.timerLabel}>минут</Text>
            </View>
            <View style={styles.timerItem}>
              <Text style={styles.timerValue}>{time.seconds}</Text>
              <Text style={styles.timerLabel}>секунд</Text>
            </View>
          </Animated.View>

          <Text style={styles.factText}>За это время в мире родилось примерно {babiesBorn.toLocaleString()} детей 👶</Text>

         <TouchableOpacity onPress={startRocketAnimation}>
           <Text style={styles.readyText}>Погрузиться в историю</Text>
         </TouchableOpacity>

        </View>
      )}

{showBlackScreen && (
  <View style={{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    zIndex: 20,
  }} />
)}


{screen === 'firstChallenge' && (
  <FirstChallenge onComplete={() => setScreen('secondChallenge')} />
)}
{screen === 'secondChallenge' && (
  <SecondChallenge onComplete={() => setScreen('final')} />
)}
{screen === 'thirdChallenge' && (
  <ThirdChallenge onReturn={() => setScreen('start')} />
)}

        {screen === 'gallery' && (
          <View style={styles.container}>
            <TouchableOpacity
              style={[styles.navButton, styles.prevButton]}
              onPress={goPrev}
              disabled={currentIndex === 0}
            >
              <Text style={styles.navButtonText}>〈</Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
              <PinchGestureHandler
                onGestureEvent={onPinchEvent}
                onHandlerStateChange={onPinchStateChange}
              >
                <Animated.Image
                  source={images[currentIndex]}
                  style={[styles.image, { transform: [{ scale }] }]}
                  resizeMode="contain"
                />
              </PinchGestureHandler>
              <Text style={styles.counter}>
                {currentIndex + 1} / {images.length}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={goNext}
              disabled={currentIndex === images.length - 1}
            >
              <Text style={styles.navButtonText}>〉</Text>
            </TouchableOpacity>
          </View>
        )}

        {screen === 'final' && (
          <RouletteScreen onFinish={() => setScreen('final')} />
        )}

      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000'
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    paddingHorizontal: 24
  },
  readyText: {
    fontSize: 26,
    color: '#333',
    fontWeight: '600',
    marginBottom: 10
  },
  hintText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20
  },
  timer: {
    fontSize: 40,
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginBottom: 30
  },
  finalText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '80%'
  },
  image: {
    width: width * 0.9,
    height: height * 0.7,
    borderRadius: 8
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10
  },
  prevButton: {
    marginRight: 10
  },
  nextButton: {
    marginLeft: 10
  },
  navButtonText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 30
  },
  counter: {
    color: '#fff',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center'
  },
  timerBox: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: '#FFE8E8',
    borderRadius: 16,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center'
  },
  timerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30
  },
  timerItem: {
    alignItems: 'center',
    marginHorizontal: 10
  },
  timerValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B'
  },
  timerLabel: {
    fontSize: 16,
    color: '#333'
  },
  factText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20
  }
});