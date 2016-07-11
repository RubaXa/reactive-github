import {rfunction} from 'rdot';

import authUserStream from './stream/auth-user';
import configStream from './stream/config';

import ui from './ui/_entry-point';

configStream.set({
    OAUTH_PUBLIC_KEY: 'xw5aLnVfIr9iloyAmLBbPCEl5fg'
});

export default rfunction<void>((el:HTMLElement) => {
    el.innerHTML = ui();
});