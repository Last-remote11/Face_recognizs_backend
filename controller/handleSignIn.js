const jwt = require('jsonwebtoken')
const redis = require('redis');
const redisClient = redis.createClient({host: 'redis', url: process.env.REDIS_URI});
let token = jwt.sign({ foo: 'bar' }, 'shhhh')

const handleSignIn = (db, bcrypt, req, res) => {
  console.log('handleSignIn')
  const { email, password } = req.body

  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }

  return db.select('email', 'hash').from('login')
      .where('email', '=', email)
      .then(data => {
          const isValid = bcrypt.compareSync(password, data[0].hash);
          if (isValid) {
            return db.select('*').from('users')
              .where('email', '=', email)
              .then(user => user[0])
              .catch(err => Promise.reject("로그인 실패"))
          } else {
          Promise.reject("로그인 실패")
      }
      })
      .catch(err => res.status(400).json('로그인 실패'))
}

const getAuthTokenId = (req, res) => { 
  // 토큰이 유효한지 확인하고 redis에 해당 토큰을 key로 가지는 value 찾아준다
  const { authorization } = req.headers
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('unauthorized')
    }
    return res.json({id: reply})
  })
}

const signToken = (email) => { 
  // 토큰발급
  const jwtPayload = { email }
  return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days' })
}

const setToken = (key, value) => {
  // 발급된 토큰을 redis에 저장
  return Promise.resolve(redisClient.set(key, value))
}

const createSessions = (user) => {
  const { email, id } = user
  const token = signToken(email)
  return setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token, user }
    })
    .catch(console.log)
}

const signinAuthentication = (db, bcrypt, req, res) => {
  console.log('signinAuthentication1')

  const { authorization } = req.headers // 토큰을 가지고 있는지 확인

  return authorization ? getAuthTokenId(req, res) 
  : handleSignIn(db, bcrypt, req, res) 
  // 토큰이 없으면 통상적인 로그인 과정을 밟되
  // 토큰을 발급받고 redis에 추가하는 과정을 추가
  .then(data => {
    console.log(data)
    return data.id && data.email ? createSessions(data) : Promise.reject(data)
  })
  .then(session => res.json(session))
  .catch(err => res.status(400).json('에러에러에러에러'))
}


module.exports = {
    signinAuthentication : signinAuthentication
}