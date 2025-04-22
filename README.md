<h1 align="center" id="title">Shop manager Front end</h1>

<p align="center">
 <img alt="Static Badge" src="https://img.shields.io/badge/Release-V--1.0.0-black?logoColor=%23000000&logoSize=16px&label=Release&labelColor=%230a66c2&color=%23c6cdcc">
 <img src="https://img.shields.io/badge/NodeJs-V--20.0.1-black?logo=npm&logoColor=%23000000&logoSize=16px&label=NodeJS&labelColor=%2397ca00&color=%23c6cdcc" alt="shields" />
</p>

<p align="center" id="description">
The project is a front-end web application for managing an e-commerce shop. It is built using Vue.js and TypeScript, with a focus on modularity and maintainability. The application includes features such as product management, order processing, and user authentication.
The project is designed to be easily extensible and customizable, allowing for future enhancements and integrations with other systems. The use of TypeScript ensures type safety and improved developer experience, while Vue.js provides a responsive and dynamic user interface. The application is built with best practices in mind, including code organization, testing, and deployment strategies.
</p>

---

### 🗺️Index

- [Description and technologies](#desc)
- [Installation](#installation)
- [Wiki](#wiki)
    > - [Build](#build)
    > - [Unit test](#test)
    > - [Branch rules and structure](#branch)
    > - [Deploy](#deploy)
    > - [Docker](#docker)

<br/>

<br/> 
<h2 id="desc">💻 Built with</h2>

<p>Tecnologies and libraries used in this project:</p>

<div align="center">
<h4>Libraries:</h4> 
<table align="center" style="border-collapse: collapse; border: none;">
  <tr>
    <td style="padding: 10px; border: none;">
      Vue router <b>V_2.3.2 </b>
    </td>
    <td style="padding: 10px; border: none;">
      Vue carousel <b>V_0.14.0</b>
    </td>
   </tr>
</table>

<br/>

<h4>Tecnologies:</h4>

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
</div>

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

#### 0. Dynamically generate the sitemap (sitemap.xml) using the router for PROD and TEST environments. <br/> The script is already automated in the build process but can be executed separately

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

<br/>

<h2 id="branch">🌱 Branch rules</h2>
The deploy branches are divided by environment. When pushing to the deploy_prod/test branch, the pipeline is triggered. The branches should only be used for CI/CD releases with Github Action and Plesk.
[See🧨Deploy section](#deploy)

- **dev**: Development and testing branch
- **deploy_test**: Branch for release in the test environment
- **deploy_prod**: Branch for release in the production environment

<br/>

<h2 id="deploy">🧨 Deploy</h2>

The release is performed via pipeline on GitHub Actions.
[See🧨Deploy section](#deploy)

It executes the webhook to notify Plesk (deployment manager) of the new version of the deploy.
The test pipeline is simplified. It builds and updates the test branch.

#### **Pipeline**:

- TEST_deploy_pipeline_ci
- PROD_deploy_pipeline_ci

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

### **CI/CD release with Github actions**

- Change branch by choosing where to release `git checkout deploy_prod / checkout deploy_test` [_see branch section_](#branch)
- Perform a pull
- Perform a **merge** with the command `git merge dev`
- Perform a commit and push

<br/>

<h2 id="docker">
<img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg" /> 
</h2>

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
