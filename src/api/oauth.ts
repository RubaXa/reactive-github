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
    private stream = new ReactiveDot<ReactiveState>(ReactiveState.INITIALIZATION);
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

    get():ReactiveState {
        return this.stream.get();
    }

    onValue(callback:(value:OAuthAPI|string) => void):this {
        this.stream.onValue(callback);
        return this;
    }

	fetch(method:string, data?:any):ReactiveDot<ReactiveState> {
		let promise;

		return new ReactiveDot<ReactiveState>((dot) => {
			const state = this.stream.get();
			
			if (state != ReactiveState.READY) {
				return state;
			} else {
				promise = promise || state.detail.get(method, {data})
					.done(data => dot.set(ReactiveState.READY.from(data)))
					.fail(err => dot.set(ReactiveState.ERROR.from(err)));

				return ReactiveState.PROCESSING;
			}
		});
	}

    private init() {
        if (!this.promise) {
            this.promise = this.openPopup(true)
                .catch((err:Error) => {
                    if (/popup/.test(err.toString())) {
                        return this.openPopup(false).catch(err => {
                            return this.stream.set(ReactiveState.ERROR.from(err));
                        });
                    }
                    
                    return err;
                })
                .then<OAuthAPI>((api:OAuthAPI) => {
                    this.stream.set(ReactiveState.READY.from(api));
                    return null;
                });
        }
    }

    private openPopup(cache:boolean):Promise<any> {
        return new Promise((resolve, reject) => {
            this.oauth.popup('github', {cache}).done(resolve).fail(reject);
        });
    }
}
