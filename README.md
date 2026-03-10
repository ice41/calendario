# 🏖️ Sistema de Gestão de Férias

Um sistema moderno e intuitivo para gestão de férias de funcionários, desenvolvido com React, TypeScript e Vite.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

<a href="https://ice41.github.io/calendario/">![WEB](https://img.shields.io/badge/demo-site-blue?style=for-the-badge)</a>
<a href="https://nped.pt/calendario/">![WEB](https://img.shields.io/badge/Oficial-site-brightgreen?style=for-the-badge)</a>


## ✨ Funcionalidades

### 👥 Gestão de Funcionários (Admin)
- **Cadastro de Funcionários**: Adicione novos funcionários com informações completas
  - Nome, email, cargo e departamento
  - Código de funcionário (usado como senha de login)
  - Cor de identificação única por cargo
  - Permissões de administrador
- **Edição e Exclusão**: Gerencie informações dos funcionários
- **Visualização Completa**: Lista com todos os funcionários e suas informações

### 📅 Calendário de Férias
- **Visualização Mensal**: Calendário interativo mostrando todas as férias
- **Código de Cores**: Cada funcionário tem uma cor única para fácil identificação
- **Legenda Dinâmica**: Mostra todos os funcionários com férias no mês atual
- **Navegação**: Navegue entre meses facilmente
- **Exportação PDF**: Imprima ou exporte o calendário com cores e legenda

### 🎯 Dashboard Inteligente

#### Para Administradores:
- **Total de Funcionários**: Contador em tempo real
- **Solicitações Pendentes**: Número de pedidos aguardando aprovação
- **Em Férias Hoje**: Contador de funcionários em férias (clicável para ver detalhes)
- **Lista de Solicitações**: Aprovar ou rejeitar pedidos diretamente do dashboard
- **Últimas Aprovações**: Visualização rápida das férias aprovadas recentemente
- **Edição de Férias**: Administradores podem editar qualquer período de férias
- **Revogação**: Possibilidade de revogar férias já aprovadas

#### Para Funcionários:
- **Dias Utilizados**: Contador de dias de férias já usados
- **Dias Restantes**: Visualização dos dias disponíveis (de 23 dias totais)
- **Minhas Solicitações**: Status dos seus pedidos de férias
- **Indicador Visual**: Cores diferentes baseado nos dias restantes
  - 🟢 Verde: 10+ dias restantes
  - 🟠 Laranja: 5-9 dias restantes
  - 🔴 Vermelho: Menos de 5 dias restantes

### 🔐 Sistema de Autenticação

#### Conta Administrador Padrão:
- **Email**: `admin`
- **Senha**: `admin123`

#### Contas de Funcionários:
- **Email**: Email cadastrado do funcionário
- **Senha**: Código de funcionário

### 🛡️ Controle de Acesso
- **Proteção de Rotas**: Funcionários não podem acessar a página de gestão de funcionários
- **Redirecionamento Automático**: Funcionários sempre iniciam no Dashboard
- **Menus Dinâmicos**: Interface adapta-se baseado nas permissões do usuário
- **Sessão Persistente**: Login mantido mesmo após refresh da página

### 📋 Solicitação de Férias
- **Formulário Intuitivo**: Selecione datas de início e fim
- **Validação Automática**: Impede marcação em feriados nacionais
- **Notas Opcionais**: Adicione observações ao pedido
- **Status em Tempo Real**: Acompanhe o status (Pendente/Aprovado/Rejeitado)

### 🎨 Interface Moderna
- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Animações Suaves**: Transições e micro-interações agradáveis
- **Tema Profissional**: Paleta de cores azul com tons de slate
- **Ícones Lucide**: Ícones modernos e consistentes
- **Feedback Visual**: Estados de hover, loading e sucesso/erro

## 🚀 Tecnologias Utilizadas

- **React 18**: Biblioteca para construção da interface
- **TypeScript**: Tipagem estática para maior segurança
- **Vite**: Build tool rápido e moderno
- **TailwindCSS**: Framework CSS utility-first
- **date-fns**: Manipulação de datas em português
- **Lucide React**: Biblioteca de ícones
- **React Context API**: Gerenciamento de estado global
- **LocalStorage**: Persistência de dados no navegador

## 📦 Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre na pasta do projeto
cd gestao_ferias

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Compila para produção
npm run preview      # Preview da build de produção

# Deploy
npm run deploy       # Deploy para GitHub Pages
```

## 📂 Estrutura do Projeto

```
gestao_ferias/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Dashboard.tsx    # Dashboard principal
│   │   ├── EmployeeList.tsx # Lista de funcionários
│   │   ├── EmployeeForm.tsx # Formulário de funcionário
│   │   ├── CalendarView.tsx # Visualização do calendário
│   │   ├── Layout.tsx       # Layout principal com sidebar
│   │   ├── Login.tsx        # Tela de login
│   │   └── ui/              # Componentes UI reutilizáveis
│   ├── store/               # Contextos e estado global
│   │   ├── AppContext.tsx   # Contexto principal da aplicação
│   │   └── AuthContext.tsx  # Contexto de autenticação
│   ├── types/               # Definições TypeScript
│   │   └── index.ts         # Tipos e interfaces
│   ├── lib/                 # Utilitários
│   │   └── utils.ts         # Funções auxiliares
│   ├── App.tsx              # Componente raiz
│   └── main.tsx             # Entry point
├── public/                  # Arquivos estáticos
└── package.json             # Dependências e scripts
```

## 🎯 Fluxo de Uso

### Para Administradores:

1. **Login** com credenciais de admin
2. **Cadastrar Funcionários** na página "Funcionários"
3. **Visualizar Solicitações** no Dashboard
4. **Aprovar/Rejeitar** pedidos de férias
5. **Editar ou Revogar** férias quando necessário
6. **Consultar Calendário** para visão geral

### Para Funcionários:

1. **Login** com email e código de funcionário
2. **Verificar Dias Disponíveis** no Dashboard
3. **Solicitar Férias** através do calendário
4. **Acompanhar Status** das solicitações
5. **Visualizar Calendário** de férias da equipe

## 🔒 Segurança

- ✅ Autenticação obrigatória para acesso ao sistema
- ✅ Controle de acesso baseado em roles (Admin/Funcionário)
- ✅ Proteção de rotas sensíveis
- ✅ Validação de dados no frontend
- ✅ Sessões persistentes com localStorage

## 🎨 Customização

### Cores de Identificação
O sistema oferece 33 cores diferentes para identificação de funcionários no calendário, garantindo fácil distinção visual.

### Dias de Férias
O total de dias de férias está configurado para **23 dias** por ano, podendo ser ajustado no código se necessário.

### Feriados Nacionais
O sistema inclui validação para feriados nacionais portugueses, impedindo marcação de férias nessas datas.

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- 💻 Desktop (1920px+)
- 💻 Laptop (1024px - 1920px)
- 📱 Tablet (768px - 1024px)
- 📱 Mobile (320px - 768px)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 👨‍💻 Desenvolvedor

</details>
<p align="left">
  <a href="https://discord.com/users/261642084463804416/"><img src="https://discord.c99.nl/widget/theme-2/261642084463804416.png" /></a><br>
</p>

---

**Versão**: 1.0.0  
**Última Atualização**: Novembro 2025
