import { AppConfigKey, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getConfig(key: AppConfigKey): Promise<string | undefined> {
  const config = await prisma.appConfig.findUnique({
    where: {
      key: key,
    },
  });

  return config?.value;
}