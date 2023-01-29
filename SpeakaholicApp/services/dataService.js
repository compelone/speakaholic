import '@azure/core-asynciterator-polyfill';
import {DataStore} from '@aws-amplify/datastore';
import {SpeechItems, Users} from '../models';

export async function createUser(email, name, cognitoUsername, imageUrl) {
  const doesUserExist = await userExists(cognitoUsername);
  if (!doesUserExist) {
    await DataStore.save(
      new Users({
        email: email,
        image_url: imageUrl,
        created_date_utc: new Date().toISOString(),
        authentication_id: cognitoUsername,
        name: name,
        cognito_user_name: cognitoUsername,
      }),
    );
  }
}

export async function userExists(cognitoUsername) {
  const models = await DataStore.query(Users, u =>
    u.cognito_user_name.eq(cognitoUsername),
  );

  return models.length > 1;
}

export async function saveSpeechItem(
  cognitoUsername,
  s3_key,
  textLength,
  voice,
  language,
  predictionType,
) {
  await DataStore.save(
    new SpeechItems({
      cognito_user_name: cognitoUsername,
      key: s3_key.key,
      character_count: textLength,
      created_date_utc: new Date().toISOString(),
      is_processed: false,
      voice: voice,
      language: language,
      prediction_type: predictionType,
    }),
  );
}
