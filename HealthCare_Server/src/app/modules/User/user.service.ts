import { Prisma, PrismaClient, UserRole, UserStatus } from "@prisma/client";
import bcrypt, { hashSync } from "bcrypt";
import { fileUploader } from "../helper/fileUploader";
import pagination from "../helper/pagination";
import { userSearchableFields } from "./user.constants";
const prisma = new PrismaClient();

const createAdmin = async (req: any) => {
  const hashedPass = await hashSync(req.password, 12);
  const file = req.file;
  if (file) {
    const uploadToCloudinary = fileUploader.uploadImage(file);
    req.body.data.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const userData = {
    email: req.body.admin.email,
    password: hashedPass,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: userData,
    });

    const admin = await tx.admin.create({
      data: req.body.admin,
    });
  });

  return result;
};

const createDoctor = async (req: any) => {
  const hashedPass = await hashSync(req.password, 12);
  const file = req.file;
  if (file) {
    const uploadToCloudinary = fileUploader.uploadImage(file);
    req.body.data.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const userData = {
    email: req.body.doctor.email,
    password: hashedPass,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: userData,
    });

    const doctor = await tx.doctor.create({
      data: req.body.doctor,
    });
  });

  return result;
};

const getAllFromDB = (param: any, paginationItem: any) => {
  const { searchTerm, ...filterData } = param;
  const { skip, page, limit, sortBy, sortOrder } = pagination(paginationItem);
  const andConditions: Prisma.UserWhereInput[] = [];

  if (param.searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => {
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

  const whereCondition: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const res = prisma.user.findMany({
    where: whereCondition,
    skip: skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    select: {
      password: false,
    },
  });
  const total = prisma.user.count({
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

const changeProfileStatus = async (id: string, status: UserRole) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateStatus = await prisma.user.update({
    where: {
      id,
    },
    data: status,
  });

  return updateStatus;
};

const getMyProfile = async (user: any) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
    select: {
      id: true,
      email: true,
      needsPasswordChange: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;
  if (user.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findMany({
      where: {
        email: user.email,
      },
    });
  }
  if (user.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.findMany({
      where: {
        email: user.email,
      },
    });
  }
  // if (user.role === UserRole.PATIENT) {
  //   profileInfo = await prisma.patient.findMany({
  //     where: {
  //       email: user.email,
  //     },
  //   });
  // }
  // if (user.role === UserRole.SUPER_ADMIN) {
  // }

  return {
    ...userInfo,
  };
};

const updateMyProfile = async (user: any, payload) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      needsPasswordChange: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;
  if (user.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
  }
  if (user.role === UserRole.DOCTOR) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: user.email,
      },
      data: payload,
    });
  }
  // if (user.role === UserRole.PATIENT) {
  //   profileInfo = await prisma.patient.findMany({
  //     where: {
  //       email: user.email,
  //     },
  //   });
  // }
  // if (user.role === UserRole.SUPER_ADMIN) {
  // }

  return {
    ...userInfo,
  };
};

export const userService = {
  createAdmin,
  createDoctor,
  getAllFromDB,
  changeProfileStatus,
  getMyProfile,
  updateMyProfile,
};
