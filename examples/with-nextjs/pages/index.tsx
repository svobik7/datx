import { NewsPreview } from 'components/Previews/NewsPreview';
import { RemoteData } from 'containers/RemoteData';
import { NewsModel } from 'models/remote/NewsModel';
import React from 'react';

import Layout from '../components/Layout/Layout';

class IndexData extends RemoteData<NewsModel> {}

const IndexPage: React.FunctionComponent = () => {
  // const [data, doFetch] = useRemoteData(ArticleModel, STORE_REMOTE_DATA_ID);

  return (
    <Layout>
      <h1>HOME NEWS</h1>
      <hr />
      <div>
        <IndexData
          modelType={NewsModel}
          render={api => {
            return (
              <ul>
                {api.data.map(model => (
                  <li key={model.meta.id}>
                    <NewsPreview
                      id={model.meta.id}
                      position={model.position}
                      // language
                      title={model.title}
                      perex={model.perex}
                      // behaviors
                      onUpdate={() => (model.title = `NEW TITLE ${Date.now()}`)}
                      onRemove={() => api.onRemove(model)}
                    />
                    <hr />
                  </li>
                ))}
              </ul>
            );
          }}
        />
      </div>
    </Layout>
  );
};

export default IndexPage;
