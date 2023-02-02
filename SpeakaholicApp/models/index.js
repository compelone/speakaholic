// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { SpeechItems, Users } = initSchema(schema);

export {
  SpeechItems,
  Users
};