module.exports = {
  apps: [
    {
      name: "simisumaq",
      script: "npx",
      args: "serve dist -s -p 4324",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
