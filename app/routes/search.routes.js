module.exports = app => {
    const movies = require("../controllers/movie.controller.js");
    const people = require("../controllers/person.controller.js");

    // Search movie
    app.get("/search/movie", movies.search);
  
    // Search person
    app.get("/search/person", people.search);
}