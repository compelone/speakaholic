import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import colors from '../styles/colors';
import defaultStyles from '../styles/defaultStyles';
import layout from '../styles/layout';
import Voices from '../components/Voices';
import DeviceInfo from 'react-native-device-info';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {uploadToS3} from '../services/generalService';
import {saveImageToSpeechItem} from '../services/dataService';
import {getCurrentUserInfo} from '../services/authService';
import Downloads from '../components/Downloads';
import {connect} from 'react-redux';
import RNFS from 'react-native-fs';

const ImageToSpeechScreen = props => {
  const [imageUri, setImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState();
  const [nameError, setNameError] = useState();
  const [voice, setVoice] = useState('Salli');
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [imageBytes, setImageBytes] = useState();

  const maxImageSize = 5000000;
  const options = {
    mediaType: 'photo',
    includeBase64: false,
    quality: 0.7,
  };

  const selectPhoto = async () => {
    const photoLibraryPermission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);

    if (photoLibraryPermission !== RESULTS.GRANTED) {
      const requestphotoLibraryPermission = await request(
        PERMISSIONS.IOS.PHOTO_LIBRARY,
      );
      if (requestphotoLibraryPermission !== RESULTS.GRANTED) {
        Alert.alert('Permission to access the photo library is not allowed');
        return;
      }
    }

    const imagePickerResponse = await launchImageLibrary(options);

    if (imagePickerResponse.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (imagePickerResponse.error) {
      console.log('ImagePicker Error: ', imagePickerResponse.error);
      return;
    }

    const imageBytes = await fetch(imagePickerResponse.assets[0].uri);
    const blob = await imageBytes.blob();

    setImageBytes(blob);

    setImageUri(imagePickerResponse.assets[0].uri);
    setIsImageChanged(true);
  };

  const pickImage = async () => {
    const cameraPermission = await check(PERMISSIONS.IOS.CAMERA);

    if (cameraPermission !== RESULTS.GRANTED) {
      const requestCameraPermission = await request(PERMISSIONS.IOS.CAMERA);
      if (requestCameraPermission !== RESULTS.GRANTED) {
        Alert.alert('Permission to access the camera is not allowed');
        return;
      }
    }

    const imagePickerResponse = await launchCamera(options);

    if (imagePickerResponse.didCancel) {
      console.log('User cancelled image picker');
      return;
    }

    if (imagePickerResponse.error) {
      console.log('ImagePicker Error: ', imagePickerResponse.error);
      return;
    }

    const imageBytes = await fetch(imagePickerResponse.assets[0].uri);
    const blob = await imageBytes.blob();

    setImageBytes(blob);

    setImageUri(imagePickerResponse.assets[0].uri);
    setIsImageChanged(true);
  };

  const save = async () => {
    setIsLoading(true);

    try {
      if (name === undefined) {
        setNameError(true);
        return;
      }
      if (!isImageChanged) {
        Alert.alert('You must select an image.');
        return;
      }

      if (imageBytes.length > maxImageSize) {
        Alert.alert('Image is too large');
        return;
      }

      const fileName = `inputs/${new Date().toISOString()}.jpg`;
      const s3_key = await uploadToS3(
        fileName,
        imageBytes,
        'private',
        'image/jpg',
        'input',
      );
      await saveImageToSpeechItem(
        props.user.loggedInUser.attributes.sub,
        s3_key.key,
        voice,
        'English',
        'imagetospeech',
        name,
      );
      setName();
      setImageUri('');
      setNameError(false);
      setIsImageChanged(false);
    } catch (error) {
      Alert.alert('Something went wrong', error.message);
    } finally {
      setIsLoading(false);
    }
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
        <TouchableOpacity
          style={styles.centerImage}
          onPress={() => pickImage()}>
          <Image
            source={
              imageUri === ''
                ? require('../assets/images/emptyimage.png')
                : {uri: imageUri}
            }
            style={styles.image}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.centerImage}
          onPress={() => selectPhoto()}>
          <Text style={styles.selectPhotoButton}>Select a photo</Text>
        </TouchableOpacity>
        {isLoading ? (
          <ActivityIndicator color={colors.COLORS.PRIMARY} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => save()}>
            <Text>Save</Text>
          </TouchableOpacity>
        )}
        <Downloads navigation={props.navigation} />
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
  selectPhotoButton: {
    fontSize: 20,
    color: colors.COLORS.SALMON,
    padding: 10,
  },
});

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps)(ImageToSpeechScreen);
