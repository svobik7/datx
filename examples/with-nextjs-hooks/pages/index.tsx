import { RemoteData } from 'containers/RemoteData/RemoteData';
import { mapItems } from 'datx-utils';
import { isFailed, isFetching, isIdle, isSucceed } from 'hooks/useRemoteFetch';
import { NewsModel } from 'models/remote/NewsModel';
import React, { Component, ReactElement } from 'react';
import { RemoteDataContext } from 'stores/storeRemoteData';

import Layout from '../components/Layout/Layout';

/**
 * Defines next.js page class
 */
class IndexPage extends Component {
  // renders page content
  render() {
    // render content with layout
    return (
      <Layout>
        <h1>INDEX NEWS</h1>
        <hr />
        <RemoteData
          context={RemoteDataContext}
          modelType={NewsModel}
          fetchOptions={{
            pageSize: 4
          }}
          render={(data, { fetcher, fetcherStatus }) => {
            // render
            return (
              <table>
                <thead>
                  <tr>
                    <th>STATUS</th>
                    <th>
                      <strong>{fetcherStatus}</strong>
                    </th>
                  </tr>
                  <tr>
                    <th>SHOWING</th>
                    <th>
                      {data.length} OF {fetcher.countTotal}
                    </th>
                  </tr>
                  <tr>
                    <th>PAGE</th>
                    <th>
                      {fetcher.page} OF {fetcher.countPages}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mapItems<NewsModel, ReactElement>(data.list, model => (
                    <tr key={model.meta.id}>
                      <td>{model.meta.id}</td>
                      <td>{model.toString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  {isIdle(fetcherStatus) && (
                    <tr>
                      <td colSpan={2}>
                        <button onClick={() => fetcher.fetch()}>FETCH</button>
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
                        <button onClick={() => fetcher.fetch()}>
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
            );
          }}
        />
      </Layout>
    );
  }
}

// exports
export default IndexPage;
