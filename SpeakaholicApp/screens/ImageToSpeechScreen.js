import React, {useEffect, useReducer, useState} from 'react';
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
import {bindActionCreators} from 'redux';
import {updateUserCreditsLeft} from '../modules/UserCreditsLeftAction';
import {userReducer} from '../modules/UserStore';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Sentry from '@sentry/react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ImageToSpeechScreen = props => {
  const [imageUri, setImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState();
  const [nameError, setNameError] = useState();
  const [voice, setVoice] = useState('Salli');
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [imageBytes, setImageBytes] = useState();

  const maxImageSize = 7000000;
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

      if (imageBytes.size > maxImageSize) {
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
      Sentry.captureException(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.mainContainer}>
        <Voices voice={voice} setVoice={setVoice} />
        <TextInput
          style={
            nameError
              ? [styles.textInput, defaultStyles.textInputError]
              : styles.textInput
          }
          onChangeText={setName}
          placeholder="Title*"
          placeholderTextColor={colors.COLORS.DARKGRAY}
          value={name}
          maxLength={64}
        />
        <Text>max 100 words</Text>
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
        <View style={styles.imageButtonsContainer}>
          <TouchableOpacity onPress={() => pickImage()}>
            <Text style={styles.selectPhotoButton}>Take a photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => selectPhoto()}>
            <Text style={styles.selectPhotoButton}>Select a photo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.charactersleftandbuttonView}>
          <View style={styles.verticalView}>
            <Text style={styles.lengthCount}>
              {'character(s) left ' +
                props?.user?.userCreditsLeft?.data?.getUserCreditsLeft
                  ?.credits_left}
            </Text>
            <Icon.Button
              name="plus-circle"
              backgroundColor="transparent"
              color={colors.COLORS.SALMON}
              size={30}
              borderRadius={20}
              onPress={() => props.navigation.navigate('Purchase')}
            />
          </View>
          {isLoading ? (
            <ActivityIndicator color={colors.COLORS.PRIMARY} />
          ) : props?.user?.userCreditsLeft?.data?.getUserCreditsLeft
              ?.credits_left <= 0 ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => props.navigation.navigate('Purchase')}>
              <Text style={styles.buttonText}>
                You have{' '}
                {
                  props?.user?.userCreditsLeft?.data?.getUserCreditsLeft
                    ?.credits_left
                }{' '}
                credits, click to purchase
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => save()}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* <Downloads navigation={props.navigation} /> */}
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingTop: 18,
  },
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
  button: {
    backgroundColor: colors.COLORS.PRIMARY,
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  image: {
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
    color: colors.COLORS.PRIMARY,
    padding: 10,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.COLORS.LIGHTGRAY,
  },
  lengthCount: {
    fontWeight: 'bold',
    fontSize: 14,
    padding: 5,
    color: colors.COLORS.DARKGRAY,
  },
  charactersleftandbuttonView: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  buttonText: {
    color: colors.COLORS.WHITE,
  },
  verticalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateUserCreditsLeft,
    },
    dispatch,
  );

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImageToSpeechScreen);
