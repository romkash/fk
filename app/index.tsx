import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { Text, View, StatusBar } from 'react-native';
import Header from '../../layout/Header';

export default function HomeScreen() {
  return (
   <View>
    <Text>Hellow</Text>
    <StatusBar barStyle={'light-content'} />
    <Header />
    </View>
  );
}
