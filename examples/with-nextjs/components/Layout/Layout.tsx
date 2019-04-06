import Link from 'next/link';
import * as React from 'react';

const Layout: React.FunctionComponent = props => (
  <div>
    <header>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>{' '}
        |{' '}
        <Link href="/articles">
          <a>Articles</a>
        </Link>{' '}
        |{' '}
        <Link href="/services">
          <a>Services</a>
        </Link>{' '}
      </nav>
    </header>
    {props.children}
  </div>
);

export default Layout;
