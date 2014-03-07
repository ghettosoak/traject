(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

//jquery v1.8.0 is included in this mess. Copyright 2012 jQuery Foundation and other contributors.
//like something you see, but can't read this unholy mess? drop me a line at (mike)[at](mfischerdesign)[dot](com)

var $windowPane = $(window)

$(function(){ //DOM Ready

	// $$(window)

	render('cell', {'cells':cells}, function(render) {
	    $('.grid').html(render);

	    $(".grid").gridster({
	        widget_margins: [10,10],
	        widget_base_dimensions:
	        	[
	        		($windowPane.width() / 5 ) - 20,
        	 		($windowPane.height() / 5 ) - 20
	        	],
	        resize: {
				enabled: true
			},
			draggable: {
	            handle: '.grab'
	        }
	    });

		$.each(cells, function(e){
			new Medium({
			    element: document.getElementById('cellEdit_'+cells[e].id),
			    tags:{
			    	paragraph: 'p'
			    }
			});	
		});
	});
});


// for (var i = 1; i <= 12; i++){
// 	new Medium({
// 	    element: document.getElementById('cell_'+i),
// 	    tags:{
// 	    	paragraph: 'p'
// 	    }

// 	});	
// }

