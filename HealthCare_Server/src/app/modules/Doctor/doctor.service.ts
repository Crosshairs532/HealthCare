import { Doctor, Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../interfaces/pagination";
import prisma from "../../utils/prisma";
import pagination from "../helper/pagination";
import { IDoctorFilterRequest } from "./doctor.interface";
import { doctorSearchableFields } from "./doctor.constants";

const getAllFromDB = async (
  filters: IDoctorFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = pagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  // doctor > doctorSpecialties > specialties -> title

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialities: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { averageRating: "desc" },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });
  return result;
};

const updateIntoDB = async (id: string, payload: any) => {
  const { specialties, ...DoctorData } = payload;
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (tx) => {
    const updateData = await tx.doctor.update({
      where: {
        id,
      },
      data: DoctorData,
    });

    if (specialties && specialties.length > 0) {
      //delete specialties
      const deleteSpecialties = specialties.filter(
        (speciality: any) => speciality.isDeleted
      );
      for (const speciality of deleteSpecialties) {
        await tx.doctorSpecialties.deleteMany({
          where: {
            doctorId: updateData?.id,
            specialitiesid: speciality.specialtiesId,
          },
        });
      }

      // create specialties

      const createSpecialties = specialties.filter(
        (speciality: any) => speciality.isDeleted
      );

      for (const speciality of deleteSpecialties) {
        await tx.doctorSpecialties.create({
          data: {
            doctorId: updateData?.id,
            specialitiesid: speciality.specialtiesId,
          },
        });
      }
    }

    for (const sId of specialties) {
      await tx.doctorSpecialties.create({
        data: {
          doctorId: updateData?.id,
          specialitiesid: sId,
        },
      });
    }
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id: doctorData.id,
    },
    include: {
      doctorSpecialties: {
        include: {
          specialities: true,
        },
      },
    },
  });

  return result;
};
export const doctorService = { updateIntoDB, getAllFromDB, getByIdFromDB };
