const view = document.createElement("template");
view.innerHTML = `

	<style>

		:host {
			--ui-switch-background-color: #2196F3;
		}

		.onoffswitch {
			position: relative; width: 60px;
			-webkit-user-select:none; -moz-user-select:none; -ms-user-select: none;
		}
		.onoffswitch-checkbox {
			display: none;
		}
		.onoffswitch-label {
			display: block; overflow: hidden; cursor: pointer;
			height: 36px; padding: 0; line-height: 36px;
			border: 2px solid #E3E3E3; border-radius: 36px;
			background-color: #FFFFFF;
			transition: background-color 0.3s ease-in;
		}
		.onoffswitch-label:before {
			content: "";
			display: block; width: 36px; margin: 0px;
			background: #FFFFFF;
			position: absolute; top: 0; bottom: 0;
			right: 22px;
			border: 2px solid #E3E3E3; border-radius: 36px;
			transition: all 0.3s ease-in 0s;
		}
		.onoffswitch-checkbox:checked + .onoffswitch-label {
			background-color: var(--ui-switch-background-color);
		}
		.onoffswitch-checkbox:checked + .onoffswitch-label, .onoffswitch-checkbox:checked + .onoffswitch-label:before {
			border-color: var(--ui-switch-background-color);
		}
		.onoffswitch-checkbox:checked + .onoffswitch-label:before {
			right: 0px;
		}

	</style>

	<div id="slider" class="onoffswitch">
		<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="checkbox" >
		<label class="onoffswitch-label" for="checkbox"></label>
	</div>

`;

export default view;

