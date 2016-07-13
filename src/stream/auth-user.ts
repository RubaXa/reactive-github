import ReactiveDot from 'rdot';

import github from '../api/github';
import sessionStream from '../stream/session';

export default sessionStream
	.map<boolean>(session => session.authorized)
	.filter(authorized => authorized)
	.map(authorized => {
		return authorized && github.me().detail || null
	});
