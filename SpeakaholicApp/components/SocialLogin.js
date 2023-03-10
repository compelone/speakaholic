import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, StyleSheet, Text} from 'react-native';
import {CognitoHostedUIIdentityProvider} from '@aws-amplify/auth';
import {Auth, Hub} from 'aws-amplify';
import {connect} from 'react-redux';

// import {getCurrentUserInfo} from '../services/authService';
// import {createUser, userExists} from '../services/dataService';

import * as layout from '../styles/layout';
import * as colors from '../styles/colors';

const SocialLogin = props => {
  useEffect(() => {
    if (props === undefined) {
      return;
    }

    const unsubscribe = Hub.listen('auth', ({payload: {event, data}}) => {
      switch (event) {
        case 'signIn':
          // props.navigation.navigate('Root');
          break;
        case 'signOut':
          break;
        case 'customOAuthState':
          console.log(data);
      }
    });
    return unsubscribe;
  }, [props]);

  return (
    <></>
    // <View>
    //   <View style={layout.default.centered.justifyContent}>
    //     <Text style={styles.useText}>- Login With -</Text>
    //   </View>
    //   <View style={styles.socialView}>
    //     <TouchableOpacity
    //       onPress={() =>
    //         Auth.federatedSignIn({
    //           provider: CognitoHostedUIIdentityProvider.Facebook,
    //         })
    //       }>
    //       <Image source={require('../assets/images/icons8-facebook-48.png')} />
    //     </TouchableOpacity>
    //   </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  image: {
    alignItems: 'center',
    paddingBottom: 50,
  },
  button: {
    backgroundColor: colors.default.COLORS.PRIMARY,
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

export default connect(mapStateToProps)(SocialLogin);
