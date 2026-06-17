module.exports = {
  apps: [
    {
      name: "simisumaq",
      script: "dist/server/entry.mjs",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: 4324,
        SESSION_SECRET: "185b2cc8b5fc084151ebc8b7ddf1e89c210f6638a2b27de0d86634d20615c4ef4d5e8b72a9e7720b76315e2808d4a9d067b1ac37803812c1d4884702491fa0c9",
      },
    },
  ],
};
