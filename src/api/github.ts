import ReactiveDot from 'rdot';
import oauth from './oauth';

export default new class {
	
	me():ReactiveDot<any> {
		return oauth.fetch('/user').map(state => {
			return state.detail;
		});
	}

}