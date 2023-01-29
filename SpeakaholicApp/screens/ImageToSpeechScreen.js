import React, {useState} from 'react';
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

const ImageToSpeechScreen = ({navigation}) => {
  const [imageUri, setImageUri] = useState('');
  const [voice, setVoice] = useState('salli');

  const saveText = () => {
    return;
  };

  const pickImage = async () => {
    let source = '';

    if (DeviceInfo.isEmulatorSync()) {
      const base64 = await RNFS.readFile(
        '/Users/lesterprivott/sc/speakaholic/SpeakaholicApp/assets/images/base64testimage.txt',
      );

      source = base64;

      setImageUri(source);
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
          source = {uri: 'data:image/jpeg;base64,' + response.data};

          setImageUri(source);
        }
      });
    }

    const level = 'private';
    const key = await uploadToS3(source, level, '');
    await saveSpeechItem(
      user.attributes.sub,
      key,
      0,
      voice,
      'English',
      'imagetospeech',
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Voices voice={voice} setVoice={setVoice} />
      <TouchableOpacity style={styles.centerImage} onPress={() => pickImage()}>
        <Image
          source={
            imageUri === ''
              ? require('../assets/images/emptyimage.png')
              : {uri: imageUri}
          }
          style={styles.image}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => saveText()}>
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
  },
  centerImage: {
    alignItems: 'center',
    backgroundColor: colors.COLORS.LIGHTGRAY,
  },
});

export default ImageToSpeechScreen;
