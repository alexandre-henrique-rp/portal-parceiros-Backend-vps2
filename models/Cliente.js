const Sequelize = require('sequelize');
const database = require('./db.js');

const Cliente = database.define('fcweb', { //nome da tabela a ser conectada
     id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
     },

     s_alerta: Sequelize.TEXT,
     referencia: Sequelize.TEXT,
     id_boleto: Sequelize.TEXT,
     id_cancelar_bol_rem: Sequelize.TEXT,
     unidade: Sequelize.TEXT,
     resposavel: Sequelize.TEXT,
     andamento: Sequelize.TEXT,
     prioridade: Sequelize.TEXT,
     solicitacao: Sequelize.TEXT,
     venda: Sequelize.TEXT,
     cpf: Sequelize.TEXT,
     cnpj: Sequelize.TEXT,
     nome: Sequelize.TEXT,
     razaosocial: Sequelize.TEXT,
     vectoboleto: Sequelize.TEXT,
     unico: Sequelize.TEXT,
     contador: Sequelize.TEXT,
     obscont: Sequelize.TEXT,
     comissaoparceiro: Sequelize.FLOAT,
     scp: Sequelize.STRING(10),
     tipocd: Sequelize.TEXT,
     valorcd: Sequelize.TEXT,
     estatos_pgto: Sequelize.TEXT,
     formapgto: Sequelize.TEXT,
     vouchersoluti: Sequelize.TEXT,
     ct_parcela: Sequelize.TEXT,
     telefone: Sequelize.TEXT,
     telefone2: Sequelize.TEXT,
     email: Sequelize.TEXT,
     dtnascimento: Sequelize.TEXT,
     rg: Sequelize.TEXT,
     cei: Sequelize.TEXT,
     endereco: Sequelize.TEXT,
     nrua: Sequelize.TEXT,
     bairro: Sequelize.TEXT,
     complemento: Sequelize.TEXT,
     cep: Sequelize.TEXT,
     uf: Sequelize.TEXT,
     cidade: Sequelize.TEXT,
     observacao: Sequelize.TEXT,
     vctoCD: Sequelize.DATE,
     historico: Sequelize.TEXT,
     arquivo: Sequelize.STRING(100),
     nomearquivo: Sequelize.STRING(100),
     obsrenovacao: Sequelize.TEXT,
     dt_aprovacao: Sequelize.DATE,
     comicao: Sequelize.FLOAT,
     validacao: Sequelize.TEXT,
     nfe: Sequelize.TEXT,
     urlnota: Sequelize.TEXT,
     id_fcw_soluti: Sequelize.STRING(10),
     dt_agenda: Sequelize.DATE,
     hr_agenda: Sequelize.TIME,
     obs_agenda: Sequelize.TEXT,
     reg_cnh: Sequelize.TEXT,
     custoCdpar: Sequelize.TEXT,
     
     
}, { freezeTableName: true }); // função para conectar tebela ja criada

//criar ou sicronizar a tabela
// Cliente.sync(); 

module.exports = Cliente;