module.exports = {
  apps: [
    {
      name: "simisumaq",
      script: "dist/server/entry.mjs",
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: 4324,
      },
    },
  ],
};
