const jwt = require('jsonwebtoken')
let token = jwt.sign({ foo: 'bar' }, 'shhhh')

const handleSignIn = (req, res, db, bcrypt) => {

  const { email, password } = req.body

  return db.select('email', 'hash').from('login') // select에서는 returning을 사용할 필요가 없다??
      .where('email', '=', email)
      .then(data => {
          const isValid = bcrypt.compareSync(password, data[0].hash);
          if (isValid) {
              return db.select('*').from('users')
              .where('email', '=', email)
              .then(user => user[0])
              .catch(err => Promise.reject('로그인 실패'))
          } else {
          Promise.reject("로그인 실패")
      }
      })
      .catch(err => Promise.reject('로그인 실패'))
}

const getAuthTokenId = () => {
  console.log('authok')
}

const signToken = (email) => {
  const jwtPayload = { email }
  return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days'})

}

const createSessions = (user) => {
  const { email, id } = user
  const token = signToken(email);
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers
  return authorization 
  ? getAuthTokenId() 
  : 
  handleSignIn(req, res, db, bcrypt)
  .then(data => {
    data.id && data.email ? createSessions(data) : Promise.reject(data)
  })
  .catch(err => res.status(400).json('error'))
}


module.exports = {
    signinAuthentication : signinAuthentication
}