import {rfunction} from 'rdot';

import config from './stream/config';
import authStream from './stream/auth-user';

config.set({
    OAUTH_PUBLIC_KEY: 'xw5aLnVfIr9iloyAmLBbPCEl5fg'
});

export default rfunction<void>((el:HTMLElement) => {
    const user = authStream.get();
    el.innerHTML = `Wow, ${(user ? user.login : '%username%')}!`;
});