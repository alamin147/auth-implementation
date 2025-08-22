import prisma from "../../config/prisma";

const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      shopNames: true,
    },
  });

  return user;
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      shopNames: true,
    },
  });

  return user;
};

export const userService = {
  getUserByUsername,
  getUserById,
};
