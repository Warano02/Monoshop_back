const userModel = require('./model/users')
const HModel = require("./model/Hconnexion")
const { Sequelize, DataTypes } = require("sequelize")
const sequelize = new Sequelize("mono1", "root", "",
    {
        host: "localhost",
        dialect: "mariadb",
        logging: false
    }
)
sequelize.authenticate()
    .then((_) => console.log("Connexion to a db complete successfully !"))
    .catch((err) => console.log("An error happen when we trying connexion to db" + err))

const users = userModel(sequelize, DataTypes)

const connexionHistory = HModel(sequelize, DataTypes)

const initDb = () => {
    return sequelize.sync()
        .then((_) => {
            console.log("All is good !");
        })
}

module.exports = { initDb, users, connexionHistory }

