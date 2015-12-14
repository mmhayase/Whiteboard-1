/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {


sails.io.on('connect', function (socket){
	//console.log('CONNECT');

	socket.on('disconnect', function (socket) {
        //console.log('DISCONNECT');
    });


    socket.on('moving', function (data) {

    // This line sends the event (broadcasts it)
    // to everyone except the originating client.
    socket.broadcast.emit('moving', data);
  });

    socket.on('clear', function (){
      //clear everyones canvas
      socket.broadcast.emit('clear')
    })
})
  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
