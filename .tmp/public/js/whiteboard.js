$(function() {
	$('#submit').click(function(e) {
		e.preventDefault();
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

function getFirstQuestion(){
	$.ajax({
		url: 'question',
		type: 'GET',
		success: function(result) {
				var firstQuestion = result[0];
		},
		failure: function(result) {
				return false; 
		}
	})
}

function returnData(data){
	console.log("data:" + data)
	return data;
}

function destroyCurrentQuestion(){}

function connectNextQuestion(){
	$.ajax({
		url: 'question',
		type: 'GET',
		success: function(result) {
				var firstQuestion = result[0];
				var callID = firstQuestion.callID;
				var call = peer.call(callID, window.localStream);
				step3(call);
		},
		failure: function(result) {
				return false; 
		}
	})
}

function nextQuestion(){
	destroyCurrentQuestion()
	connectNextQuestion()
}

