var exports = module.exports = {}


exports.signup = function(req,res){

	res.render('signup');

}

exports.signin = function(req,res){

	res.render('signin');

}

// exports.dashboard = function(req,res){
// 	console.log("+++++++++++++++++++++++++++++++++++++++++++++++");
// 	console.log(req.user.id);
// 	console.log("+++++++++++++++++++++++++++++++++++++++++++++++");
// 	var userId = {id: req.user.id};
// 	res.render('dashboard',userId);
//
// }

exports.logout = function(req,res){

  req.session.destroy(function(err) {
  res.redirect('/');
  });

}
