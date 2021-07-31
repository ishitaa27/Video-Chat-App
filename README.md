# Video-Chat App

A web based Video-Chat App that allows real-time communication via audio/video and messages.

Try the app at: - [arcane-waters-48936.herokuapp.com](https://arcane-waters-48936.herokuapp.com)


## Features

1. Mute/Unmute
2. Camera On/Off.
3. Input/Modify username
4. Chat with others
5. Invite others

## Technologies Used

1. ExpressJS (back-end)
2. PeerJS (to achieve Peer-To-Peer communication by audio/video)
3. Socket.IO (to communicate between client/server)
4. uuid (to create rooms with unique IDs)
5. Heroku (to deploy the app)

## Set-Up Procedures

### For local usage

* Clone the repository
* Run the command:
```
npm init
```
* In public/script.js, change port to the port number of localhost and host to '/'
* Run server.js

### To deploy

* Clone the repository
* Navigate to project in terminal and run:
```
heroku login
heroku create
```
* In public/script.js, change host to name of the heroku app
* Navigate to project in terminal and run:
```
git init
git add .
git commit
git push heroku master
heroku open
```
* The deployed link will open

## Acknowledgments

* [Clever Programmer](https://www.youtube.com/watch?v=ZVznzY7EjuY)
