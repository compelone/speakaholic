import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerSpeechItems = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SpeechItems, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly key: string;
  readonly cognito_user_name: string;
  readonly character_count: number;
  readonly created_date_utc: string;
  readonly is_processed?: boolean | null;
  readonly voice: string;
  readonly language: string;
  readonly prediction_type: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazySpeechItems = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SpeechItems, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly key: string;
  readonly cognito_user_name: string;
  readonly character_count: number;
  readonly created_date_utc: string;
  readonly is_processed?: boolean | null;
  readonly voice: string;
  readonly language: string;
  readonly prediction_type: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type SpeechItems = LazyLoading extends LazyLoadingDisabled ? EagerSpeechItems : LazySpeechItems

export declare const SpeechItems: (new (init: ModelInit<SpeechItems>) => SpeechItems) & {
  copyOf(source: SpeechItems, mutator: (draft: MutableModel<SpeechItems>) => MutableModel<SpeechItems> | void): SpeechItems;
}

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
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Users = LazyLoading extends LazyLoadingDisabled ? EagerUsers : LazyUsers

export declare const Users: (new (init: ModelInit<Users>) => Users) & {
  copyOf(source: Users, mutator: (draft: MutableModel<Users>) => MutableModel<Users> | void): Users;
}