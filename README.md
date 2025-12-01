# 📚 App de Gestão de Livros -- Mobile (Expo)

Aplicativo mobile desenvolvido em **React Native + Expo** para
gerenciamento de livros integrado à API:

    https://tcc-back-2025.vercel.app/livros

## 🚀 Tecnologias Utilizadas

-   React Native
-   Expo
-   Expo Router
-   Axios
-   Expo Linear Gradient
-   Expo BlurView

## 📦 Funcionalidades

-   Listar livros
-   Cadastrar livros
-   Visualizar detalhes
-   Editar (opcional)
-   Excluir (opcional)

## 🛠️ Como Rodar

``` sh
npm install
npx expo start
```

## 🔌 API

``` js
const API_URL = "https://tcc-back-2025.vercel.app/livros";
```

## 📁 Estrutura

/app\
/livros\
index.js\
create.js\
\[id\].js\
/components\
/styles\
styles.js\
App.js\
README.md

## 📝 Notas

Importar StyleSheet sempre que usar:

``` js
import { StyleSheet } from "react-native";
```
