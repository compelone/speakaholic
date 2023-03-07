// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Users, SpeechItems, UserCreditsLeft, PurchaseCredits } = initSchema(schema);

export {
  Users,
  SpeechItems,
  UserCreditsLeft,
  PurchaseCredits
};