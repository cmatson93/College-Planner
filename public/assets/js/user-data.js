
// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {


  $("#register").on("click", function(event) {
    console.log("YAYAYAY");
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newUser = {
      username: $("#email").val().trim(),
      email: $("#email").val().trim(),
      password: $("#password").val().trim(),
      location: $("#location").val().trim(),
      gpa: $("#gpa").val().trim(),
    };

    console.log(newUser);
    // Send the POST request.
    $.ajax("/api/users", {
      type: "POST",
      data: newUser
    }).then(
      function(result) {
        console.log("created new user");
        // Reload the page to get the updated list
        // location.href = '/profile';
        console.log(result);
        // var id = res.body.id;
        // console.log(id);
        location.href = 'api/users/'+ result.id;
      }
    );
  });

  $.ajax("api/users/:id", {
    type: "GET"
  }).then(function(result){
      console.log("___get___");
  })

});



