import 'configs/api';

import { Collection, IModelConstructor, IType, View } from 'datx';
import {
  IJsonapiCollection,
  IJsonapiModel,
  IJsonapiView,
  IRequestOptions,
  jsonapi
} from 'datx-jsonapi';
import _ from 'lodash';
import { ArticleLanguageModel } from 'models/remote/ArticleLanguageModel';
import { ArticleModel } from 'models/remote/ArticleModel';
import { NewsModel } from 'models/remote/NewsModel';
import { ServiceLanguageModel } from 'models/remote/ServiceLanguageModel';
import { ServiceModel } from 'models/remote/ServiceModel';
import { createContext } from 'react';
import { CommentModel } from 'models/remote/CommentModel';

// export ID of store remote data
export const STORE_REMOTE_DATA_ID = 'storeRemoteData';

/**
 * Defines Remote Data View interface following DatX rules
 * @see https://github.com/infinum/datx/wiki/View
 */
export type IStoreRemoteDataView = View & IJsonapiView;

/**
 * Defines Remote Data View base class
 * @see https://github.com/infinum/datx/wiki/Basic-configuration
 */
export class StoreRemoteDataView extends jsonapi(View) {}

/**
 * Defines Remote Data Collection interface following DatX rules
 * @see https://github.com/infinum/datx/wiki/JSONAPI-Collection
 */
export type IStoreRemoteDataCollection = Collection & IJsonapiCollection;

/**
 * Defines Remote Data Collection base class
 * @see https://github.com/infinum/datx/wiki/Basic-configuration
 */
class StoreRemoteDataCollection extends jsonapi(Collection)
  implements IStoreRemoteDataCollection {
  static types = [
    NewsModel,
    CommentModel,
    ArticleModel,
    ArticleLanguageModel,
    ServiceModel,
    ServiceLanguageModel
  ];
}

// creates remote collection
export const storeRemoteData = new StoreRemoteDataCollection();

// creates store context
export const RemoteDataContext = createContext(storeRemoteData);

// bind remote collection to window - hide this in production
if (typeof window === 'object') {
  _.set(window, STORE_REMOTE_DATA_ID, storeRemoteData);
}
