require('dotenv').config();
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

module.exports = {
     eAdmin: async function (req, res, next) {
          const authheader = req.headers.authorization;
          // console.log(authheader);
          if (!authheader) {
               return res.status(400).send({
                    error: true,
                    message: 'Não autorizado a'
               });
          }
          const [, token] = authheader.split(' ');
         

          if(!token) {
               return res.status(400).send({
                    error: true,
                    message: 'Não autorizado b'
               });
          }
          try {
               const decode = await promisify(jwt.verify)(token, process.env.SECRET);
               req.userId = decode.id;
               return next();
          }catch(err) {
               return res.status(400).send({
                    error: true,
                    message: 'Não autorizado c'
               });
          }

     }
}