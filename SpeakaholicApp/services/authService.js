import {Auth} from 'aws-amplify';

async function registration(email, password, name) {
  await Auth.signUp({
    username: email,
    password,
    attributes: {name, email},
    autoSignIn: {enabled: true},
  });
}

async function signIn(email, password) {
  const user = await Auth.signIn(email, password);
  // await createUser(
  //   user.attributes.email,
  //   user.attributes.name,
  //   user.attributes.sub,
  //   null,
  // );

  return user;
}

async function confirmAccount(email, code) {
  await Auth.confirmSignUp(email, code);
}

async function resendConfirmationCode(email) {
  await Auth.resendSignUp(email);
}

async function signOut() {
  await Auth.signOut({global: true});
}

async function forgotPassword(email) {
  await Auth.forgotPassword(email);
}

async function confirmForgotPassword(email, code, newPassword) {
  await Auth.forgotPasswordSubmit(email, code, newPassword);
}

async function getCurrentUserInfo() {
  return await Auth.currentUserInfo();
}

async function isAuthenticated() {
  const userInfo = await getCurrentUserInfo();
  return userInfo !== undefined;
}

export {
  registration,
  signIn,
  confirmAccount,
  resendConfirmationCode,
  signOut,
  forgotPassword,
  confirmForgotPassword,
  getCurrentUserInfo,
  isAuthenticated,
};
