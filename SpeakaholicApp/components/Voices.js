import React, {useEffect, useState} from 'react';
import Sound from 'react-native-sound';
import {StyleSheet, Alert} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import * as colors from '../styles/colors';

Sound.setCategory('Playback');

const Voices = props => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'English, Ivy, Female', value: 'ivy'},
    {label: 'English, Joanna, Female', value: 'joanna'},
    {label: 'English, Joey, Male', value: 'joey'},
    {label: 'English, Justin, Male', value: 'justin'},
    {label: 'English, Kendra, Female', value: 'kendra'},
    {label: 'English, Kevin, Male', value: 'kevin'},
    {label: 'English, Kimberly, Female', value: 'kimberly'},
    {label: 'English, Matthew, Male', value: 'matthew'},
    {label: 'English, Salli, Female', value: 'salli'},
  ]);

  const changedValue = (value, index) => {
    var voice = new Sound(`${value}.mp3`, Sound.MAIN_BUNDLE, error => {
      if (error) {
        Alert.alert('failed to load the sound', error);
        return;
      }

      // Play the sound with an onEnd callback
      voice.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });

    voice.release();
  };

  return (
    <DropDownPicker
      open={open}
      setOpen={setOpen}
      items={items}
      setItems={setItems}
      style={styles.select}
      dropDownContainerStyle={styles.dropDownContainerStyle}
      containerStyle={styles.selectContainer}
      placeholder={'Select a voice*'}
      value={props.voice}
      setValue={props.setVoice}
      placeholderStyle={styles.placeholderStyle}
      onChangeValue={(value, index) => changedValue(value, index)}
    />
  );
};

const styles = StyleSheet.create({
  select: {
    borderColor: colors.default.COLORS.DARKGRAY,
    backgroundColor: 'transparent',
    color: colors.default.COLORS.DARKGRAY,
    zIndex: 1000,
  },
  dropDownContainerStyle: {
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  selectContainer: {
    height: 60,
  },
  placeholderStyle: {
    color: colors.default.COLORS.DARKGRAY,
  },
});

export default Voices;
