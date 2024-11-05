import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const getAllFromDB = (param: any) => {
  //! optimizing search.

  const andConditions: Prisma.AdminWhereInput[] = [];
  if (param.searchTerm) {
    andConditions.push({
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
    });
  }

  const whereCondition: Prisma.AdminWhereInput = { AND: andConditions };

  const res = prisma.admin.findMany({
    where: whereCondition,
  });
  return res;
};

export const adminService = {
  getAllFromDB,
};
