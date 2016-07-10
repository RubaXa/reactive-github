import {rfunction} from 'rdot'
import authFrom from './auth-form';

export default rfunction<string>(():string => {
	const session = sessionStream.get();

	if (session.auth) {

	} else {
		return authFrom();
	}
})