delimiter // 

create trigger impedir_alteracao_evento_passado
before update on evento
for each row
begin
    if old.data_hora < curdate() then
        signal sqlstate '45000'
        set message_text = 'Não é permitido alterar eventos que ocorreram.';
    end if;
end ; //

delimiter ;

-- TESTANDO A TRIGGER EM UM EVENTO ANTIGO
update evento
set local = 'Novo Congresso'
where nome = 'Congresso de Tecnologia';

-- TESTANDO A TRIGGER EM UM EVENTO QUE AINDA NÃO OCORREU
update evento
set local = 'Teatro Central'
where nome = 'Feira Cultural de Inverno';