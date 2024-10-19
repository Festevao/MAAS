# MAAS - Movie and Genre API Service

O MAAS é um serviço de API desenvolvido com NestJS que permite gerenciar informações sobre filmes e gêneros. Este projeto foi criado como parte de um teste de código para uma entrevista de emprego e serve como um exemplo de como configurar um ambiente com múltiplas dependências, incluindo MySQL e MongoDB.

## Dependencias

- Node 20.11.0
- MySql server
- MongoDB server

## Configurações do Ambiente

### Variáveis de Ambiente

Para que o projeto funcione corretamente, você deve definir um arquivo `.env` na raiz do projeto. Abaixo estão as variáveis de ambiente necessárias:

| Nome                  | Descrição                                                   | Tipo                | Valor Sugerido                       |
|-----------------------|-------------------------------------------------------------|---------------------|--------------------------------------|
| SMTP_HOST             | Endpoint do servidor SMTP                                   | string (url)        | N/A                                  |
| SMTP_SECURE           | Define se a comunicação usará TLS                           | boolean (true/false)| N/A                                  |
| SMTP_PORT             | Porta do servidor SMTP                                      | number (int)        | N/A                                  |
| SMTP_USER             | Usuário do servidor SMTP                                    | string              | N/A                                  |
| SMTP_PASS             | Senha do usuário do servidor SMTP                           | string              | N/A                                  |
| SMTP_IGNORE_TLS       | Define se o TLS do servidor SMTP será ignorado             | boolean (true/false)| N/A                                  |
| SMTP_FROM             | E-mail que aparecerá na caixa de entrada dos remetentes    | string (email)      | N/A                                  |
| DB_HOST               | Endpoint do servidor MySQL                                  | string (url)        | N/A                                  |
| DB_USER               | Usuário do servidor MySQL                                   | string              | N/A                                  |
| DB_PASS               | Senha do usuário do servidor MySQL                          | string              | N/A                                  |
| DB_PORT               | Porta do servidor MySQL                                     | number (int)        | 3306                                 |
| DB_DATABASE           | Nome da base de dados do servidor MySQL                     | string              | MAAS                                 |
| MONGODB_HOST          | Endpoint do servidor MongoDB                                | string (url)        | N/A                                  |
| MONGODB_USER          | Usuário do servidor MongoDB                                 | string              | N/A                                  |
| MONGODB_PASSWORD      | Senha do usuário do servidor MongoDB                        | string              | N/A                                  |
| MONGODB_PORT          | Porta do servidor MongoDB                                   | number (int)        | 27017                                |
| MONGODB_DB            | Nome da base de dados do servidor MongoDB                   | string              | N/A                                  |
| JWT_KEY               | Chave para JWT                                             | string              | N/A                                  |
| MOVIE_DATABASE_URL    | Endpoint da API do Movie Database                           | string (url)        | https://api.themoviedb.org         |
| MOVIE_DATABASE_TOKEN   | Token de usuário da API do Movie Database                  | string              | N/A                                  |
| NODE_ENV              | Define o ambiente executado na API                         | string              | production                           |

## Informações para Rodar o Projeto

### Com Docker

Para rodar o projeto utilizando Docker, execute o seguinte comando:

```bash
docker-compose up --build
```

### Sem Docker

Se você preferir rodar os projetos separadamente, existem dois projetos na pasta `package`: `api` e `genre`. Para rodar cada um deles, certifique-se de que os servidores MySQL e MongoDB já estejam em execução e que as variáveis de ambiente estejam corretamente configuradas.

#### API

##### 1. Instale o Nest CLI globalmente (se ainda não o fez):

```bash
npm install -g @nestjs/cli
```

##### 2. Instale as dependências:

```bash
npm install
```

##### 3. Execute as migrações:

```bash
npm run migration:run
```

##### 4. Construa o projeto:

```bash
npm run build
```

##### 5. Inicie o servidor:

```bash
npm start
```

#### Genre

##### 1. Instale ts-node e typescript globalmente (se ainda não o fez):

```bash
npm install -g ts-node typescript
```

##### 2. Instale as dependências:

```bash
npm install
```

##### 3. Execute o script:

```bash
ts-node themes.ts
```

### Acessando a API

#### Documentação

- É possivel acessar o swagger com a aplicação rodando a partir da rota `/docs`.
- O arquivo `db-model.png` é uma representação gráfica do esquema relacional do banco mysql.
- O arquivo `back_end_Node_desafio_pratico_dev_pleno.pdf` é uma cópia do desafio de inspiração desse repositório.
- O arquivo `Insomnia.json` na raiz do projeto contém as collections para utilização da API. Você pode importá-lo no Insomnia ou Postman para facilitar os testes.
