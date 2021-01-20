const express = require('express');
const bcrypt = require('bcrypt-nodejs')

const cors = require('cors')
const app = express();

const knex = require('knex');
const { response } = require('express');

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



app.get('/', (req, res) => {
    res.send(database.users)
})


// signin과 register는 post요청(CRUD의 create)
app.post('/signin', (req, res) => {

    const { email, password } = req.body

    db.select('email', 'hash').from('login') // select에서는 returning을 사용할 필요가 없다??
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                .where('email', '=', email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.statusMessage(400).json('로그인 실패'))
            } else {
            res.status(400).json("로그인 실패")
        }
        })
        .catch(err => res.status(400).json('로그인 실패'))
})



app.post('/register', (req, res) => {

    const { email, name, hash} = req.body
    
    // 두 가지 이상의 작업을 할 경우 트랜잭션 사용
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail=> {
            return trx('users')
                .returning('*') // returning을 하면 insert를 수행한 뒤 결과(?)를 반환해줌
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date() 
                })
                .then(user => 
                    res.json(user[0]))
                .catch(err => 
                    res.status(400).json('이미 가입된 이메일입니다.'))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })


})
    

app.get('/profile/:id', (req, res) => {

    const { id } = req.params;

    db.select('*').from('users').where({id}).then(user => {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('그런 유저는 없습니다.')
        }
    })
    .catch(err => {res.status(400).json('error getting user')})

})


app.put('/image', (req, res) => {

    const { id } = req.body;
    db('users').where('id' ,'=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json("에러발생"))
})


app.listen(3000, () => {
    console.log("it is running on port 3000")
})
