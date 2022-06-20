import express from 'express'
import cors from 'cors'

const server = express()

server.use(cors())

server.use(express.json())

const users = []
const tweets = []

server.post('/sign-up', (req, res) => {
  const { username, avatar } = req.body

  switch (true) {
    case username === undefined || avatar === undefined:
      res.sendStatus(400)
      return

    case username.trim() === '' || avatar.trim() === '':
      res.status(400).send('Todos os campos são obrigatórios!')
      return

    case isURL(avatar):
      res.status(400).send('URL inválido')
      return

    case username[0] === ' ' || username[username.length - 1] === ' ':
      res
        .status(400)
        .send('Nome do usuário não pode começar ou terminar com espaços vazios')
      return

    default:
      users.push(req.body)

      res.status(201).send('OK')
      return
  }
})

server.get('/tweets', (req, res) => {
  const page = req.query.page

  if (page < 1) res.status(400).send('Informe uma página válida!')

  const startIndex = (page - 1) * 10
  const endIndex = page * 10

  const send = tweets.slice(startIndex, endIndex)

  res.send(send)
})

server.post('/tweets', (req, res) => {
  const username = req.headers.user
  const tweet = req.body.tweet

  if (tweet === undefined || username === undefined) {
    return res.sendStatus(400)
  }

  if (username.trim() === '' || tweet.trim() === '') {
    return res.status(400).send('Todos os campos são obrigatórios!')
  }

  const post = {
    tweet: tweet,
    username: username,
    avatar: users.find(item => item.username === username).avatar
  }

  tweets.unshift(post)

  res.status(201).send('OK')
})

server.get('/tweets/:USERNAME', (req, res) => {
  const userName = req.params.USERNAME

  const tweetsUser = tweets.filter(item => item.username === userName)

  if (tweetsUser.length === 0) res.sendStatus(400)

  res.send(tweetsUser)
})

server.listen(5000)

function isURL(avatar) {
  const regexUrlImage = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/g

  return regexUrlImage.test(avatar) === false
}
