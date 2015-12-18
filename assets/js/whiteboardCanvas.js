$(function(){

	// This demo depends on the canvas element
	if(!('getContext' in document.createElement('canvas'))){
		alert('Sorry, it looks like your browser does not support canvas!');
		return false;
	}

	// The URL of your web server (the port is set in app.js)
	var url = 'http://whiteboard-iango.rhcloud.com/';

	var doc = $(document),
		win = $(window),
		canvas = $('#paper'),
		ctx = canvas[0].getContext('2d');
	

	var x = $(".col-sm-8").position();
	var canvastop = x.top+55; //these are magic numbers, I don't care. 
    var canvasleft = x.left+15;	// its because of the nav tabs causing issues. this fixes it.


	// Generate an unique ID
	var id = Math.round($.now()*Math.random());

	// A flag for drawing activity
	var drawing = false;

	var clients = {};
	var cursors = {};

	var prev = {};

	var socket = io.connect(url);


	//var clearButton = document.getElementById('clear');
    //clearButton.onclick = clearCanvas();
    $('#clear').click(function(){
    	clearCanvas();
    });

    socket.on('clear', function(){
    	//console.log('recieved clear event')
    	ctx.beginPath();
	    ctx.fillStyle = "#F4F4F8";
	    ctx.rect(0, 0, 750, 600);
	    ctx.fill();
	    ctx.closePath();
    })

    function clearCanvas() {
    	ctx.beginPath();
	    ctx.fillStyle = "#F4F4F8";
	    ctx.rect(0, 0, 750, 600);
	    ctx.fill();
	    ctx.closePath();
	    socket.emit('clear')
	  }

	socket.on('moving', function (data) {
		if(! (data.id in clients)){
			// a new user has come online. create a cursor for them
			cursors[data.id] = $('<div class="cursor">').appendTo('#cursors');
		}
		// Move the mouse pointer
		cursors[data.id].css({
			'left' : data.x,
			'top' : data.y
		});

		// Is the user drawing?
		if(data.drawing && clients[data.id]){

			// Draw a line on the canvas. clients[data.id] holds
			// the previous position of this user's mouse pointer

			drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y);
		}

		// Saving the current client state
		clients[data.id] = data;
		clients[data.id].updated = $.now();
	});

	

	canvas.on('mousedown',function(e){
		e.preventDefault();
		drawing = true;
		prev.x = e.pageX-canvasleft;
		prev.y = e.pageY-canvastop;

	});

	doc.bind('mouseup mouseleave',function(){
		drawing = false;
	});
	var lastEmit = $.now();

	doc.on('mousemove',function(e){
		if($.now() - lastEmit > 30){
			socket.emit('moving',{
				'x': e.pageX-canvasleft,
				'y': e.pageY-canvastop,
				'drawing': drawing,
				'id': id
			});
			lastEmit = $.now();
		}

		// Draw a line for the current user's movement, as it is
		// not received in the socket.on('moving') event above

		if(drawing){
			//console.log(prev)
			drawLine(prev.x, prev.y, e.pageX-canvasleft, e.pageY-canvastop);

			prev.x = e.pageX-canvasleft;
			prev.y = e.pageY-canvastop;
		}
	});

	// Remove inactive clients after 10 seconds of inactivity
	setInterval(function(){

		for(ident in clients){
			if($.now() - clients[ident].updated > 10000){

				// Last update was more than 10 seconds ago.
				// This user has probably closed the page

				cursors[ident].remove();
				delete clients[ident];
				delete cursors[ident];
			}
		}

	},10000);

	function drawLine(fromx, fromy, tox, toy){
		ctx.beginPath();
		ctx.moveTo(fromx, fromy);
		ctx.lineTo(tox, toy);
		ctx.stroke();
		ctx.closePath();
	}

});