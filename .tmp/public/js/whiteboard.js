$(function() {
	//create canvas variables for when we go to the next question
	var canvas = $('#paper')
	var ctx = canvas[0].getContext('2d');
	var socket = io.connect(url);

	// The URL of your web server (the port is set in app.js)
	var url = 'http://whiteboard-iango.rhcloud.com/';

	$('#submit').click(function(e) {
		e.preventDefault();
		putQuestion();
		$('#myModal').modal('hide');
		return false;
	})

	$('#questionClose').click(function(e){
		$('#question').val('');
	})

	$("#nameForm").submit(function(e) {
		e.preventDefault();
		var username = $('#username_input').val();
		storeName(username);
		storeTA();
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

	if (window.location.pathname == "/home") {
		checkTA();
	};

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
	var name = getName();

	$.ajax({
		url: 'question/create?text='+question+'&callID='+callID+'&name='+name,
		type: 'PUT',
		success: function(result) {
			$('#question').val('');	
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

function checkTA(){
	var is_ta = sessionStorage.getItem("is_ta");
	if (is_ta == "false"){
		$("#nextInQueue").hide();
	}
}

function storeTA(){
	var is_ta = $("#ta").prop('checked');
	sessionStorage.setItem("is_ta", is_ta);
}

function storeName(username){
	sessionStorage.setItem("username", username);
}

function getName(){
	var tempUsername = sessionStorage.getItem("username");
	if (tempUsername == null){
		return "STUDENT";
	}else{
		return tempUsername;
	}
}
