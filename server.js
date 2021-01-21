const express = require('express');
const bcrypt = require('bcrypt-nodejs')

const cors = require('cors')
const app = express();

const knex = require('knex');
const { response } = require('express');

const signIn = require('./controller/handleSignIn')
const register = require('./controller/handleRegister')
const image = require('./controller/handleImage')
const profile = require('./controller/handleProfile')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'peko',
      database : 'facerecognize'
    }
  });



app.use(express.json()); 
app.use(cors())


// signin과 register는 post요청(CRUD의 create)
app.get('/', (req, res) => {res.send('it is working')} )

app.post('/signin', (req, res) => { signIn.handleSignIn(req, res, db, bcrypt) })

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
    
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/submit', (req, res) => { image.handleApi(req, res) })

app.listen(process.env.PORT || 3000, () => {
    console.log(`it is running on port ${process.env.PORT}`)
})
