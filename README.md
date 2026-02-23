# 🌬️ TGS Climatização — Sistema de Gestão

<div align="center">

![Version](https://img.shields.io/badge/versão-2.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/status-ativo-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/licença-privado-red?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Sistema completo de controle financeiro e ordens de serviço para a Loja de Ar Condicionado TGS**

*Desenvolvido por Wanderson de Farias — 2025*

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Usar](#-como-usar)
- [Seções do Sistema](#-seções-do-sistema)
- [Armazenamento de Dados](#-armazenamento-de-dados)
- [Geração de PDF](#-geração-de-pdf)
- [Design e Interface](#-design-e-interface)
- [Responsividade](#-responsividade)
- [Regras de Negócio](#-regras-de-negócio)
- [Contato](#-contato)

---

## 🎯 Sobre o Projeto

O **TGS Sistema de Gestão** é uma aplicação web completa, desenvolvida em **HTML, CSS e JavaScript puro**, sem nenhum framework ou dependência de backend. O sistema foi criado especialmente para a **Loja de Ar Condicionado TGS**, localizada em Uberaba-MG, com o objetivo de centralizar e profissionalizar o controle financeiro e a emissão de ordens de serviço.

Todo o sistema funciona diretamente no navegador, sem necessidade de servidor, banco de dados externo ou instalação de qualquer software adicional. Os dados são persistidos localmente via `localStorage`.

### 🎨 Design

O sistema possui um design **dark premium** moderno, com paleta de cores escura profissional, sidebar de navegação lateral, cards de KPI com indicadores visuais, animações suaves e total responsividade para dispositivos móveis.

---

## ✅ Funcionalidades

### 👥 Gestão de Clientes
- [x] Cadastro completo de clientes (Nome, Telefone, Email, Endereço)
- [x] Edição de dados via modal elegante (sem `prompt()` do navegador)
- [x] Exclusão com confirmação em modal
- [x] Busca em tempo real por nome, telefone ou email
- [x] Contador de clientes no sistema
- [x] Atualização automática das ordens ao editar cliente

### 📋 Ordens de Serviço
- [x] Emissão de ordens com todos os dados necessários
- [x] Seleção de cliente com preenchimento automático do endereço
- [x] 5 tipos de serviço disponíveis
- [x] Controle de tipo (Entrada / Saída)
- [x] Controle de status (Pendente / Concluído / Cancelado)
- [x] Campo de responsável pela atividade
- [x] Campo opcional de quem concluiu
- [x] Assinatura do cliente
- [x] Edição completa via modal (bloqueada se paga)
- [x] Exclusão com confirmação

### 💳 Controle de Pagamentos
- [x] Status de pagamento: **Pendente** ou **Pago**
- [x] Seleção de método: **Pix**, **Dinheiro** ou **Cartão**
- [x] Reversão de pagamento (Pago → Pendente)
- [x] **Bloqueio automático de edição** em ordens pagas

### 🔍 Filtros e Busca
- [x] Filtro por mês (campo `month picker`)
- [x] Botão de atalho para o mês anterior
- [x] Filtro por data específica
- [x] Busca textual (cliente, serviço, responsável, status)
- [x] Filtro por status de pagamento (Todos / Pendente / Pago)
- [x] Limpeza de todos os filtros com um clique

### 📊 Dashboard
- [x] Card de total de clientes
- [x] Card de total de ordens
- [x] Card de total de entradas (receitas)
- [x] Card de total de saídas (despesas)
- [x] Card de saldo atual com barra de progresso animada
- [x] Indicador de tendência (Positivo / Negativo / Equilíbrio)
- [x] Lista das 5 últimas ordens com indicadores visuais
- [x] Painel de resumo financeiro rápido
- [x] Apresentação dos serviços oferecidos

### 📈 Financeiro
- [x] Totais de entradas, saídas e saldo líquido
- [x] Resumo por tipo de serviço com barra de progresso
- [x] Valor total e contagem de ordens por serviço
- [x] Separação de entradas e saídas por categoria

### 📄 Geração de PDF
- [x] PDF profissional com cabeçalho azul e dados da empresa
- [x] Número de OS, dados do cliente e responsável
- [x] Serviço, valor, data/hora, tipo e status
- [x] Informações de pagamento e método
- [x] Campos de assinatura do cliente e responsável
- [x] Rodapé com identificação do sistema
- [x] Download automático ao clicar

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **HTML5** | — | Estrutura e semântica da aplicação |
| **CSS3** | — | Estilização, layout (Flexbox/Grid), animações |
| **JavaScript (ES6+)** | — | Lógica, interatividade e manipulação de dados |
| **Font Awesome** | 6.5.0 | Ícones vetoriais em toda a interface |
| **jsPDF** | 2.5.1 | Geração de documentos PDF no navegador |
| **localStorage API** | — | Persistência de dados no navegador |

> ⚡ **Zero dependências de backend** — nenhum servidor, banco de dados ou linguagem de servidor necessária.

---

## 📁 Estrutura do Projeto

```
tgs-sistema/
│
├── index.html          # Arquivo principal — contém todo o sistema
│                         (HTML + CSS embutido + JavaScript embutido)
│
├── README.md           # Documentação completa do projeto
│
└── img/                # (opcional) Imagens e logos
    ├── ar-condicionado-1.jpg
    └── logo_ar_condicionado.jpg
```

> 💡 **Todo o sistema está contido em um único arquivo `index.html`**, tornando a distribuição, hospedagem e manutenção extremamente simples. Não há dependências locais — apenas conexão com internet para carregar Font Awesome e jsPDF via CDN.

---

## 🚀 Como Usar

### Opção 1 — Abrir diretamente no navegador

1. Baixe o arquivo `index.html`
2. Dê um duplo clique no arquivo
3. O sistema abrirá diretamente no seu navegador padrão
4. **Pronto!** Nenhuma instalação necessária

### Opção 2 — Hospedagem em servidor web

1. Faça o upload do arquivo `index.html` para qualquer servidor web (Apache, Nginx, etc.)
2. Ou utilize serviços gratuitos como **GitHub Pages**, **Netlify** ou **Vercel**
3. Acesse pelo domínio configurado

### Opção 3 — Servidor local simples

```bash
# Com Python 3
python -m http.server 8080

# Com Node.js (npx)
npx serve .

# Acesse: http://localhost:8080
```

> ⚠️ **Importante:** O sistema requer conexão com internet somente para carregar os ícones (Font Awesome) e a biblioteca de PDF (jsPDF) via CDN. Os dados são sempre salvos localmente no navegador.

---

## 📱 Seções do Sistema

### 🏠 Dashboard
A tela inicial apresenta uma visão completa e rápida do negócio:

- **5 cards de KPI** com métricas principais
- **Barra de saldo** mostrando a proporção entre entradas e saídas
- **Indicador de tendência** colorido (verde = positivo, vermelho = negativo)
- **Últimas 5 ordens** com cores por status de pagamento
- **Resumo financeiro** lateral com entradas, saídas e saldo
- **Vitrine de serviços** da empresa

### 👥 Clientes
Gerenciamento completo da base de clientes:

- Formulário colapsável para novo cadastro
- Tabela com todos os clientes e busca em tempo real
- Edição e exclusão via modais profissionais

### 📋 Ordens de Serviço
Central de ordens com controle total:

- Formulário detalhado para emissão de ordens
- Sistema de filtros avançados
- Tabela completa com todas as ações disponíveis

### 📈 Financeiro
Análise financeira detalhada:

- Cards com totais de entradas, saídas e saldo
- Resumo por serviço com barras de progresso
- Comparação de entradas vs saídas por categoria

---

## 💾 Armazenamento de Dados

O sistema utiliza o **`localStorage`** do navegador para persistir todos os dados. Isso significa:

| Característica | Detalhe |
|---|---|
| **Onde ficam os dados** | No próprio navegador do usuário |
| **Capacidade** | ~5MB por domínio (suporta centenas de clientes e ordens) |
| **Persistência** | Os dados permanecem mesmo após fechar o navegador |
| **Chaves utilizadas** | `tgs_c` (clientes) e `tgs_o` (ordens) |
| **Formato** | JSON serializado |
| **Backup** | Manual — via botão "Limpar Dados" com confirmação |

### ⚠️ Atenção sobre os dados

> Os dados ficam **somente no navegador** em que foram inseridos. Se utilizar em outro computador ou outro navegador, os dados não estarão disponíveis. Para uso em múltiplos dispositivos, recomenda-se uma versão futura com backend.

---

## 📄 Geração de PDF

A geração de PDF utiliza a biblioteca **jsPDF 2.5.1**. Cada ordem de serviço pode ser exportada individualmente com:

```
┌─────────────────────────────────────────┐
│  [CABEÇALHO AZUL]                       │
│  ORDEM DE SERVIÇO                       │
│  TGS Climatização • Endereço • Telefone │
├─────────────────────────────────────────┤
│  Nº OS: xxxxxxxxxx                      │
│  Cliente: [nome]                        │
│  Endereço: [endereço]                   │
│  Responsável: [nome]                    │
│  Serviço: [tipo]                        │
│  Valor: R$ xx,xx                        │
│  Data/Hora: dd/mm/aaaa hh:mm            │
│  Tipo: Entrada / Saída                  │
│  Status: Pendente / Concluído           │
│  Pagamento: Pago / Pendente             │
│  Método: Pix / Dinheiro / Cartão        │
├─────────────────────────────────────────┤
│  ________________  ________________     │
│  Assinatura Cliente  Assinatura Resp.   │
├─────────────────────────────────────────┤
│  [RODAPÉ] Documento gerado pelo TGS     │
└─────────────────────────────────────────┘
```

O arquivo é salvo automaticamente como `OS_[id].pdf`.

---

## 🎨 Design e Interface

### Paleta de Cores

| Variável | Cor | Uso |
|---|---|---|
| `--bg` | `#0a0e1a` | Fundo principal da página |
| `--panel` | `#131b2e` | Cards e painéis |
| `--blue` | `#3b82f6` | Ações primárias, links |
| `--green` | `#22c55e` | Entradas, sucesso, positivo |
| `--red` | `#ef4444` | Saídas, perigo, negativo |
| `--amber` | `#f59e0b` | Saldo, alertas, destaque |
| `--purple` | `#a855f7` | Card de ordens |
| `--cyan` | `#06b6d4` | Detalhes e gradientes |

### Componentes de Interface

- **Sidebar** — Navegação lateral fixa com grupos e ícones
- **Top Strip** — Cabeçalho com título da seção e relógio em tempo real
- **KPI Cards** — Cards com ícone colorido, valor, label e rodapé informativo
- **Data Tables** — Tabelas com hover, badges coloridos e ações por linha
- **Modais** — Diálogos sobrepostos com blur de fundo para todas as ações
- **Toast Notifications** — Notificações no canto inferior direito
- **Collapsibles** — Formulários recolhíveis com animação suave
- **Filtros** — Barra de filtros avançados com múltiplas opções

---

## 📐 Responsividade

O sistema é totalmente responsivo com 3 breakpoints:

| Breakpoint | Dispositivo | Comportamento |
|---|---|---|
| `> 1080px` | Desktop grande | Layout completo com sidebar e grid de 4 colunas |
| `800px – 1080px` | Tablet / Desktop pequeno | Grid de 2 colunas, dashboard em coluna única |
| `< 800px` | Mobile / Tablet pequeno | Sidebar oculta com menu hambúrguer, layout em coluna |
| `< 520px` | Mobile pequeno | Grid totalmente em coluna única |

### Mobile
- Topbar com botão hambúrguer substitui a sidebar
- Sidebar abre como overlay deslizante
- Formulários em coluna única
- Tabelas com scroll horizontal

---

## ⚙️ Regras de Negócio

```
1. CADASTRO
   ├── Cliente: Nome, Telefone, Email e Endereço são obrigatórios
   └── Ordem: Todos os campos com asterisco (*) são obrigatórios

2. PAGAMENTO
   ├── Nova ordem sempre inicia como "Pendente"
   ├── Ao marcar como "Pago", solicita forma (Pix/Dinheiro/Cartão)
   └── Pode ser revertido de Pago → Pendente via confirmação em modal

3. EDIÇÃO
   ├── Clientes podem ser editados a qualquer momento
   ├── Ordens PENDENTES podem ser editadas livremente
   └── Ordens PAGAS ficam BLOQUEADAS para edição (proteção financeira)

4. EXCLUSÃO
   ├── Toda exclusão exige confirmação em modal
   └── Ao editar nome/endereço de cliente, todas as ordens são atualizadas

5. FINANCEIRO
   ├── Entradas e saídas são calculadas em tempo real
   ├── Filtros afetam os totais exibidos nas seções
   └── Saldo = Total Entradas - Total Saídas
```

---

## 🔮 Possíveis Melhorias Futuras

- [ ] **Exportação de dados** — Backup em JSON ou Excel
- [ ] **Importação de dados** — Restaurar backup do sistema
- [ ] **Múltiplos usuários** — Com autenticação e login
- [ ] **Backend com banco de dados** — Para acesso em múltiplos dispositivos
- [ ] **Relatórios por período** — PDF com resumo mensal/anual
- [ ] **Notificações de vencimento** — Alertas para ordens pendentes antigas
- [ ] **Histórico de alterações** — Log de modificações nas ordens
- [ ] **Integração WhatsApp** — Envio de OS por WhatsApp ao cliente

---

## 📞 Contato

<div align="center">

**Loja de Ar Condicionado TGS**

📍 Av. Nossa Senhora do Desterro 185, Uberaba - MG

📞 (34) 99931-9991 / (34) 99979-8788

📧 contato@lojaarcondicionado.com.br

[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://api.whatsapp.com/send?phone=5534999319991)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/seu_perfil)
[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://facebook.com/suaempresa)

---

*Desenvolvido com ❤️ por **Wanderson de Farias** — 2025*

*© 2025 TGS Climatização. Todos os direitos reservados.*

</div>
