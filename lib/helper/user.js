const bcrypt = require("bcrypt")
const { users, connexionHistory } = require("../config/db")
const Fs = require("fs/promises")
const fs = require("fs")
const PATH = require('path')
/**
 * 
 * @param {string} contact - The contact of user 
 * @param {string} name  - Name of user that trying to create account
 * @param {string} password - Strong password of this user 
 * @param {string} appareil - Device where connexion has created
 * @returns json | false
 */
async function signUp(contact, name, password, appareil) {
    const generateUniqueId = () => {
        let date = Date.now()
        let currentId = (date % 900000) + (new Date().getMilliseconds()) + 1
        return currentId
    }

    const encrypt = (psw) => {
        return new Promise((resolve, reject) => {
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds)
                .then(salt => bcrypt.hash(psw, salt))
                .then(hashPassword => {
                    const unique_id = generateUniqueId()
                    resolve({ hashPassword, unique_id })
                })
                .catch(e => reject(e))
        })
    }

    const testIfExist = await users.findOne({ where: { contact: contact } })
    if (testIfExist) return { error: true, msg: "User already exist !" }

    try {
        let pass = await encrypt(password)

        await users.create({
            profile: "user.png",
            name: name,
            contact: contact,
            password: pass.hashPassword,
            unique_id: pass.unique_id,
            solde: 0
        })

        const hmm = await users.findOne({ where: { contact: contact } })

        await connexionHistory.create({
            unique_id: hmm.unique_id,
            date: (new Date().toDateString()),
            appareil: appareil
        })

        return {
            error: false,
            data: {
                id: hmm.unique_id,
                name: name,
                contact: contact,
                solde: 0,
                profile: hmm.profile,
                msg: "1-)The money device is XAF.\n2-) You can add security question to your account to dont miss it !"
            }
        }
    } catch (error) {
        console.log("an error when create user account " + error)
        return false
    }
}

/**
 * 
 * @param {string} element - A name of a value that you need to change
 * @param {string} newValue - A new value of this terms
 * @param {integer} id - Unique id of this user
 * @returns boolean - true if all is good
 */

async function modifyInfos(element, newValue, id) {
    if (!element || !newValue) return false;

    const user = await users.findOne({ where: { unique_id: id } })

    if (!user) return false

    let tampon = user

    switch (element) {
        case "name":
            tampon.name = newValue

            await users.update({ name: tampon.name }, { where: { unique_id: id } })

            return true

        case "profile":

            const REGEXP = new RegExp(/data:image\/(png|jpg|jpeg|webp);base64,/);

            if (!REGEXP.test(newValue)) return false

            let base64 = newValue.split(',')[1]
            let match = newValue.match(REGEXP)
            if (!match) return false
            let format = match[1]
            let name = `${id}.${format}`

            let file_path = PATH.join(__dirname, "../public/profil/", name)

            const buffer = Buffer.from(base64, "base64")

            tampon.profile = name

            fs.writeFileSync(file_path, buffer)

            await users.update({ profile: tampon.profile }, { where: { unique_id: id } })

            return true
        case "contact":

            tampon.contact = newValue

            await users.update(
                {
                    contact: tampon.contact
                },
                {
                    where:
                    {
                        unique_id: id
                    }
                })

            return true
        default:
            return false

    }

}

/**
 * 
 * @param {String} contact - Infos of user that trying to be connect 
 * @param {string} password - clair password of that user
 * @param {string} appareil - Info that provide by user.Agent in frontend
 * @returns json
 */


async function logIn(contact, password, appareil) {
    const user = await users.findOne({ where: { contact: contact } })

    if (!user) return { error: true, code: 404, msg: "User not found" }
    let nativePassword = user.password

    const compare = await bcrypt.compare(password, nativePassword)

    if (!compare) return { error: true, code: 401, msg: "Incorrect password !" }

    await connexionHistory.create({
        unique_id: user.unique_id,
        date: (new Date().toDateString()),
        appareil: appareil
    })
    let regex = new RegExp(/(png|jpg|jpeg)/gm)
    let extensions = `data:image/${regex.exec(user.profile)[1]};base64,`
    console.log(extensions)
    let profil;

    try {
        let profile_path = PATH.join(__dirname, "../public/profil/", user.profile);
        const data = fs.readFileSync(profile_path);
        profil = Buffer.from(data).toString("base64");
    } catch (err) {
        console.error("Error when trying to read your profile: ", err);
        profil = false;
    }

    profil = extensions + profil

    return {
        error: false,
        data:
        {
            id: user.unique_id,
            name: user.name,
            profile: profil,
            contact,
            solde: user.solde,
        }
    }
}

module.exports = { signUp, modifyInfos, logIn }