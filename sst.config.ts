/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "flashmind",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {

    const web = new sst.aws.StaticSite("web", {
      path: "apps/flashmind-app/dist"
    });

    const api = new sst.aws.Function("api", {
      handler: "apps/api/handler.handler",
      url: true,
      environment: {
        DATABASE_URL: process.env.DATABASE_URL as string,
        GEMINI_API_KEY: process.env.GEMINI_API_KEY as string,
      }
    })

    return {
      api: api.url,
      web: web.url,
    }
  },
});
