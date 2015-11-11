function getAllAjax(route){
	event.preventDefault();

	$.ajax({
		url:"/" + route + "/",
		type: 'GET',
		success:function(data){
			return "data";
		}
	});
}