$(function() {
	$('#submit').click(function(e) {
		e.preventDefault();
		var question = $('#question').val();
		// var photo = $('#')
		console.log('here');
		$.ajax({
			url: 'question/create?text='+question,
			type: 'PUT',
			success: function(result) {
				$('#exRequests').html(JSON.stringify(result));
			}
		})
		return false;
	})
})