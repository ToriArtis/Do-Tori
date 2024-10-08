This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

1. 모듈 설치
   ```bash
   npm install
   npm install @mui/material @mui/styled-engine-sc styled-components
   ```

2. 프로젝트 시작
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


```
Client-Next
├─ .eslintrc.json
├─ .gitignore
├─ contexts
│  └─ ThemeContext.js
├─ jsconfig.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ pages
│  ├─ index.js
│  ├─ login.js
│  ├─ logout.js
│  ├─ posts.js
│  ├─ profile.js
│  ├─ setting.js
│  ├─ todo.js
│  ├─ _app.js
│  └─ _document.js
├─ postcss.config.mjs
├─ public
│  ├─ next.svg
│  └─ vercel.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ globals.css
│  │  ├─ layout.js
│  │  └─ page.js
│  ├─ auth
│  │  ├─ api
│  │  │  ├─ authApi.js
│  │  │  └─ authLoginApi.js
│  │  ├─ components
│  │  │  ├─ css
│  │  │  │  ├─ profile.css
│  │  │  │  ├─ setting.css
│  │  │  │  └─ users.css
│  │  │  └─ Input.js
│  │  ├─ hooks
│  │  │  └─ useForm.js
│  │  ├─ models
│  │  │  └─ auth.js
│  │  ├─ viewmodels
│  │  │  ├─ useLoginViewModel.js
│  │  │  └─ useProfileViewModel.js
│  │  └─ views
│  │     ├─ LoginView.js
│  │     ├─ proFileView.js
│  │     └─ settingView.js
│  ├─ components
│  │  ├─ Sidebar.js
│  │  └─ ThemeContext.js
│  ├─ config
│  │  └─ app-config.js
│  ├─ post
│  │  ├─ api
│  │  │  └─ postApi.js
│  │  ├─ components
│  │  │  ├─ popularPosts.js
│  │  │  ├─ postCreateBox.js
│  │  │  ├─ PostItem.js
│  │  │  └─ postList.js
│  │  ├─ models
│  │  │  └─ post.js
│  │  ├─ viewmodels
│  │  │  └─ postViewModel.js
│  │  └─ views
│  │     └─ postListView.js
│  └─ todo
│     ├─ components
│     │  ├─ AddTodo.js
│     │  ├─ Calendar.js
│     │  ├─ css
│     │  │  └─ Calendar.module.css
│     │  └─ todo.js
│     ├─ models
│     │  └─ todoModels.js
│     └─ viewmodels
│        └─ todoViewModels.js
└─ tailwind.config.js

```

```
Client-Next
├─ .eslintrc.json
├─ .gitignore
├─ contexts
│  └─ ThemeContext.js
├─ jsconfig.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ pages
│  ├─ bookmark.js
│  ├─ emailfind.js
│  ├─ index.js
│  ├─ login.js
│  ├─ logout.js
│  ├─ passwordfind.js
│  ├─ posts.js
│  ├─ profile.js
│  ├─ setting.js
│  ├─ signup.js
│  ├─ todo.js
│  ├─ toribox.js
│  ├─ _app.js
│  └─ _document.js
├─ postcss.config.mjs
├─ public
│  ├─ google.png
│  ├─ kakao.png
│  ├─ naver.png
│  ├─ next.svg
│  ├─ tori.png
│  └─ vercel.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ globals.css
│  │  ├─ layout.js
│  │  └─ page.js
│  ├─ auth
│  │  ├─ api
│  │  │  ├─ authApi.js
│  │  │  ├─ authLoginApi.js
│  │  │  └─ followApi.js
│  │  ├─ components
│  │  │  ├─ css
│  │  │  │  ├─ auth.css
│  │  │  │  ├─ emailfind.css
│  │  │  │  ├─ passwordfind.css
│  │  │  │  ├─ profile.css
│  │  │  │  ├─ setting.css
│  │  │  │  └─ signup.css
│  │  │  ├─ Input.js
│  │  │  └─ OAuthRedirectHandler.js
│  │  ├─ hooks
│  │  │  └─ useForm.js
│  │  ├─ models
│  │  │  └─ auth.js
│  │  ├─ viewmodels
│  │  │  ├─ useEmailFindViewModel.js
│  │  │  ├─ useInfoViewModel.js
│  │  │  ├─ useLoginViewModel.js
│  │  │  ├─ usePasswordFindViewModel.js
│  │  │  └─ useSignUpViewModel.js
│  │  └─ views
│  │     ├─ deleteView.js
│  │     ├─ emailFindView.js
│  │     ├─ LoginView.js
│  │     ├─ OauthLoadingPage.js
│  │     ├─ passwordFindView.js
│  │     ├─ proFileView.js
│  │     ├─ settingView.js
│  │     └─ signupView.js
│  ├─ components
│  │  ├─ Sidebar.js
│  │  └─ ThemeContext.js
│  ├─ config
│  │  └─ app-config.js
│  ├─ Config.js
│  ├─ post
│  │  ├─ api
│  │  │  └─ postApi.js
│  │  ├─ components
│  │  │  ├─ popularPosts.js
│  │  │  ├─ postCreateBox.js
│  │  │  ├─ postItem.js
│  │  │  └─ postList.js
│  │  ├─ hooks
│  │  │  └─ usePostItem.js
│  │  ├─ models
│  │  │  └─ post.js
│  │  ├─ viewmodels
│  │  │  └─ postViewModel.js
│  │  └─ views
│  │     ├─ bookmarkView.js
│  │     ├─ postListView.js
│  │     └─ toriboxView.js
│  └─ todo
│     ├─ components
│     │  ├─ AddTodo.js
│     │  ├─ Calendar.js
│     │  ├─ css
│     │  │  └─ Calendar.module.css
│     │  └─ todo.js
│     ├─ models
│     │  └─ todoModels.js
│     └─ viewmodels
│        └─ todoViewModels.js
└─ tailwind.config.js

```