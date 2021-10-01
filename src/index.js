// Express is already installed
const express = require("express");
const db = require("./db-config");

db.connect((err) => {
    if (err) {
      console.error('error connecting: ' + err.stack);
    } else {
      console.log('connected to database with threadId :  ' + db.threadId);
    }
  });



const app = express();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome to my favourite movie list");
});

app.get("/api/movies", async (req, res) => {
    try {
        const rows = await db.promise().query('SELECT * FROM movies');
        return res.status(200).json(rows[0]);
    } catch(err) {
        res.status(500).send('Error retrieving data from database');
    }
});

app.get("/api/movies/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find((movie) => movie.id === id);
  if (!movie) {
    res.status(404).send("Not Found");
  }
  res.status(200).json(movie);
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
  res.status(401).send("unauthorized");
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
