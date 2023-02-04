import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import colors from '../styles/colors';
import defaultStyles from '../styles/defaultStyles';
import layout from '../styles/layout';
import {Storage} from '@aws-amplify/storage';
import {saveSpeechItem} from '../services/dataService';
import {getCurrentUserInfo} from '../services/authService';
import Voices from '../components/Voices';

import {PushNotification} from '@aws-amplify/pushnotification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';

const TextToSpeechScreen = ({navigation}) => {
  const [text, setText] = useState();
  const [textError, setTextError] = useState();
  const [textLength, setTextLength] = useState(0);
  const [voice, setVoice] = useState('salli');

  const maxLength = 1000;
  if (!DeviceInfo.isEmulatorSync()) {
    useEffect(() => {
      (async () => {
        const notificationPermissions = await check(
          PERMISSIONS.IOS.NOTIFICATIONS,
        );

        if (notificationPermissions !== RESULTS.GRANTED) {
          const requestNotificationPermission = await request(
            PERMISSIONS.IOS.NOTIFICATIONS,
          );
          if (requestNotificationPermission !== RESULTS.GRANTED) {
            Alert.alert('Permission to send notification is not allowed');
            return;
          }

          PushNotification.onRegister(token => {
            console.log('in app registration', token);
          });

          PushNotificationIOS.addEventListener(
            'notification',
            onRemoteNotification,
          );
        }
      })();
    }, []);
  }

  const onRemoteNotification = notification => {
    const isClicked = notification.getData().userInteraction === 1;

    if (isClicked) {
      // Navigate user to another screen
      console.log('clicked');
    } else {
      // Do something else with push notification
      console.log('not clicked');
    }
  };

  const saveText = async () => {
    try {
      if (text.length > 0) {
        const fileName = new Date().toISOString();
        const key = await Storage.put(`${fileName}.txt`, text, {
          level: 'private',
          contentType: 'text/plain',
        });
        user = await getCurrentUserInfo();
        await saveSpeechItem(
          user.attributes.sub,
          key,
          textLength,
          voice,
          'English',
          'texttospeech',
        );
      }
      setText();
    } catch (error) {
      Alert.alert('Something went wrong', error.message);
    }
  };

  const setTextAndLength = value => {
    setText(value);
    setTextLength(value.length);
  };

  return (
    <View style={styles.mainContainer}>
      <Voices voice={voice} setVoice={setVoice} />

      <TextInput
        style={
          textError
            ? [
                styles.descriptionTextInput,
                defaultStyles.default.textInputError,
              ]
            : styles.descriptionTextInput
        }
        multiline={true}
        placeholder="Text*"
        value={text}
        onChangeText={value => setTextAndLength(value)}
        maxLength={maxLength}
      />
      <Text style={styles.lengthCount}>
        {textLength + ' character(s) of ' + maxLength}
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => saveText()}>
        <Text>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Downloads')}>
        <Text>Downloads</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: layout.top,
  scrollContainer: {
    paddingTop: 0,
  },
  headerText: {
    color: colors.COLORS.DEFAULT,
    fontSize: defaultStyles.standardText.fontSize,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    ...defaultStyles.textInput,
  },
  descriptionTextInput: {
    ...defaultStyles.textInput,
    height: '60%',
  },
  button: {
    backgroundColor: colors.COLORS.LIGHTGRAY,
    alignItems: 'center',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  lengthCount: {
    fontWeight: 'bold',
    fontSize: 14,
    padding: 5,
  },
});

export default TextToSpeechScreen;
