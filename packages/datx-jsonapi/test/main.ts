// tslint:disable:no-import-side-effect

import { configure } from 'mobx';

import './general';
import './views';

import './network/basics';
import './network/caching';
import './network/error-handling';
import './network/headers';
import './network/params';
import './network/updates';

import './issues';

configure({ enforceActions: 'observed' });
