import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config/config";

const passwordHash = async (password: string) => {
  const saltRounds = Number(config.saltrounds);
  const hashedPassword: string = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

const comparePasswords = async (
  plainTextPassword: string,
  hashedPassword: string
) => {
  const match: boolean = await bcrypt.compare(
    plainTextPassword,
    hashedPassword
  );
  return match;
};

const createToken = (
  data: Record<string, unknown>,
  expiresIn?: string
): string => {
  return jwt.sign(data, config.jwt_secrets as Secret, {
    algorithm: "HS256",
    expiresIn: expiresIn || config.jwt_expires_in,
  });
};

const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt_secrets as Secret) as JwtPayload;
};

export const utils = {
  passwordHash,
  comparePasswords,
  createToken,
  verifyToken,
};
