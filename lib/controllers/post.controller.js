const { signUp, logIn } = require("../helper/user")

function SignUp(contact, name, password, appareil) {
    return new Promise(async (resolve, reject) => {
        const trySign = await signUp(contact, name, password, appareil)
        if (trySign.error) {
            reject(trySign)
        } else {
            resolve(trySign)
        }
    })
}

function Login(contact,password,appareil) {
    return new Promise(async (resolve, reject) => {
        const tryLog=await logIn(contact, password,appareil)
        if(!tryLog.error){
            resolve(tryLog)
        }else{
            reject(tryLog)
        }
    })
}
module.exports = { SignUp ,Login}