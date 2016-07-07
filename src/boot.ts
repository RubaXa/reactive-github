import config from './stream/config';
import oauth from './api/oauth';

config.set({
    OAUTH_PUBLIC_KEY: 'xw5aLnVfIr9iloyAmLBbPCEl5fg'
});

export default function boot(el:HTMLElement) {
    const api = oauth.get()

    el.innerHTML = 'Wow!';
}