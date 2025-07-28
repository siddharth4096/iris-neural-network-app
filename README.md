# 🌸 Iris Species Predictor - Full Stack ML Web App

> **🎯 Goal**: Learn by doing! This project was created as a hands-on test to understand how to train, deploy, and integrate a Neural Network model into a full-stack web application using Flask, Node.js, and MySQL.

---

## 🔥 Project Highlights

🚀 **End-to-End Integration** of Machine Learning with Web Development  
🧠 Built and deployed a **Neural Network (MLPClassifier)** to classify Iris flower species  
🌐 Created a RESTful **Flask API** to serve predictions  
🗃️ Used **MySQL** to store inputs, predicted species, and class probabilities  
💡 Built a **Node.js + Express** backend to connect frontend with ML API  
🎨 Developed a basic, responsive **frontend** using HTML/CSS/JS

---

## 🧠 Technologies Used

| Part        | Stack / Tools                             |
|-------------|--------------------------------------------|
| Machine Learning | Python, Scikit-learn, Flask, joblib       |
| Backend API | Flask (for ML) + Node.js/Express (Manager) |
| Frontend    | HTML, CSS, JavaScript                      |
| Database    | MySQL + JSON column for probability scores |

---

## 🖼️ Demo Flow

1. 📥 User enters 4 features (sepal & petal length/width)
2. 🔁 Node.js server sends data to Flask model
3. 🧠 Flask returns prediction + class probabilities
4. 🗂️ Data is saved to MySQL for logging and analytics
5. 🧾 Prediction is shown on the frontend in real-time

---

## 📦 Folder Structure

```bash
iris-ml-test-project/
├── app.py                # Flask ML API
├── model.pkl             # Trained MLPClassifier
├── scaler.pkl            # Scaler used during training
├── label_encoder.pkl     # Encoded labels
├── server.js             # Node.js backend
├── public/               # Frontend UI files
│   ├── index.html
│   └── script.js
├── schema.sql            # MySQL table schema
├── package.json          # Node dependencies
├── requirements.txt      # Python dependencies
```

---

## 🗃️ MySQL Table Schema

```sql
CREATE DATABASE iris_predictions;
USE iris_predictions;

CREATE TABLE predictions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sepal_length DECIMAL(5,2),
  sepal_width DECIMAL(5,2),
  petal_length DECIMAL(5,2),
  petal_width DECIMAL(5,2),
  predicted_species VARCHAR(50),
  prediction_probabilities JSON,
  prediction_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 Getting Started

### ✅ Backend (Flask)
```bash
pip install -r requirements.txt
python app.py
```

### ✅ Manager (Node.js)
```bash
npm install
node server.js
```

Make sure your MySQL server is running and the schema is created.

---

## 📊 Sample Input

```json
{
  "features": [5.1, 3.5, 1.4, 0.2]
}
```

---

## 🎯 What I Learned

✅ Deploying a trained ML model with Flask  
✅ Creating REST APIs for prediction  
✅ Connecting ML logic with full-stack architecture  
✅ Logging predictions in a relational database  
✅ Building real-world workflows with JS, Express, SQL & Python

---

## 🤝 Let's Connect

📧 your.email@example.com  
🔗 [LinkedIn Profile](https://linkedin.com/in/yourname)  
🧠 I'm open to feedback, collaboration, and ideas!

---

## 📄 License

This project is licensed under the **MIT License**.
