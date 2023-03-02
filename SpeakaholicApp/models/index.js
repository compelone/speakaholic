// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { PurchaseCredits, UserCreditsLeft, SpeechItems, Users } = initSchema(schema);

export {
  PurchaseCredits,
  UserCreditsLeft,
  SpeechItems,
  Users
};