/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPurchaseCredits = /* GraphQL */ `
  mutation CreatePurchaseCredits(
    $input: CreatePurchaseCreditsInput!
    $condition: ModelPurchaseCreditsConditionInput
  ) {
    createPurchaseCredits(input: $input, condition: $condition) {
      id
      cognito_user_name
      credits
      purchase_date
      expiration_date
      is_expired
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updatePurchaseCredits = /* GraphQL */ `
  mutation UpdatePurchaseCredits(
    $input: UpdatePurchaseCreditsInput!
    $condition: ModelPurchaseCreditsConditionInput
  ) {
    updatePurchaseCredits(input: $input, condition: $condition) {
      id
      cognito_user_name
      credits
      purchase_date
      expiration_date
      is_expired
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deletePurchaseCredits = /* GraphQL */ `
  mutation DeletePurchaseCredits(
    $input: DeletePurchaseCreditsInput!
    $condition: ModelPurchaseCreditsConditionInput
  ) {
    deletePurchaseCredits(input: $input, condition: $condition) {
      id
      cognito_user_name
      credits
      purchase_date
      expiration_date
      is_expired
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createUserCreditsLeft = /* GraphQL */ `
  mutation CreateUserCreditsLeft(
    $input: CreateUserCreditsLeftInput!
    $condition: ModelUserCreditsLeftConditionInput
  ) {
    createUserCreditsLeft(input: $input, condition: $condition) {
      id
      created_date_utc
      cognito_user_name
      credits_left
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateUserCreditsLeft = /* GraphQL */ `
  mutation UpdateUserCreditsLeft(
    $input: UpdateUserCreditsLeftInput!
    $condition: ModelUserCreditsLeftConditionInput
  ) {
    updateUserCreditsLeft(input: $input, condition: $condition) {
      id
      created_date_utc
      cognito_user_name
      credits_left
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteUserCreditsLeft = /* GraphQL */ `
  mutation DeleteUserCreditsLeft(
    $input: DeleteUserCreditsLeftInput!
    $condition: ModelUserCreditsLeftConditionInput
  ) {
    deleteUserCreditsLeft(input: $input, condition: $condition) {
      id
      created_date_utc
      cognito_user_name
      credits_left
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createSpeechItems = /* GraphQL */ `
  mutation CreateSpeechItems(
    $input: CreateSpeechItemsInput!
    $condition: ModelSpeechItemsConditionInput
  ) {
    createSpeechItems(input: $input, condition: $condition) {
      id
      s3_input_key
      cognito_user_name
      character_count
      created_date_utc
      is_processed
      voice
      language
      prediction_type
      s3_output_key
      failed_reason
      name
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateSpeechItems = /* GraphQL */ `
  mutation UpdateSpeechItems(
    $input: UpdateSpeechItemsInput!
    $condition: ModelSpeechItemsConditionInput
  ) {
    updateSpeechItems(input: $input, condition: $condition) {
      id
      s3_input_key
      cognito_user_name
      character_count
      created_date_utc
      is_processed
      voice
      language
      prediction_type
      s3_output_key
      failed_reason
      name
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteSpeechItems = /* GraphQL */ `
  mutation DeleteSpeechItems(
    $input: DeleteSpeechItemsInput!
    $condition: ModelSpeechItemsConditionInput
  ) {
    deleteSpeechItems(input: $input, condition: $condition) {
      id
      s3_input_key
      cognito_user_name
      character_count
      created_date_utc
      is_processed
      voice
      language
      prediction_type
      s3_output_key
      failed_reason
      name
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createUsers = /* GraphQL */ `
  mutation CreateUsers(
    $input: CreateUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    createUsers(input: $input, condition: $condition) {
      id
      email
      name
      cognito_user_name
      image_url
      created_date_utc
      monthly_limit
      additional_credits
      credit_reset_days
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateUsers = /* GraphQL */ `
  mutation UpdateUsers(
    $input: UpdateUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    updateUsers(input: $input, condition: $condition) {
      id
      email
      name
      cognito_user_name
      image_url
      created_date_utc
      monthly_limit
      additional_credits
      credit_reset_days
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteUsers = /* GraphQL */ `
  mutation DeleteUsers(
    $input: DeleteUsersInput!
    $condition: ModelUsersConditionInput
  ) {
    deleteUsers(input: $input, condition: $condition) {
      id
      email
      name
      cognito_user_name
      image_url
      created_date_utc
      monthly_limit
      additional_credits
      credit_reset_days
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
