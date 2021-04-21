const Clarifai = require('clarifai');

const api = new Clarifai.App({
    apiKey: 'c9f7a09b371a4b52b7980905d777c44b'
})

const handleApi = (req, res) => {
    
    api.models.predict('d02b4508df58432fbb84e800597b8959', req.body.imgUrl)
    .then(result => {
        res.json(result)
    })
    .catch(err => res.statue(400).json('실패'))
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id' ,'=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0])
    })
    .catch(err => res.status(400).json("에러발생"))
}

module.exports = {
    handleImage,
    handleApi
}