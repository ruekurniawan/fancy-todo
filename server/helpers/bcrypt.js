const bcrypt = require('bcrypt')

module.exports = {
  hash(password) {
    let salt = bcrypt.genSaltSync(8)
    let hashing = bcrypt.hashSync(password,salt)
    return hashing
  },
  compare(valueReq, hashPass) {
    let compare = bcrypt.compareSync(valueReq, hashPass)
    return compare
  }
}