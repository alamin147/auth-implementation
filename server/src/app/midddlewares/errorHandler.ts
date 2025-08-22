import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import AppError from "../global/error";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof PrismaClientValidationError) {
    const argMatch = err.message.match(/Unknown argument `([^`]+)`/);
    // console.log(argMatch[1]);
    const errorMessage = argMatch
      ? `${argMatch[1]} is not a valid input`
      : "Something went wrong!";
    res.status(StatusCodes.NOT_ACCEPTABLE).json({
      success: false,
      message: errorMessage,
      errorDetails: err,
    });
  } else if (err instanceof PrismaClientKnownRequestError) {
    // console.log(err)
    let errorMessage = "Database error occurred";
    let statusCode = StatusCodes.BAD_REQUEST;

    if (err.code === "P2002") {
      // Unique constraint violation
      const target = err?.meta?.target as string[] | undefined;
      if (target && target.length > 0) {
        const field = target[0];
        if (field === "name") {
          errorMessage =
            "Shop name already exists. Please choose a different name.";
        } else if (field === "username") {
          errorMessage =
            "Username already exists. Please choose a different username.";
        } else {
          errorMessage = `${field} already exists`;
        }
      } else {
        errorMessage = "This value already exists in the system";
      }
      statusCode = StatusCodes.CONFLICT;
    } else {
      const target = err?.meta?.target as string[] | undefined;
      errorMessage = target
        ? target.map((error: any) => `${error} is invalid`).join(". ")
        : "Database operation failed";
    }

    const issues: any = err?.meta?.target
      ? (err.meta.target as string[]).map((field: any) => ({
          field,
          message: errorMessage,
        }))
      : [];

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      errorDetails: {
        issues,
      },
    });
  } else if (err instanceof ZodError) {
    // Get all required fields that are missing
    const requiredFields = err.errors
      .filter(
        (error) =>
          (error.code === "invalid_type" && error.received === "undefined") ||
          error.message.toLowerCase().includes("required")
      )
      .map((error) => {
        const fieldPath = error.path;
        return fieldPath[fieldPath.length - 1];
      })
      .filter((field) => field);

    // Get unknown/unrecognized fields
    const unknownFields = err.errors
      .filter((error) => error.code === "unrecognized_keys")
      .flatMap((error) =>
        'keys' in error ? (error as any).keys || [] : []
      );

    // Get all error messages
    const allErrorMessages = err.errors.map((error) => error.message);

    // Create a more descriptive message
    let message = allErrorMessages.join(". ");

    // Handle different types of errors
    const messageParts = [];

    if (requiredFields.length > 0) {
      messageParts.push(`Required fields: ${requiredFields.join(", ")}`);
    }

    if (unknownFields.length > 0) {
      messageParts.push(`Unknown fields: ${unknownFields.join(", ")}`);
    }

    // Get other validation errors (not required or unknown fields)
    const otherErrors = err.errors
      .filter(
        (error) =>
          !(error.code === "invalid_type" && error.received === "undefined") &&
          !error.message.toLowerCase().includes("required") &&
          error.code !== "unrecognized_keys"
      )
      .map((error) => error.message);

    if (otherErrors.length > 0) {
      messageParts.push(otherErrors.join(". "));
    }

    message = messageParts.length > 0 ? messageParts.join(". ") : message;

    const issues = err.errors.map((error) => ({
      field:
        error.path[error.path.length - 1] ||
        error.path[0] ||
        (error.code === "unrecognized_keys" ? "unknown" : "field"),
      message: error.message,
    }));

    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: message || "Validation error",
      errorDetails: {
        issues: issues,
      },
    });
  } else if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message || "Error",
      errorDetails: {
        issues: err,
      },
    });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message || "Something went wrong!",
      errorDetails: err,
    });
  }
};

export default errorHandler;
