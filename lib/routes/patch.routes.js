const express = require("express")
const { Modify } = require("../controllers/patch.controller")
const router = express.Router()

router.patch("/update", (req, res) => {

    const element = req.body.element
    const newValue = req.body.newValue
    const REGEXP = new RegExp(/data:image\/(png|jpg|jpeg|webp);base64,/);
    const id = req.body.id
    if (!element || !newValue || !id) {
        res.status(400).json({ error: true, msg: "Please complete the body of your request and try again !" })
    } else if (element == "profile" && !REGEXP.test(newValue)) {
        console.log(!REGEXP.test(newValue));
        res.status(400).json({ error: true, msg: "We can't use this form of data. Please enter Base64 and try again !" })
    } else {
        Modify(element, newValue, id)
            .then((_) => res.status(204).json({ error: false, msg: "Data is now update" }))
            .catch(error => res.status(400).json(error))
    }

})


module.exports = router