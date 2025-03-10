module.export = function validateUser({cpf,email,password,name,data_nascimento}){
    if(!cpf||!email||!password||!name||!data_nascimento){
        return{error: "Todos os campos devem ser preeenchidos"}
    }
    if(isNaN(cpf)||cpf.length !==11){
        return{error: "CPF inválido. Deve conter 11 dígitos numéricos"}
    }
    if(!email.includes("@")){
        return{error: "Email inválido. DEve conter @"}
    }
    return null; //Ou seja, se estiver tudo certo eu retorno nulo para ignorar o IF naa userController
}