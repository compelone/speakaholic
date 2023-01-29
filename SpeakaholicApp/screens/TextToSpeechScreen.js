import React, {useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import colors from '../styles/colors';
import defaultStyles from '../styles/defaultStyles';
import layout from '../styles/layout';

const TextToSpeechScreen = ({navigation}) => {
  const [text, setText] = useState();
  const [textError, setTextError] = useState();
  const [textLength, setTextLength] = useState(0);

  const maxLength = 1000;

  const saveText = () => {
    return;
  };

  const setTextAndLength = value => {
    setText(value);
    setTextLength(value.length);
  };

  return (
    <View style={styles.mainContainer}>
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
    height: '80%',
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
