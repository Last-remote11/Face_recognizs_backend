const handleProfile = (req, res) => {

const { id } = req.params;

db.select('*').from('users').where({id}).then(user => {
    if (user.length) {
        res.json(user[0])
    } else {
        res.status(400).json('그런 유저는 없습니다.')
    }
})
.catch(err => {res.status(400).json('error getting user')})
}

module.exports = {
    handleProfile: handleProfile
}