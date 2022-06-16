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
  users.push(req.body)
  res.send('OK')
})

server.get('/tweets', (_, res) => {
  const tweetsToSend = []
  for (let i = 0; i < 10 && i < tweets.length; i++) {
    tweetsToSend.push(tweets[tweets.length - (1 + i)])
  }
  res.send(tweetsToSend)
})

server.post('/tweets', (req, res) => {
  const post = {
    ...req.body,
    avatar: users.find(item => item.username === req.body.username).avatar
  }
  tweets.push(post)
  res.send('OK')
})

server.listen(5000)
