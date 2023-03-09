import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import colors from '../styles/colors';
import defaultStyles from '../styles/defaultStyles';
import layout from '../styles/layout';
import {saveSpeechItem} from '../services/dataService';
import Voices from '../components/Voices';
import {uploadToS3} from '../services/generalService';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  updateUserCreditsLeft,
  updateUsedCreditsAfterSubmit,
} from '../modules/UserCreditsLeftAction';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as Sentry from '@sentry/react-native';
import {useFlags} from 'react-native-flagsmith/react';
import Icon from 'react-native-vector-icons/FontAwesome';

const TextToSpeechScreen = props => {
  const [text, setText] = useState();
  const [name, setName] = useState();
  const [nameError, setNameError] = useState();
  const [textError, setTextError] = useState();
  const [textLength, setTextLength] = useState(0);
  const [maxCharacters, setMaxCharacters] = useState(3000);
  const [voice, setVoice] = useState('Salli');
  const [isLoading, setIsLoading] = useState(false);
  const flags = useFlags(['max_characters']);
  const flagMaxCharacters = flags.max_characters;

  useEffect(() => {
    if (flagMaxCharacters) {
      setMaxCharacters(flagMaxCharacters.value);
    }
  }, [flagMaxCharacters]);

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
      if (
        text.length >
        props.user.userCreditsLeft.data.getUserCreditsLeft.credits_left
      ) {
        setTextError('Not enough credits remaining');
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

      const updatedCreditsLeft =
        props.user.userCreditsLeft.data.getUserCreditsLeft.credits_left -
        textLength;

      props.user.userCreditsLeft.data.getUserCreditsLeft.credits_left =
        updatedCreditsLeft;
      props.updateUserCreditsLeft(props.user.userCreditsLeft);

      setText();
      setName();
    } catch (error) {
      Alert.alert('Something went wrong', error.message);
      Sentry.captureException(error);
    } finally {
      setIsLoading(false);
    }
  };

  const setTextAndLength = value => {
    setText(value);
    setTextLength(value.length);
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
        <Text>max {maxCharacters} characters at a time</Text>
        <View style={styles.descriptionView}>
          <TextInput
            style={
              textError
                ? [styles.descriptionTextInput, styles.textDescriptionError]
                : styles.descriptionTextInput
            }
            multiline={true}
            placeholder="Text*"
            placeholderTextColor={colors.COLORS.DARKGRAY}
            value={text}
            onChangeText={value => setTextAndLength(value)}
            maxLength={maxCharacters}
          />
        </View>
        <View style={styles.verticalView}>
          <Text style={styles.lengthCount}>
            {textLength +
              ' character(s) of ' +
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
          <TouchableOpacity style={styles.button} onPress={() => saveText()}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        )}
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
  mainContainer: {
    ...layout.top,
  },
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
    flexGrow: 1,
  },
  descriptionView: {
    flexGrow: 1,
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
    color: colors.COLORS.DARKGRAY,
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

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateUserCreditsLeft,
      updateUsedCreditsAfterSubmit,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(TextToSpeechScreen);
