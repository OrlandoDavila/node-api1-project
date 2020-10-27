const express = require('express'); //import express from 'express'
const { json } = require('express')

const server = express();
const shortid = require('shortid'); //npm i shortid

let users = [
    {
        id: 1,
        name: "Some Person",
        bio: "I do a thing"
    },
    {
        id: 2,
        name: "Another Person",
        bio: "I do another thing"
    },
    {
        id: 3,
        name: "Some PersonAgain",
        bio: "I do more things"
    },
];


/*****************POST******************************************************************************/ 

//When the client makes a POST request to /api/users:
server.post("/api/users", (req, res) => {
    const { name, bio } = req.body;
//If the request body is missing the name or bio property:
        if (!name || !bio) {
//respond with HTTP status code 400 (Bad Request).
        res.status(400).json({
//return the following JSON response: { errorMessage: "Please provide name and bio //for the user." }.
            errorMessage: "Please provide a name and a bio for the user",
    });            
//If the information about the user is valid:
} else {
//save the new user the the database.
  try {
     const newUser = {
         name: name,
         bio: bio,
         id: shortid.generate(),
     }; 
     users.push(newUser);
//respond with HTTP status code 201 (Created).
//return the newly created user document.
     req.status(201).json(newUser);
//If there's an error while saving the user:
} catch {    
//respond with HTTP status code 500 (Server Error).
    res.status(500).json({
//return the following JSON object: { errorMessage: "There was an error while saving the user to the database" }.
        errorMessage:
            "There was an error while saving the user to the database",
     });
    }
  }
});

/*****************GET******************************************************************************/ 


//When the client makes a GET request to /api/users:
server.get("/api/users", (req, res) => {
    try {
      res.status(200).json(users);
//If there's an error in retrieving the users from the database:
//respond with HTTP status code 500.
//return the following JSON object: { errorMessage: "The users information could not be retrieved." }.
    } catch {
      res.status(500).json({
        errorMessage: "The users information could not be retrieved.",
      });
    }
  });
  //When the client makes a GET request to /api/users/:id:
  server.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    
  
    const user = users.find((u) => u.id === id);

    console.log(user);
//If the user with the specified id is not found:
    if (!user) {
//respond with HTTP status code 404 (Not Found).
//return the following JSON object: { message: "The user with the specified ID does not exist." }.        
      res.status(404).json({
        message: "The user with the specified ID does not exist.",
      });
    } else {
      try {
        res.status(200).json(user);
//If there's an error in retrieving the user from the database:
//respond with HTTP status code 500.
//return the following JSON object: { errorMessage: "The user information could not be retrieved." }.
      } catch {
        res.status(500).json({
          errorMessage: "The users information could not be retrieved.",
        });
      }
    }
  });




/*****************DELETE******************************************************************************/ 

//When the client makes a DELETE request to /api/users/:id:
server.delete("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);

  const deleted = users.find((u) => u.id === id);
  console.log(deleted)

  if(deleted) {
     users = users.filter((user) => user.id !== id)
      res.status(200).json(users).end()
//If the user with the specified id is not found:
  } else if (!deleted) {
//respond with HTTP status code 404 (Not Found).
//return the following JSON object: { message: "The user with the specified ID does not exist." }.
      res.status(404).json({message: "The user with the specified ID does not exist."})
//If there's an error in removing the user from the database:
  } else {
      //respond with HTTP status code 500.
//return the following JSON object: { errorMessage: "The user could not be removed" }.
      res.status(500).json({errorMessage: "The user could not be removed"})
  }
})



/*****************PUT******************************************************************************/

//When the client makes a PUT request to /api/users/:id:
server.put("/api/users/:id", (req, res) => {
    const id = Number(req.params.id)

    const edited = req.body

    let userToEdit = users.find((u) => u.id === id)

    if(!edited.name || !edited.bio) {
//respond with HTTP status code 400 (Bad Request).
//return the following JSON response: { errorMessage: "Please provide name and bio for the user." }.
//If there's an error when updating the user:
        res.status(400).json({errorMessage: "Please provide name and bio for the user."})
//If the user with the specified id is not found:     
    } else if(!userToEdit) {
//respond with HTTP status code 404 (Not Found).
//return the following JSON object: { message: "The user with the specified ID does not exist." }.
//If the request body is missing the name or bio property:
        res.status(404).json({errorMessage: "The user with the specified ID does not exist."})
    } else if(userToEdit) {
        Object.assign(userToEdit, edited)
//If the user is found and the new information is valid:
//update the user document in the database using the new information sent in the request body.
//respond with HTTP status code 200 (OK).
//return the newly updated user document.
        res.status(200).json(userToEdit)
    } else {
//respond with HTTP status code 500.
//return the following JSON object: { errorMessage: "The user information could not be modified." }.
        res.status(500).json({errorMessage: "The user information could not be modified"})
    }
})


const port = 5000; //used to see api
server.listen(port, () => console.log("Server running..."));