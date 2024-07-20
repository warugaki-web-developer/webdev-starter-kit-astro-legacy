# Web Development Starter Kit

このプロジェクトは、Astroを使ったレガシー環境開発最小限のスタートキットです。

## 前提条件

- Node.js v20.14.0
- npm v10.7.0

## 開発機能

- Astro
- Post

## 初回セットアップ

依存関係をインストール:

```sh
npm ci
```

## プロジェクト構成

```plaintext
.
├── _tasks
│   └── build-postcss.mjs
├── dist
├── public
│   ├── favicons
│   ├── scripts
│   └── styles
├── src
│   ├── pages
│   ├── scripts
│   └── styles
├── eslint.config.mjs
├── .prettierrc.cjs
├── .stylelintrc.cjs
├── astro.config.mjs
├── package.json
├── postcss.config.js
└── README.md
```

## npm scripts

### ビルド

全アセット（CSS, JS, HTML, 公開ファイル）をビルド: `dist`フォルダに出力されます。

```sh
npm run build
```

### 開発

開発サーバーを起動:

```sh
npm run dev
```

## 設定ファイル

### _tasks/build-postcss.mjs

postcssのビルドやウォッチスクリプトで使用されるパス設定を含むファイル。

### postcss.config.js

autoprefixer や postcss-preset-env などのプラグインを含む PostCSS の設定。

### .eslint.config.mjs

Astro・JavaScript・HTML ファイルをリントするための ESLint 設定。

### .stylelintrc.cjs

CSS ファイルをリントするための Stylelint 設定。

### .prettierrc.cjs

Astro・CSS・JS ファイルをフォーマットするための Prettier 設定。

### astro.config.mjs

Astro 設定。

## 開発ワークフロー

1. 開発サーバーを起動:

```sh
npm run dev
```
