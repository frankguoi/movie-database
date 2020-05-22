module.exports = app => {
    const people = require("../controllers/person.controller.js");
  
    // Create a new Person
    app.post("/people", people.create);
  
    // Retrieve all People
    app.get("/people", people.findAll);
  
    // Retrieve a single Person with pid
    app.get("/people/:pid", people.findOne);

    // Retrieve filmography of a Person with pid
    app.get("/people/:pid/filmography", people.findFilmography);

    // Update a Person with pid
    app.put("/people/:pid", people.update);
  
    // Delete a Person with pid
    app.delete("/people/:pid", people.delete);
};