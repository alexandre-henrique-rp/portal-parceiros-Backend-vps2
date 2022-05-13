require('dotenv').config();
const http = require('http');
const express = require('express'); //chamando a biblioteca express //
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');


const app = express();



// autenticação
const bcrypt = require('bcryptjs');
const { eAdmin } = require('./middlewares/auth');

// table
const User = require('./models/User');
const Cliente = require('./models/Cliente');


// retorno em Json

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// login
app.post('/login', async (req, res) => {

     const user = await User.findOne({
          attributes: ['idagrv', 'senha', 'nome', 'cpf', 'nascimento', 'rg', 'logradouro', 'numero', 'complemento', 'cep', 'municipio', 'uf', 'whatsapp', 'email', 'chavepix', 'tipopix', 'numeropolo', 'a1pj_12m', 'a3pj_36m', 'a1pf_12m', 'a3pf_36m'],
          where: {
               email: req.body.email,
          }
     });


     if (user === null) { //verifica se o usuario existe
          return res.status(400).end({
               erro: true,
               message: 'Erro: Usuário ou senha incorreto!'
          });
     };

     const match = await bcrypt.compare(req.body.senha, user.senha);
     if (!match) {
          return res.status(400).json({
               erro: true, message: 'Erro: Usuário ou senha incorreto!'
          });
     }
     var token = jwt.sign({ id: user.idagrv }, process.env.SECRET, {
          expiresIn: 14400 // expires in 4 hours
     });
     return res.json({
          user: {
               id: user.idagrv,
               nome: user.nome,
               numeropolo: user.numeropolo,
               cel: user.whatsapp,
               a1pf: user.a1pf_12m,
               a3pf: user.a3pf_36m,
               a1pj: user.a1pj_12m,
               a3pj: user.a3pj_36m,
          },
          token: token

     });
});


// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// cadastrar
app.post('/cadastrar', async (req, res) => {

     const user = User.findOne({
          attributes: ['idagrv', 'nome', 'email', 'senha', 'numeropolo'],
          where: {
               email: req.body.email,
               senha: req.body.senha,
          }
     });
     var dados = req.body;

     dados.senha = await bcrypt.hash(dados.senha, 8);

     await User.create(dados)
          .then(() => {
               return res.json({
                    error: false,
                    message: 'Usuário cadastrado com sucesso!'
               });
          }).catch(err => {
               return res.status(400).json({
                    error: true,
                    message: 'Erro: Não foi possível cadastrar o usuário!'
               });
          });
});

app.post('/test', async (req, res) => {

     var dados = req.body;

     dados.senha = await bcrypt.hash(dados.senha, 8);
     console.log(dados.senha);

     return res.json({
          error: false,
          message: 'Usuário cadastrado com sucesso!',
          senha: dados.senha
     });

});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// usuario
app.get('/usuario/:id', async (req, res, next) => {
     // app.get('/usuario', async (req, res, next) => {

     const usuario = await User.findOne({
          attributes: ['idagrv', 'nome', 'cpf', 'nascimento', 'rg', 'logradouro', 'numero', 'complemento', 'cep', 'municipio', 'uf', 'bairro', 'whatsapp', 'email', 'chavepix', 'tipopix', 'numeropolo', 'a1pj_12m', 'a3pj_36m', 'a1pf_12m', 'a3pf_36m'],
          where: {
               idagrv: req.params.id,

          },
     })
          .then((usuario) => {
               res.json(usuario)
               console.log(usuario)
          })
          .catch((err) => {
               console.log(err)
          })
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// usuario update

app.put('/usuario/update/:id', eAdmin, async (req, res, next) => {

     var dados = req.body;

     const usuario = await User.update(dados, {
          attributes: ['idagrv', 'nome', 'cpf', 'nascimento', 'rg', 'logradouro', 'numero', 'complemento', 'bairro', 'cep', 'municipio', 'uf', 'whatsapp', 'chavepix', 'tipopix', 'numeropolo', 'a1pj_12m', 'a3pj_36m', 'a1pf_12m', 'a3pf_36m'],
          where: {
               idagrv: req.params.id,

          },
     })



          .then((usuario) => {
               return res.json({
                    error: false,
                    message: 'Usuário atualizado com sucesso!'
               });
          })
          .catch((err) => {
               return res.status(400).json({
                    error: true,
                    message: 'Erro: Não foi possível atualizar o usuário!'
               });
          })

});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// cliente update

app.put('/cliente/update/:id', async (req, res, next) => {

     var dados = req.body;

     const cliente = await Cliente.update(dados, {
          attributes: ['id', 'nome', 'email', 'rg', 'cpf', 'cnpj', 'tipocd', 'hr_agenda', 'formapgto', 'valorcd', 'ct_parcela', 'telefone', 'dtnascimento', 'reg_cnh', 'cei', 'razaosocial', 'comissaoparceiro', 'scp', 'observacao', 'historico', 'agrv'],
          where: {
               id: req.params.id,
          },
     })

          .then((cliente) => {
               return res.json({
                    error: false,
                    message: 'Cliente atualizado com sucesso!'
               });
          })
          .catch((err) => {
               return res.status(400).json({
                    error: true,
                    message: 'Erro: Não foi possível atualizar o cliente!'
               });
          })

});

app.put('/cliente/excluir/:id', eAdmin, async (req, res, next) => {

     var dados = req.body;

     const cliente = await Cliente.update(dados, {
          attributes: ['id', 'unidade', 'dt_agenda', 'hr_agenda'],
          where: {
               id: req.params.id,
          },
     })

          .then((cliente) => {
               return res.json({
                    error: false,
                    message: 'Cliente excluído com sucesso!'
               });
          })
          .catch((err) => {
               return res.status(400).json({
                    error: true,
                    message: 'Erro: Não foi possível excluir o cliente!'
               });
          })

});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// cliente eAdmin,
app.get('/clientes/:numeropolo', async (req, res, next) => {

     const clientes = await Cliente.findAll({
          attributes: ['id', 'unidade', 'andamento', 'cpf', 'cnpj', 'nome', 'razaosocial', 'unico', 'tipocd', 'valorcd', 'custoCdpar', 'estatos_pgto', 'formapgto', 'telefone', 'email', 'dtnascimento', 'rg', 'cei', 'vctoCD', 'dt_aprovacao', 'dt_agenda', 'hr_agenda', 'obs_agenda', 'reg_cnh', 'createdAt', 'estatos_pgto', 'andamento', 'scp', 'comissaoparceiro', 'solicitacao'],
          where: {
               unidade: req.params.numeropolo,
               createdAt: {
                    [Op.gte]: new Date(new Date() - 35 * 60 * 60 * 60 * 1000),
               }
          },
     })
          .then((clientes) => {
               res.json(clientes)
          })
          .catch((err) => {
               console.log(err)
          })
});

app.get('/cliente/get/:id', eAdmin, async (req, res, next) => {

     const clientes = await Cliente.findOne({
          attributes: ['id', 'unidade', 'andamento', 'cpf', 'cnpj', 'nome', 'razaosocial', 'unico', 'tipocd', 'valorcd', 'custoCdpar', 'estatos_pgto', 'formapgto', 'telefone', 'email', 'dtnascimento', 'rg', 'cei', 'vctoCD', 'dt_aprovacao', 'dt_agenda', 'hr_agenda', 'obs_agenda', 'reg_cnh', 'estatos_pgto', 'andamento', 'createdAt', 'historico', 'ct_parcela', 'scp', 'comissaoparceiro', 'solicitacao'],
          where: {
               id: req.params.id,
          },

     })
          .then((clientes) => {
               res.json(clientes)
          })
          .catch((err) => {
               console.log(err)
          })
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// create cliente
app.post('/cadastrar/cliente', eAdmin, async (req, res) => {


     const cliente = await Cliente.findOne({
          attributes: ['dt_agenda', 'andamento', 'nome', 'email', 'rg', 'cpf', 'cnpj', 'unidade', 'tipocd', 'hr_agenda', 'formapgto', 'valorcd', 'ct_parcela', 'telefone', 'dtnascimento', 'reg_cnh', 'cei', 'razaosocial', 'validacao', 'referencia', 'comissaoparceiro', 'scp', 'obscont', 'estatos_pgto', 'observacao', 'historico', 'custoCdpar'],
          where: {
               email: req.body.email,
               cpf: req.body.cpf,
               andamento: req.body.andamento,
               nome: req.body.nome,
               rg: req.body.rg,
               cnpj: req.body.cnpj,
               unidade: req.body.unidade,
               tipocd: req.body.tipocd,
               hr_agenda: req.body.hr_agenda,
               formapgto: req.body.formapgto,
               valorcd: req.body.valorcd,
               ct_parcela: req.body.ct_parcela,
               telefone: req.body.telefone,
               dtnascimento: req.body.dtnascimento,
               reg_cnh: req.body.reg_cnh,
               cei: req.body.cei,
               razaosocial: req.body.razaosocial,
               validacao: req.body.validacao,
               referencia: req.body.referencia,
               comissaoparceiro: req.body.comissaoparceiro,
               scp: req.body.scp,
               obscont: req.body.obscont,
               estatos_pgto: req.body.estatos_pgto,
               observacao: req.body.observacao,
               historico: req.body.historico,
               custoCdpar: req.body.custoCdpar
          }

     })
     var dados = req.body;

     await Cliente.create(dados)
          .then(() => {

               return res.json({ error: false, message: 'cliente cadastrado com sucesso!' });

          })

          .catch(err => {
               return res.status(400).json({ error: true, message: 'Erro: Não foi possível cadastrar o usuário!' });
          });
});

app.get('/cliente/robo/:id', eAdmin, async (req, res) => {



     (async () => {
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          await page.goto('https://example.com');
          await page.screenshot({ path: 'example.png' });

          await browser.close();
     })();



});
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// email
app.post('/send/email', function (req, res) {

     let id = req.body.id;
     let email = req.body.email;
     let nome = req.body.nome;
     let titulo = req.body.titulo;
     let solicitacao = req.body.solicitacao;
     let document = req.body.document;
     let senha = req.body.senha;
     let tipocd = req.body.tipocd;

     const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          secureConnection: false,
          requireTLS: false,
          auth: {
               user: process.env.EMAIL_USER,
               pass: process.env.EMAIL_PASSWORD,
          },
          tls: {
               // do not fail on invalid certs
               rejectUnauthorized: false,
          },
     })
     transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: `Termo de Emissão: ${titulo}`,
          //text: `Prezado ${nome},\n\nLink para download do assistente de Emissão: 'https://redebrasilrp.com.br/' \nEm seguida clique no botão verde *EMISSOR*(faça o download e execute)\nCódigo de Emissão: ${solicitacao} ${document}\nSenha de Emissão: usar a que o ciente criou\nou\nSenha de Emissão Padrão: ${senha}\nModelo do certificado: ${tipocd}`,
          html: '<h1>Prezado ' + nome + '</h1><br><br><p>Link para download do assistente de Emissão: <a href="https://redebrasilrp.com.br/">https://redebrasilrp.com.br/</a><br>Em seguida clique no botão verde <strong>EMISSOR</strong>(faça o download e execute),<br>Código de Emissão: <strong>' + solicitacao + ' ' + document + '</strong>,<br>Senha de Emissão: <strong>Entrar em contato com seu Revendedor</strong><br>Modelo do certificado: <strong>' + tipocd + '</strong><br>Codigo do cliente: <strong>' + id + '</strong>',
     })
          .then(info => {
               res.status(200).send(info)
               console.log(info)
          }).catch(error => {
               res.status(500).send(error)
               console.error('Email incorreto')
          })
});


const server = http.createServer(app);
server.listen(process.env.PORT || 3034, function () {
     console.log('servidor em execução')
});
