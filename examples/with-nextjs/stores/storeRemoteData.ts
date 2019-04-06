import { Collection, View } from 'datx';
import { IJsonapiCollection, IJsonapiView, jsonapi } from 'datx-jsonapi';
import _ from 'lodash';
import { ArticleLanguageModel } from 'models/remote/ArticleLanguageModel';
import { ArticleModel } from 'models/remote/ArticleModel';
import { NewsModel } from 'models/remote/NewsModel';
import { ServiceLanguageModel } from 'models/remote/ServiceLanguageModel';
import { ServiceModel } from 'models/remote/ServiceModel';

// export ID of store remote data
export const STORE_REMOTE_DATA_ID = 'storeRemoteData';

// defines remote data view type
export type IStoreRemoteDataView<T> = View<T> & IJsonapiView;

// defines remote data view config
export class StoreRemoteDataView extends jsonapi(View) {}

// defines remote collection type
export type IStoreRemoteDataCollection = Collection & IJsonapiCollection;

// defines remote collection config
class StoreRemoteDataCollection extends jsonapi(Collection) {
  static types = [
    NewsModel,
    ArticleModel,
    ArticleLanguageModel,
    ServiceModel,
    ServiceLanguageModel
  ];
}

// creates remote collection
const storeRemoteData = new StoreRemoteDataCollection();

// bind remote collection to window - hide this in production
if (typeof window === 'object') {
  _.set(window, STORE_REMOTE_DATA_ID, storeRemoteData);
}

// make remote collection available 'globally'
export default storeRemoteData;
