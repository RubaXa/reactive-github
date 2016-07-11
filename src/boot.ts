import {rfunction, RStream, ReactiveState} from 'rdot';

import oauth from './api/oauth';

import configStream from './stream/config';
import sessionStream from './stream/session';
import authUserStream from './stream/auth-user';

import ui from './ui/_entry-point';

configStream.set({
    OAUTH_PUBLIC_KEY: 'xw5aLnVfIr9iloyAmLBbPCEl5fg'
});

export default (el:HTMLElement) => {
	const onSignIn = new RStream<Event>();

	onSignIn.onValue(rfunction(() => {
		const state = oauth.get();
		
		if (state.is(ReactiveState.READY)) {
			sessionStream.set({authorized: true});
		}
	}));

	// Bind UI
	ui(el, {
		onSignIn,
		authUserStream
	});
};