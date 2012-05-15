<?php

class jQueryComboBoxPlugin extends MantisPlugin {

	function register() {
		$this->name = 'jQuery ComboBox Replacement';
		$this->description = 'Provides a ComboBox replacement.';

		$this->version = '0.1';
		$this->requires = array(
			'MantisCore' => '1.2.0',
			'jQuery' => '1.6.2',
		);

		$this->author	= 'Tobias Kalbitz';
		$this->contact	= 'tobias.kalbitz (at) googlemail.com';
		$this->url		= 'http://initos.com';
	}

	function hooks() {
		return array(
			'EVENT_LAYOUT_RESOURCES' => 'resources',
		);
	}

	/**
	 * Create the resource link to load the jQuery library.
	 */
	function resources( $p_event ) {
		return '<script type="text/javascript" src="' . plugin_file( 'combobox.js' ) . '"></script>';
	}
}

