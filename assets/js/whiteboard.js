$(function() {
	//create canvas variables for when we go to the next question
	var canvas = $('#paper')
	var ctx = canvas[0].getContext('2d');
	var socket = io.connect(url);

	// The URL of your web server (the port is set in app.js)
	var url = 'http://whiteboard-iango.rhcloud.com/';

	$('#submit').click(function(e) {
		e.preventDefault();
		$('#myModal').modal('hide');
		putQuestion();
		return false;
	})

	$("#nameForm").submit(function(e) {
		e.preventDefault();
		var username = $('#username').val();
		$.ajax({
			url: 'home',
			type: 'PUT',
			success: function(result) {
				window.location.href = "/home";
			}
		})
		return false;
	})

	$("#nextInQueue").click(function(e){
		//clear the canvas
		clearCanvas();
		//move to next question in queue
		nextInQueue();
	})

	function clearCanvas() {
    	ctx.beginPath();
	    ctx.fillStyle = "#F4F4F8";
	    ctx.rect(0, 0, 750, 600);
	    ctx.fill();
	    ctx.closePath();
	    socket.emit('clear')
	  }

})


function putQuestion(){
	var question = $('#question').val();
	var callID = $('#my-id').text();
	// var photo = $('#')
	console.log('here in jquery');
	$.ajax({
		url: 'question/create?text='+question+'&callID='+callID,
		type: 'PUT',
		success: function(result) {
				
		}
	})
}

// function getFirstQuestion(){
// 	$.ajax({
// 		url: 'question',
// 		type: 'GET',
// 		success: function(result) {
// 				var firstQuestion = result[0];
// 		},
// 		failure: function(result) {
// 				return false; 
// 		}
// 	})
// }

function returnData(data){
	console.log("data:" + data)
	return data;
}



function destroyQuestion(questionID){
	$.ajax({
		url: 'question/destroy/'+questionID,
		type: 'DELETE',
		success: function(result) {
				console.log("deleted a question")
		},
		failure: function(result) {
				return false; 
		}
	})
}

function connectNextQuestion(){
	$.ajax({
		url: 'question',
		type: 'GET',
		success: function(result) {
				var firstQuestion = result[0];
				var callID = firstQuestion.callID;
				var call = peer.call(callID, window.localStream);
				var firstQuestionID = firstQuestion.id;

				// Close existing call, if any, and call next in queue
				step3(call);


				destroyQuestion(firstQuestionID); // Destroy next question to "bump" the queue
		},
		failure: function(result) {
				return false; 
		}
	})
	
}

// Calls functions to delete current question and then connect next call
function nextInQueue(){
	// TODO: Account for edge cases with queue

	// Delete current question; connectNextQuestion assumes updated queue
	// Necessary to have below ajax call every time because getCurrentQuestion is returning undefined
	$.ajax({ 
		url: 'question',
		type: 'GET',
		success: function(result) {
				var firstQuestion = result[0];
				var firstQuestionID = firstQuestion.id;

				destroyQuestion(firstQuestionID); // Destroy next question to "bump" the queue
				connectNextQuestion();
		},
		failure: function(result) {
				console.log("Something went wrong connecting to next in queue")
				return false; 
		}
	})
}

