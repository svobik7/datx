import { IJsonapiModel, Response } from 'datx-jsonapi';
import { IDictionary } from 'datx-utils';
import _ from 'lodash';
import { RemoteModel } from 'models/RemoteModel';
import { useEffect, useReducer } from 'react';
import { StoreRemoteDataView } from 'stores/storeRemoteData';

/**
 * Defines remote request params names
 */
export enum RemoteRequestParams {}

/**
 * Defines remote response params names
 */
export enum RemoteResponseParams {}

/**
 * Defines persistor api
 */
export type RemotePersistApi = {
  // behaviors
  persist: (model: RemoteModel, data?: IDictionary<any>) => void;
  destroy: (model: RemoteModel) => void;
};

/**
 * Defines persistor behavioral options
 * which can be passed down by parent component
 */
export type RemotePersistOptions = {};

/**
 * Defines persistor local state
 * - state is dynamically mutated based on client interactions and remote api responses
 */
export type RemotePersistState = {
  status: RemotePersistRequestStatus;
  // options
  options: RemotePersistOptions;
  // response cache
  lastResponse?: Response<IJsonapiModel>;
};

/**
 * Defines persistor local state reducer
 * - reducer mutates state after receives some action
 * @see https://reactjs.org/docs/hooks-reference.html#usereducer
 */
export type RemotePersistStateReducer = (
  state: RemotePersistState,
  action: RemotePersistAction
) => RemotePersistState;

/**
 * Defines persistor state reducer action in flux format
 * @see https://github.com/redux-utilities/flux-standard-action
 */
export type RemotePersistAction = {
  type: RemotePersistActionType;
  payload: RemotePersistActionPayload;
};

/**
 * Defines all possible persistor state actions
 * which will be reduced by state reducer
 */
export enum RemotePersistActionType {
  PERSIST_BEGIN = 'PERSIST_BEGIN',
  PERSIST_END = 'PERSIST_END'
}

/**
 * Defines shape of persistor action payload
 */
export type RemotePersistActionPayload = {
  status?: RemotePersistRequestStatus;
  response?: RemotePersistResponse;
};

/**
 * Defines all possible persist request statuses
 * which can describe 'persist result'
 */
export enum RemotePersistRequestStatus {
  Idle = 'IDLE',
  Persisting = 'PERSISTING',
  Succeed = 'SUCCEED',
  Failed = 'FAILED'
}

/**
 * Defines persistor response object received from server and parsed by DatX lib
 */
export type RemotePersistResponse = Response<IJsonapiModel>;

/**
 * Defines initial persistor options
 * - can be overwrite by explicit options passed down by parent
 */
const initialOptions: RemotePersistOptions = {};

/**
 * Defines initial persistor state
 */
const initialState: RemotePersistState = {
  status: RemotePersistRequestStatus.Idle,
  // options
  options: {
    ...initialOptions
  }
};

/**
 * Defines how all persistor actions will be handled and
 * how the state will be mutated
 * @param state
 * @param action
 */
const stateReducer: RemotePersistStateReducer = (state, action) => {
  // load action type and payload
  const {
    type,
    payload: { response, status = RemotePersistRequestStatus.Idle }
  } = action;

  // prevent any state mutation when type or page is missing
  if (!type) return state;

  // reduce FETCH BEGIN actions
  if (type === RemotePersistActionType.PERSIST_BEGIN) {
    return {
      ...state,
      status
    };
  }

  // reduce FETCH END actions
  if (type === RemotePersistActionType.PERSIST_END) {
    return {
      ...state,
      status,
      // response cache
      lastResponse: response
    };
  }

  // return not mutated state
  return state;
};

/**
 * USE REMOTE FETCHER
 * - handles remote persist requests
 * - can be finite = data from current page are retrieved
 * - can be infinite = data from all pages are retrieved
 * - pageSize is always set
 * @param context
 * @param modelType
 * @param options
 */
const useRemotePersist = (
  view: StoreRemoteDataView,
  options: Partial<RemotePersistOptions> = {}
): [RemotePersistRequestStatus, RemotePersistApi] => {
  // use state reducer and action dispatcher
  const [state, dispatch] = useReducer(stateReducer, {
    ...initialState,
    options: {
      ...initialState.options,
      ...options
    }
  });

  // change current page
  // const persist = (model: RemoteModel, data?: IDictionary<any>) => {
  //   // update model with given data
  //   data && model.update(data);
  //   //
  //   const isValid = await model.validate();

  //   if (!isValid) {
  //     return;
  //   }

  //   dispatch({
  //     type: RemoteFetchActionType.FETCH_BEGIN,
  //     payload: {
  //       page: page || 1,
  //       status: RemoteFetchRequestStatus.Fetching
  //     }
  //   });
  // };

  // create success callback
  const onSuccess = (model: RemoteModel, response: IJsonapiModel) => {
    dispatch({
      type: RemotePersistActionType.PERSIST_END,
      payload: {
        // response,
        status: RemotePersistRequestStatus.Succeed
      }
    });
  };

  // create fail callback
  const onFail = (model: RemoteModel, reason: any) => {
    dispatch({
      type: RemotePersistActionType.PERSIST_END,
      payload: {
        // response,
        status: RemotePersistRequestStatus.Failed
      }
    });
  };

  // create fail callback
  const onReject = (reason: any) => {
    dispatch({
      type: RemotePersistActionType.PERSIST_END,
      payload: {
        status: RemotePersistRequestStatus.Failed
      }
    });
  };

  const doPersist = async (model: RemoteModel, data?: IDictionary<any>) => {
    // update model with given data
    data && model.update(data);
    //
    const isValid = await model.validate();

    debugger;
    console.log('IS VALID', isValid);
    if (!isValid) {
      return;
    }

    model
      .save()
      .then(
        response => onSuccess(model, response),
        reason => onFail(model, reason)
      )
      .catch(onReject);
  };

  const doDestroy = (model: RemoteModel) => {};

  // build persist api
  const persistor: RemotePersistApi = {
    // behaviors
    persist: doPersist,
    destroy: doDestroy
  };

  // expose status and persistor api
  return [state.status, persistor];
};

// exports
export { useRemotePersist };

// persistor status helper methods
export const isIdle = (status: RemotePersistRequestStatus) =>
  status === RemotePersistRequestStatus.Idle;
export const isPersisting = (status: RemotePersistRequestStatus) =>
  status === RemotePersistRequestStatus.Persisting;
export const isSucceed = (status: RemotePersistRequestStatus) =>
  status === RemotePersistRequestStatus.Succeed;
export const isFailed = (status: RemotePersistRequestStatus) =>
  status === RemotePersistRequestStatus.Failed;
