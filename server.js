const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise'); // New: To talk to MySQL database

const app = express();
app.use(cors());
app.use(express.json());

// --- Your MySQL Database Connection Details ---
const dbConfig = {
    host: 'localhost',
    user: 'root',    
    password: '014323', 
    database: 'iris_predictions'   
};

let pool; // This will manage your database connections efficiently

// Function to set up the database connection when the Node.js server starts
async function initializeDatabasePool() {
    try {
        pool = mysql.createPool(dbConfig);
        console.log('MySQL connection ready to go!');

        // Just a quick test to make sure it can connect
        const connection = await pool.getConnection();
        console.log('Successfully connected to MySQL database for a test.');
        connection.release(); // Give the connection back

    } catch (error) {
        console.error('FAILED to connect to MySQL! Check if MySQL server is running and your username/password are correct:', error);
        process.exit(1); // Stop the server if it can't connect to the database
    }
}

// Start connecting to the database as soon as the Node.js app begins
initializeDatabasePool();

// --- Tell Node.js where your website files are (HTML, CSS, JS) ---
app.use(express.static(path.join(__dirname, 'public')));

// --- The part that handles requests from your website ---
app.post('/api/predict', async (req, res) => {
  const { features } = req.body; // Get the plant measurements from the website

  // Basic check to make sure we got 4 numbers for the features
  if (!features || !Array.isArray(features) || features.length !== 4) {
    return res.status(400).json({ error: 'Please provide all 4 plant measurements.' });
  }

  // Store individual measurements for saving later
  const [sepal_length, sepal_width, petal_length, petal_width] = features;

  let predictionResult = null;
  let predictionProbabilities = null;

  try {
    // 1. Send the plant measurements to your Flask "Brain" app
    const flaskResponse = await axios.post('http://127.0.0.1:5000/predict', {
      features: features
    });

    predictionResult = flaskResponse.data.prediction;
    predictionProbabilities = flaskResponse.data.probabilities;

    // 2. NOW, save this information to your MySQL database
    const insertQuery = `
      INSERT INTO predictions
      (sepal_length, sepal_width, petal_length, petal_width, predicted_species, prediction_probabilities)
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    // Convert the probabilities (which is a JavaScript object) into a text format MySQL can store
    const probabilitiesJsonString = JSON.stringify(predictionProbabilities);

    await pool.query(insertQuery, [
      sepal_length,
      sepal_width,
      petal_length,
      petal_width,
      predictionResult,
      probabilitiesJsonString
    ]);
    console.log('Prediction and plant data SAVED to the database!');

    // 3. Send the prediction result back to your website
    res.json(flaskResponse.data); // Send back exactly what Flask gave us

  } catch (error) {
    console.error('Something went wrong during prediction or saving data:', error.message);
    // More detailed error logs if Flask or MySQL gives a specific response
    if (error.response) {
        console.error('Details from Flask:', error.response.data);
        console.error('Flask status:', error.response.status);
    }
    if (error.sqlMessage) { // If it's a MySQL error
        console.error('MySQL Error message:', error.sqlMessage);
        res.status(500).json({ error: 'Failed to save data to database.' });
    } else { // If it's a problem talking to Flask or general error
        res.status(500).json({ error: 'Prediction could not be completed.' });
    }
  }
});

// --- Start the Node.js Manager ---
app.listen(3000, () => {
  console.log('Node.js Manager (server) is running at http://localhost:3000');
  // console.log('Your website files are being served from the "public" folder.');
});