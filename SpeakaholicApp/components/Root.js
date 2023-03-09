// import {useEffect, useState} from 'react';
// import {Hub} from 'aws-amplify';
// import {connect} from 'react-redux';
// import {updateUser} from '../modules/UserActions';
// import {updateUserCreditsLeft} from '../modules/UserCreditsLeftAction';
// import {bindActionCreators} from 'redux';
// import flagsmith from 'react-native-flagsmith';
// import {DataStore, syncExpression} from '@aws-amplify/datastore';
// import {getCreditsLeft} from '../services/dataService';
// import {SpeechItems, UserCreditsLeft, Users} from '../models';
// import * as Keychain from 'react-native-keychain';
// import {useFlags} from 'react-native-flagsmith/react';

// const Root = props => {
//   const flags = useFlags(['allow_skip_purchase_screen_if_no_credits']);
//   const flagAllowSkipPurchaseScreenIfNoCredits =
//     flags.allow_skip_purchase_screen_if_no_credits;

//   useEffect(() => {
//     (async () => {
//       const unsubscribe = Hub.listen(
//         'auth',
//         async ({payload: {event, data}}) => {
//           switch (event) {
//             case 'signIn':
//               console.log(data);
//               props.updateUser(data);

//               const cognito_user_name = data.attributes.sub;
//               flagsmith.identify(cognito_user_name);

//               DataStore.configure({
//                 syncExpressions: [
//                   syncExpression(UserCreditsLeft, () => {
//                     return ucl => ucl.cognito_user_name.eq(cognito_user_name);
//                   }),
//                   syncExpression(SpeechItems, () => {
//                     return si => si.cognito_user_name.eq(cognito_user_name);
//                   }),
//                   syncExpression(Users, () => {
//                     return u => u.cognito_user_name.eq(cognito_user_name);
//                   }),
//                 ],
//               });

//               DataStore.start();

//               const userCreditsLeft = await getCreditsLeft(cognito_user_name);

//               if (userCreditsLeft.data.getUserCreditsLeft === null) {
//                 if (flagAllowSkipPurchaseScreenIfNoCredits) {
//                   props.navigation.navigate('Purchase');
//                 } else {
//                   props.navigation.navigate('Root');
//                 }
//                 break;
//               }

//               props.updateUserCreditsLeft(userCreditsLeft);

//               props.navigation.replace('Root');
//               break;
//             case 'tokenRefresh':
//             case 'tokenRefresh_failure':
//             case 'signOut':
//               await Keychain.resetGenericPassword();
//               await DataStore.clear();
//               props.reset();
//               props.navigation.navigate('Home');
//               break;
//           }
//         },
//       );
//       return unsubscribe;
//     })();
//   }, [props]);

//   return <></>;
// };

// const mapStateToProps = state => {
//   const {user} = state;
//   return {user};
// };

// const mapDispatchToProps = dispatch =>
//   bindActionCreators(
//     {
//       updateUser,
//       updateUserCreditsLeft,

//     },
//     dispatch,
//   );

// export default connect(mapStateToProps, mapDispatchToProps)(Root);
