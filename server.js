// import our dependencies
const express = require('express')
const app = express()
const mysql = require('mysql2');
const dotenv = require('dotenv')

// configure environment variables
dotenv.config();


//create a connection object
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// test the connection
db.connect((err) => {
    // if the connection is not successful
    if(err) {
        return console.log("Error connecting to the database: ", err)
    }

    // connection is successfull
    console.log("Successfully connected to MySQL: ", db.threadId)
})



// Question 1
// retrieve all patients
app.get('/get-patients', (req,res) => {
    const getPatients = "SELECT * FROM patients"
    db.query(getPatients, (err,data) => {
        // if i have an error
        if(err) {
            return res.status(500).send("Failed to get patients", err)
        }

        res.status(200).send(data)
    })
})


// Question 2
//retrieve all providers
app.get('/get-providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Failed to fetch providers:', err);
            res.status(500).json({ error: 'An error occurred accessing providers' });
            return;
        }
        res.json(results);
    });
});


// Question 3
// Filter patients by first name
app.get('/patients', (req, res) => {
  const firstName = req.query.first_name; // obtain the first name from query parameters

  if (!firstName) {
      return res.status(400).json({ error: 'Provide a first name to filter' });
  }

  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';

  db.query(query, [firstName], (err, results) => {
      if (err) {
          console.error('Failed to get patients:', err);
          res.status(500).json({ error: 'An error occurred while retrieving patients' });
          return;
      }

      // If no patients found, send a message
      if (results.length === 0) {
          res.status(404).json({ message: 'No patients found with the given first name' });
          return;
      }

      res.json(results);
  });
});


// Question 4
// Retrieve all providers by the specialty
app.get('/providers', (req, res) => {
  const specialty = req.query.provider_specialty; // retrieve the specialty from query parameters

  if (!specialty) {
      return res.status(400).json({ error: 'Please provide a provider specialty to filter' });
  }

  const query = 'SELECT provider_id, first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';

  db.query(query, [specialty], (err, results) => {
      if (err) {
          console.error('Error fetching providers:', err);
          res.status(500).json({ error: 'An error occurred while fetching providers' });
          return;
      }

      // If no providers found, send a message
      if (results.length === 0) {
          res.status(404).json({ message: 'No providers found with the given specialty' });
          return;
      }

      res.json(results);
  });
});

// listen to the server
app.listen(3300, () => {
  console.log(`server is running on port 3300...`)
})


