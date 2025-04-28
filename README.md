<h1 align="center" id="title">Shop manager Front end</h1>

<div align="center">
  <img alt="Static Badge" src="https://img.shields.io/badge/Release-V--1.0.0-black?logoColor=%23000000&logoSize=16px&label=Release&labelColor=%230a66c2&color=%23c6cdcc"> 
  <img src="https://img.shields.io/badge/NodeJs-V--20.0.0-black?logo=npm&logoColor=%23000000&logoSize=16px&label=NodeJS&labelColor=%2397ca00&color=%23c6cdcc" alt="shields" />
</div>

<br/>

The project is a production ready front-end web application for managing an e-commerce shop. built with **VueJs 3** in **TypeScript**, using **Pinia** for state management and **Sass** for styling. The website is also available in a [SSR version](https://github.com/ValerioGc/shop-manager-fe_ssr) made with NuxtJs.

The website reads a local **config.json** at build time to manage API endpoints, feature flags, theming, and SEO defaults these settings are also stored and editable via the [Back Office Admin panel](https://github.com/ValerioGc/shop-manager-bo). At runtime, the app fetches dynamic data (products, categories, contacts, etc..) from the [Shop Manager Backend](https://github.com/ValerioGc/laravel-shop-manager) via RESTful APIs with built-in error handling.
The app is designed to be responsive and works on all devices, including mobile phones and tablets. It also includes a **PWA** manifest for offline support and a **sitemap.xml** and dynamic **metatags** for SEO optimization.

<br/>

<h2 id="desc">💻 Built with</h2>

<table align="center" style="border-collapse: collapse; border: none;">
  <tr>
    <td style="padding: 10px; border: none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg" alt="logo vue" width="50px" height="50px" />
    </td>
    <td style="padding: 10px; border: none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="logo javascript" width="50px" height="50px" />
    </td>
    <td style="padding: 10px; border: none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Sass_Logo_Color.svg" alt="logo sass" width="50px" height="50px" />
    </td>
    <td style="padding: 10px; border: none;">
      <img src="https://upload.wikimedia.org/wikipedia/commons/1/1c/Pinialogo.svg" alt="logo pinia" width="50px" height="50px" />
    </td>
  </tr>
</table>

<br/>

## 🚀 Github Actions

The project is integrated with GitHub Actions for CI/CD. The pipeline is triggered on every push to the deploy_prod/deploy_test branch. The pipeline includes the following steps:

- **Version and changelog extraction**: The version and changelog are extracted from the package.json file to be used in the release process.
- **Build**: The project is built using the build script.
- **Test**: The project is tested using the test script.
- **Deploy**: The compiled build is deployed to the production/test branch.
- **Sitemap**: The sitemap is generated using the sitemap script.
- **Github release**: The project is released on GitHub using the release script and **tagged with version numbers**.

### **Script deploy**

The deployment process is automated through scripts that can be used via NodeJS commands.

**Start the production pipeline on GitHub Actions.**

```
npm run deploy:prod
```

<br/>

**Start the test pipeline on GitHub Actions.**

```
npm run deploy:test
```

<br/>

<h2 id="docker">Docker integration</h2>

The project uses Docker to run the application and perform other operations without having NodeJs installed locally. The script compiles for development using a nodeJs:alpine environment via Docker.

**Start the project with docker on Windows environments**

```bash
npm run docker:win
```

**Start the project with docker on Linux environments**

```bash
npm run docker:linux
```

<br/>

It's also present a docker script for running the compiled files on VPS/VM on nodeJs:alpine instance

**Start the project with docker in test mode**

```bash
npm run docker:deploy -- {mode}
```

##### _Avaliable Mode_:

> - development
> - test
> - prod

<br/>

<br/>

## Suggested IDE Configuration

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (Vetur disabled).

<br/>
<h2 id="installation">🛠️ Installation Steps:</h2>

##### 1. Install dependencies

```sh
npm install
```

##### 2. Update dependencies

```sh
npm update
```

##### 3. Compile for development (_Opens the website locally_)

```sh
npm run dev
```

##### 4. Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

<br/>

<h2 id="build">🔨 Build and Optimization for Deploy</h2>

#### 0. Dynamically generate the sitemap (sitemap.xml) using the router for PROD and TEST environments. <br/>

```sh
npm run generate-sitemap:prod // PRODUCTION
npm run generate-sitemap:test // TEST
```

#### 1. Build using the .env files for production

```sh
npm run build:dev
```

#### 2. Build using the .env files for production

```sh
npm run build:prod
```

#### 3. Build using the .env files for production

```sh
npm run build:test
```

<br/>

<h2 id="test">🧪 Unit Test <a href="https://vitest.dev">[Vitest]</a></h2>
The testing process is already integrated into the build script and pipelines. However, it is possible to run the tests in standalone mode with the following command.

```sh
npm run test:unit
```
