import {rfunction} from 'rdot'
import sessionStream from '../stream/session';
import authFrom from './auth-form';

export default rfunction<string>(():string => {
	const session = sessionStream.get();

	if (session.authorized) {
		return 'Authorized!';
	} else {
		return authFrom();
	}
})