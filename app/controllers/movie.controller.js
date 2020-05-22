const Movie = require("../models/movie.model.js");

// Create and Save a new Movie
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  
  // Create a Movie
  const movie = new Movie({
    mid: req.body.mid,
    title: req.body.title,
    release_date: req.body.release_date,
    summary: req.body.summary,
    runtime: req.body.runtime,
    rating: req.body.rating,
    num_votes: req.body.num_votes
  });
  
  // Save Movie in the database
  Movie.create(movie, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Movie."
      });
    else res.send(data);
  });
};

// Retrieve all Movies from the database.
exports.findAll = (req, res) => {
  Movie.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving movies."
      });
    else res.send(data);
  });
};

// Find a single Movie with a mid
exports.findOne = (req, res) => {
  Movie.findById(req.params.mid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Movie with id ${req.params.mid}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Movie with id " + req.params.mid
        });
      }
    } else res.send(data);
  });
};

// Update a Movie identified by the mid in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  
  Movie.updateById(
    req.params.mid,
    new Movie(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found movie with id ${req.params.mid}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Movie with id " + req.params.mid
          });
        }
      } else res.send(data);
    }
  );
};

// Delete a Movie with the specified mid in the request
exports.delete = (req, res) => {
  Movie.remove(req.params.mid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Movie with id ${req.params.mid}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Movie with id " + req.params.mid
        });
      }
    } else res.send({ message: `Movie was deleted successfully!` });
  });
};

// Retrieve movie credits with the mid
exports.findCredits = (req, res) => {
  Movie.findCreditsById(req.params.mid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found credits with movie '${req.params.mid}'.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving credits with Movie '" + req.params.mid + "'"
        });
      }
    } else res.send(data);
  });
}

// Retrieve movie genres with the mid
exports.findGenres = (req, res) => {
  Movie.findGenresById(req.params.mid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found genres with movie '${req.params.mid}'.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving genres with Movie '" + req.params.mid + "'"
        });
      }
    } else res.send(data);
  });
}

// Search movie with the specified query parameters in the request
exports.search = (req, res) => {
  Movie.searchByParams(req.query.title, req.query.year, req.query.summary, req.query.minruntime, req.query.maxruntime, req.query.minrating, req.query.maxrating, req.query.minvotes, req.query.maxvotes, req.query.genres, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Person with '${JSON.stringify(req.query)}'.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Movie with '" + JSON.stringify(req.query) + "'"
        });
      }
    } else res.send(data);
  });
}