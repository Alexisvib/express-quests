// Express is already installed
const { json } = require("express");
const express = require("express");
const db = require("./db-config");

db.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  } else {
    console.log("connected to database with threadId :  " + db.threadId);
  }
});

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to my favourite movie list");
});

app.get("/api/movies", async (req, res) => {
  let sqlQuery = "SELECT * FROM movies";

  const color = req.query.color;

  const max_duration = req.query.max_duration;

  const sqlValues = [];

  if (color && !max_duration) {
    sqlQuery += " WHERE color = ?";
    sqlValues.push(color);
  }

  if (max_duration && !color) {
    sqlQuery += " WHERE duration <= ?";
    sqlValues.push(max_duration);
  }

  if (max_duration && color) {
    sqlQuery += " WHERE color= ? AND duration <= ?";
    sqlValues.push(color, max_duration);
  }

  db.query(sqlQuery, sqlValues, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/api/movies/:id", (req, res) => {
  db.query(
    "SELECT * FROM movies WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).send("Error getting the movie");
      } else {
        if (result.length > 0) {
          return res.status(200).json(result[0]);
        } else {
          return res.status(404).send("Movie not found");
        }
      }
    }
  );
});

app.get("/api/search", (req, res) => {
  const maxDuration = parseInt(req.query.maxDuration);
  const moviesFilter = movies.filter((movie) => movie.duration <= maxDuration);
  if (moviesFilter.length === 0) {
    res.status(404).send("no movies found for this duration");
  }
  res.status(200).json(moviesFilter);
});

app.get("/api/users", (req, res) => {
  let sqlQuery = "SELECT * FROM users";
  const sqlValues = [];
  if (req.query.language) {
    sqlQuery += " WHERE language = ?";
    sqlValues.push(req.query.language);
  }

  db.query(sqlQuery, sqlValues, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error getting the users");
    } else {
      return res.status(200).json(result);
    }
  });
});

app.post("/api/movies", (req, res) => {
  const { title, director, year, color, duration } = req.body;
  db.query(
    "INSERT INTO movies (title, director, year, color, duration) VALUES (?,?,?,?,?)",
    [title, director, year, color, duration],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error saving the movie");
      } else {
        res.status(201).send("Movie saved successfully");
      }
    }
  );
});

app.post("/api/users", (req, res) => {
  const { firstname, lastname, email } = req.body;
  db.query(
    "INSERT INTO users (firstname, lastname, email) VALUES (?,?,?)",
    [firstname, lastname, email],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error saving the User ");
      } else {
        res.status(201).send("User saved successfully");
      }
    }
  );
});

app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const userInfos = req.body;

  db.query(
    "UPDATE user SET ? WHERE id = ?",
    [userInfos, userId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating the user");
      } else {
        res.status(200).send("User updated successfully 🎉");
      }
    }
  );
});

app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [userId], (err, result) => {
    if (err) {
      res.status(500).send("Error deleting the user");
    } else {
      res.status(200).send("User deleted successfully");
    }
  });
});

app.get("/api/users/:id", (req, res) => {
  user = req.params.id;
  db.query("SELECT * FROM users WHERE id = ?", [user], (err, result) => {
    if (err) {
      res.status(500).send("Error during the process of getting the user");
    } else {
      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(200).send("No user corresponding to the id provided");
      }
    }
  });
});

app.delete("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;
  db.query("DELETE FROM movies WHERE id = ?", [movieId], (err, result) => {
    if (err) {
      res.status(500).send("Error deleting the movie");
    } else {
      res.status(200).send("Movie deleted successfully");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
