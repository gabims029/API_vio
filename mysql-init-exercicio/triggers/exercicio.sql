-- Cria tabela antes da trigger
create table resumo_evento (
    id_evento int primary key,
    total_ingressos int not null
);

delimiter //

create trigger atualizar_total_ingressos 
after insert on ingresso_compra
for each row
begin
    declare idEvento int;

    select fk_id_evento into idEvento
    from ingresso 
    where id_ingresso = new.fk_id_ingresso;
   
    if exists(select 1 from resumo_evento where id_evento = idEvento) then
        update resumo_evento
        set total_ingressos = total_ingressos + new.quantidade
        where id_evento = idEvento;
    else
        insert into resumo_evento(id_evento, total_ingressos) values
        (idEvento, new.quantidade);
    end if;
end; //

delimiter ; 

select * from resumo_evento;