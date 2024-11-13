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

  static async getEventosPorData(req, res){
    const query = `SELECT * FROM evento`
    
    try{
      connect.query(query,(err,results) => {
        if(err){
          console.error(err);
          return res.status(500).json({error: "Erro ao buscar eventos"})
        }
        const dataEvento = new Date(results[0].data_hora)
        const dia = dataEvento.getDate()
        const mes = dataEvento.getMonth()+1
        const ano = dataEvento.getFullYear()
        console.log(dia+ '/' +mes+ '/' +ano)

        const dataEvento2 = new Date(results[1].data_hora)
        const dia2 = dataEvento2.getDate()
        const mes2 = dataEvento2.getMonth()+1
        const ano2 = dataEvento2.getFullYear()
        console.log(dia2+ '/' +mes2+ '/' +ano2)

        const dataEvento3 = new Date(results[2].data_hora)
        const dia3 = dataEvento3.getDate()
        const mes3 = dataEvento3.getMonth()+1
        const ano3 = dataEvento3.getFullYear()
        console.log(dia3+ '/' +mes3+ '/' +ano3)
        
        const now = new Date()
        const eventosPassados = results.filter(evento => new Date(evento.data_hora)<now)
        const eventosFuturos = results.filter(evento => new Date(evento.data_hora)>now)

        const diferencaMs = eventosFuturos[0].data_hora.getTime() - now.getTime();
        const dias = Math.floor(diferencaMs/(1000*60*60*24));
        const horas = Math.floor(diferencaMs%(1000*60*60*24) / (1000*60*60));
        console.log(diferencaMs,'Fatam: '+dias+ ' dias', +horas+ ' horas');

        //comparando datas
        const dataFiltro = new Date('2024-12-15').toISOString().split("T");
        const eventosDia = results.filter(evento => new Date(evento.data_hora).toISOString().split("T")[0] === dataFiltro[0]);
        console.log("Data Filtro: ", dataFiltro);
        console.log("Eventos: ",eventosDia);

        return res.status(200).json({message:'Ok', eventosPassados, eventosFuturos})
      })

    }
    catch(error){
      console.error(err);
      return res.status(500).json({error: "Erro ao buscar eventos"})
    }
    

  }

  static async getListarEvento(req, res){
    const data = req.params.data_hora;
    const query = `SELECT * FROM evento WHERE data_hora = 2024-10-30`;

    try {
      connect.query(query, data, (err, results) => {
        if(err){
        console.log(err);
        return res.status(400).json({error: "Erro ao listar evento :( "});
        }
        if(results.affectedRows === 0){
        return res.status(404).json({error: "Evento não encontrado"});
        }
        });
      }
    catch(error){
      console.log("Erro ao executar a consulta", error);
      return res.status(500).json({error: "Erro interno do servidor"});
    }
  }
};
