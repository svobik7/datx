import { ArticlePreview } from 'components/Previews/ArticlePreview';
import { RemoteData } from 'containers/RemoteData';
import { ArticleModel } from 'models/remote/ArticleModel';
import React from 'react';

import Layout from '../components/Layout/Layout';

class ArticlesData extends RemoteData<ArticleModel> {}

const ArticlesPage: React.FunctionComponent = () => {
  // const [data, doFetch] = useRemoteData(ArticleModel, STORE_REMOTE_DATA_ID);

  return (
    <Layout>
      <h1>ARTICLES</h1>
      <hr />
      <div>
        <ArticlesData
          modelType={ArticleModel}
          render={api => {
            return (
              <ul>
                {api.data.map(model => (
                  <li key={model.meta.id}>
                    <ArticlePreview
                      id={model.meta.id}
                      // language
                      title={model.title}
                      perex={model.perex}
                      content={model.content}
                      // attributes
                      duration={model.duration}
                      dateOfPublish={model.published_at}
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

export default ArticlesPage;
