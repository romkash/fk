import 'react-native-gesture-handler';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RouletteScreen from './Rouletka';
import FirstChallenge from './FirstChall';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Roulette">
          <Stack.Screen name="Roulette" component={RouletteScreen} />
          <Stack.Screen name="FirstChallenge" component={FirstChallenge} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}