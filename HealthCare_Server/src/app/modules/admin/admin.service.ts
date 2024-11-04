import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getAllFromDB = (param: any) => {
  const res = prisma.admin.findMany({
    where: {
      OR: [
        {
          name: {
            contains: param,
            mode: "insensitive",
          },
          email: {
            contains: param,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  return res;
};

export const adminService = {
  getAllFromDB,
};
