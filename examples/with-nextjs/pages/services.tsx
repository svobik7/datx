import { ServicePreview } from 'components/Previews/ServicePreview';
import { RemoteData } from 'containers/RemoteData';
import { ServiceModel } from 'models/remote/ServiceModel';
import React from 'react';

import Layout from '../components/Layout/Layout';

class ServicesData extends RemoteData<ServiceModel> {}

const ServicesPage: React.FunctionComponent = () => {
  // const [data, doFetch] = useRemoteData(ServiceModel, STORE_REMOTE_DATA_ID);

  return (
    <Layout>
      <h1>SERVICES</h1>
      <hr />
      <div>
        <ServicesData
          modelType={ServiceModel}
          render={api => {
            return (
              <ul>
                {api.data.map(model => (
                  <li key={model.meta.id}>
                    <ServicePreview
                      id={model.meta.id}
                      // language
                      title={model.title}
                      perex={model.perex}
                      // attributes
                      link={model.link}
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

export default ServicesPage;
