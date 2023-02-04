// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { UserCreditsLeft, SpeechItems, Users } = initSchema(schema);

export {
  UserCreditsLeft,
  SpeechItems,
  Users
};