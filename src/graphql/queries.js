/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPurchaseCredits = /* GraphQL */ `
  query GetPurchaseCredits($id: ID!) {
    getPurchaseCredits(id: $id) {
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
export const listPurchaseCredits = /* GraphQL */ `
  query ListPurchaseCredits(
    $filter: ModelPurchaseCreditsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPurchaseCredits(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncPurchaseCredits = /* GraphQL */ `
  query SyncPurchaseCredits(
    $filter: ModelPurchaseCreditsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncPurchaseCredits(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getUserCreditsLeft = /* GraphQL */ `
  query GetUserCreditsLeft($id: ID!) {
    getUserCreditsLeft(id: $id) {
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
export const listUserCreditsLefts = /* GraphQL */ `
  query ListUserCreditsLefts(
    $filter: ModelUserCreditsLeftFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserCreditsLefts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncUserCreditsLefts = /* GraphQL */ `
  query SyncUserCreditsLefts(
    $filter: ModelUserCreditsLeftFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUserCreditsLefts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getSpeechItems = /* GraphQL */ `
  query GetSpeechItems($id: ID!) {
    getSpeechItems(id: $id) {
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
export const listSpeechItems = /* GraphQL */ `
  query ListSpeechItems(
    $filter: ModelSpeechItemsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSpeechItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncSpeechItems = /* GraphQL */ `
  query SyncSpeechItems(
    $filter: ModelSpeechItemsFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncSpeechItems(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const getUsers = /* GraphQL */ `
  query GetUsers($id: ID!) {
    getUsers(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUsersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUsersFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
