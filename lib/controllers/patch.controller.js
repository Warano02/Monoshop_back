const { modifyInfos } = require("../helper/user")

function Modify(element, newValue, id) {
    return new Promise(async (resolve, reject) => {
        const modif = await modifyInfos(element, newValue, id)
        
        modif ? resolve({ error: false, msg: "Your now update" }) : reject({ error: true, msg: "Modify and try again" })
    })
}
module.exports={Modify}