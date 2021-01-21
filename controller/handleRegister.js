const handleRegister = (req, res, db) => {

const { email, name, hash} = req.body

if (!email || !name) {
    return res.status(400).json('Register failed')
}
    
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
}

module.exports = {
    handleRegister: handleRegister
}