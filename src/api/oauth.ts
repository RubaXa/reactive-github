import config, {IConfig} from '../stream/config';
import ReactiveDot, {ReactiveState} from 'rdot';

export type IOAuthAPICall<D, F> = (method:string, options:OAuthAPICallOptions) => IOAuthAPICallDeferred<D, F>;

interface IOAuthAPICallDeferred<D, F> {
	done:(callback:(result:D) => void) => IOAuthAPICallDeferred<D,F>;
	fail:(callback:(error:F) => void) => IOAuthAPICallDeferred<D,F>;
}

interface OAuthIO {
    initialize:(key:string) => void;
    popup:(provider:string, options:any) => IOAuthAPICallDeferred<OAuthAPI, Error>
}

export interface OAuthAPICallOptions {
    data: any;
}

export interface OAuthAPI {
    get:IOAuthAPICall<any, Error>;
    post:IOAuthAPICall<any, Error>;
}

export default new class OAuthService {
    private oauth:OAuthIO = window['OAuth'];
    private stream = new ReactiveDot<OAuthAPI | ReactiveState>(ReactiveState.INITIALIZATION);
    private promise:Promise<OAuthAPI>;

	constructor() {
        config
            .map<string>((cfg:IConfig) => cfg.OAUTH_PUBLIC_KEY)
            .filter((key:string) => key != null)
            .onValue((key:string) => {
                this.oauth.initialize(key);
                this.stream.set(() => {
                    this.init();
                    return ReactiveState.INTERACTIVE;
                });
            })
        ;
	}

    get():OAuthAPI|ReactiveState {
        return this.stream.get();
    }

    onValue(callback:(value:OAuthAPI|string) => void):this {
        this.stream.onValue(callback);
        return this;
    }

	fetch(method:string, data?:any):ReactiveDot<ReactiveState> {
		let promise;

		return new ReactiveDot<ReactiveState>((dot) => {
			const api = this.stream.get();
			
			if (api instanceof ReactiveState) {
				return api;
			}
			else {
				promise = promise || api.get(method, {data})
					.done(data => dot.set(new ReactiveState('ready', data)))
					.fail(err => dot.set(new ReactiveState('error', err)));

				return ReactiveState.PROCESSING;
			}
		});
	}

    private init() {
        if (!this.promise) {
            this.promise = this.openPopup(true)
                .catch((err:Error) => {
                    if (/popup/.test(err.toString())) {
                        return this.openPopup(false).catch(err => this.stream.set(err));
                    }
                    
                    return err;
                })
                .then<OAuthAPI>((api:OAuthAPI) => {
                    this.stream.set(api);
                    return null;
                });
        }
    }

    private openPopup(cache:boolean):Promise<OAuthAPI> {
        return new Promise((resolve, reject) => {
            this.oauth.popup('github', {cache}).done(resolve).fail(reject);
        });
    }
}
