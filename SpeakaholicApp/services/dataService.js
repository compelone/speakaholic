import {DataStore} from '@aws-amplify/datastore';
import {SpeechItems, Users} from '../models';
import {API, graphqlOperation} from 'aws-amplify';
import {getUserCreditsLeft} from '../models/graphql/queries';
import {createPurchaseCredits} from '../models/graphql/mutations';

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
  fileName,
) {
  await DataStore.save(
    new SpeechItems({
      cognito_user_name: cognitoUsername,
      s3_input_key: s3_key.key,
      character_count: textLength,
      created_date_utc: new Date().toISOString(),
      is_processed: false,
      voice: voice,
      language: language,
      prediction_type: predictionType,
      name: fileName,
    }),
  );
}

export async function saveImageToSpeechItem(
  cognitoUsername,
  s3_key,
  voice,
  language,
  predictionType,
  name,
) {
  await DataStore.save(
    new SpeechItems({
      cognito_user_name: cognitoUsername,
      s3_input_key: s3_key,
      character_count: 0,
      created_date_utc: new Date().toISOString(),
      is_processed: false,
      voice: voice,
      language: language,
      prediction_type: predictionType,
      name: name,
    }),
  );
}

export async function getProcessedSpeechItems(cognitoUsername) {
  const models = await DataStore.query(SpeechItems, u =>
    u.cognito_user_name.eq(cognitoUsername),
  );

  return models.filter(
    model => model.is_processed || model.failed_reason !== null,
  );
}

export async function purchaseCredits(cognito_user_name, credits) {
  const now = new Date();
  const purchase_date = now.toISOString();
  const expiration_date = new Date(
    now.setDate(now.getDate() + 30),
  ).toISOString();

  const purchaseCredits = {
    cognito_user_name: cognito_user_name,
    credits: credits,
    purchase_date: purchase_date,
    expiration_date: expiration_date,
    is_expired: false,
  };

  const newPurchase = await API.graphql({
    query: createPurchaseCredits,
    variables: {input: purchaseCredits},
  });

  return newPurchase;
}

export async function getCreditsLeft(cognito_user_name) {
  try {
    const filter = {
      id: {
        eq: cognito_user_name,
      },
    };
    const userCreditsLeft = await API.graphql({
      query: getUserCreditsLeft,
      variables: {id: cognito_user_name},
    });
    return userCreditsLeft;
  } catch (error) {
    console.log(error);
    // raise error to the caller
    throw error;
  }
}

export async function deleteSpeechItem(id) {
  await DataStore.delete(SpeechItems, id);
}

export async function deleteUser(cognito_user_name) {
  await DataStore.save(
    new Users({
      id: cognito_user_name,
      cognito_user_name: cognito_user_name,
      email: 'deleteuser@deleteuser.com',
      name: 'deleteuser',
      created_date_utc: new Date().toISOString(),
      monthly_limit: 0,
      additional_credits: 0,
      credit_reset_days: 0,
    }),
  );
}
