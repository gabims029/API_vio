const connect = require("../db/connect");

module.exports = class ingressoController {
  //Criação do ingresso
  static async createIngresso(req, res) {
    const {preco, tipo, fk_id_evento} = req.body;

    //Validação genérica de todos os atributos
    if (!preco || !tipo || !fk_id_evento) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }

    const tipoMinusculo = tipo.toLowerCase();
    if(tipoMinusculo !== "pista" && tipoMinusculo !== "vip"){
        return res.status(400).json({error: "Tipo errado. Digite Pista ou Vip"})
    }

    const query = `insert into ingresso (preco, tipo, fk_id_evento) values ('${preco}', '${tipoMinusculo}', '${fk_id_evento}')`;
    const values = [preco, tipoMinusculo, fk_id_evento];
    try {
      connect.query(query, values, (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao criar o ingresso :(" });
        }
        return res.status(201).json({ message: "Ingresso criado com sucesso!" });
      });
    } catch (error) {
      console.log("Erro ao executar consulta: ", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  //Vizualizar todos os ingressos cadastrados
  static async getAllIngresso(req, res) {
    const query = `SELECT * from ingresso`;

    try {
      connect.query(query, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao buscar ingressos" });
        }
        return res
          .status(200)
          .json({
            messagem: "Ingressos listados com sucesso!!",
            events: results,
          });
      });
    } catch (error) {
      console.log("Erro ao consultar a query: ", error);
      return res.status(500).json({ arror: "Erro interno do servidor :(" });
    }
  }

  static async updateIngresso(req, res) {
    const { id_ingresso, preco, tipo, fk_id_evento } = req.body;

    //Validação genérica de todos os atributos
    if (!id_ingresso || !preco || !tipo || !fk_id_evento) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    
    const tipoMinusculo = tipo.toLowerCase();
    if(tipoMinusculo !== "pista" && tipoMinusculo !== "vip"){
        return res.status(400).json({error: "Tipo errado. Digite Pista ou Vip"})
    }

    const query = `update ingresso set preco=?, tipo=?, fk_id_evento=? where id_ingresso=?`;
    const values = [preco, tipo, fk_id_evento, id_ingresso];
    try {
      connect.query(query, values, (err, results) => {
        console.log("Resultados: ",results);
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao atualizar o ingresso :(" });
        }
        if (results.affectedRows === 0){
            return res.status(404).json({error: "Ingresso não encontrado :("});
        }
        return res.status(200).json({ message: "Ingresso atualizado com sucesso!" });
      });
    }catch (error) {
      console.log("Erro ao executar consulta: ", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  //Exclusão de ingresso
  static async deleteIngresso(req, res){
    const idIngresso = req.params.id;
    const query = `delete from ingresso where id_ingresso=?`;

    try {
        connect.query(query, idIngresso, (err, results) => {
            if(err){
                console.log(err);
                return res.status(400).json({error: "Erro ao excluir ingresso :( "});
            }
            if(results.affectedRows === 0){
                return res.status(404).json({error: "Ingresso não encontrado"});
            }
        })
    }catch(error){
        console.log("Erro ao executar a consulta", error);
        return res.status(500).json({error: "Erro interno do servidor"});
    }
  }
};
