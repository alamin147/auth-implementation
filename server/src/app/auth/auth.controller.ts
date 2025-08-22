import { NextFunction, Request, Response } from "express";
import sendResponse from "../global/response";
import { StatusCodes } from "http-status-codes";
import { authService } from "./auth.service";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;
    const result = await authService.signupUser(userData);
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;
    const result = await authService.signinUser(userData);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User signed in successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

export const authController = {
  signup,
  signin,
};
