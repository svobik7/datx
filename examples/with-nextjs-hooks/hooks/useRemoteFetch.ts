import { IJsonapiModel, IRequestOptions, Response } from 'datx-jsonapi';
import _ from 'lodash';
import { useEffect, useReducer } from 'react';
import { StoreRemoteDataView } from 'stores/storeRemoteData';

/**
 * Defines remote request params names
 */
export enum RemoteRequestParams {
  Page = 'page',
  PageSize = 'per-page'
}

/**
 * Defines remote response params names
 */
export enum RemoteResponseParams {
  CountTotal = 'total_count',
  CountPages = 'page_count'
}

/**
 * Defines fetcher api
 */
export type RemoteFetchApi = {
  page: number;
  // counts
  countTotal: number;
  countPages: number;
  // behaviors
  fetch: (page: number) => void;
  fetchNext: () => void;
  fetchPrev: () => void;
  fetchAgain: () => void;
  // indicators
  hasNext: () => boolean;
  hasPrev: () => boolean;
};

/**
 * Defines fetcher behavioral options
 * which can be passed down by parent component
 */
export type RemoteFetchOptions = {
  fetchOnMount: boolean;
  infinite: boolean;
  pageSize: number;
  request: IRequestOptions;
};

/**
 * Defines fetcher single page data structure
 */
export type RemoteFetchPage = {
  status: RemoteFetchRequestStatus;
  updatedAt: number;
  attempts: number;
};

/**
 * Defines fetcher response meta data
 * which can be passed down by parent component
 */
export type RemoteFetchResponseMeta = {
  totalCount: number;
  pageCount: number;
};

/**
 * Defines fetcher local state
 * - state is dynamically mutated based on client interactions and remote api responses
 */
export type RemoteFetchState = {
  currentPage: number;
  // counts
  countTotal: number;
  countPages: number;
  // options
  options: RemoteFetchOptions;
  // pagination
  pagination: Record<number, RemoteFetchPage>;
  // response cache
  lastResponse?: Response<IJsonapiModel>;
};

/**
 * Defines fetcher local state reducer
 * - reducer mutates state after receives some action
 * @see https://reactjs.org/docs/hooks-reference.html#usereducer
 */
export type RemoteFetchStateReducer = (
  state: RemoteFetchState,
  action: RemoteFetchAction
) => RemoteFetchState;

/**
 * Defines fetcher state reducer action in flux format
 * @see https://github.com/redux-utilities/flux-standard-action
 */
export type RemoteFetchAction = {
  type: RemoteFetchActionType;
  payload: RemoteFetchActionPayload;
};

/**
 * Defines all possible fetcher state actions
 * which will be reduced by state reducer
 */
export enum RemoteFetchActionType {
  FETCH_BEGIN = 'FETCH_BEGIN',
  FETCH_END = 'FETCH_END'
}

/**
 * Defines shape of fetcher action payload
 */
export type RemoteFetchActionPayload = {
  page: number;
  status?: RemoteFetchRequestStatus;
  response?: RemoteFetchResponse;
};

/**
 * Defines all possible fetch request statuses
 * which can describe 'fetch result'
 */
export enum RemoteFetchRequestStatus {
  Idle = 'IDLE',
  Fetching = 'FETCHING',
  Succeed = 'SUCCEED',
  Failed = 'FAILED'
}

/**
 * Defines fetcher response object received from server and parsed by DatX lib
 */
export type RemoteFetchResponse = Response<IJsonapiModel>;

/**
 * Defines initial fetcher options
 * - can be overwrite by explicit options passed down by parent
 */
const initialOptions: RemoteFetchOptions = {
  fetchOnMount: true,
  infinite: true,
  pageSize: 25,
  request: {}
};

/**
 * Defines initial fetcher state
 */
const initialState: RemoteFetchState = {
  currentPage: 0,
  // counts
  countPages: 0,
  countTotal: 0,
  // pagination
  pagination: {},
  // options
  options: {
    ...initialOptions
  }
};

/**
 * Defines how all fetcher actions will be handled and
 * how the state will be mutated
 * @param state
 * @param action
 */
const stateReducer: RemoteFetchStateReducer = (state, action) => {
  // load action type and payload
  const {
    type,
    payload: { page, response, status = RemoteFetchRequestStatus.Idle }
  } = action;

  // prevent any state mutation when type or page is missing
  if (!type || !page) return state;

  // reduce FETCH BEGIN actions
  if (type === RemoteFetchActionType.FETCH_BEGIN) {
    // load current page state data
    const pageData = state.pagination[page] || {};
    const fetchAttempts = pageData.attempts || 0;

    return {
      ...state,
      currentPage: page,
      // pagination
      pagination: {
        ...state.pagination,
        [page]: {
          ...pageData,
          updatedAt: Date.now(),
          status: RemoteFetchRequestStatus.Fetching,
          attempts: fetchAttempts + 1
        }
      }
    };
  }

  // reduce FETCH END actions
  if (type === RemoteFetchActionType.FETCH_END) {
    return {
      ...state,
      // counts
      countTotal: _.get(
        response,
        ['meta', RemoteResponseParams.CountTotal],
        state.countTotal
      ),
      countPages: _.get(
        response,
        ['meta', RemoteResponseParams.CountPages],
        state.countPages
      ),
      // pagination
      pagination: {
        ...state.pagination,
        [page]: {
          ...(state.pagination[page] || {}),
          updatedAt: Date.now(),
          status
        }
      },
      // response cache
      lastResponse: response
    };
  }

  // return not mutated state
  return state;
};

/**
 * USE REMOTE FETCHER
 * - handles remote fetch requests
 * - can be finite = data from current page are retrieved
 * - can be infinite = data from all pages are retrieved
 * - pageSize is always set
 * @param context
 * @param modelType
 * @param options
 */
const useRemoteFetch = (
  view: StoreRemoteDataView,
  options: Partial<RemoteFetchOptions> = {}
): [RemoteFetchRequestStatus, RemoteFetchApi] => {
  // use state reducer and action dispatcher
  const [state, dispatch] = useReducer(stateReducer, {
    ...initialState,
    options: {
      ...initialState.options,
      ...options
    }
  });

  // load current page data
  const pageData = state.pagination[state.currentPage];

  // invoke remote fetch whenever current page changed
  useEffect(() => {
    // - prevent any action when page is not greater then 0
    if (state.currentPage < 1) return;
    // - create request pagination params
    const paginationParams = createPagination(
      state.currentPage,
      state.options.pageSize
    );
    // - load explicit request params
    const explicitParams = _.get(state.options, ['request', 'params'], []);
    // - invoke api fetch
    view
      .fetchAll({
        ...state.options.request,
        params: [...paginationParams, ...explicitParams]
      })
      .then(
        response => onSuccess(state.currentPage, response),
        response => onFail(state.currentPage, response)
      );
  }, [state.currentPage, _.get(pageData, 'attempts', 0)]);

  // change current page to '1' onMount if is allowed
  useEffect(() => {
    state.options.fetchOnMount && fetchPage(1);
  }, []);

  // fetch page
  const fetchPage = (page: number, force: boolean = false) => {
    // prevent any action when force is false and current page equals given page
    if (force === false && page === state.currentPage) return null;
    // clear view when infinite is not used
    if (!state.options.infinite) {
      view.removeAll();
    }
    // dispatch new fetch action
    dispatch({
      type: RemoteFetchActionType.FETCH_BEGIN,
      payload: {
        page: page || 1,
        status: RemoteFetchRequestStatus.Fetching
      }
    });
  };

  // create success callback
  const onSuccess = (page: number, response: RemoteFetchResponse) => {
    dispatch({
      type: RemoteFetchActionType.FETCH_END,
      payload: {
        page,
        response,
        status: RemoteFetchRequestStatus.Succeed
      }
    });
  };

  // create fail callback
  const onFail = (page: number, response: RemoteFetchResponse) => {
    dispatch({
      type: RemoteFetchActionType.FETCH_END,
      payload: {
        page,
        response,
        status: RemoteFetchRequestStatus.Failed
      }
    });
  };

  // invokes fetching of next page
  const fetchNext = () => {
    hasNext() && fetchPage(state.currentPage + 1);
  };

  // invokes fetching of previous page
  const fetchPrev = () => {
    hasPrev() && fetchPage(state.currentPage - 1);
  };

  // invokes fetching of current page again
  const fetchAgain = () => {
    fetchPage(state.currentPage, true);
  };

  // indicates if there is next page ready to fetch or load from cache
  const hasNext = (): boolean => {
    return state.countPages > state.currentPage;
  };

  // indicates if there is prev pare ready to fetch or load from cache
  const hasPrev = (): boolean => {
    return state.currentPage > 1;
  };

  // build fetch api
  const fetcher: RemoteFetchApi = {
    page: state.currentPage,
    // counts
    countTotal: state.countTotal,
    countPages: state.countPages,
    // behaviors
    fetch: (page: number) => fetchPage(Number(page)),
    fetchNext,
    fetchPrev,
    fetchAgain,
    // indicators
    hasNext,
    hasPrev
  };

  // build fetch status
  const status = _.get(
    state.pagination,
    [state.currentPage, 'status'],
    RemoteFetchRequestStatus.Idle
  );

  // expose status and fetcher api
  return [status, fetcher];
};

// exports
export { useRemoteFetch };

/**
 * Create fetch request pagination params
 * @param page
 * @param size
 */
export const createPagination = (page: number, size: number) => [
  {
    key: RemoteRequestParams.Page,
    value: String(page || 1)
  },
  {
    key: RemoteRequestParams.PageSize,
    value: String(size)
  }
];

// fetcher status helper methods
export const isIdle = (status: RemoteFetchRequestStatus) =>
  status === RemoteFetchRequestStatus.Idle;
export const isFetching = (status: RemoteFetchRequestStatus) =>
  status === RemoteFetchRequestStatus.Fetching;
export const isSucceed = (status: RemoteFetchRequestStatus) =>
  status === RemoteFetchRequestStatus.Succeed;
export const isFailed = (status: RemoteFetchRequestStatus) =>
  status === RemoteFetchRequestStatus.Failed;
