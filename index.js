import express from 'express'
import cors from 'cors'

const server = express()

server.use(cors())

server.use(
  express.urlencoded({
    extended: true
  })
)

server.use(express.json())

const users = []
const tweets = []

server.post('/sign-up', (req, res) => {
  const user = req.body

  if (validUser(user)) res.sendStatus(400)

  users.push(user)

  res.status(201).send('OK')
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

  if (username.trim() === '' || tweet.trim === '') res.sendStatus(400)

  const post = {
    tweet: tweet,
    username: username,
    avatar: users.find(item => item.username === username).avatar
  }

  tweets.push(post)

  res.status(201).send('OK')
})

server.get('/tweets/:USERNAME', (req, res) => {
  const userName = req.params.USERNAME

  const tweetsUser = tweets.filter(item => item.username === userName)

  if (tweetsUser.length === 0) res.sendStatus(400)

  res.send(tweetsUser)
})

server.listen(5000)

function validUser({ username, avatar }) {
  return (
    username === undefined ||
    avatar === undefined ||
    username.trim() === '' ||
    avatar.search(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png)/g) === -1
  )
}
