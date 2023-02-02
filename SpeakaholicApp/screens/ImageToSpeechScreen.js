import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import colors from '../styles/colors';
import defaultStyles from '../styles/defaultStyles';
import layout from '../styles/layout';
import Voices from '../components/Voices';
import DeviceInfo from 'react-native-device-info';
import {showImagePicker} from 'react-native-image-picker';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import {uploadToS3} from '../services/generalService';
import {saveImageToSpeechItem} from '../services/dataService';
import {getCurrentUserInfo} from '../services/authService';

const ImageToSpeechScreen = ({navigation}) => {
  const [imageUri, setImageUri] = useState('');
  const [voice, setVoice] = useState('salli');

  useEffect(() => {
    (async () => {
      const imageBase64 = {
        uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAREAAAC4CAMAAADzLiguAAAAG1BMVEX39/f4+Pjv7+/k5OT09PTq6urm5ubw8PDs7OxW829PAAACYElEQVR4nO3dzU7DMBAA4fzYjt//iamTNnUmQeK2SJ65oMKB7ack0A0qU12sr07LbH3LS2Syb4owRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYf9B5PaudbHTxIuk2zsbho4TL5LyyrbIieJFlhvIWiLniRcpd5E1cqRIkbldU7cHkDUfXwsZLEwk5bL3BPI6b44iLihxIs8UOFYUUUSRbxQpudbKq8rAImV7fzYXRVp1+swwp6JIA+kG6klGFamXAXqSQUVK2h/XnOtxNamji+znzPsV8H64pNFFUvv+n5VAO0rmMrbIftKcj3KbqSoybYp4jNy6ipx7ozbMnMcWWfdF81bOQ6Rbqw0qcmxV2wYp12Ok0X/6fraqKaXj4/C/s54vfN91dytGFVm7fep8uX0zrMha6tQW7201737kfPLLtm1cog0t8pgiiijSlX65m3cpYrS4+77pD0XMFf+3Af8tRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYowRZgiTBGmCFOEKcIUYYqwXcT6lqne/gvk2NUfdiEYb2qZLrAAAAAASUVORK5CYII=',
      };

      setImageUri(imageBase64);
    })();
  }, []);

  const pickImage = async () => {
    if (DeviceInfo.isEmulatorSync()) {
      const imageBase64 = {
        uri: 'data:image/png;base64,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',
      };

      setImageUri(imageBase64);
    } else {
      const cameraPermission = await check(PERMISSIONS.IOS.CAMERA);

      if (cameraPermission !== RESULTS.GRANTED) {
        const requestCameraPermission = await request(PERMISSIONS.IOS.CAMERA);
        if (requestCameraPermission !== RESULTS.GRANTED) {
          Alert.alert('Permission to access the camera is not allowed');
          return;
        }
      }
      let options = {
        title: 'Select Image',
        customButtons: [
          {
            name: 'customOptionKey',
            title: 'Choose Photo from Custom Option',
          },
        ],
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      showImagePicker(options, response => {
        console.log('Response = ', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const imageBase64 = {uri: 'data:image/jpeg;base64,' + response.data};

          setImageUri(imageBase64);
        }
      });
    }
  };

  const save = async () => {
    const level = 'private';
    const key = await uploadToS3(source, level, 'text/plain', '');
    const user = await getCurrentUserInfo();
    await saveImageToSpeechItem(
      user.attributes.sub,
      key,
      voice,
      'English',
      'imagetospeech',
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Voices voice={voice} setVoice={setVoice} />
      <TouchableOpacity style={styles.centerImage} onPress={() => pickImage()}>
        <Image source={imageUri} style={styles.image} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => save()}>
        <Text>Save</Text>
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
    height: 300,
  },
  button: {
    backgroundColor: colors.COLORS.LIGHTGRAY,
    alignItems: 'center',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  image: {
    margin: 10,
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  centerImage: {
    alignItems: 'center',
    backgroundColor: colors.COLORS.LIGHTGRAY,
  },
});

export default ImageToSpeechScreen;
