/*

License:
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
file except in compliance with the License. You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under the
License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
*/

function storeValue(itemValue){
    if(!localStorage) return;

    // start storing fav projects
    var favProjects = JSON.parse(localStorage.getItem('favProjects'));
    if(!favProjects){
        favProjects = {};
    }
    if(!favProjects[itemValue]){
        favProjects[itemValue] = 0;
    }
    favProjects[itemValue] += 1;
    localStorage.setItem('favProjects',JSON.stringify(favProjects));
}




(function($) {
	$.widget("ui.combobox", {
		_create: function() {
			var self = this;
			var select = this.element;
			select.hide();
			
			// process select options into an array
			var opts = new Array();
			$('option',select).each(function(index) {
				var opt = new Object();
				opt.value = $(this).val();
				opt.label = $(this).text();
				opts[opts.length] = opt;
			});
			
			// set up input text element
			var input = $("<input>");
			input.insertAfter(select);
			input.autocomplete({
					source: opts,
					delay: 0,
					change: function(event, ui) {
						if (!ui.item) {
							// user didn't select an option, but what they typed may still match
							var enteredString = $(this).val();
							var stringMatch = false;
							for (var i=0; i < opts.length; i++){
								if(opts[i].label.toLowerCase() == enteredString.toLowerCase()){
									select.val(opts[i].value);// update (hidden) select
									$(this).val(opts[i].label);// corrects any incorrect case
									stringMatch = true;
									break;
								}
							}
							if(!stringMatch){
								// remove invalid value, as it didn't match anything
								$(this).val($(':selected',select).text());
							}
							return false;
						}
					},
					select: function(event, ui) {
						select.val(ui.item.value);// update (hidden) select

                        storeValue(ui.item.value); // save in local storage
                        
						select.change();
						$(this).val(ui.item.label);
						return false;
					},
					// stop parent form from being while menu is open
					open: function(event, ui) {
						input.attr("menustatus","open");
					},
					close: function(event, ui) {
						input.attr("menustatus","closed");
					},
					minLength: 0
				});
			input.addClass("ui-widget ui-widget-content ui-corner-left");
			// initialise text with what's currently selected
			input.val($(':selected',select).text());
			//clear text when user clicks in text input
			input.click(function(){
				$(this).val("");
			});
			
			// over-ride form submit, so it cant submit if the menu is open
			input.attr("menustatus","closed");
			var form = $(input).closest("form"); //$(input).parents('form:first');
			$(form).submit(function(e){
				return (input.attr('menustatus') == 'closed');
			});
				
			// set up button for fake 'select'
			var btn = $("<button>&nbsp;</button>");
			btn.attr("tabIndex", -1);
			btn.attr("title", "Show All Items");
			btn.insertAfter(input);
			btn.button({
				icons: {
					primary: "ui-icon-triangle-1-s"
				},
				text: false
			});
			btn.removeClass("ui-corner-all");
			btn.addClass("ui-corner-right ui-button-icon");
			btn.click(function() {
				//event.preventDefault();
				// close if already visible
				if (input.autocomplete("widget").is(":visible")) {
					input.autocomplete("close");
					return false; // return false, so form isn't automatically submitted
				}
				// pass empty string as value to search for, displaying all results
				input.autocomplete("search", "");
				input.focus();
				return false; // return false, so form isn't automatically submitted
			});
			
			// add some styles
			btn.css("margin-left","-1px");
			input.css("margin",0);
			btn.css("padding",0);
			input.css("padding","0 0.4em 0 0.4em");
			$('span.ui-button-text', btn).css("padding",0);

			input.keypress(function(event) {
				if ((event.which && event.which == 13) || (event.keyCode && event.keyCode == 13)) {
    					setTimeout( function() {
        					$(input).closest("form").submit(); 
    					} , 50 );
			}});

            
			//input.autocomplete.result(function(event, data, formatted) {
  			//	$(this).closest("form").submit();
			//});
		}
	});

})(jQuery);

jQuery(document).ready(function($) {
	// new code
	$(function() {
		//$(".combobox").combobox();
		jQuery('select[name="project_id"]').combobox();

        select = jQuery('select[name="project_id"]').first();
        // process select options into an array
		var opts = new Array();
		$('option',select).each(function(index) {
			var opt = new Object();
			opt.value = $(this).val();
			opt.label = $(this).text();
			opts[opts.length] = opt;
		});
        var favProjects = JSON.parse(localStorage.getItem('favProjects'));
        // process select projects into an array
		var pros = new Array();
		jQuery.each(favProjects, function(index, value) {
			var pro = new Object();
			pro.index = index;
			pro.value = value;
			pros[pros.length] = pro;
		});
        pros.sort(function(a,b){return a.value < b.value;});
        var linkCount = 0;
        var favDiv = jQuery('<div align="right" style="font-size: 11px;"></div>');
        jQuery.each(pros, function(ind, obj) { 
            var index = obj.index;
            var value = obj.value;
            if(select.val() == index) return;
            linkCount += 1;
            if(linkCount > 5) return;
            var linkLabel = '';
            for (var i=0; i < opts.length; i++){
				if(opts[i].value == index){
					linkLabel = opts[i].label;
					break;
				}
			}
            if(linkLabel == '') return;

            var favLink = $('<a>',{
                text: linkLabel.trim(),
                title: linkLabel,
                href: '#',
                click: function(){ 
                    select.val(index); 
                    storeValue(index); 
                    select.change(); 
                    return false;}
            });

            favDiv.append(favLink);
            if(linkCount < 5)
             favDiv.append(" | ");
        });
        favDiv.insertBefore(jQuery('table').first());

	});
});
