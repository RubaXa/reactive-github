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

	warn(message) {
		this.add('warn', message);
	}
}