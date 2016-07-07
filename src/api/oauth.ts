import config, {IConfig} from '../stream/config';
import ReactiveDot, {ReactiveState} from 'rdot';

export type IOAuthAPICall = (method:string, options:IOAuthAPICallOptions) => Promise<any>;

interface IOAuthIO {
    initialize:(key:string) => void;
    popup:(provider:string, options:any) => IOAuthIOPromise
}

interface IOAuthIOPromise {
    done:(callback:(api:IOAuthAPI) => void) => IOAuthIOPromise;
    fail:(callback:(err:Error) => void) => IOAuthIOPromise;
}

export interface IOAuthAPICallOptions {
    data: any;
}

export interface IOAuthAPI {
    get:IOAuthAPICall;
    post:IOAuthAPICall;
}

export default new class OAuthAPI extends ReactiveDot<IOAuthAPI | ReactiveState> {
    private oauth:IOAuthIO = window['OAuth'];
    private promise:Promise<OAuthAPI>;

	constructor() {
		super(dot => {
            this.init();
            return ReactiveDot.INITIALIZATION;
		});
        
        config
            .map<string>((cfg:IConfig) => cfg.OAUTH_PUBLIC_KEY)
            .filter((key:string) => key != null)
            .onValue((key:string) => {
                this.oauth.initialize(config.get().OAUTH_PUBLIC_KEY);
            })
        ;
	}

    private init() {
        if (!this.promise) {
            this.promise = this.openPopup(true)
                .catch((err:Error) => {
                    if (/popup/.test(err.toString())) {
                        return this.openPopup(false).catch(err => this.set(err));
                    }
                    
                    return err;
                })
                .then((api:OAuthAPI) => this.set(api));
        }
    }

    private openPopup(cache:boolean):Promise<OAuthAPI> {
        return new Promise((resolve, reject) => {
            this.oauth.popup('github', {cache}).done(resolve).fail(reject);
        });
    }
}
