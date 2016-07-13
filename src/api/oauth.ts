import configStream from '../stream/config';
import sessionStream from '../stream/session';
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
    private stream:ReactiveDot<ReactiveState>;
    private promise:Promise<OAuthAPI>;

	constructor() {
		// Конфигурируем приватный поток
		this.stream = configStream
			.map(cfg => cfg.OAUTH_PUBLIC_KEY)
			.filter(key => key != null)
			.map(key => {
				this.oauth.initialize(key);
				return ReactiveState.INTERACTIVE.from(this.oauth);
			})
			.startWith(ReactiveState.INITIALIZATION)
			.map(state => {
				const session = sessionStream.get();
				
				if (session.authorized && state.is(ReactiveState.INTERACTIVE)) {
					this.login()
							.then(api => this.stream.set(ReactiveState.READY.from(api)))
							.catch(err => this.stream.set(ReactiveState.ERROR.from(err)))
					;

					return ReactiveState.AWAITING;
				} else {
					return state;
				}
			})
			.log('oauth')
		;
	}

    get():ReactiveState {
        return this.stream.get();
    }

	fetch(method:string, data?:any):ReactiveDot<ReactiveState> {
		const dot = new ReactiveDot<ReactiveState>(ReactiveState.INITIALIZATION);

		this.stream.onValue(function callback(state) {
			if (state.is(ReactiveState.READY)) {
				this.stream.offValue(callback);
				
				dot.set(ReactiveState.PROCESSING);

				state.detail.get(method, {data})
					.done(data => dot.set(ReactiveState.READY.from(data)))
					.fail(err => dot.set(ReactiveState.ERROR.from(err)));
			} else {
				dot.set(state.from(null));
			}
		}.bind(this));

		return dot;
	}

    public login():Promise<OAuthAPI> {
        if (!this.promise) {
            this.promise = this.openPopup(true)
                .catch((err:Error) => {
                    if (/popup/.test(err.toString())) {
                        return this.openPopup(false);
                    }
                    
                    return err;
                });
        }

		return this.promise;
    }

    private openPopup(cache:boolean):Promise<OAuthAPI> {
        return new Promise((resolve, reject) => {
            this.oauth.popup('github', {cache}).done(resolve).fail(reject);
        });
    }
}
