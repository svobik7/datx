import { IModelConstructor, View } from 'datx';
import { IJsonapiView } from 'datx-jsonapi';
import { RemoteDataOptions, useRemoteData } from 'hooks/useRemoteData';
import {
  RemoteFetchApi,
  RemoteFetchOptions,
  RemoteFetchRequestStatus,
  useRemoteFetch
} from 'hooks/useRemoteFetch';
import { Observer } from 'mobx-react';
import { RemoteModel } from 'models/RemoteModel';
import { Context, ReactElement } from 'react';
import { IStoreRemoteDataCollection } from 'stores/storeRemoteData';

export type RemoteDataProps<T extends RemoteModel> = {
  // data
  context: Context<IStoreRemoteDataCollection>;
  modelType: IModelConstructor<T>;
  // options
  dataOptions?: Partial<RemoteDataOptions>;
  fetchOptions?: Partial<RemoteFetchOptions>;
  persistOptions?: {};
  // layout
  render: (view: View<T> & IJsonapiView, api: RemoteDataApi) => ReactElement;
};

export type RemoteDataApi = {
  fetcher: RemoteFetchApi;
  fetcherStatus: RemoteFetchRequestStatus;
  // TODO: add persistor api to RemoteData bucket
  // persistor: RemotePersistApi;
  // persistorStatus: RemotePersistRequestStatus;
};

const RemoteData = <T extends RemoteModel>(props: RemoteDataProps<T>) => {
  const { dataOptions = {}, fetchOptions = {}, persistOptions = {} } = props;
  // use remote data view
  const view = useRemoteData(props.context, props.modelType, {
    unique: true,
    ...dataOptions
  });
  // use remote fetcher with pagination
  const [fetcherStatus, fetcher] = useRemoteFetch(view, fetchOptions);
  // use remote persistor with create, update, delete
  // const [persistorStatus, persistor] = useRemotePersist(view, persistOptions);
  // render observable content
  return (
    <Observer
      render={() =>
        props.render(view, {
          fetcher,
          fetcherStatus
          // persistor,
          // persistorStatus
        })
      }
    />
  );
};

export { RemoteData };
