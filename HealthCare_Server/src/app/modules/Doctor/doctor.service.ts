import prisma from "../../utils/prisma";

const updateIntoDB = async (id: string, payload: any) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const updateData = await prisma.doctor.update({
    where: {
      id,
    },
    data: payload,
  });

  return updateData;
};
export const doctorService = { updateIntoDB };
