import { utils } from "../utils/utils";
import AppError from "../global/error";
import { StatusCodes } from "http-status-codes";
import { userService } from "../modules/user/user.service";
import { SigninData, SignupData } from "./auth.interface";
import prisma from "../config/prisma";

const signinUser = async (data: SigninData) => {
  const { username, password, rememberMe } = data;

  const user = await userService.getUserByUsername(username);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  if (!(await utils.comparePasswords(password, user.password))) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Incorrect password");
  }

  // Set token expiration based on rememberMe
  const expiresIn = rememberMe ? "7d" : "30m";

  const accessToken = utils.createToken(
    {
      id: user.id,
      username: user.username,
    },
    expiresIn
  );

  return {
    id: user.id,
    username: user.username,
    token: accessToken,
    shopNames: user.shopNames.map((shop: any) => shop.name),
  };
};

const signupUser = async (data: SignupData) => {
  const { username, password, shopNames } = data;

  // Check if username already exists
  const existedUser = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (existedUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Username already exists");
  }

  // Check if any shop names already exist globally
  const existingShopNames = await prisma.shopName.findMany({
    where: {
      name: {
        in: shopNames,
      },
    },
  });

  if (existingShopNames.length > 0) {
    const conflictingNames = existingShopNames.map((shop: any) => shop.name);
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Shop names already exist: ${conflictingNames.join(", ")}`
    );
  }

  const hashedPassword = await utils.passwordHash(password);

  const result = await prisma.$transaction(async (transaction: any) => {
    // Create user
    const createdUser = await transaction.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });

    // Create shop names
    const shopNamePromises = shopNames.map((shopName: string) =>
      transaction.shopName.create({
        data: {
          name: shopName,
          userId: createdUser.id,
        },
      })
    );

    await Promise.all(shopNamePromises);

    return {
      id: createdUser.id,
      username: createdUser.username,
      createdAt: createdUser.createdAt,
    };
  });

  // Generate token for the new user
  const accessToken = utils.createToken({
    id: result.id,
    username: result.username,
  });

  return {
    id: result.id,
    username: result.username,
    token: accessToken,
    createdAt: result.createdAt,
  };
};

export const authService = {
  signinUser,
  signupUser,
};
