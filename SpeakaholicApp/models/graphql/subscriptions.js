/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePurchaseCredits = /* GraphQL */ `
  subscription OnCreatePurchaseCredits(
    $filter: ModelSubscriptionPurchaseCreditsFilterInput
  ) {
    onCreatePurchaseCredits(filter: $filter) {
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
export const onUpdatePurchaseCredits = /* GraphQL */ `
  subscription OnUpdatePurchaseCredits(
    $filter: ModelSubscriptionPurchaseCreditsFilterInput
  ) {
    onUpdatePurchaseCredits(filter: $filter) {
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
export const onDeletePurchaseCredits = /* GraphQL */ `
  subscription OnDeletePurchaseCredits(
    $filter: ModelSubscriptionPurchaseCreditsFilterInput
  ) {
    onDeletePurchaseCredits(filter: $filter) {
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
export const onCreateUserCreditsLeft = /* GraphQL */ `
  subscription OnCreateUserCreditsLeft(
    $filter: ModelSubscriptionUserCreditsLeftFilterInput
  ) {
    onCreateUserCreditsLeft(filter: $filter) {
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
export const onUpdateUserCreditsLeft = /* GraphQL */ `
  subscription OnUpdateUserCreditsLeft(
    $filter: ModelSubscriptionUserCreditsLeftFilterInput
  ) {
    onUpdateUserCreditsLeft(filter: $filter) {
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
export const onDeleteUserCreditsLeft = /* GraphQL */ `
  subscription OnDeleteUserCreditsLeft(
    $filter: ModelSubscriptionUserCreditsLeftFilterInput
  ) {
    onDeleteUserCreditsLeft(filter: $filter) {
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
export const onCreateSpeechItems = /* GraphQL */ `
  subscription OnCreateSpeechItems(
    $filter: ModelSubscriptionSpeechItemsFilterInput
  ) {
    onCreateSpeechItems(filter: $filter) {
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
export const onUpdateSpeechItems = /* GraphQL */ `
  subscription OnUpdateSpeechItems(
    $filter: ModelSubscriptionSpeechItemsFilterInput
  ) {
    onUpdateSpeechItems(filter: $filter) {
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
export const onDeleteSpeechItems = /* GraphQL */ `
  subscription OnDeleteSpeechItems(
    $filter: ModelSubscriptionSpeechItemsFilterInput
  ) {
    onDeleteSpeechItems(filter: $filter) {
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
export const onCreateUsers = /* GraphQL */ `
  subscription OnCreateUsers($filter: ModelSubscriptionUsersFilterInput) {
    onCreateUsers(filter: $filter) {
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
export const onUpdateUsers = /* GraphQL */ `
  subscription OnUpdateUsers($filter: ModelSubscriptionUsersFilterInput) {
    onUpdateUsers(filter: $filter) {
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
export const onDeleteUsers = /* GraphQL */ `
  subscription OnDeleteUsers($filter: ModelSubscriptionUsersFilterInput) {
    onDeleteUsers(filter: $filter) {
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
