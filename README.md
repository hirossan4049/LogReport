# LogReport
[Monster Eggs for Engineer in Osaka](https://ailab-corp.connpass.com/event/278116/)

# requirements

### server
- docker
- docker-compose
- nodejs
- yarn
- python3
- pip3

### client
- yarn


# setup

### server
```
$ cd server
$ yarn
$ docker-compose up -d
$ npx prisma migrate dev --name init
$ yarn prisma:dev
$ pip3 install -r requirements.txt
$ yarn dev
```

### client
```
$ cd client
$ yarn
$ yarn dev
```


# Team
- [hirossan4049](https://github.com/hirossan4049)
- [alok0814](https://github.com/alok0814)

# License
