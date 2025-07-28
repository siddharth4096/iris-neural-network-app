-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS iris_predictions;

-- Use the created database
USE iris_predictions;

-- Create a table to store the predictions if it doesn't exist
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sepal_length DECIMAL(5, 2) NOT NULL,
    sepal_width DECIMAL(5, 2) NOT NULL,
    petal_length DECIMAL(5, 2) NOT NULL,
    petal_width DECIMAL(5, 2) NOT NULL,
    predicted_species VARCHAR(50) NOT NULL,
    prediction_probabilities JSON, -- This stores the detailed probabilities
    prediction_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP -- Records when it was saved
);