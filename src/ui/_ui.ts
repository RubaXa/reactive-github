import {rfunction} from 'rdot';
import loggerStream from '../stream/logger';

export interface IUI {
	events:IUIEvents;
	html:string;
}

export interface IUIEvents {
	[index:string]:{name:string, handle:(evt:Event) => void};
}

export default function factory<T>(template:string):(props:T) => IUI {
	let id:number = 0;
	let events:any = {};
	let compiledTemplate;

	function compile():(props:T) => string {
		template = template.replace(/\son-(\w+)="\{(.*?)\}"/g, (_, name:string, code:string):string => {
			events[++id] = {
				name,
				handle: `function (evt) { ${code} }` 
			};
			return ' data-event="' + id + '"';
		});
		
		const code = `return function (props) {
			var __events = { ${Object.keys(events)
				.map(id => `${id}: {
					name: "${events[id].name}",
					handle: ${events[id].handle}
				}`)
				.join(',\n')
			} };
			
			return {events: __events, html: template};
		}`;

		try {
			return <any>Function('template', code)(template);
		} catch (err) {
			loggerStream.error(`ui.compile: ${err.toString()}\n${code}`);
		}
	}

	return rfunction<IUI>((props:T) => {
		if (!compiledTemplate) {
			compiledTemplate = compile();
		}

		return compiledTemplate(props);
	});
};