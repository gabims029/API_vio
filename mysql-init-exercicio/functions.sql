-- CRIAÇÃO DE FUNCTION 
delimiter $$
create function calcula_idade(datanascimento date)
returns int
deterministic
contains sql
begin  
    declare idade int;
    set idade = timestampdiff(year, datanascimento, curdate());
    return idade;
end $$
delimiter ;

show create function calcula_idade;

select name, calcula_idade(data_nascimento) as idade from usuario;

delimiter $$
create function status_sistema()
returns varchar(50)
no sql
begin 
    return 'Sistema operando normalmente';
end; $$
delimiter ; 

select status_sistema();

delimiter $$
create function total_compras_usuario(id_usuario int)
returns int
reads sql data
begin 
    declare total int;
    
    select count(*) into total
    from compra 
    where id_usuario = compra.fk_id_usuario;

    return total;
end; $$
delimiter ;

select total_compras_usuario(3) "Total de compras";

-- TABELA PARA TESTAR A CLÁUSULA MODIFILES SQL DATA
create table log_evento(
    id_log int auto_increment primary key,
    mensagem varchar(255),
    data_log datetime default current_timestamp
);

delimiter $$
create function registrar_log_evento(texto varchar(255))
returns varchar(50)
not deterministic
modifies sql data
begin
    insert into log_evento(mensagem)
    values(texto);
    return 'Log inserido com sucesso';
end; $$

delimiter ; 

show create function registrar_log_evento;

-- VIZUALIZAR O ESTADO DA VARIAVEL DE CONTROLE PARA PERMISSÃO DE CRIAÇÃO DE FUNÇÕES
show variables like 'log_bin_trust_function_creators';


set global log_bin_trust_function_creators = 1;

select registrar_log_evento('teste');

delimiter $$ 
create function mensagem_boas_vinas(nome_usuario varchar(100))
returns varchar(255)
deterministic
contains sql
begin
    declare msg varchar(255);
    set msg = concat('Olá ', nome_usuario, '! Seja bem-vindo(a) ao sistema VIO');
    return msg;
end; $$
delimiter ;

-- Ver as funções criadas
select routine_name from 
information_schema.routines
    where routine_type = 'FUNCTION'
        and routine_schema = 'vio_gabi';

-- Ver usuário maior de idade
delimiter $$
create function is_maior_idade(data_nascimento date)
returns boolean
not deterministic
contains sql
begin
    declare idade int;

    -- Utilizando a função já criada
    set idade = calcula_idade(data_nascimento);
    return idade >= 18;
end; $$
delimiter ;

-- Categorizar usuários por faixa etária
delimiter $$
create function faixa_etaria(data_nascimento date)
returns varchar(20)
not deterministic
contains sql 
begin 
    declare idade int;

    -- cálculo da idade com a função já criada
    set idade = calcula_idade(data_nascimento);

    if idade < 18 then
        return "menor de idade";
    elseif idade < 60 then
        return "adulto";
    else 
        return "idoso";
    end if;

end; $$
delimiter ;

-- agrupar usuários por faixa etária
select faixa_etaria(data_nascimento) as faixa, count(*) as quantidade from usuario
group by faixa;

-- identificar uma faixa etária específica
select name from usuario 
    where faixa_etaria(data_nascimento) = "idoso";

-- calcular a média de idade de usuário
delimiter $$
create function media_idade()
returns decimal(5,2)
not deterministic
reads sql data
begin 
    declare media decimal(5,2);

    -- cálculo da média das idades 
    select avg(timestampdiff(year, data_nascimento, curdate())) into media from usuario;

    return ifnull(media, 0);
end; $$
delimiter ;

-- selecionar idade especifica
select "A média de idade dos clientes é maior que 30" as resultado where media_idade() > 30;

-- EXERCÍCIO DIRECIONADO
-- Cálculo do total gasto por um usuário
delimiter $$
create function calcula_total_gasto(pid_usuario int)
returns decimal(10,2)
not deterministic
reads sql data
begin
    declare total decimal(10,2);

    select sum(i.preco * ic.quantidade) into total
    from compra c
    join ingresso_compra ic on c.id_compra = ic.fk_id_compra
    join ingresso i on i.id_ingresso = ic.fk_id_ingresso
    where c.fk_id_usuario = pid_usuario;

    return ifnull(total,0);
end; $$

delimiter ;

-- Buscar a faixa etária de um usuário
delimiter $$
create function buscar_faixa_etaria_usuario(pid int)
returns varchar(20)
not deterministic
reads sql data 
begin 
    declare nascimento date;
    declare faixa varchar(20);

    select data_nascimento into nascimento
    from usuario
    where id_usuario = pid;

    set faixa = faixa_etaria(nascimento);

    return faixa;
end; $$
delimiter ;


-- EXERCÍCIO
delimiter $$
create function total_ingressos_vendidos(id_evento int)
returns int
not deterministic
reads sql data
begin
    declare total int;

    select sum(ic.quantidade) into total
    from ingresso i
    join ingresso_compra ic on i.id_ingresso = ic.fk_id_ingresso
    join evento e on e.id_evento = i.fk_id_evento
    where i.fk_id_evento = id_evento;

    return ifnull(total,0);
end; $$
delimiter ;


delimiter $$ 
create function renda_total_evento(id_evento int)
returns decimal (10,2)
not deterministic
reads sql data
begin
    declare total decimal(10,2);

    select sum(i.preco * ic.quantidade) into total
    from ingresso i
    join ingresso_compra ic on i.id_ingresso = ic.fk_id_ingresso
    where i.fk_id_evento = id_evento;

    return ifnull(total,0);
end; $$
delimiter ;