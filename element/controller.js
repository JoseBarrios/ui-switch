'use strict'

import view from "./view.js";

class SwitchViewController extends HTMLElement {

	static get observedAttributes(){
		return ['value', 'name'];
	}

	constructor(model){
		super();
		this.state = {};
		this.state.connected = false;
		//Keeps reference of events with bindings (so we can remove them)
		//see: https://stackoverflow.com/questions/11565471/removing-event-listener-which-was-added-with-bind
		this.event = {};
		this.model = model || {};

		this.shadowRoot = this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(view.content.cloneNode(true));
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

		//Reference events with bindings
		this.event.click = this._onClick.bind(this);
		this.$slider.addEventListener('click', this.event.click);
		this.state.connected = true;
		this._updateView();
	}

	adoptedCallback(){
		console.log('adoptedCallback');
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		const hasValue = newVal !== null;

		switch(attrName){

			case 'value':
				this.value = newVal === 'true';
				break;

			case 'name':
				this.name = newVal;
				break;

			default:
				console.warn(`Attribute ${attrName} is not handled, you should probably do that`);
		}
	}

	get shadowRoot(){return this._shadowRoot;}
	set shadowRoot(value){ this._shadowRoot = value}

	get value(){ return this.model.value || false; }
	set value(value){
		this.model.value = value;
		this._updateView();
	}

	get name(){ return this.model.name; }
	set name(value){
		this.model.name = value;
	}

	_updateView(){
		if(this.$checkbox){
			this.$checkbox.checked = this.value;
		}
	}

	_onClick(event) {
		this.value = !this.value;
		this.dispatchEvent(new CustomEvent('update', {detail: this.value}));
		event.preventDefault();
	}

	disconnectedCallback() {
		this.$slider.removeEventListener('click', this.event.click);
		this.state.connected = false;
	}
}

window.customElements.define('ui-switch', SwitchViewController);
