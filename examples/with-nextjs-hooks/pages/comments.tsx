import { RemoteData } from 'containers/RemoteData/RemoteData';
import { mapItems } from 'datx-utils';
import { isFailed, isFetching, isIdle, isSucceed } from 'hooks/useRemoteFetch';
import { CommentModel } from 'models/remote/CommentModel';
import React, { Component, Fragment, ReactElement } from 'react';
import { RemoteDataContext } from 'stores/storeRemoteData';

import Layout from '../components/Layout/Layout';

class CommentsPage extends Component {
  render() {
    return (
      <Layout>
        <h1>COMMENTS</h1>
        <hr />
        <div>
          <RemoteData
            context={RemoteDataContext}
            modelType={CommentModel}
            fetchOptions={{
              fetchOnMount: false,
              infinite: false,
              pageSize: 2,
              request: {
                filter: {
                  related_id: '12402',
                  related_type: 'poc_helps'
                }
              }
            }}
            render={(data, { fetcher, fetcherStatus }) => {
              return (
                <Fragment>
                  <div>FETCHER: {fetcherStatus}</div>
                  <div>
                    DATA: {data.length} OF {fetcher.countTotal}
                  </div>
                  <div>
                    PAGE: {fetcher.page} OF {fetcher.countPages}
                  </div>
                  <table>
                    <tbody>
                      {mapItems<CommentModel, ReactElement>(
                        data.list,
                        model => (
                          <tr key={model.meta.id}>
                            <td>{model.meta.id}</td>
                            <td>{model.toString()}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                    <tfoot>
                      {isIdle(fetcherStatus) && (
                        <tr>
                          <td colSpan={2}>
                            <button onClick={() => fetcher.fetch(1)}>
                              FETCH
                            </button>
                          </td>
                        </tr>
                      )}
                      {isFetching(fetcherStatus) && (
                        <tr>
                          <td colSpan={2}>LOADING ...</td>
                        </tr>
                      )}

                      {isFailed(fetcherStatus) && (
                        <tr>
                          <td colSpan={2}>
                            <p>Something went wrong.</p>
                            <button onClick={() => fetcher.fetchAgain()}>
                              TRY AGAIN
                            </button>
                          </td>
                        </tr>
                      )}

                      {isSucceed(fetcherStatus) && fetcher.hasPrev() && (
                        <tr>
                          <td colSpan={2}>
                            <button onClick={() => fetcher.fetchPrev()}>
                              PREV
                            </button>
                          </td>
                        </tr>
                      )}

                      {isSucceed(fetcherStatus) && fetcher.hasNext() && (
                        <tr>
                          <td colSpan={2}>
                            <button onClick={() => fetcher.fetchNext()}>
                              NEXT
                            </button>
                          </td>
                        </tr>
                      )}

                      {isSucceed(fetcherStatus) && !fetcher.hasNext() && (
                        <tr>
                          <td colSpan={2}>That's all folks</td>
                        </tr>
                      )}
                    </tfoot>
                  </table>
                </Fragment>
              );
            }}
          />
        </div>
      </Layout>
    );
  }
}

export default CommentsPage;
