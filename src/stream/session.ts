import ReactiveDot from 'rdot';
import loggerStream from './logger';

const SESSION_KEY:string = 'rg-session-stream';

export interface ISession {
	authorized: boolean;
}

export default new class SessionStream extends ReactiveDot<ISession> {
	constructor() {
		// Initial state
		let data:ISession = {
			authorized: false
		};

		try {
			data = JSON.parse(localStorage.getItem(SESSION_KEY)) || data;
		} catch (err) {
			loggerStream.warn(`session.read: ${err.toString()}`);
		}

		super(data, {
			setter(value:ISession):ISession {
				try {
					localStorage.setItem(SESSION_KEY, JSON.stringify(value));
				} catch (err) {
					loggerStream.warn(`session.write: ${err.toString()}`);
				}

				return value;
			}
		});
	}
};
