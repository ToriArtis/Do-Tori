This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

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
├─ jsconfig.json
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ pages
│  └─ login.js
├─ postcss.config.mjs
├─ public
│  ├─ next.svg
│  └─ vercel.svg
├─ README.md
├─ src
│  ├─ app
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.js
│  │  └─ page.js
│  ├─ auth
│  │  ├─ api
│  │  │  ├─ authApi.js
│  │  │  └─ authLoginApi.js
│  │  ├─ components
│  │  │  ├─ css
│  │  │  │  └─ users.css
│  │  │  └─ Input.js
│  │  ├─ hooks
│  │  │  └─ useForm.js
│  │  ├─ models
│  │  │  └─ a
│  │  ├─ viewmodels
│  │  │  └─ useLoginViewModel.js
│  │  └─ views
│  │     └─ LoginView.js
│  ├─ common
│  │  ├─ components
│  │  │  └─ a
│  │  └─ hooks
│  │     └─ a
│  ├─ config
│  │  └─ app-config.js
│  ├─ post
│  │  ├─ api
│  │  │  └─ a
│  │  ├─ components
│  │  │  └─ a
│  │  ├─ hooks
│  │  │  └─ a
│  │  ├─ models
│  │  │  └─ a
│  │  ├─ viewmodels
│  │  │  └─ a
│  │  └─ views
│  │     └─ a
│  └─ todo
│     ├─ api
│     │  └─ a
│     ├─ components
│     │  └─ a
│     ├─ hooks
│     │  └─ a
│     ├─ models
│     │  └─ a
│     ├─ viewmodels
│     │  └─ a
│     └─ views
│        └─ a
└─ tailwind.config.js

```
```
Client-Next
├─ .eslintrc.json
├─ .gitignore
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
│  └─ todo.js
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
│  ├─ common
│  │  ├─ components
│  │  │  └─ a
│  │  └─ hooks
│  │     └─ a
│  ├─ config
│  │  └─ app-config.js
│  ├─ post
│  │  ├─ api
│  │  │  └─ postApi.js
│  │  ├─ components
│  │  │  ├─ popularPosts.js
│  │  │  ├─ postCreateBox.js
│  │  │  ├─ postItem.js
│  │  │  └─ postList.js
│  │  ├─ hooks
│  │  ├─ models
│  │  │  └─ post.js
│  │  ├─ viewmodels
│  │  │  └─ postViewModel.js
│  │  └─ views
│  │     └─ postListView.js
│  └─ todo
│     ├─ components
│     │  ├─ AddTodo.js
│     │  └─ todo.js
│     ├─ models
│     │  └─ todoModels.js
│     └─ viewmodels
│        └─ todoViewModels.js
└─ tailwind.config.js

```