This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

推荐使用 bun 启动
如果还未下载 bun，请参考[https://bun.sh/docs/installation](https://bun.sh/docs/installation)

## Introduce
这是一个整合了`Nextjs15`、`Cesium` 的模板项目

需要注意的是，由于`turbopack`目前还未完全兼容`webpack`，因此在`cesium`项目中，
需要取消`turbopack`启动，这一点已在`package.json`中配置好了，并且该模板用的是`React 19`，
如果后期开发遇到版本冲突，可以考虑降版本至 18

## Environment Variable
在`.env`中添加`NEXT_PUBLIC_CESIUM_TOKEN`字段，并赋值你的Cesium Access Token，
`Token`获取详见[https://ion.cesium.com/tokens?page=1](https://ion.cesium.com/tokens?page=1)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
