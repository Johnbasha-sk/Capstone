const express = require('express');
const app = express();
const port = 5000;

const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore } = require('firebase/firestore');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));

app.set('view engine', 'ejs');
app.use(express.static('public'));

const firebaseConfig = {
  apiKey: "AIzaSyBYO4eQ7sygLuwTh2ZNovbACArVSmKDVw0",
  authDomain: "capstone-cb28d.firebaseapp.com",
  databaseURL: "https://capstone-cb28d-default-rtdb.firebaseio.com",
  projectId: "capstone-cb28d",
  storageBucket: "capstone-cb28d.appspot.com",
  messagingSenderId: "692523877521",
  appId: "1:692523877521:web:1fe7d4a7e5d0f206bfab30"
};

const app1 = initializeApp(firebaseConfig);
const auth = getAuth(app1);
const db = getFirestore(app1);

app.get('/', (req, res) => {
  res.render('welcome');
});

app.get('/signup', (req, res) => {
  res.render('signup', { error: null }); // Pass null as the initial error
});

app.post('/signupSubmit', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user);
    res.render('login');
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;

    if (errorCode === 'auth/email-already-in-use') {
      // Email is already in use, display an error message to the user
      res.render('signup', { error: 'Email already in use. Please choose a different one.' });
    } else {
      console.error('Signup error:', errorCode, errorMessage);
      res.render('signup', { error: 'An error occurred during signup. Please try again later.' });
    }
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/loginSubmit', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed in:', user);
    res.render('dashboard');
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('Login error:', errorCode, errorMessage);
    res.render('login', { error: 'Invalid email or password. Please try again.' });
  }
});

app.get('/dashboard', (req, res) => {
  res.render('/welcome')
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
