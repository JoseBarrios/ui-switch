'use strict'

const uiSwitchDoc = document._currentScript || document.currentScript;
const uiSwitch = uiSwitchDoc.ownerDocument.querySelector('#ui-switch-view');

class SwitchViewController extends HTMLElement {

  static get observedAttributes(){
    return ['value'];
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
		if(!this.hasAttribute('role')){
			this.setAttribute('role', 'checkbox');
		}

		//Set elements tabindex
		if (!this.hasAttribute('tabindex')){
			this.setAttribute('tabindex', 0);
		}

		//Wire views here
    this.$container = this.shadowRoot.querySelector('.container');
    this.$header = this.shadowRoot.querySelector('#header');
    this.$text = this.shadowRoot.querySelector('#text');

		//Reference events with bindings
		this.event.click = this._onClick.bind(this);
    this.$container.addEventListener('click', this.event.click);

		this.state.connected = true;
    this._updateView();
	}

	adoptedCallback(){
		console.log('adoptedCallback');
	}

	attributeChangedCallback(attrName, oldVal, newVal) {
		switch(attrName){

			case 'value':
				if(newVal !== this.value){ this.value = newVal; }
				break;

			default:
				console.warn(`Attribute ${attrName} is not handled, you should probably do that`);
		}
  }

  get shadowRoot(){return this._shadowRoot;}
  set shadowRoot(value){ this._shadowRoot = value}


	get value(){ return this.model.value; }
	set value(value){
		//Check if attribute matches property value, Sync the property with the
		//attribute if they do not, skip this step if already sync
		if(this.getAttribute('value') !== value){
			//By setting the attribute, the attributeChangedCallback() function is
			//called, which inturn calls this setter again.
			this.setAttribute('value', value);
			//attributeChangeCallback() implicitly called
			return;
		}

		this.model.value = value;
		this._updateView(this.$header);
	}

	_onClick(e){
		this.dispatchEvent(new CustomEvent('custom-click', {detail: this.model}));
	}

  _updateView(view) {
		//No point in rendering if there isn't a model source, or a view on screen
		if(!this.model || !this.state.connected){ return; }

		switch(view){
			case this.$header:
				this._updateHeaderView();
				break;

			case this.$text:
				this._updateTextView();
				break;

			default:
				this._updateHeaderView();
				this._updateTextView();
		}
  }

	_updateHeaderView(){
		this.$header.innerHTML = this.model.value;
	}

	_updateTextView(){
		this.$text.innerHTML = this.model.value;
	}

	disconnectedCallback() {
		this._removeEvents()
		this.state.connected = false;
	}

	_removeEvents(){
    this.$container.removeEventListener('click', this.event.click);
	}

}

window.customElements.define('ui-switch', SwitchViewController);
