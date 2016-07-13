import oauth from './api/oauth';

// Data
import configStream from './stream/config';

// UI
import ui from './ui/_entry-point';

configStream.set({
    OAUTH_PUBLIC_KEY: 'xw5aLnVfIr9iloyAmLBbPCEl5fg'
});

export default (el:HTMLElement) => {
	// Сonfiguration & Binding 
	ui(el);
};