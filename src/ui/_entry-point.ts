import ReactiveDot, {rfunction, RStream} from 'rdot';

// Data
import loggerStream from '../stream/logger';
import sessionStream from '../stream/session';
import authUserStream from '../stream/auth-user';

// Events
import onSignIn from '../event-stream/signin';

import {IUI} from './_ui';
import authFrom from './auth-form';

export interface IEntryPointProps {
	onSignIn:RStream<Event>;
	authUserStream:ReactiveDot<any>;
}

export default rfunction<void>((el:HTMLElement) => {
	const session = sessionStream.get();
	let ui:IUI;

	if (session.authorized) {
		loggerStream.info(`authUser: ${JSON.stringify(authUserStream.get())}`);
	} else {
		ui = authFrom({onSignIn});
	}

	if (ui) {
		el.innerHTML = ui.html;
		[].forEach.call(el.querySelectorAll('[data-event]'), (el:HTMLElement) => {
			const event = ui.events[el.dataset['event']];
			el.addEventListener(event.name, event.handle, false);
		});
	}
})