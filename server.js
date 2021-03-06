const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
const knex = require('knex');
const { response } = require('express');
const morgan = require('morgan')
const redis = require('redis')
const redisClient = redis.createClient({host : 'redis'})

const signIn = require('./controller/handleSignIn')
const register = require('./controller/handleRegister')
const image = require('./controller/handleImage')
const profile = require('./controller/handleProfile')
const auth = require('./controller/authorization')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

app.use(cors());
app.use(morgan('combined'));
app.use(express.json()); 

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
  }
});

// signin과 register는 post요청(CRUD의 create)
app.get('/', (req, res) => {res.send('it is working')} )

app.post('/signin', (req, res) => { signIn.signinAuthentication(db, bcrypt, req, res) })

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
    
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfile(req, res, db) })

app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)})

app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) })

app.post('/submit', auth.requireAuth, (req, res) => { image.handleApi(req, res) })



app.listen(process.env.PORT || 3000, () => {
    console.log(`it is running on port 3000`)
})
