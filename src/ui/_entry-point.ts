import {rfunction} from 'rdot'
import authFrom from './auth-form';

export default rfunction<string>(():string => {
	return `
		<div class="logged-out env-production macintosh session-authentication page-responsive min-width-0">
			${authFrom()}
		</div>
	`
})