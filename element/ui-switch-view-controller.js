'use strict'

const uiSwitchDoc = document._currentScript || document.currentScript;
const uiSwitch = uiSwitchDoc.ownerDocument.querySelector('#ui-switch-view');

class SwitchViewController extends HTMLElement {

	static get observedAttributes(){
		return ['checked'];
	}

	constructor(model){
		super();
		this.state = {};
		this.state.connected = false;
		//Keeps reference of events with bindings (so we can remove them)
		//see: https://stackoverflow.com/questions/11565471/removing-event-listener-which-was-added-with-bind
		this.event = {};
		this.model = model || {};

		const view = document.importNode(uiSwitch.content, true);
		this.shadowRoot = this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(view);
	}

	//Fires when the element is inserted into the DOM. It's a good place to set
	//the initial role, tabindex, internal state, and install event listeners.
	//
	//NOTE: A user may set a property on an instance of an element, before its
	//prototype has been connected to this class. The _upgradeProperty() method
	//will check for any instance properties and run them through the proper
	//class setters.
	connectedCallback() {

		//Set ARIA role, if necesary
		//if(!this.hasAttribute('role')){
			//this.setAttribute('role', 'checkbox');
		//}

		//Set elements tabindex
		//if (!this.hasAttribute('tabindex')){
			//this.setAttribute('tabindex', 0);
		//}

		//Wire views here
		this.$slider = this.shadowRoot.querySelector('#slider');
		this.$checkbox = this.shadowRoot.querySelector('#checkbox');

		this._upgradeProperty('checked');
		this._upgradeProperty('disabled');

		//Reference events with bindings
		this.event.click = this._onClick.bind(this);
		this.$slider.addEventListener('click', this.event.click);
		this.state.connected = true;

	}
	_upgradeProperty(prop) {
		if (this.hasOwnProperty(prop)) {
			let value = this[prop];
			delete this[prop];
			this[prop] = value;
		}
	}

	adoptedCallback(){
		console.log('adoptedCallback');
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		const hasValue = newVal !== null;

		switch(attrName){
			case 'checked':
				//this.setAttribute('aria-checked', hasValue);
				break;

			default:
				console.warn(`Attribute ${attrName} is not handled, you should probably do that`);
		}
	}

	get shadowRoot(){return this._shadowRoot;}
	set shadowRoot(value){ this._shadowRoot = value}

	get checked(){ return this.hasAttribute('checked'); }
	set checked(value){
		const isChecked = Boolean(value);
		if (isChecked){
			this.setAttribute('checked', '');
		} else {
			this.removeAttribute('checked');
		}
	}

	_onClick(event) {
		this._toggleChecked();
		this.$checkbox.checked = this.checked;
		event.preventDefault();
	}

	_toggleChecked() {
		this.checked = !this.checked;
		this.dispatchEvent(new CustomEvent('update', {detail: this.checked}));
	}

	disconnectedCallback() {
		this.$slider.removeEventListener('click', this.event.click);
		this.state.connected = false;
	}

	_removeEvents(){
	}

}

window.customElements.define('ui-switch', SwitchViewController);
