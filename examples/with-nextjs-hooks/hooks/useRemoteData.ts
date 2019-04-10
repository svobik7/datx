import { IIdentifier, IModelConstructor } from 'datx';
import { IJsonapiModel } from 'datx-jsonapi';
import { RemoteModel } from 'models/RemoteModel';
import { Context, useContext, useEffect, useState } from 'react';
import {
  IStoreRemoteDataCollection,
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
const useRemoteData = (
  context: Context<IStoreRemoteDataCollection>,
  modelType: IModelConstructor<RemoteModel>,
  options: RemoteDataOptions
): StoreRemoteDataView => {
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

  //
  useEffect(() => {
    console.log(store.__viewList);
    return () => {
      // view.destroy()
      // TODO: when component is unmounted the view is no longer in need - should be removed from collection
    };
  }, []);
  // return view
  return view;
};

export { useRemoteData };
