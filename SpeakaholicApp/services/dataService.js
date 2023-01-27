// import '@azure/core-asynciterator-polyfill';
// import {DataStore} from '@aws-amplify/datastore';
// import {Users} from '../models';

// export async function createUser(email, name, cognitoUsername, imageUrl) {
//   await DataStore.save(
//     new Users({
//       email: email,
//       image_url: imageUrl,
//       created_utc: new Date().toISOString(),
//       authentication_id: cognitoUsername,
//       name: name,
//       cognito_user_name: cognitoUsername,
//     }),
//   );
// }

// export async function userExists(cognitoUsername) {
//   const models = await DataStore.query(Users, u =>
//     u.cognito_user_name.eq(cognitoUsername),
//   );

//   return models.length > 1;
// }
