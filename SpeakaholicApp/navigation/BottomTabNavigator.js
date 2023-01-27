import * as React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TextToSpeechScreen from '../screens/TextToSpeechScreen';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="TextToSpeech"
      screenOptions={{headerShown: false}}>
      <BottomTab.Screen name="TextToSpeech" component={TextToSpeechNavigator} />
    </BottomTab.Navigator>
  );
}
const TextToSpeechStack = createNativeStackNavigator();

function TextToSpeechNavigator() {
  return (
    <TextToSpeechStack.Navigator>
      <TextToSpeechStack.Screen
        name="TextToSpeechScreen"
        component={TextToSpeechScreen}
        options={{
          header: () => <></>,
        }}
      />
    </TextToSpeechStack.Navigator>
  );
}
