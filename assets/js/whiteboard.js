$(function() {
	$('#submit').click(function(e) {
		e.preventDefault();
		var question = $('#question').val();
		// var photo = $('#')
		console.log('here in jquery');
		$.ajax({
			url: 'question/create?text='+question,
			type: 'PUT',
			success: function(result) {
			
			}
		})
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