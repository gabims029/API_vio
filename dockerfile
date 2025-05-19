## Baixa e executa a imagem do node na versão Alpine(Versão simplificada)
FROM node:alpine

## Define o local onde o irá app ficarno dico do container
## O caminho de Dev quem escolhe
WORKDIR /usr/app

## Copia tudo que começa e termina com .json para dentro de usr/app
COPY package*.json ./

## Executa npm install para adiciionar todas e criar a pasta_node_moduled
RUN npm install

## Copia tudo que está no diretorio onde o arquivo Dockerfile está
## Será copiado dentro da pasta /usr/app do container
## Vamos ignorer a node_modules (.dockerignore)
COPY . .

## Container ficará ouvindo os acessos na porta 5000
EXPOSE 5000

## Executa o comando para iniciar o script que está no package.json
CMD npm start