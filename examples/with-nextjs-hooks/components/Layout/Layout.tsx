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
        <Link href="/comments">
          <a>Comments</a>
        </Link>{' '}
      </nav>
    </header>
    {props.children}
  </div>
);

export default Layout;
