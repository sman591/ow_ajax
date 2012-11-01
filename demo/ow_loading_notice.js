function ow_loading_notice(act, callback) {

	var loader_selector = '#loader-holder';

	if (callback == undefined) {
		callback = function(){};
	}

	if ( $(loader_selector).length == 0 ) {
		
		// if it doesn't exist, proceed to callback
		
		callback();
		
	}

	switch (act) {
	
		case 'show':
			
			$(loader_selector).show(0, function(){
			
				$('.modal:visible').each(function(i) {
					
					modal_handler('loader', 'show', '#'+this.id);
					
				});
				
				if (callback && typeof(callback) === "function") {
					callback();
				}
				
			});
			
		break
		case 'hide':
		
			$(loader_selector).fadeOut(300, function(){
				
				$('.modal:visible').each(function(i) {
					
					modal_handler('loader', 'hide', '#'+this.id);
					
				});
				
				if (callback && typeof(callback) === "function") {
					callback();
				}
				
			});
			
		break;
		
	}
	
}