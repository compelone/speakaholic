import * as React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TextToSpeechScreen from '../screens/TextToSpeechScreen';
import ImageToSpeechScreen from '../screens/ImageToSpeechScreen';
import SpeechToTextScreen from '../screens/SpeechToTextScreen';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="TextToSpeech"
      screenOptions={{headerShown: false}}>
      <BottomTab.Screen
        name="Text To Speech"
        component={TextToSpeechNavigator}
      />
      <BottomTab.Screen
        name="Image To Speech"
        component={ImageToSpeechNavigator}
      />
      {/* <BottomTab.Screen
        name="Speech To Text"
        component={SpeechToTextNavigator}
      /> */}
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

const ImageToSpeechStack = createNativeStackNavigator();

function ImageToSpeechNavigator() {
  return (
    <ImageToSpeechStack.Navigator>
      <ImageToSpeechStack.Screen
        name="ImageToSpeechScreen"
        component={ImageToSpeechScreen}
        options={{
          header: () => <></>,
        }}
      />
    </ImageToSpeechStack.Navigator>
  );
}

const SpeechToTextStack = createNativeStackNavigator();

function SpeechToTextNavigator() {
  return (
    <SpeechToTextStack.Navigator>
      <SpeechToTextStack.Screen
        name="SpeechToTextScreen"
        component={SpeechToTextScreen}
        options={{
          header: () => <></>,
        }}
      />
    </SpeechToTextStack.Navigator>
  );
}
