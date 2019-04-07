const jwt = require('jsonwebtoken')

module.exports = {
  Authenticate: function (req, res, next) {
    try {
      // console.log(req.headers)
      let token = req.headers.token

      if(token) {
        let decode = jwt.verify(token, process.env.JWT_TOKEN)
        req.authenticate = decode
        next()
      } else {
        res.status(404).json({
          msg : 'U must be login'
        })  
      }
    } catch (err) {
      res.status(404).json({
        msg : 'Token Is Not Valid'
      })
    }
  }
}