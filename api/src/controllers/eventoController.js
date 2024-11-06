const connect = require("../db/connect");

module.exports = class eventoController {
  //criação de evento
  static async createEvento(req, res) {
    const { nome, descricao, data_hora, local, fk_id_organizador } = req.body;

    //Validação genérica de todos os atributos
    if (!nome || !descricao || !data_hora || !local || !fk_id_organizador) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const query = `insert into evento (nome, descricao, data_hora, local, fk_id_organizador) values (?, ?, ?, ?, ?)`;
    const values = [nome, descricao, data_hora, local, fk_id_organizador];
    try {
      connect.query(query, values, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao criar o evento :(" });
        }
        return res.status(201).json({ message: "Evento criado com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar consulta: ", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  //Vizualizar todos os eventos cadastrados
  static async getAllEvento(req, res) {
    const query = `SELECT * from evento`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao buscar eventos" });
        }
        return res
          .status(200)
          .json({
            messagem: "Eventos listados com sucesso!!",
            events: results,
          });
      });
    } catch (error) {
      console.log("Erro ao consultar a query: ", error);
      return res.status(500).json({ arror: "Erro interno do servidor :(" });
    }
  }

  static async updateEvento(req, res) {
    const { id_evento, nome, descricao, data_hora, local, fk_id_organizador } = req.body;

    //Validação genérica de todos os atributos
    if (!id_evento || !nome || !descricao || !data_hora || !local || !fk_id_organizador) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const query = `update evento set nome =?, descricao=?, data_hora=?, local=?, fk_id_organizador=? where id_evento=?`;
    const values = [nome, descricao, data_hora, local, fk_id_organizador, id_evento];
    try {
      connect.query(query, values, (err, results) => {
        console.log("Resultados: ",results);
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao atualizar o evento :(" });
        }
        if (results.affectedRows === 0){
            return res.status(404).json({error: "Evento não encontrado :("});
        }
        return res.status(200).json({ message: "Evento atualizado com sucesso!" });
      });
    }catch (error) {
      console.log("Erro ao executar consulta: ", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  //Exclusão de eventos
  static async deleteEvento(req, res){
    const idEvento = req.params.id;
    const query = `delete from evento where id_evento=?`;

    try {
        connect.query(query, idEvento, (err, results) => {
            if(err){
                console.log(err);
                return res.status(400).json({error: "Erro ao excluir evento :( "});
            }
            if(results.affectedRows === 0){
                return res.status(404).json({error: "Evento não encontrado"});
            }
        })
    }catch(error){
        console.log("Erro ao executar a consulta", error);
        return res.status(500).json({error: "Erro interno do servidor"});
    }
  }
};
