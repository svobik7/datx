import App, { Container } from 'next/app';
import { RemoteDataContext, storeRemoteData } from 'stores/storeRemoteData';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <RemoteDataContext.Provider value={storeRemoteData}>
        <Container>
          <Component {...pageProps} />
        </Container>
      </RemoteDataContext.Provider>
    );
  }
}

export default MyApp;
