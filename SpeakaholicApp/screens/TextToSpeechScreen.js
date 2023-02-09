import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import colors from '../styles/colors';
import defaultStyles from '../styles/defaultStyles';
import layout from '../styles/layout';
import {saveSpeechItem} from '../services/dataService';
import Voices from '../components/Voices';

import {PushNotification} from '@aws-amplify/pushnotification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import {uploadToS3} from '../services/generalService';
import {connect} from 'react-redux';

const TextToSpeechScreen = props => {
  const [text, setText] = useState();
  const [name, setName] = useState();
  const [nameError, setNameError] = useState();
  const [textError, setTextError] = useState();
  const [textLength, setTextLength] = useState(0);
  const [voice, setVoice] = useState('Salli');
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      if (name === undefined) {
        setNameError(true);
        return;
      }
      if (text === undefined) {
        setTextError(true);
        return;
      }

      const fileName = `inputs/${new Date().toISOString()}.txt`;
      const s3_key = await uploadToS3(
        fileName,
        text,
        'private',
        'text/plain',
        'input',
      );

      await saveSpeechItem(
        props.user.loggedInUser.attributes.sub,
        s3_key,
        textLength,
        voice,
        'English',
        'texttospeech',
        name,
      );
      setText();
      setName();
    } catch (error) {
      Alert.alert('Something went wrong', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const setTextAndLength = value => {
    setText(value);
    setTextLength(value.length);
  };

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        <Voices voice={voice} setVoice={setVoice} />

        <TextInput
          style={
            nameError
              ? [styles.textInput, defaultStyles.textInputError]
              : styles.textInput
          }
          onChangeText={setName}
          placeholder="Name*"
          value={name}
          maxLength={100}
        />
        <TextInput
          style={
            textError
              ? [styles.descriptionTextInput, styles.textDescriptionError]
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
        {isLoading ? (
          <ActivityIndicator color={colors.COLORS.PRIMARY} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => saveText()}>
            <Text>Save</Text>
          </TouchableOpacity>
        )}
        {/* <Downloads navigation={props.navigation} /> */}
      </View>
    </ScrollView>
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
  textDescriptionError: {
    ...defaultStyles.textInput,
    height: '60%',
    borderColor: 'red',
  },
  button: {
    backgroundColor: colors.COLORS.PRIMARY,
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  lengthCount: {
    fontWeight: 'bold',
    fontSize: 14,
    padding: 5,
  },
});

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps)(TextToSpeechScreen);
