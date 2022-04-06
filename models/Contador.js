const Sequelize = require('sequelize');
const database = require('./db.js');

const Contador = database.define('parceiro', { //nome da tabela a ser conectada
     codigo: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
     },

     usuario: Sequelize.TEXT,
     senha: Sequelize.TEXT,
     mensagem: Sequelize.TEXT,
     unidade: Sequelize.TEXT,
     nome: Sequelize.TEXT,
     fone: Sequelize.TEXT,
     email: Sequelize.TEXT,
     observacao: Sequelize.TEXT,
     endereco: Sequelize.TEXT,
     'A1PJ-12': Sequelize.TEXT,
     'A3PJ-12': Sequelize.TEXT,
     'A3PJ-24': Sequelize.TEXT,
     'A3PJ-36': Sequelize.TEXT,
     'A1PF-12': Sequelize.TEXT,
     'A3PF-12': Sequelize.TEXT,
     'A3PF-24': Sequelize.TEXT,
     'A3PF-36': Sequelize.TEXT,
     ocultar_valor_volcher: Sequelize.TEXT,
     tipo_comissao: Sequelize.TEXT,


}, { freezeTableName: true }); // função para conectar tebela ja criada

//criar ou sicronizar a tabela
// Contador.sync(); 

module.exports = Contador;