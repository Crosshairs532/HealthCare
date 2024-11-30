import prisma from "../../utils/prisma";

const updateIntoDB = async (id: string, payload: any) => {
  const { specialties, ...DoctorData } = payload;
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const updateData = await tx.doctor.update({
      where: {
        id,
      },
      data: DoctorData,
    });

    for (const sId of specialties) {
      const createDoctorSpecialties = await tx.doctorSpecialties.create({
        data: {
          doctorId: updateData?.id,
          specialitiesid: sId,
        },
      });
    }

    return updateData;
  });

  return result;
};
export const doctorService = { updateIntoDB };
