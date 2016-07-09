import {rfunction} from 'rdot';

import config from './stream/config';
import authStream from './stream/auth-user';

import ui from './ui/_entry-point';

config.set({
    OAUTH_PUBLIC_KEY: 'xw5aLnVfIr9iloyAmLBbPCEl5fg'
});

export default rfunction<void>((el:HTMLElement) => {
    el.innerHTML = ui();
});