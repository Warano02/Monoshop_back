const express = require("express")
const { SignUp, Login } = require("../controllers/post.controller")
const router = express.Router()

router.post("/signUp", (req, res) => {

    const name = req.body.name
    const contact = req.body.contact
    const password = req.body.password
    const appareil = req.body.appareil
    if (!name || !contact || !password || !appareil) {
        res.status(400).json({ error: true, msg: "Please complete the body of your request and try again !" })
    } else {
        SignUp(contact, name, password, appareil)
            .then(data => res.status(201).json(data))
            .catch(bad => res.status(403).json(bad))
    }

})

router.post("/login", (req, res) => {
    const contact = req.body.contact
    const password = req.body.password
    const appareil = req.body.appareil
    if (!contact || !password || !appareil) {
        res.status(400).json({ error: true, msg: "Please complete the body of your request and try again !" })
    } else {
        Login(contact, password, appareil)
            .then(data => res.status(201).json(data))
            .catch(error => res.status(error.code).json({ error: true, msg: error.msg }))
    }

})


module.exports = router