import { Server } from "./presentation/server";
import { LogModel, MongoDatabase } from "./data/mongo/index";
import { envs } from "./config/plugins/envs.plugin";
import { PrismaClient } from "@prisma/client";
(() => {
  main();
})();

async function main() {
  await MongoDatabase.connect({
    mongoUrl: envs.MONGO_URL,
    dbName: envs.MONGO_DB_NAME,
  });

  // const prisma = new PrismaClient();
  // const newLog = await prisma.logModel.create({
  //   data: {
  //     level: "HIGH",
  //     message: "Test Prisma Log",
  //     origin: "App.ts",
  //   },
  // });

  Server.start();
}
