import ReactiveDot from 'rdot';

interface ILog {
	type:string;
	data:any;
}

export default new class LoggerStream extends ReactiveDot<ILog[]>  {
	constructor() {
		super([]);
	}

	add(type:string, data:any) {
		this.set([].concat(this.get(), {type, data}));
		console[type](data);
	}

	write(message) {
		this.add('log', message);
	}

	info(message) {
		this.add('info', message);
	}

	warn(message) {
		this.add('warn', message);
	}

	error(message) {
		this.add('error', message);
	}
}