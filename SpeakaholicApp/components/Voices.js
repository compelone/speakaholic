import React, {useEffect, useState} from 'react';
import Sound from 'react-native-sound';
import {StyleSheet, Alert} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import * as colors from '../styles/colors';

Sound.setCategory('Playback');

const Voices = props => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'English, Ivy, Female', value: 'Ivy'},
    {label: 'English, Joanna, Female', value: 'Joanna'},
    {label: 'English, Joey, Male', value: 'Joey'},
    {label: 'English, Justin, Male', value: 'Justin'},
    {label: 'English, Kendra, Female', value: 'Kendra'},
    {label: 'English, Kevin, Male', value: 'Kevin'},
    {label: 'English, Kimberly, Female', value: 'Kimberly'},
    {label: 'English, Matthew, Male', value: 'Matthew'},
    {label: 'English, Salli, Female', value: 'Salli'},
    {label: 'English, Amber, Female', value: 'en-US-AmberNeural'},
    {label: 'English, Ana, Female', value: 'en-US-AnaNeural'},
    {label: 'English, Ashley, Female', value: 'en-US-AshleyNeural'},
    {label: 'English, Brandon, Male', value: 'en-US-BrandonNeural'},
    {label: 'English, Davis, Male', value: 'en-US-DavisNeural'},
    {label: 'English, Elizabeth, Female', value: 'en-US-ElizabethNeural'},
    {label: 'English, Eric, Male', value: 'en-US-EricNeural'},
    {label: 'English, Jacob, Male', value: 'en-US-JacobNeural'},
    {label: 'English, Jason, Male', value: 'en-US-JasonNeural'},
    {label: 'English, Jenny, Female', value: 'en-US-JennyNeural'},
    {label: 'English, Michelle, Female', value: 'en-US-MichelleNeural'},
    {label: 'English, Monica, Female', value: 'en-US-MonicaNeural'},
    {label: 'English, Nancy, Female', value: 'en-US-NancyNeural'},
    {label: 'English, Roger, Male', value: 'en-US-RogerNeural'},
    {label: 'English, Steffan, Male', value: 'en-US-SteffanNeural'},
    {label: 'English, Tony, Male', value: 'en-US-TonyNeural'},
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
      placeholderTextColor={colors.default.COLORS.DARKGRAY}
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
