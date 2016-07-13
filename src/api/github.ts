import {ReactiveState} from 'rdot';
import oauth from './oauth';

class GitHub {
	private _me;

	me():ReactiveState {
		!this._me && (this._me = oauth.fetch('/user'));
		return this._me.get();
	}
}

export default new GitHub