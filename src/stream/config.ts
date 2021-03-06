import ReactiveDot from 'rdot';

export interface IConfig {
	OAUTH_PUBLIC_KEY: string;
}

export default new class ConfigStream extends ReactiveDot<IConfig> {
	constructor() {
		super({
			OAUTH_PUBLIC_KEY: ''
		});
	}
};
