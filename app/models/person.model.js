const sql = require("./db.js");

// constructor
const Person = function(person) {
  this.pid = person.pid;
  this.name = person.name;
};

Person.create = (newPerson, result) => {
  sql.query("INSERT INTO people SET ?", newPerson, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created person: ", { ...newPerson });
    result(null, { ...newPerson });
  });
};

Person.findById = (pid, result) => {
  sql.query(`SELECT * FROM people WHERE pid = ?`, pid, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found person: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Person with the id
    result({ kind: "not_found" }, null);
  });
};

Person.getAll = result => {
  sql.query("SELECT * FROM people", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("people: ", res);
    result(null, res);
  });
};

Person.updateById = (id, person, result) => {
  sql.query(
    "UPDATE people SET name = ? WHERE pid = ?",
    [person.name, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Person with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated person: ", { ...person });
      result(null, { ...person });
    }
  );
};

Person.remove = (id, result) => {
  sql.query("DELETE FROM people WHERE pid = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Person with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted person with id: ", id);
    result(null, res);
  });
};

Person.searchByParams = (name, result) => {
  sql.query(`SELECT * FROM people WHERE MATCH(name) AGAINST(?)`, name, (err, res) => {
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

Person.findFilmographyById = (pid, result) => {
  sql.query(`SELECT m.mid, m.title, DATE_FORMAT(m.release_date, '%Y-%m-%d') AS release_date, j.name AS job, mc.credit, mc.role FROM movies m JOIN movie_credits mc ON m.mid=mc.mid JOIN jobs j ON mc.jid=j.jid WHERE mc.pid=? ORDER BY m.release_date DESC;`, pid, (err, res) => {
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

module.exports = Person;