#  Adastra EDScript  — App React Native + TypeScript

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow?style=for-the-badge)

<p align="center">
  <a href="#sobre">Sobre</a> •
  <a href="#stacks">Stacks</a> •
  <a href="#estrutura">Estrutura</a> •
  <a href="#como-comecar">Como Começar</a>
</p>

**Adastra EDScript** é o aplicativo mobile responsável pela interface e experiência do usuário do projeto **Adastra**, desenvolvido em **React Native + TypeScript** com **Expo**.

Este projeto faz parte da entrega do **Grupo Adastra** no **Desafio 01 do Hackathon EDScript Recife 2026**, onde as equipes competidoras precisam reconstruir as jornadas essenciais do site da [Esportes da Sorte](https://www.esportesdasorte.com/) — patrocinadora principal do evento — em uma experiência **mobile nativa ou híbrida**.

🔗 A API backend desenvolvida em Node.js + TypeScript está disponível [aqui](#).

<h2 id="sobre"> 📌 Sobre</h2>

O app foi construído com **Expo Router** para navegação baseada em arquivos, **React Native Reanimated** para animações fluidas e suporte a tema claro/escuro via `useColorScheme`. A arquitetura segue uma separação clara entre telas, componentes reutilizáveis, hooks e constantes de tema.

O projeto tem suporte a **iOS**, **Android** e **Web** a partir de uma única base de código.

<h2 id="stacks"> 🧪 Stacks</h2>

- [React Native 0.81](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo 54](https://expo.dev/)
- [Expo Router 6](https://expo.github.io/router/)
- [React Navigation 7](https://reactnavigation.org/)
- [React Native Reanimated 4](https://docs.swmansion.com/react-native-reanimated/)
- [Expo Vector Icons](https://icons.expo.fyi/)

<h2 id="estrutura"> 📁 Estrutura de Pastas</h2>

```
app-edscript/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx     # Layout das abas de navegação
│   │   ├── index.tsx       # Tela inicial
│   │   └── explore.tsx     # Tela de exploração
│   ├── _layout.tsx         # Layout raiz da aplicação
│   └── modal.tsx           # Tela de modal global
├── components/
│   ├── ui/                 # Componentes primitivos (ícones, collapsible)
│   ├── themed-text.tsx     # Texto com suporte a tema
│   ├── themed-view.tsx     # View com suporte a tema
│   ├── parallax-scroll-view.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   └── external-link.tsx
├── constants/
│   └── theme.ts            # Paleta de cores e tokens de tema
├── hooks/
│   ├── use-color-scheme.ts # Hook de tema (iOS/Android)
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
├── assets/
│   └── images/             # Ícones, splash e imagens do app
├── app.json                # Configuração do Expo
└── package.json
```

<h2 id="como-comecar"> ▶️ Como Começar</h2>

### Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [Expo Go](https://expo.dev/go) instalado no celular (para testar em dispositivo físico)

### Clone o repositório

```bash
git clone https://github.com/issagomesdev/edscript.git
cd edscript/app-edscript
```

### Instale as dependências

```bash
npm install
```

### Inicie o servidor de desenvolvimento

```bash
npm start
```

Escaneie o QR code com o **Expo Go** (Android) ou a câmera (iOS) para abrir o app no dispositivo.

### Rodar em plataforma específica

```bash
npm run android   # Abre no emulador ou dispositivo Android
npm run ios       # Abre no simulador iOS (requer macOS)
npm run web       # Abre no navegador
```

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o servidor Expo com QR code |
| `npm run android` | Inicia diretamente no Android |
| `npm run ios` | Inicia diretamente no iOS |
| `npm run web` | Inicia na versão web |
| `npm run lint` | Verifica erros de lint |
| `npm run reset-project` | Reseta o projeto para o estado inicial |

---

🔗 Repositório da API backend (Node.js) disponível [aqui](#)
