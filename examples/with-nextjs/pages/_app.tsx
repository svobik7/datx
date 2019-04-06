import { Provider } from 'mobx-react';
import App, { Container } from 'next/app';
import storeRemoteData from 'stores/storeRemoteData';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Provider storeRemoteData={storeRemoteData}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default MyApp;
