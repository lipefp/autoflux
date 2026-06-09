# 🚗 AutoFlux

Marketplace mobile de autopeças que conecta **clientes** e **lojas** num só app. Front-end em React Native (Expo) e back-end em Django REST Framework.

![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=%23D04A37)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-%23a30000.svg?style=for-the-badge&logo=django&logoColor=white)

---

## ✨ Funcionalidades

**👤 Cliente**
- Navega lojas próximas e o catálogo de peças
- Busca peças e adiciona ao carrinho
- Checkout e acompanhamento de pedidos por status
- Avaliação de pedidos concluídos

**🏪 Loja**
- Dashboard com métricas da loja
- Cadastro e edição de peças (catálogo próprio)
- Gestão de pedidos recebidos e atualização de status

**🔐 Autenticação**
- Cadastro separado para cliente e loja
- Login com autenticação por token (rotas protegidas por perfil)

---

## 🧰 Stack

**Back-end**
- Django + Django REST Framework
- Autenticação por Token (DRF)
- SQLite · django-cors-headers
- `User` customizado (`AbstractUser`) com campo `role` (client / store)

**Mobile**
- React Native + Expo + TypeScript
- expo-router (navegação por arquivos)
- Axios · AsyncStorage (persistência do token)

---

## 🗂️ Estrutura

```
autoflux/
├── backend/                         # API Django REST Framework
│   ├── api/                         # models, views, serializers, urls
│   │   └── management/commands/
│   │       └── seed.py              # popula dados de demonstração
│   └── autoflux/                    # settings do projeto
└── mobile/                          # App React Native (Expo)
    └── app/
        ├── (auth)/                  # welcome, login, cadastro
        ├── (client)/                # home, lojas, carrinho, checkout, pedidos
        └── (store)/                 # dashboard, catálogo, pedidos da loja
```

---

## 🔑 Contas de demonstração

Após rodar o `seed` (ver abaixo):

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Cliente | `cliente@autoflux.com` | `123456` |
| Loja | `loja@autoflux.com` | `123456` |
| Admin | `admin@autoflux.com` | `admin` |

---

## 🚀 Como rodar

### 1. Back-end (Django)

```bash
cd backend

python -m venv .venv
source .venv/bin/activate        # Linux/macOS
# .venv\Scripts\activate         # Windows

pip install -r requirements.txt
python manage.py migrate
python manage.py seed            # cria as contas/dados de demonstração
python manage.py runserver
```

API disponível em `http://127.0.0.1:8000/`.

### 2. Mobile (Expo)

```bash
cd mobile
npm install
npx expo start
```

Abra no **Expo Go** (celular) ou em um emulador.

> ⚠️ Em celular físico, edite `mobile/constants/api.ts` e troque a URL pelo **IP da sua máquina** na rede local (ex: `http://192.168.1.100:8000`). O emulador Android já usa `10.0.2.2` automaticamente.

---

## 📡 Endpoints

> A API é servida na raiz. Rotas autenticadas exigem o header `Authorization: Token <token>`.

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/auth/register` | Cadastro de usuário (cliente ou loja) |
| `POST` | `/auth/login` | Login — retorna o token |
| `GET` | `/auth/me` | Dados do usuário autenticado |
| `GET/POST` | `/parts` | Lista / cria peças |
| `GET` | `/parts/{id}` | Detalhe da peça |
| `GET` | `/stores` | Lista de lojas |
| `GET` | `/stores/{id}` | Detalhe da loja |
| `GET` | `/stores/{id}/metrics` | Métricas da loja (dashboard) |
| `GET/POST` | `/orders` | Lista / cria pedidos |
| `GET` | `/orders/{id}` | Detalhe do pedido |
| `PATCH` | `/orders/{id}/status` | Atualiza o status do pedido |
| `GET/POST` | `/reviews` | Lista / cria avaliações |

---

## 👤 Autor

**Felipe Diniz** · [GitHub](https://github.com/lipefp) · [LinkedIn](https://www.linkedin.com/in/felipe-diniz-39237b288)
