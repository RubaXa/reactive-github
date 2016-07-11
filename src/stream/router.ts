import ReactiveDot from 'rdot';

interface IRouterParams {
	user?:string;
}

interface IRoute {
	pathname:string
	search:string;
	query:any;
	params:IRouterParams;
}

function parse(location:Location):IRoute {
	const [pathname, queryString] = (location.toString().split('#!')[0] || '/').split('?');
	const pathParts = pathname.split('/');
	const params:IRouterParams = {};
	const query = {};

	if (pathParts.length > 1) {
		params.user = pathParts[1];
	}

	return {
		pathname,
		query,
		params,
		search: queryString ? `?${queryString}` : ''
	};
}

export default new class RouterStream extends ReactiveDot<IRoute> {
	constructor() {
		super(parse(location));

		ReactiveDot.fromEvent(window, 'hashchange').onValue(() => {
			this.set(parse(location));
		});
	}
};
