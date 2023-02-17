export const updateUserCreditsLeft = credits => ({
  type: 'SET_USER_CREDITS_LEFT',
  payload: credits,
});

export const updateUsedCreditsAfterSubmit = () => ({
  type: 'SET_USED_CREDITS_AFTER_SUBMIT',
});

export const setLastCheckedDate = date => ({
  type: 'SET_LAST_CHECKED_DATE',
});
