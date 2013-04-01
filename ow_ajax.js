function ow_ajax(url, data, success, error, vars) {

	/*	url*		URL to post data to
		data*		Data to post to  url
		success		Calback function upon success; returns function(json.content)
		error		Callback function upon error; returns function(json.content)
		vars		Custom vars, such as  modalid, alertid
			vars.modalid	If set, acts on a modal
			vars.alertid	If set, uses the specified element for alerts
	*/
	
	if (success==undefined) {
		success = function(){};
	}
	
	if (error==undefined) {
		error = function(){};
	}

	ow_loading_notice('show', function() {

		if (!vars) {
			vars = Array();
		}

		if (vars.modalid) {
			modalid = vars.modalid;
			alertid = modalid+' .modal-error';
		}
		else {
			modalid = false;
			alertid = '#alert-global';
		}
		
		if (vars.alertid) {
			alertid = vars.alertid;
		}
	
		var ajaxRequest = $.ajax({
	        type: "POST",
	        url: url,
	        data: data,
	        dataType: "html",
	        timeout: 6000,
	        success: function(data) {
	        	
	        	try {
				    json = $.parseJSON(data);
				    
				    switch (json.code) {
						case 'success':
				        	success(json.content);
				        break;
				        case 'error':
				        	ow_ajax_handler('error', ['', 'Error', json.content, modalid], alertid);
				        	error(json.content);
				        break;
				        default:
			        		ow_ajax_handler('error', ['', 'Unknown error code', json.code, modalid], alertid);
			        		error(json.content);
				        break;
				   	}
				    
				} catch (e) {
				    ow_ajax_handler('error', ['', 'Error parsing JSON ('+e+')', data, modalid], alertid);
				}
			   	
			   	ow_loading_notice('hide');
			   	
	        },
	        error: function(request, status, err) {
	            ow_ajax_handler('error', [request, status, err, modalid], alertid);
	            ow_loading_notice('hide');
	        }
	    });
	    
	});
	
}
/* ow_ajax() */

function ow_ajax_handler(type, act, alert_id) {

	if (alert_id!='') {
		var alertid = alert_id;
	}
	else {
		var alertid = '#alert-global';
	}
	
	var request = act[0];
	var status 	= act[1];
	var err 	= act[2];
	var modalid = act[3];

	switch (type) {
	
		case 'error':
			
			$(alertid+' .alert-heading').html('Error');
			
			if (act==='reset') {
				$(alertid+' .alert-content').html('[error details]');
				$(alertid).css('display', 'none');
			}
			else {
				
				switch (status) {
					
					case 'timeout':
						
						alert_content = 'Action timed out. Please try again later.';
						
					break;
					case 'Error':
					case 'error':
					
						alert_content = err;
					
					break;
					default:
					
						alert_content = status+': '+err;
					
					break;
					
				}
				
				$(alertid+' .alert-content').html(alert_content);
				
		        $(alertid).slideDown(400);
		   	}
			
		break;
	
	} /* switch (type) */
	
}
