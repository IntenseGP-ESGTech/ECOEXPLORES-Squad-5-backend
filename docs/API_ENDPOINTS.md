# 📚 API Endpoints - ECOEXPLORES

## 🌐 Acessar Swagger UI

```
http://localhost:4000/api-docs
```

## 📋 Lista de Endpoints

### 1. **GET /api/health**
**Health Check** - Verifica se o servidor está funcionando

**Resposta:**
```json
{
  "ok": true,
  "service": "auth",
  "time": "2024-01-15T10:30:00.000Z"
}
```

---

### 2. **POST /api/auth/register**
**Registrar novo usuário**

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (201):**
```json
{
  "user": {
    "id": "uuid-here",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "jwt-token-here"
}
```

**Erros possíveis:**
- `400` - Campos obrigatórios faltando
- `409` - Email já cadastrado

---

### 3. **POST /api/auth/login**
**Fazer login**

**Body:**
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "user": {
    "id": "uuid-here",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "jwt-token-here"
}
```

**Erros possíveis:**
- `400` - Campos obrigatórios faltando
- `401` - Credenciais inválidas

---

### 4. **GET /api/auth/me**
**Obter perfil do usuário autenticado** ⚠️ Requer autenticação

**Headers:**
```
Authorization: Bearer <seu-token-jwt>
```

**Resposta (200):**
```json
{
  "user": {
    "id": "uuid-here",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Erros possíveis:**
- `401` - Token inválido ou ausente
- `404` - Usuário não encontrado

---

## 🔧 Como Testar

### No Swagger UI:
1. Inicie o servidor: `npm run server`
2. Acesse: `http://localhost:4000/api-docs`
3. Teste os endpoints clicando em "Try it out"

### No Swagger - Testando endpoint protegido (/api/auth/me):
1. Primeiro faça **Register** ou **Login** para obter um token
2. Copie o token da resposta
3. Clique no botão **"Authorize"** no topo da página
4. Cole o token (sem "Bearer ")
5. Agora pode testar o endpoint `/api/auth/me`

### No Postman/Insomnia:
- Configure a URL base: `http://localhost:4000`
- Para endpoints protegidos, adicione header:
  ```
  Authorization: Bearer <token>
  ```

---

## 📝 Notas

- Todos os endpoints retornam JSON
- O token JWT expira em 7 dias
- Senhas são criptografadas com bcrypt
- Dados são armazenados em `server/storage/users.json`

