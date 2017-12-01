var db = require("../models");

var request = require('request');


module.exports = function(app) {
  //=======================User================================
  // Get One User
  app.get("/api/users/:id", function(req, res) {
    db.User.findOne({

        where: {
          id: req.params.id
        }
      })
      .then(function(result) {
        // res.json(result);
        var data = {users: [result.dataValues]};
        // console.log(result);
        console.log(result.dataValues);
        
        var collegeBody = makeQuery(result.dataValues, req, res);
        // var colleges = {colleges: [collegeBody.results]};
        // console.log("+++++++++++");
        // console.log(collegeBody);
        // res.render('user', data);
        // return res.redirect(data, '/profile' )
      }).catch(function(err) {
        res.json(err);
      });
  });

  // Create User
  app.post("/api/users", function(req, res) {
    console.log("-------");
    console.log(req.body);
    db.User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        location: req.body.location,
        gpa: req.body.gpa
      }).then(function(result) {
        res.json({
          id: result.id
        });

      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Update User
  app.put("/api/users/:id", function(req, res) {
    db.User.update({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      score: req.body.score,
      gpa: req.body.gpa,
      location: req.body.location,

    }, {
      where: {
        //id: req.params.id
        id: req.body.id
      }
    })
  .then(function(result) {
    res.json(result);
  }).catch(function(err) {
    res.json(err);
  });
});

  // Delete User
  app.delete("/api/users/:id", function(req, res) {
    db.User.destroy({
      where: {
        id: req.body.id
      }
    })
  .then(function(result) {
    res.json(result);
  }).catch(function(err) {
    res.json(err);
  });
});

  //=======================College================================

  // Get All Fev Colleges for One User
  app.get("/api/colleges/:id", function(req, res) {
    db.User.findAll({
        include: [db.User],
        where: {
          UserId: req.body.id,
        }
      })
      .then(function(result) {
        res.json(result);
        // return res.render('index', {
        //   result
        // })
      }).catch(function(err) {
        res.json(err);
      });
  });

  // Create College
  app.post("/api/colleges/:userid", function(req, res) {
    db.College.create({
        name: req.body.name,
        description: req.body.description,
        requirements: req.body.requirements,
        tuition: req.body.tuition,
        application_deadline: req.body.application_deadline,
        UserId: request.params.userid
      }).then(function(result) {
        res.json({
          id: result.id
        });
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Update College
  app.put("/api/colleges/:id", function(req, res) {
    db.College.update({
      name: req.body.name,
      description: req.body.description,
      requirements: req.body.requirements,
      tuition: req.body.tuition,
      application_deadline: req.body.application_deadline
    }, {
      where: {
        //id: req.params.id
        id: request.body.id
      }
    })
  .then(function(result) {
    res.json(result);
  }).catch(function(err) {
    res.json(err);
  });
});

  // Delete College
  app.delete("/api/colleges/:id", function(req, res) {
    db.College.destroy({
      where: {
        id: req.body.id
      }
    })
  .then(function(result) {
    res.json(result);
  }).catch(function(err) {
    res.json(err);
  });
});

  //=======================Task================================

  // Get All Tasks for One User
  app.get("/api/tasks/:id", function(req, res) {
    db.Task.findAll({
        include: [db.User],
        where: {
          UserId: req.body.id,
        }
      })
      .then(function(result) {
        res.json(result);
        // return res.render('index', {
        //   result
        // })
      }).catch(function(err) {
        res.json(err);
      });
  });

  // Create Task
  app.post("/api/tasks/:userid", function(req, res) {
    db.Task.create({
        task: req.body.task,
        UserId: request.params.userid
      }).then(function(result) {
        res.json({
          id: result.id
        });
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // Update Task
  app.put("/api/tasks/:id", function(req, res) {
    db.Task.update({
      task: req.body.task
    }, {
      where: {
        //id: req.params.id
        id: request.body.id
      }
    })
  .then(function(result) {
    res.json(result);
  }).catch(function(err) {
    res.json(err);
  });
});


  // Delete Task
  app.delete("/api/tasks/:id", function(req, res) {
    db.Task.destroy({
      where: {
        id: req.body.id
      }
    })
  .then(function(result) {
    res.json(result);
  }).catch(function(err) {
    res.json(err);
  });
  });

};

var makeQuery = function(data,req,res){
  var zipCode = data.location;
  var api_key = "TVS524kLUADDEEUcZl0PFHtEbVISmZCAGeT6buGi";
  var results = "&_fields=id,school.name";
  var query = "https://api.data.gov/ed/collegescorecard/v1/schools.json?_zip="+zipCode+"&_distance=100mi&api_key="+ api_key + results;

  request(query, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', JSON.parse(body)); 

    // JSON.parse(body);

    var colleges = {colleges: [body["results"]]};
    console.log("____COLLEGES_____");
    console.log(colleges);
    res.render('user', colleges);

    return body;

  });

}




