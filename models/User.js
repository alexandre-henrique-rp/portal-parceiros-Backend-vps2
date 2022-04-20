require('dotenv').config();
const Sequelize = require('sequelize');
const db = require('./db');

const User = db.define('AGRV', {
     idagrv: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
     },
     nome: Sequelize.STRING(100),
     cpf: Sequelize.STRING(20),
     nascimento: Sequelize.DATE,
     rg: Sequelize.STRING(20),
     linkcnh: Sequelize.TEXT,
     linkfotoperfil: Sequelize.TEXT,
     logradouro: Sequelize.TEXT,
     numero: Sequelize.TEXT,
     complemento: Sequelize.TEXT,
     cep: Sequelize.TEXT,
     municipio: Sequelize.TEXT,
     codmunicipio: Sequelize.TEXT,
     uf: Sequelize.TEXT,
     whatsapp: Sequelize.TEXT,
     celular: Sequelize.TEXT,
     fixo: Sequelize.TEXT,
     email: Sequelize.TEXT,
     email2: Sequelize.TEXT,
     permissaoacesso: Sequelize.TEXT,
     senha: Sequelize.TEXT,
     chavepix: Sequelize.TEXT,
     nomebanco: Sequelize.TEXT,
     numerobanco: Sequelize.FLOAT,
     numeroagencia: Sequelize.STRING(10),
     numeroconta: Sequelize.TEXT,
     tipocontabanco: Sequelize.TEXT,
     nomepolo: Sequelize.TEXT,
     numeropolo: Sequelize.TEXT,
     linklogopolo: Sequelize.TEXT,
     municipiopolo: Sequelize.TEXT,
     ufpolo: Sequelize.TEXT,
     a1pj_12m: Sequelize.INTEGER(11),
     a3pj_36m: Sequelize.INTEGER(11),
     a1pf_12m: Sequelize.INTEGER(11),
     a3pf_36m: Sequelize.INTEGER(11),
     bairro: Sequelize.TEXT,
     tipopix: Sequelize.TEXT,
     
}, { freezeTableName: true });

//criar a tabela
// User.sync();

module.exports = User;
