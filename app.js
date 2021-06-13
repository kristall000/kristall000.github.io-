//@ts-check
//Зависимости
const express = require('express')
const { Sequelize, DataTypes, Model } = require('sequelize');
const app = express()
const cors = require('cors')
const { createToken, verifyToken, createPasswordHash, comparePassword } = require('./auth_service');
const path = require('path')

const port = process.env.PORT || 3000

//Настройка подключения
const sequelize = new Sequelize('kidskills_feedback', 'kidskills_user', 'user12345', {
  host: 'localhost',
  dialect: 'mysql'
});
// const sequelize = new Sequelize('us7fhwu6wsxs6owi', 'orahw809v48oq4f0', 'vbeuo2ur26abmi3o', {
//   host: 'r6ze0q02l4me77k3.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
//   dialect: 'mysql'
// });

//Модель базы данных
class FeedBacks extends Model { }

function StringType() {
  return {
    type: DataTypes.STRING
    // ,
    // allowNull: false
  }
}

FeedBacks.init({
  fdbck__type: StringType(),
  fdbck__name: StringType(),
  fdbck__phone: StringType(),
  fdbck__mail: StringType(),
  fdbck__text: {
    type: DataTypes.TEXT
  }
}, {
  modelName: 'fdbck',
  sequelize
})

//Модель БД с юзерами
class Admin extends Model { }

Admin.init({
  name: StringType(),
  password: StringType()
}, {
  modelName: 'Admin',
  sequelize
})

//Подключение к базе данных и запуск
start();

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    // console.log('successful DB connection');
    startApp();
  } catch (error) {
    console.error(error);
  }
}

//Запуск сервера
function startApp() {
  app.use(cors());
  app.use(express.json());

  // app.get('/', function (req, res) {
  //   res.send('Hello from express')
  // })

  app.post('/api/admin', async function (req, res) {
    const passwordHash = createPasswordHash(req.body.password)
    const newAdmin = await Admin.create({
      name: req.body.name,
      password: passwordHash
    })
    res.send(newAdmin)
  })

  app.post('/api/login', async function (req, res) {
    const userFromDB = await Admin.findOne({ where: { name: req.body.name } })
    //@ts-ignore
    if (comparePassword(req.body.password, userFromDB.password)) {
      const token = createToken(userFromDB)
      res.send({
        //  token: token
        token
      })
    } else {
      res.status(403).send({
        message: 'Wrong password'
      })
    }

  })

  app.get('/api/fdbck', verifyToken, async function (req, res) {
    const orders = await FeedBacks.findAll()
    res.send(orders)
  })

  app.post('/api/fdbck', async function (req, res) {
    const fdbckInfo = req.body
    let error = 0;
    if (error) {
      res.status(400).send({ messages: 'error' })
    }
    else {
      const fdbckFromDB = await FeedBacks.create(fdbckInfo)
      res.send(fdbckFromDB)
    }
  })

  app.use(express.static(path.join(__dirname, ''))) //public

  app.listen(port, function () {
    console.log('Server started: http://localhost:' + port);
  })
}
