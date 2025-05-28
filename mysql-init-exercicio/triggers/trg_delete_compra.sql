-- Cria tabela antes da trigger
create table historico_compra (
    id_historico int auto_increment primary key,
    id_compra int not null,
    data_compra datetime not null,
    id_usuario int not null,
    data_exclusao datetime default current_timestamp
);

delimiter //

create trigger trg_after_delete_compra
after delete on compra
for each row
begin
    insert into historico_compra (id_compra, data_compra, id_usuario) value
    (old.id_compra, old.data_compra, old.fk_id_usuario);
end; //

delimiter ; 


delete from compra where id_compra = 4;

select * from historico_compra;

