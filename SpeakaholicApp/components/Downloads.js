import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet, Text} from 'react-native';
import {connect} from 'react-redux';

import * as colors from '../styles/colors';

const Downloads = props => {
  return (
    <View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => props.navigation.navigate('Downloads')}>
        <Image
          source={require('../assets/images/icons8-download-from-the-cloud-48.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  button: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: colors.default.COLORS.SALMON,
  },
  socialView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  useText: {
    fontSize: 20,
    padding: 20,
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

export default connect(mapStateToProps)(Downloads);
