import {RStream} from 'rdot';
import sessionStream from '../stream/session';


export default new RStream<Event>(() => {
	sessionStream.set({authorized: true});
});