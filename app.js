const express = require("express");
const bodyParser = require ("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public")); //An Express function is in order for our server to serve up static files such as CSS & images.
app.use(bodyParser.urlencoded({extended: true})); //In order to use bodyParser that we required.

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html"); //Our response is to send the file that is at the location of our directory name + ""
});

app.post("/", function(req, res){ //to pull up the values of those things inside our form.
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  // console.log(firstName, lastName, email);

  var data = { //Javascript
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_field: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data); //Turn the JavaScript data into the string in format of JSON.

  // const url = "https://$API_SERVER.api.mailchimp.com/3.0/lists/$list_id/members"
  const url = "https://us21.api.mailchimp.com/3.0/lists/239f20c8ab";

  const options = {
    method: "POST",
    auth: "Sep:6720506ccae546f5c3178e41823dd582-us21"
  }

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }


    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
})

app.post("/failure", function(req, res){ //when we click the "try again" button, it will take us back to the origin page.
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
});

// API key:
// 6720506ccae546f5c3178e41823dd582-us21
//
// List Id
// 239f20c8ab
