import { IIdentifier, IModelConstructor } from 'datx';
import { IJsonapiModel } from 'datx-jsonapi';
import { RemoteModel } from 'models/RemoteModel';
import { Context, useContext, useEffect, useState } from 'react';
import {
  IStoreRemoteDataCollection,
  IStoreRemoteDataView,
  StoreRemoteDataView
} from 'stores/storeRemoteData';

/**
 * Remote data options
 */
export type RemoteDataOptions = {
  sortBy?: string | ((item: IJsonapiModel) => any);
  models?: Array<IIdentifier | IJsonapiModel>;
  unique: boolean;
};

/**
 * USE REMOTE DATA
 * - creates remote data view bound with store collection
 * - caches remote data view
 */
const useRemoteData = <T extends RemoteModel>(
  context: Context<IStoreRemoteDataCollection>,
  modelType: IModelConstructor<T>,
  options: RemoteDataOptions
): IStoreRemoteDataView<T> => {
  // use context store
  const store = useContext(context);
  // create store view
  const [view, setView] = useState(
    () =>
      new StoreRemoteDataView(
        modelType,
        store,
        options.sortBy,
        options.models,
        options.unique
      )
  );

  // return view
  return view;
};

export { useRemoteData };
