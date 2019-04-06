import 'configs/api';

import { inject, observer } from 'mobx-react';
import { IRemoteModelConstructor } from 'models/RemoteModel';
import React, { ReactElement } from 'react';
import {
  IStoreRemoteDataCollection,
  IStoreRemoteDataView,
  STORE_REMOTE_DATA_ID,
  StoreRemoteDataView
} from 'stores/storeRemoteData';

// defines remote data container props
type RemoteDataProps<T> = {
  modelType: IRemoteModelConstructor<T>;
  // behaviors
  render: (props: RemoteDataRenderProps<T>) => ReactElement;
};

// defines remote data container injected props (by decorators)
type RemoteDataInjectedProps = {
  storeRemoteData: IStoreRemoteDataCollection;
};

// defines remote data container render props (passed to children)
type RemoteDataRenderProps<T> = {
  data: Array<T>;
  // behaviors
  onRemove: (model: T) => void;
};

// REMOTE DATA - Remote Data & Store collection handler
// - invokes remote requests
// - can handle request response
@observer
class RemoteData<T> extends React.Component<
  RemoteDataProps<T> & RemoteDataInjectedProps
> {
  // collection view (list) holder
  private view: IStoreRemoteDataView<T>;

  // constructor
  constructor(props: RemoteDataProps<T> & RemoteDataInjectedProps) {
    super(props);

    // create view
    this.view = new StoreRemoteDataView(
      props.modelType,
      props.storeRemoteData,
      'position',
      [],
      true
    );
  }

  // invokes remote data fetch
  componentDidMount() {
    this.fetch();
  }

  // process remote data fetch
  fetch = () => {
    this.view.fetchAll();
  };

  // removes model from collection
  remove = (model: T) => {
    this.view.remove(model);
  };

  // build proper render props
  buildRenderProps(): RemoteDataRenderProps<T> {
    return {
      data: this.view.list,
      // behaviors
      onRemove: this.remove
    };
  }

  // render children
  render() {
    const renderProps = this.buildRenderProps();
    return this.props.render(renderProps);
  }
}

const injectStore = inject(STORE_REMOTE_DATA_ID);
const Component = injectStore(RemoteData);

export { Component as RemoteData };
