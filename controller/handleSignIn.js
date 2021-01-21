const handleSignIn = (req, res, db, bcrypt) => {

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
}

module.exports = {
    handleSignIn : handleSignIn
}