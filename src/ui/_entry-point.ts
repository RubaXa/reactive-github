import {rfunction, RStream} from 'rdot';

import loggerStream from '../stream/logger';
import sessionStream from '../stream/session';

import {IUI} from './_ui';
import authFrom from './auth-form';

export interface IEntryPointProps {
	onSignIn:RStream<Event>;
}

export default rfunction<void>((el:HTMLElement, props:IEntryPointProps) => {
	const session = sessionStream.get();
	let ui:IUI;

	if (session.authorized) {
		loggerStream.info('seesion.authorized: true');
	} else {
		ui = authFrom({
			onSignIn: props.onSignIn
		});
	}

	if (ui) {
		el.innerHTML = ui.html;
		[].forEach.call(el.querySelectorAll('[data-event]'), (el:HTMLElement) => {
			const event = ui.events[el.dataset['event']];
			el.addEventListener(event.name, event.handle, false);
		});
	}
})