const connect = require("../db/connect");
let nextId = 1;

module.exports = class organizadorController {
  static async createOrganizador(req, res) {
    const { telefone, email, senha, nome } = req.body;

    if (!telefone || !email || !senha || !name) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(telefone) || telefone.length !== 11) {
      return res.status(400).json({
        error: "Telefone inválido. Deve conter exatamente 11 dígitos numéricos",
      });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    } else {
      // Construção da query INSERT
      const query = `INSERT INTO organizador (telefone, senha, email, nome) VALUES('${telefone}', 
      '${senha}', 
      '${email}', 
      '${nome}')`;

      // Executando a query  criada
      try {
        connect.query(query, function (err) {
          if (err) {
            console.log(err);
            console.log(err.code);
            if (err.code === "ER_DUP_ENTRY") {
              return res
                .status(400)
                .json({ error: "O email já está vinculado a outro usuário" });
            } else {
              return res.status(500).json({
                error: "Erro interno do servidor",
              });
            }
          } else {
            return res
              .status(201)
              .json({ message: "Usuário criado com sucesso" });
          }
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  }
  static async getAllOrganizador(req, res) {
      const query = `SELECT * FROM organizador`;
  
      try {
        connect.query(query, function (err, results) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Erro interno do Servidor" });
          }
          return res
            .status(200)
            .json({ message: "Lista de Organizador", organizadores: results });
        });
      } catch (error) {
        console.error("Erro ao executar consulta:", error);
        return res.status(500).json({ error: "Erro inertno do Servidor" });
      }
    }

  static async updateOrganizador(req, res) {
    //Desestrutura e recupera os dados enviados via corpo da requisição
    const { id, telefone, email, senha, nome } = req.body;

    //Validar se todos os campos foram preenchidos
    if (!id || !telefone || !email || !senha || !nome) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    const query = `UPDATE organizador SET nome=?,email=?,senha=?,telefone=? WHERE id_organizador = ?`
    const values = [nome, email, senha, telefone, id];

    try{
      connect.query(query,values,function(err,results){})
    }
    catch{

    }
  }

  static async deleteOrganizador(req, res) {
    //Obtém o parametro 'id' da requisição, que é o id de organizador a ser deletado
    const organizadorId = req.params.id;

    //Procurar o indice do organizador no Arry 'organizadores' pelo email
    const organizadorIndex = organizadores.findIndex(
      (organizador) => organizador.id == organizadorId
    );

    // Se o organizador não for entrontrado organizadorIndex equivale a -1
    if (organizadorIndex == -1) {
      return res.status(400).json({ error: "Organizador não encontrado" });
    }

    //Removendo o organizador do Array 'organizadores'
    organizadores.splice(organizadorIndex, 1);
    return res.status(200).json({ message: "Organizador apagado" });
  }
};
