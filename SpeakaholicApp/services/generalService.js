import {Storage} from 'aws-amplify';

function generateUUID(digits) {
  let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
  let uuid = [];
  for (let i = 0; i < digits; i++) {
    uuid.push(str[Math.floor(Math.random() * str.length)]);
  }
  return uuid.join('');
}

async function uploadToS3(fileName, data, access, contentType, prefix) {
  const key = await Storage.put(fileName, data, {
    level: access,
    contentType: contentType,
    // customPrefix: {
    //   private: `${prefix}/`,
    // },
  });

  return key;
}

export {generateUUID, uploadToS3};
