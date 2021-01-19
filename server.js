const express = require('express');
const bcrypt = require('bcrypt-nodejs')

const cors = require('cors')
const app = express();

app.use(express.json()); 
// 원래는 body-parser라는 별개의 패키지였으나 express와 통합됨

app.use(cors())

const database = {
    users: [
        {
            id: '123',
            name: 'peko',
            password: "miko",
            email: 'peko@gmail.com',
            entries: 0,
            joined: new Date()
        },
        {
            id: '456',
            name: 'houshou',
            password: "marine",
            email: 'houshou@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ],

    login: [
        {
            id: '987',
            hash: '',
            email: 'peko@gmail.com'
        }
    ]
}
// 임시로 맨든 데이터베이스. 서버를 새로고침하면 추가된건 날아감


app.get('/', (req, res) => {
    res.send(database.users)
})


// signin과 register는 post요청(CRUD의 create)
app.post('/signin', (req, res) => {

    bcrypt.compare("miko", '$2a$10$iy2MZm6GWuOqm3J8kiG9xeb7pP//nvVavylAeb4Od5uJYE3kUSVQq', function(err, res) {
        console.log('first guess', res)
    });

    bcrypt.compare("haha", '$2a$10$iy2MZm6GWuOqm3J8kiG9xeb7pP//nvVavylAeb4Od5uJYE3kUSVQq', function(err, res) {
        console.log('seconde guess', res)
    })

    let signinSuccess = false
    const { email, password } = req.body

    database.users.forEach((user, i) => {
        if (email === user.email && password === user.password) {
            signinSuccess = true
            res.json(database.users[i])
        }
    })
        if (!signinSuccess) {
            res.status(400).json('로그인 실패')
        }
    

    // if (req.body.email === database.users[1].email &&
    //     req.body.password === database.users[1].password ) {
    //     res.json('sign in success')
    // } else {
    //     res.status(400).json('wrong email or password')
    // }

    // db와 대조하여 맞으면 로그인 아니면 거부?
});

app.post('/register', (req, res) => {

    const { email, name, password} = req.body
    
    database.users.push(
        {
            id: '124',
            name: name,
            email: email,
            entries: 0,
            joined: new Date()
        }
    )
    res.json(database.users[database.users.length - 1])
})
    

app.get('/profile/:id', (req, res) => {
    let found = false;
    const { id } = req.params;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('그런 유저는 없습니다.')
    }     
})

app.put('/image', (req, res) => {
    let found = false
    const { id } = req.body;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('그런 유저는 없습니다.')
    }
})



// bcrypt.hash(password, null, null, function(err, hash) {
//     console.log(hash)
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });



app.listen(3000, () => {
    console.log("it is running on port 3000")
})
