import prisma from "../../utils/prisma";

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
export const doctorService = { updateIntoDB };
