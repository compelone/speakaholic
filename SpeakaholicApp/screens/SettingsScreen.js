import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import * as colors from '../styles/colors';
import {signOut} from '../services/authService';
import layout from '../styles/layout';
import {connect} from 'react-redux';
import {version} from '../package.json';
import {reset} from '../modules/ResetAction';
import {bindActionCreators} from 'redux';
import Purchases from 'react-native-purchases';
import {deleteUser} from '../services/dataService';
import * as Sentry from '@sentry/react-native';
import {ENVIRONMENT} from '@env';
import {DataStore} from '@aws-amplify/datastore';

const SettingsScreen = props => {
  const handlePress = async () => {
    await DataStore.clear();

    await signOut();
  };

  const restore = async () => {
    try {
      await Purchases.restorePurchases();
      Alert.alert('Purchases restored');
    } catch (error) {
      console.log(error);
      Alert.alert('Something went wrong.');
      Sentry.captureException(error);
    }
  };

  const deleteAccount = async () => {
    try {
      Alert.alert(
        'Remove All Data',
        'This will remove all your data including any unused characters. Are you sure?',
        [
          {
            text: 'Cancel',
            onPress: () => {},
          },
          {
            text: 'OK',
            onPress: async () => {
              deleteUser(props.user.loggedInUser.attributes.sub);
              await signOut();
            },
          },
        ],
      );
    } catch (e) {
      console.log(e);
      Alert.alert('Something went wrong.');
      Sentry.captureException(error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <Text
          style={styles.textLinks}
          onPress={() =>
            Linking.openURL('https://speakaholic.com/pages/privacy')
          }>
          Privacy Policy
        </Text>
        <View style={styles.separator}></View>
        <Text
          style={styles.textLinks}
          onPress={() =>
            Linking.openURL('https://speakaholic.com/pages/terms')
          }>
          Terms
        </Text>
        <TouchableOpacity style={styles.button} onPress={restore}>
          <Text style={styles.buttonText}>Restore Purchases</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate('Purchase')}>
          <Text style={styles.buttonText}>Purchase Credits</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress()}>
          <Text style={styles.buttonText}>Signout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.versionView}>
        <TouchableOpacity style={styles.button} onPress={() => deleteAccount()}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
        <Text style={styles.textVersion}>
          {ENVIRONMENT} Version: {version}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    ...layout.top,
    justifyContent: 'center',
    paddingTop: 100,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    backgroundColor: colors.default.COLORS.DEFAULT,
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: colors.default.COLORS.WHITE,
  },
  textLinks: {
    fontSize: 30,
    color: colors.default.COLORS.PRIMARY,
    marginBottom: 10,
  },
  versionView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
});

const mapStateToProps = state => {
  const {user} = state;
  return {user};
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      reset,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
