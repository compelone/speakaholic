import * as React from 'react';
import {Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TextToSpeechScreen from '../screens/TextToSpeechScreen';
import ImageToSpeechScreen from '../screens/ImageToSpeechScreen';
import SpeechToTextScreen from '../screens/SpeechToTextScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../styles/colors';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="TextToSpeech"
      screenOptions={({route, navigation}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let page;
          if (route.name === 'Text To Speech') {
            iconName = 'file-text-o';
            page = 'TextToSpeechScreen';
          } else if (route.name === 'Image To Speech') {
            iconName = 'file-image-o';
            page = 'ImageToSpeechScreen';
          }

          print(page);
          return (
            <Icon.Button
              onPress={() => navigation.navigate(page)}
              name={iconName}
              padding={5}
              backgroundColor={'white'}
              color={focused ? colors.COLORS.SALMON : colors.COLORS.DARKGRAY}
            />
          );
        },
        headerShown: false,
        tabBarActiveTintColor: colors.COLORS.SALMON,
        tabBarInactiveTintColor: colors.COLORS.DARKGRAY,
      })}>
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
