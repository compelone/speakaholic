import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import colors from '../styles/colors';
import defaultStyles from '../styles/defaultStyles';
import layout from '../styles/layout';
import {uploadToS3} from '../services/generalService';
import {connect} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFlags} from 'react-native-flagsmith/react';
import Voices from '../components/Voices';
import DocumentPicker from 'react-native-document-picker';
import * as Sentry from '@sentry/react-native';

const PdfToSpeechScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [voice, setVoice] = useState('Salli');
  const [name, setName] = useState();
  const [nameError, setNameError] = useState();
  const [pdfUri, setPdfUri] = useState();
  const [maxPdfSize, setMaxPdfSize] = useState(5000000);

  const flags = useFlags(['pdf_to_speech_enabled'], ['max_pdf_size']);
  const isPdfToSpeechEnabled = flags.pdf_to_speech_enabled;
  const maxPdfSizeFlag = flags.max_pdf_size;

  useEffect(() => {
    if (maxPdfSizeFlag !== undefined) {
      setMaxPdfSize(maxPdfSizeFlag);
    }
  }, [maxPdfSizeFlag]);

  const selectFile = async () => {
    try {
      DocumentPicker.types.pdf;

      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
        allowMultiSelection: false,
      });

      const file = res[0];

      if (file.size > maxPdfSize) {
        Alert.alert('File size is too large.');
        return;
      }

      if (file.uri) {
        setPdfUri(file.uri);
        if (name === undefined) {
          setName(file.name);
        }
      }
    } catch (error) {
      Alert.alert(
        'Something went wrong. Did you remember to select a document?',
      );
      Sentry.captureException(error);
    }
  };

  const save = async () => {
    setIsLoading(true);

    try {
      if (name === undefined) {
        setNameError(true);
        return;
      }
      if (pdfUri === undefined) {
        Alert.alert('You must select a file to upload.');
        return;
      }

      const pdfBytes = await fetch(imagePickerResponse.assets[0].uri);
      const blob = await pdfBytes.blob();

      const fileName = `inputs/${new Date().toISOString()}.jpg`;

      const s3_key = await uploadToS3(
        fileName,
        blob,
        'private',
        'application/pdf',
        'input',
      );

      await saveImageToSpeechItem(
        props.user.loggedInUser.attributes.sub,
        s3_key.key,
        voice,
        'English',
        'pdftospeech',
        name,
      );

      setName();
      setPdfUri();
      setNameError(false);
    } catch (error) {
      Alert.alert('Something went wrong.');
      Sentry.captureException(error);
    } finally {
      setIsLoading(false);
    }

    return;
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContainer}>
      {isPdfToSpeechEnabled ? (
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
          <View style={styles.fileSelectorView}>
            <TouchableOpacity onPress={() => selectFile()}>
              <Image
                source={require('../assets/images/icons8-pdf-64.png')}
                style={styles.image}
              />
            </TouchableOpacity>
            {pdfUri ? (
              <Text style={styles.fileName}>File selected: {name}</Text>
            ) : (
              <></>
            )}
          </View>
          <View style={styles.verticalView}>
            <Text style={styles.lengthCount}>
              {'character(s) left ' +
                props.user.userCreditsLeft.data.getUserCreditsLeft.credits_left}
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
          <View>
            {isLoading ? (
              <ActivityIndicator color={colors.COLORS.PRIMARY} />
            ) : props.user.userCreditsLeft.data.getUserCreditsLeft
                .credits_left <= 0 ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => props.navigation.navigate('Purchase')}>
                <Text style={styles.buttonText}>
                  You have{' '}
                  {
                    props.user.userCreditsLeft.data.getUserCreditsLeft
                      .credits_left
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
        </View>
      ) : (
        <Text>
          Coming Soon! Pdf to Speech is not enabled yet. Please check back later
          to see when it is enabled. Thank you for your patience and
          understanding.
        </Text>
      )}
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
  fileSelectorView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  image: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
    marginTop: 50,
  },
  fileName: {
    fontSize: 16,
    color: colors.COLORS.DARKGRAY,
    padding: 5,
    marginTop: 10,
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps)(PdfToSpeechScreen);
