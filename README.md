<p align="center">
  <img  src="https://cdn.iconscout.com/icon/free/png-256/credit-card-2650080-2196542.png">
</p>
<h1 align="center">
  Valex
</h1>
<div align="center">

  ![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
  ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
  <a href="https://github.com/andreseichi/valex/commits">
    <img alt="Github repo size" src="https://img.shields.io/github/repo-size/andreseichi/valex?style=for-the-badge">
  </a>
  <a href="https://github.com/andreseichi/valex/commits">
    <img alt="Last commit" src="https://img.shields.io/github/last-commit/andreseichi/valex?style=for-the-badge" />
  </a>
</div>
​
<br/>
​

# Descrição

API de gerenciamento de cartão benefício, feito para empresas realizarem a gestão dos cartões de seus empregados.
​
</br>

​
## Funcionalidades
​
-   Criar cartão
-   Obter saldo do cartão
-   Ativar / Bloquear / Desbloquear um cartão
-   Recarregar um cartão
-   Realizar pagamento com cartão
​
</br>
​

## API Documentação

​
### Create a card
​
```http
POST /card/create
```
​
#### Request:

| Headers     | Tipo     | Descrição           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Obrigatório**. API key |
​
####
​
| Body   | Tipo       | Descrição             |
| :----- | :--------- | :---------------------- |
| `type` | `string`   | **Obrigatório**. Tipo do cartão |
| `employeeId` | `number`   | **Obrigatório**. ID do empregado |
​
###

`Tipos válidos: [groceries, restaurant, transport, education, health]`

​
#### Response:
​
```json
{
	"card": {
		"employeeId": 1,
		"number": "1111-1111-1111-1111",
		"cardholderName": "FULANO R SILVA",
		"securityCode": "111",
		"expirationDate": "01/27",
		"isVirtual": false,
		"isBlocked": false,
		"type": "tipo do cartão"
	}
}
```

<br/>

​
### Obter saldo do cartão
​
```http
POST /card/balance
```
​
#### Request:
​
| Body             | Tipo     | Descrição                        |
| :--------------- | :------- | :--------------------------------- |
| `fullName`       | `string` | **Obrigatório**. Nome completo do usuário       |
| `number`         | `string` | **Obrigatório**. Número do cartão          |
| `expirationDate` | `string` | **Obrigatório**. Data de expiração do cartão |

###
​
`Formato do número: "1111-1111-1111-1111"`
<br/>

`Formato do data: "MM/YY"`
​
<br/>

#### Response:
​
```json
{
	"balance": 0000,
	"transactions": [],
	"recharges": []
}
```

#
​
### Ativar um cartão
​
```http
PUT /card/activate
```
​
#### Request:
​
| Body             | Tipo     | Descrição                        |
| :--------------- | :------- | :--------------------------------- |
| `fullName`       | `string` | **Obrigatório**. Nome completo do usuário       |
| `number`         | `string` | **Obrigatório**. Número do cartão          |
| `expirationDate` | `string` | **Obrigatório**. Data de expiração do cartão |
| `password`       | `string` | **Obrigatório**. Senha do cartão        |
| `CVC`            | `string` | **Obrigatório**. CVC do cartão             |
​
###

`Formato do número: "1111-1111-1111-1111"`

`Formato do data: "MM/YY"`

`Número de digítos da senha: 4`
​
#
​
### Bloquear um cartão
​
```http
PUT /card/block
```
​
#### Request:
​
| Body             | Tipo     | Descrição                        |
| :--------------- | :------- | :--------------------------------- |
| `fullName`       | `string` | **Obrigatório**. Nome completo do usuário  |
| `number`         | `string` | **Obrigatório**. Número do cartão          |
| `expirationDate` | `string` | **Obrigatório**. Data de expiração do cartão |
| `password`       | `string` | **Obrigatório**. Senha do cartão        |
​
###

`Formato do número: "1111-1111-1111-1111"`

`Formato do data: "MM/YY"`

`Número de digítos da senha: 4`
​
#
​
### Desbloquear um cartão
​
```http
PUT /card/unblock
```
​
#### Request:
​
| Body             | Tipo     | Descrição                        |
| :--------------- | :------- | :--------------------------------- |
| `fullName`       | `string` | **Obrigatório**. Nome completo do usuário  |
| `number`         | `string` | **Obrigatório**. Número do cartão          |
| `expirationDate` | `string` | **Obrigatório**. Data de expiração do cartão |
| `password`       | `string` | **Obrigatório**. Senha do cartão        |
​
###

`Formato do número: "1111-1111-1111-1111"`

`Formato do data: "MM/YY"`

`Número de digítos da senha: 4`
​
#
​
### Recarregar um cartão
​
```http
POST /card/recharge
```
​
#### Request:
​
| Headers     | Tipo     | Descrição           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Obrigatório**. API key |
​
####
​
| Body             | Tipo      | Descrição                        |
| :--------------- | :-------- | :--------------------------------- |
| `fullName`       | `string` | **Obrigatório**. Nome completo do usuário  |
| `number`         | `string` | **Obrigatório**. Número do cartão          |
| `expirationDate` | `string` | **Obrigatório**. Data de expiração do cartão |
| `amount`         | `number` | **Obrigatório**. Quantia de recarga      |
​
###

`Formato do número: "1111-1111-1111-1111"`

`Formato do data: "MM/YY"`

​
#

### Realizar pagamento com cartão
​
```http
POST /card/purchase
```
​
#### Request:
​
| Headers     | Tipo     | Descrição           |
| :---------- | :------- | :-------------------- |
| `x-api-key` | `string` | **Required**. API key |
​
####
​
| Body             | Tipo      | Descrição                        |
| :--------------- | :-------- | :--------------------------------- |
| `fullName`       | `string` | **Obrigatório**. Nome completo do usuário  |
| `number`         | `string` | **Obrigatório**. Número do cartão          |
| `expirationDate` | `string` | **Obrigatório**. Data de expiração do cartão |
| `password`       | `string` | **Obrigatório**. Senha do cartão        |
| `amount`         | `number` | **Obrigatório**. Quantia paga      |
| `businessId`     | `number` | **Obrigatório**. ID da empresa      |

​
`Formato do número: "1111-1111-1111-1111"`

`Formato do data: "MM/YY"`
​
#
​
## Variáveis de ambiente
​
Para rodar este projeto você vai precisar adicionar as seguintes variáveis de ambiente no seu arquivo `.env`

`PORT = number #recommended:5000`

`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName`

`CRYPTR_SECRET = any string`
​
</br>
​
## Rodar o projeto localmente
​
Clone o projeto

```bash
  git clone https://github.com/andreseichi/projeto18-valex
```

Abre o projeto
​
```bash
  cd projeto18-valex/
```

Instalar dependências
​
```bash
  yarn
```
​
Criar o banco de dados
​
```bash
  cd database/ && bash ./create-database
```

```bash
  cd ../
```
​
Iniciar o servidor
​
```bash
  yarn dev
```
​