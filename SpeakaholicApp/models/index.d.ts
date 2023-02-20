import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerUsers = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Users, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly cognito_user_name: string;
  readonly image_url?: string | null;
  readonly created_date_utc: string;
  readonly monthly_limit: number;
  readonly additional_credits: number;
  readonly credit_reset_days: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUsers = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Users, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly cognito_user_name: string;
  readonly image_url?: string | null;
  readonly created_date_utc: string;
  readonly monthly_limit: number;
  readonly additional_credits: number;
  readonly credit_reset_days: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Users = LazyLoading extends LazyLoadingDisabled ? EagerUsers : LazyUsers

export declare const Users: (new (init: ModelInit<Users>) => Users) & {
  copyOf(source: Users, mutator: (draft: MutableModel<Users>) => MutableModel<Users> | void): Users;
}

type EagerSpeechItems = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SpeechItems, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly s3_input_key: string;
  readonly cognito_user_name: string;
  readonly character_count: number;
  readonly created_date_utc: string;
  readonly is_processed?: boolean | null;
  readonly voice: string;
  readonly language: string;
  readonly prediction_type: string;
  readonly s3_output_key?: string | null;
  readonly failed_reason?: string | null;
  readonly name: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazySpeechItems = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SpeechItems, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly s3_input_key: string;
  readonly cognito_user_name: string;
  readonly character_count: number;
  readonly created_date_utc: string;
  readonly is_processed?: boolean | null;
  readonly voice: string;
  readonly language: string;
  readonly prediction_type: string;
  readonly s3_output_key?: string | null;
  readonly failed_reason?: string | null;
  readonly name: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type SpeechItems = LazyLoading extends LazyLoadingDisabled ? EagerSpeechItems : LazySpeechItems

export declare const SpeechItems: (new (init: ModelInit<SpeechItems>) => SpeechItems) & {
  copyOf(source: SpeechItems, mutator: (draft: MutableModel<SpeechItems>) => MutableModel<SpeechItems> | void): SpeechItems;
}

type EagerUserCreditsLeft = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserCreditsLeft, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly created_date_utc: string;
  readonly cognito_user_name: string;
  readonly credits_left: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUserCreditsLeft = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<UserCreditsLeft, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly created_date_utc: string;
  readonly cognito_user_name: string;
  readonly credits_left: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UserCreditsLeft = LazyLoading extends LazyLoadingDisabled ? EagerUserCreditsLeft : LazyUserCreditsLeft

export declare const UserCreditsLeft: (new (init: ModelInit<UserCreditsLeft>) => UserCreditsLeft) & {
  copyOf(source: UserCreditsLeft, mutator: (draft: MutableModel<UserCreditsLeft>) => MutableModel<UserCreditsLeft> | void): UserCreditsLeft;
}

type EagerPurchaseCredits = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PurchaseCredits, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly cognito_user_name: string;
  readonly credits: string;
  readonly purchase_date: string;
  readonly expiration_date: string;
  readonly is_expired: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPurchaseCredits = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PurchaseCredits, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly cognito_user_name: string;
  readonly credits: string;
  readonly purchase_date: string;
  readonly expiration_date: string;
  readonly is_expired: boolean;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PurchaseCredits = LazyLoading extends LazyLoadingDisabled ? EagerPurchaseCredits : LazyPurchaseCredits

export declare const PurchaseCredits: (new (init: ModelInit<PurchaseCredits>) => PurchaseCredits) & {
  copyOf(source: PurchaseCredits, mutator: (draft: MutableModel<PurchaseCredits>) => MutableModel<PurchaseCredits> | void): PurchaseCredits;
}