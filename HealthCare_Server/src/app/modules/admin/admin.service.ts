import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import pagination from "../helper/pagination";

const prisma = new PrismaClient();

const getAllFromDB = (param: any, paginationItem: any) => {
  //! optimizing search.
  const { searchTerm, ...filterData } = param;
  // const { limit, page, sortBy, sortOrder } =

  const { skip, page, limit, sortBy, sortOrder } = pagination(paginationItem);

  const andConditions: Prisma.AdminWhereInput[] = [];
  const searchOn = ["name", "email"];
  // [
  //   {
  //     name: {
  //       contains: param.searchTerm,
  //       mode: "insensitive",
  //     },
  //     email: {
  //       contains: param.searchTem,
  //       mode: "insensitive",
  //     },
  //   },
  // ],

  // console.log(
  //   searchOn.map((field: string) => {
  //     return {
  //       [field]: {
  //         contains: param.searchTem,
  //         mode: "insensitive",
  //       },
  //     };
  //   })
  // );
  if (param.searchTerm) {
    andConditions.push({
      OR: searchOn.map((field: string) => {
        return {
          [field]: {
            contains: param.searchTem,
            mode: "insensitive",
          },
        };
      }),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key: any) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }
  andConditions.push({
    isDeleted: false,
  });
  const whereCondition: Prisma.AdminWhereInput = { AND: andConditions };

  const res = prisma.admin.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  const total = prisma.admin.count({
    where: whereCondition,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: res,
  };
};

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const res = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  return res;
};

const updateAdminDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const res = await prisma.admin.update({
    where: {
      id,
    },
    data: data,
  });

  return res;
};

const DeleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
    },
  });
  const res = prisma.$transaction(async (tx) => {
    const adminDeletedData = await tx.admin.delete({
      where: {
        id,
      },
    });

    const userDeletedData = await tx.admin.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return adminDeletedData;
  });

  return res;
};
const SoftDeleteFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const res = prisma.$transaction(async (tx) => {
    const adminDeletedData = await tx.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    const userDeletedData = await tx.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedData;
  });

  return res;
};
export const adminService = {
  getAllFromDB,
  getByIdFromDB,
  updateAdminDB,
  DeleteFromDB,
  SoftDeleteFromDB,
};
