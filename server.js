require("dotenv").config();
const http = require("http");
const express = require("express"); //chamando a biblioteca express //
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");

const app = express();

// autenticação
const bcrypt = require("bcryptjs");
const { eAdmin } = require("./middlewares/auth");

// table
const User = require("./models/User");
const Cliente = require("./models/Cliente");

// retorno em Json

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// login
app.post("/login", async (req, res) => {
  const user = await User.findOne({
    attributes: [
      "idagrv",
      "senha",
      "nome",
      "cpf",
      "nascimento",
      "rg",
      "logradouro",
      "numero",
      "complemento",
      "cep",
      "municipio",
      "uf",
      "whatsapp",
      "email",
      "chavepix",
      "tipopix",
      "numeropolo",
      "a1pj_12m",
      "a3pj_36m",
      "a1pf_12m",
      "a3pf_36m",
    ],
    where: {
      email: req.body.email,
    },
  });

  if (user === null) {
    //verifica se o usuario existe
    return res.status(400).send({
      erro: true,
      message: "Erro: Usuário ou senha incorreto!",
    });
  }

  const match = await bcrypt.compare(req.body.senha, user.senha);
  if (!match) {
    return res.status(400).json({
      erro: true,
      message: "Erro: Usuário ou senha incorreto!",
    });
  }
  var token = jwt.sign({ id: user.idagrv }, process.env.SECRET, {
    expiresIn: 14400, // expires in 4 hours
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
    token: token,
  });
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// cadastrar
app.post("/cadastrar", async (req, res) => {
  const user = User.findOne({
    attributes: ["idagrv", "nome", "email", "senha", "numeropolo"],
    where: {
      email: req.body.email,
      senha: req.body.senha,
    },
  });
  var dados = req.body;

  dados.senha = await bcrypt.hash(dados.senha, 8);

  await User.create(dados)
    .then(() => {
      return res.json({
        error: false,
        message: "Usuário cadastrado com sucesso!",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        error: true,
        message: "Erro: Não foi possível cadastrar o usuário!",
      });
    });
});

app.post("/test", async (req, res) => {
  var dados = req.body;

  dados.senha = await bcrypt.hash(dados.senha, 8);
  console.log(dados.senha);

  return res.json({
    error: false,
    message: "Usuário cadastrado com sucesso!",
    senha: dados.senha,
  });
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// usuario
app.get("/usuario/:id", async (req, res, next) => {
  // app.get('/usuario', async (req, res, next) => {

  const usuario = await User.findOne({
    attributes: [
      "idagrv",
      "nome",
      "cpf",
      "nascimento",
      "rg",
      "logradouro",
      "numero",
      "complemento",
      "cep",
      "municipio",
      "uf",
      "bairro",
      "whatsapp",
      "email",
      "chavepix",
      "tipopix",
      "numeropolo",
      "a1pj_12m",
      "a3pj_36m",
      "a1pf_12m",
      "a3pf_36m",
    ],
    where: {
      idagrv: req.params.id,
    },
  })
    .then((usuario) => {
      res.json(usuario);
      console.log(usuario);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// usuario update

app.put("/usuario/update/:id", eAdmin, async (req, res, next) => {
  var dados = req.body;

  const usuario = await User.update(dados, {
    attributes: [
      "idagrv",
      "nome",
      "cpf",
      "nascimento",
      "rg",
      "logradouro",
      "numero",
      "complemento",
      "bairro",
      "cep",
      "municipio",
      "uf",
      "whatsapp",
      "chavepix",
      "tipopix",
      "numeropolo",
      "a1pj_12m",
      "a3pj_36m",
      "a1pf_12m",
      "a3pf_36m",
    ],
    where: {
      idagrv: req.params.id,
    },
  })

    .then((usuario) => {
      return res.json({
        error: false,
        message: "Usuário atualizado com sucesso!",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        error: true,
        message: "Erro: Não foi possível atualizar o usuário!",
      });
    });
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// cliente update

app.put("/cliente/update/:id", async (req, res, next) => {
  var dados = req.body;

  const cliente = await Cliente.update(dados, {
    attributes: [
      "id",
      "nome",
      "email",
      "rg",
      "cpf",
      "cnpj",
      "tipocd",
      "hr_agenda",
      "formapgto",
      "valorcd",
      "ct_parcela",
      "telefone",
      "dtnascimento",
      "reg_cnh",
      "cei",
      "razaosocial",
      "comissaoparceiro",
      "scp",
      "observacao",
      "historico",
      "agrv",
    ],
    where: {
      id: req.params.id,
    },
  })

    .then((cliente) => {
      return res.json({
        error: false,
        message: "Cliente atualizado com sucesso!",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        error: true,
        message: "Erro: Não foi possível atualizar o cliente!",
      });
    });
});

app.put("/cliente/excluir/:id", async (req, res, next) => {
  var dados = req.body;

  const cliente = await Cliente.update(dados, {
    attributes: ["id", "unidade", "dt_agenda", "hr_agenda"],
    where: {
      id: req.params.id,
    },
  })

    .then((cliente) => {
      return res.json({
        error: false,
        message: "Cliente excluído com sucesso!",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        error: true,
        message: "Erro: Não foi possível excluir o cliente!",
      });
    });
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// cliente eAdmin,
app.get("/clientes/:numeropolo", async (req, res, next) => {
  const clientes = await Cliente.findAll({
    attributes: [
      "id",
      "unidade",
      "andamento",
      "cpf",
      "cnpj",
      "nome",
      "razaosocial",
      "unico",
      "tipocd",
      "valorcd",
      "custoCdpar",
      "estatos_pgto",
      "formapgto",
      "telefone",
      "email",
      "dtnascimento",
      "rg",
      "cei",
      "vctoCD",
      "dt_aprovacao",
      "dt_agenda",
      "hr_agenda",
      "obs_agenda",
      "reg_cnh",
      "createdAt",
      "estatos_pgto",
      "andamento",
      "scp",
      "comissaoparceiro",
      "solicitacao",
    ],
    where: {
      unidade: req.params.numeropolo,
      createdAt: {
        [Op.gte]: new Date(new Date() - 35 * 60 * 60 * 60 * 1000),
      },
    },
  })
    .then((clientes) => {
      res.json(clientes);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/cliente/get/:id", eAdmin, async (req, res, next) => {
  const clientes = await Cliente.findOne({
    attributes: [
      "id",
      "unidade",
      "andamento",
      "cpf",
      "cnpj",
      "nome",
      "razaosocial",
      "unico",
      "tipocd",
      "valorcd",
      "custoCdpar",
      "estatos_pgto",
      "formapgto",
      "telefone",
      "email",
      "dtnascimento",
      "rg",
      "cei",
      "vctoCD",
      "dt_aprovacao",
      "dt_agenda",
      "hr_agenda",
      "obs_agenda",
      "reg_cnh",
      "estatos_pgto",
      "andamento",
      "createdAt",
      "historico",
      "ct_parcela",
      "scp",
      "comissaoparceiro",
      "solicitacao",
    ],
    where: {
      id: req.params.id,
    },
  })
    .then((clientes) => {
      res.json(clientes);
    })
    .catch((err) => {
      console.log(err);
    });
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// create cliente
app.post("/cadastrar/cliente", async (req, res) => {
  //   const cliente = await Cliente.findOne({
  //     attributes: [
  //       "dt_agenda",
  //       "andamento",
  //       "nome",
  //       "email",
  //       "rg",
  //       "cpf",
  //       "cnpj",
  //       "unidade",
  //       "tipocd",
  //       "hr_agenda",
  //       "formapgto",
  //       "valorcd",
  //       "ct_parcela",
  //       "telefone",
  //       "dtnascimento",
  //       "reg_cnh",
  //       "cei",
  //       "razaosocial",
  //       "validacao",
  //       "referencia",
  //       "comissaoparceiro",
  //       "scp",
  //       "obscont",
  //       "estatos_pgto",
  //       "observacao",
  //       "historico",
  //       "custoCdpar",
  //     ],
  //   });
  var dados = req.body;

  await Cliente.create(dados)
    .then(async (resp) => {
      try {
        const subject = `NOVA SOLICITAÇÃO AGRV/ERP - ${resp.dataValues.id}`;
        const email = "redebrasilrp@gmail.com";
        const conteudo = "";

        await EmailEnvio(email, subject, conteudo);

        return res.json({
          error: false,
          message: "cliente cadastrado com sucesso!",
        });
      } catch (error) {
        return res.status(400).json({
          error: true,
          message: JSON.stringify(error),
        });
      }
    })

    .catch((err) => {
      return res.status(400).json({
        error: true,
        message: "Erro: Não foi possível cadastrar o usuário!",
      });
    });
});

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// email
app.post("/send/email", async function (req, res) {
  let id = req.body.id;
  let nome = req.body.nome;
  let titulo = req.body.titulo;
  let solicitacao = req.body.solicitacao;
  let document = req.body.document;
  let tipocd = req.body.tipocd;

  const conteudo =
    "<h1>Prezado " +
    nome +
    '</h1><br><br><p>Link para download do assistente de Emissão: <a href="https://redebrasilrp.com.br/">https://redebrasilrp.com.br/</a><br>Em seguida clique no botão verde <strong>EMISSOR</strong>(faça o download e execute),<br>Código de Emissão: <strong>' +
    solicitacao +
    " " +
    document +
    "</strong>,<br>Senha de Emissão: <strong>Entrar em contato com seu Revendedor</strong><br>Modelo do certificado: <strong>" +
    tipocd +
    "</strong><br>Codigo do cliente: <strong>" +
    id +
    "</strong>";
  const subject = `Termo de Emissão: ${titulo}`;
  const email = req.body.email;

  try {
    await EmailEnvio(email, subject, conteudo);

    res
      .json({ error: false, message: "Email enviado com sucesso!" })
      .status(200);
  } catch (error) {
    res.json({ error: true, message: "Erro: " + error }).status(400);
  }
});

const server = http.createServer(app);
server.listen(3034, function () {
  console.log("servidor em execução");
});

async function EmailEnvio(email, subject, conteudo) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "redebrasilrp@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const emailOptions = {
      from: "redebrasilrp@gmail.com",
      to: email,
      subject: subject,
      html: conteudo,
    };

    const request = await transporter.sendMail(emailOptions);

    return request;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function ParceiroVerificado(uniddae) {
  try {
    const usuario = await User.findOne({
      attributes: ["idagrv", "nome", "numeropolo"],
      where: {
        numeropolo: uniddae,
      },
    });

    return usuario.dataValues;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
