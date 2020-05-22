module.exports = app => {
    const movies = require("../controllers/movie.controller.js");
  
    // Create a new Movie
    app.post("/movies", movies.create);
  
    // Retrieve all Movies
    app.get("/movies", movies.findAll);
  
    // Retrieve a single Movie with mid
    app.get("/movies/:mid", movies.findOne);

    // Retrieve credits from a single Movie with mid
    app.get("/movies/:mid/fullcredits", movies.findCredits);

    // Retrieve genres from a single Movie with mid
    app.get("/movies/:mid/genres", movies.findGenres);

    // Update a Movie with mid
    app.put("/movies/:mid", movies.update);
  
    // Delete a Movie with mid
    app.delete("/movies/:mid", movies.delete);
};