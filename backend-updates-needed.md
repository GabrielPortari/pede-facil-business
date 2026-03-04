# Atualizações necessárias no backend (cadastro de empresa)

## 1) Contrato de dados esperado pelo front

### Obrigatórios

- name (nome fantasia)
- legalName (razão social)
- cnpj (14 dígitos)
- contact (telefone em formato internacional, ex: +5511999999999)
- email
- password
- address.address (rua)
- address.number
- address.neighborhood (bairro)
- address.city
- address.state (UF com 2 letras)
- address.zipcode (CEP)

### Opcionais

- website
- logoUrl
- address.complement

---

## 2) Endpoint

- Manter endpoint: POST /auth/signup/business
- Manter resposta de sucesso: 201

---

## 3) Atualizar DTOs (NestJS)

## SignupBusinessDto

- Adicionar:
  - legalName: string com IsString + IsNotEmpty
  - cnpj: string com IsString + validação regex
  - website?: string com IsOptional + IsUrl
- Manter:
  - name, logoUrl, contact, email, password
- Garantir contact com IsPhoneNumber("BR")

## AddressDto

- Tornar obrigatórios:
  - address
  - number
  - neighborhood
  - city
  - state
  - zipcode
- Manter opcional:
  - complement
- Sugestões de validação:
  - state: regex com 2 letras
  - zipcode: regex de CEP válido

## Exemplo de regex úteis

- CNPJ numérico puro: ^\\d{14}$
- UF: ^[A-Za-z]{2}$
- CEP: ^\\d{5}-?\\d{3}$

---

## 4) Atualizar service de autenticação

No AuthService.signupBusiness:

- Normalizar cnpj removendo máscara antes de salvar
- Salvar novos campos:
  - legalName
  - cnpj
  - website (quando informado)
- Persistir address completo com os campos obrigatórios
- Manter regras existentes de criação de usuário/empresa

---

## 5) Atualizar model/entidade Business

Adicionar campos:

- legalName: string
- cnpj: string
- website?: string

Observação:

- cnpj deve ser único por empresa

---

## 6) Regras de negócio e erros HTTP

Implementar validações de unicidade:

- cnpj duplicado -> retornar 409
- email duplicado -> retornar 409

Mensagens recomendadas:

- CNPJ já cadastrado
- Email já cadastrado

Para payload inválido:

- retornar 400 com detalhes de validação

---

## 7) Ajustes de banco/índices

- Criar índice único para cnpj
- Revisar índice para email (único, se for regra de negócio)

Se já houver dados antigos:

- Rodar script de migração para preencher legalName/cnpj quando possível
- Tratar registros sem os novos campos antes de aplicar constraints

---

## 8) Swagger e documentação

- Atualizar ApiBody do endpoint signup/business com novo DTO
- Atualizar exemplos de request/response no Swagger
- Atualizar README com payload oficial de cadastro business

---

## 9) Exemplo de payload final

{
"name": "Café do Centro",
"legalName": "Café do Centro LTDA",
"cnpj": "12345678000195",
"website": "https://cafedocentro.com.br",
"logoUrl": "https://cdn.exemplo.com/logo.png",
"contact": "+5511999999999",
"email": "contato@cafedocentro.com.br",
"password": "senhaForte123",
"address": {
"address": "Rua das Flores",
"number": "123",
"complement": "Sala 5",
"neighborhood": "Centro",
"city": "São Paulo",
"state": "SP",
"zipcode": "01001-000"
}
}

---

## 10) Checklist final de implementação

- DTO atualizado
- Service atualizado
- Model/entidade atualizado
- Índices de unicidade aplicados
- Swagger atualizado
- Testes cobrindo:
  - sucesso 201
  - cnpj duplicado 409
  - email duplicado 409
  - validação de payload 400
