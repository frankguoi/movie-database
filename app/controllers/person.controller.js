const Person = require("../models/person.model.js");

// Create and Save a new Person
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  
  // Create a Person
  const person = new Person({
    pid: req.body.pid,
    name: req.body.name,
  });
  
  // Save Person in the database
  Person.create(person, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Person."
      });
    else res.send(data);
  });
};

// Retrieve all People from the database.
exports.findAll = (req, res) => {
    Person.getAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving people."
        });
      else res.send(data);
    });
  };

// Find a single Person with a pid
exports.findOne = (req, res) => {
    Person.findById(req.params.pid, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Person with id '${req.params.pid}'.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Person with id '" + req.params.pid + "'"
          });
        }
      } else res.send(data);
    });
  };

// Update a Person identified by the pid in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  
  Person.updateById(
    req.params.pid,
    new Person(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found person with id '${req.params.pid}'.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Person with id '" + req.params.pid + "'"
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Person with the specified pid in the request
exports.delete = (req, res) => {
  Person.remove(req.params.pid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Person with id '${req.params.pid}'.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Person with id '" + req.params.pid + "'"
        });
      }
    } else res.send({ message: `Person was deleted successfully!` });
  });
};

// Search people with the specified query parameters in the request
exports.findFilmography = (req, res) => {
  Person.findFilmographyById(req.params.pid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found filmography with person '${req.params.pid}'.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving filmography with person '" + req.params.pid + "'"
        });
      }
    } else res.send(data);
  });
}

// Search people with the specified query parameters in the request
exports.search = (req, res) => {
  Person.searchByParams(req.query.name, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Person with name '${req.query.name}'.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Person with name '" + req.query.name + "'"
        });
      }
    } else res.send(data);
  });
}