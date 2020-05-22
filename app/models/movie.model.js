const sql = require("./db.js");

// constructor
const Movie = function(movie) {
  this.mid = movie.mid;
  this.title = movie.title;
  this.release_date = movie.release_date;
  this.summary = movie.summary;
  this.runtime = movie.runtime;
  this.rating = movie.rating;
  this.num_votes = movie.num_votes;
};

Movie.create = (newMovie, result) => {
  sql.query("INSERT INTO movies SET ?", newMovie, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created movie: ", { ...newMovie });
    result(null, { ...newMovie });
  });
};

Movie.findById = (mid, result) => {
  sql.query(`SELECT mid, title, DATE_FORMAT(release_date, '%Y-%m-%d') AS release_date, summary, runtime, rating, num_votes FROM movies WHERE mid=?`, mid, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found movie: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Movie with the id
    result({ kind: "not_found" }, null);
  });
};

Movie.getAll = result => {
  sql.query("SELECT mid, title, DATE_FORMAT(release_date, '%Y-%m-%d') AS release_date, summary, runtime, rating, num_votes FROM movies", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("movies: ", res);
    result(null, res);
  });
};

function addUpdateQuery(query, columnName, value) {
  var addedQuery = "";
  if (value !== undefined)
    addedQuery = query.includes('SET') ? `, ` + columnName + ` = ` + sql.escape(value) : ` SET ` + columnName + ` = ` + sql.escape(value);
  return addedQuery;
}

Movie.updateById = (id, movie, result) => {
  var query = "UPDATE movies";
  query += addUpdateQuery(query, 'title', movie.title);
  query += addUpdateQuery(query, 'release_date', movie.release_date);
  query += addUpdateQuery(query, 'summary', movie.summary);
  query += addUpdateQuery(query, 'runtime', movie.runtime);
  query += addUpdateQuery(query, 'rating', movie.rating);
  query += addUpdateQuery(query, 'num_votes', movie.num_votes);
  query += ` WHERE mid = ` + sql.escape(id);
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Movie with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("updated movie: ", { ...movie });
    result(null, { ...movie });
  });
};

Movie.remove = (id, result) => {
  sql.query("DELETE FROM movies WHERE mid = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Movie with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted movie with id: ", id);
    result(null, res);
  });
};

Movie.searchByParams = (title, year, summary, minruntime, maxruntime, minrating, maxrating, minvotes, maxvotes, genres, result) => {
  var query = `SELECT DISTINCT(m.mid), m.title, DATE_FORMAT(m.release_date, '%Y-%m-%d') AS release_date, m.summary, m.runtime, m.rating, m.num_votes FROM movies m JOIN movie_genres mg ON m.mid=mg.mid JOIN genres g ON mg.gid=g.gid`;
  if (title != undefined) {
    query += query.includes('WHERE') ? ` AND` : ` WHERE`;
    query += ` MATCH(m.title) AGAINST(` + sql.escape(title) + `)`;
  }
  if (year != undefined) {
    query += query.includes('WHERE') ? ` AND` : ` WHERE`;
    query += ` YEAR(m.release_date)=` + sql.escape(year);
  }
  if (summary != undefined) {
    query += query.includes('WHERE') ? ` AND` : ` WHERE`;
    query += ` MATCH(m.summary) AGAINST(` + sql.escape(summary) + `)`;
  }
  if (minruntime != undefined) {
    query += query.includes('WHERE') ? ` AND` : ` WHERE`;
    query += ` m.runtime >= ` + sql.escape(runtime);
  }
  if (maxruntime != undefined) {
    query += query.includes('WHERE') ? ` AND` : ` WHERE`;
    query += ` m.runtime <= ` + sql.escape(maxruntime);
  }
  if (minrating != undefined) {
    query += query.includes('WHERE') ? ` AND` : ` WHERE`;
    query += ` m.rating >= ` + sql.escape(minrating);
  }
  if (maxrating != undefined) {
    query += query.includes('WHERE') ? ` AND` : ` WHERE`;
    query += ` m.rating <= ` + sql.escape(maxrating);
  }
  if (minvotes != undefined) {
    query += query.includes('WHERE') ? ` AND` : ` WHERE`;
    query += ` m.num_votes >= ` + sql.escape(minvotes);
  }
  if (maxvotes != undefined) {
    query += query.includes('WHERE') ? ` AND` : ` WHERE`;
    query += ` m.num_votes <= ` + sql.escape(maxvotes);
  }
  if (genres != undefined) {
    query += query.includes('WHERE') ? ` AND` : ` WHERE`;
    query += ` g.name IN (` + sql.escape(genres).split(',').join("','") + `)`;

  }
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("people: ", res);
      result(null, res);
      return;
    }

    // not found Person with the id
    result({ kind: "not_found" }, null);
  });
};

Movie.findCreditsById = (mid, result) => {
  sql.query(`SELECT p.pid, p.name, j.name AS job, mc.credit, mc.role FROM people p JOIN movie_credits mc ON p.pid=mc.pid JOIN jobs j ON mc.jid=j.jid WHERE mc.mid=?;`, mid, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("people: ", res);
      result(null, res);
      return;
    }

    // not found Movie with the id
    result({ kind: "not_found" }, null);
  });
};

Movie.findGenresById = (mid, result) => {
  sql.query(`SELECT g.name AS genre FROM movie_genres mg JOIN genres g ON mg.gid=g.gid WHERE mg.mid=?;`, mid, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("people: ", res);
      result(null, res);
      return;
    }

    // not found Movie with the id
    result({ kind: "not_found" }, null);
  });
};

module.exports = Movie;