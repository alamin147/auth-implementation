import { Link, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useAppDispatch } from "../redux/hooks";
import { useRegisterUserMutation } from "../redux/features/auth/authApi";
import { setUser } from "../redux/features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useState } from "react";

interface SignupFormData {
  username: string;
  password: string;
  shopNames: { name: string }[];
}

export const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      username: "",
      password: "",
      shopNames: [{ name: "" }, { name: "" }, { name: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "shopNames",
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const onSubmit = async (data: SignupFormData) => {
    try {
      const filteredShopNames = data.shopNames
        .map((shop) => shop.name.trim())
        .filter((name) => name !== "");

      if (filteredShopNames.length < 3) {
        toast.error("Please provide at least 3 shop names");
        return;
      }

      const result = await registerUser({
        username: data.username,
        password: data.password,
        shopNames: filteredShopNames,
      }).unwrap();

      console.log(result);
      if (result.success) {
        const { token } = result.data;
        const decoded = jwtDecode(token);
        dispatch(setUser({ user: decoded, token }));
        toast.success("Account created successfully!");
        console.log("Decoded User:", decoded);
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      const errorMessage =
        error?.data?.message || "Sign up failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const addShopName = () => {
    append({ name: "" });
  };

  const removeShopName = (index: number) => {
    if (fields.length > 3) {
      remove(index);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              to="/signin"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                {...register("username", { required: "Username is required" })}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value: /^(?=.*[0-9])(?=.*[!@#$%^&*])/,
                      message:
                        "Password must contain at least 1 number and 1 special character",
                    },
                  })}
                  className="appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-.085-.3.085.3zM14.121 14.121L15.536 15.536M14.121 14.121l.085-.3-.085.3zM12 3c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-1.563 3.029"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters with 1 number and 1 special
                character
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Names (minimum 3 required)
              </label>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      {...register(`shopNames.${index}.name`, {
                        required:
                          index < 3 ? "This shop name is required" : false,
                        validate: (value) => {
                          if (index < 3 && (!value || value.trim() === "")) {
                            return "Shop name cannot be empty";
                          }
                          return true;
                        },
                      })}
                      className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder={`Shop name ${index + 1}${
                        index < 3 ? " *" : ""
                      }`}
                    />
                    {errors.shopNames?.[index]?.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shopNames[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  {fields.length > 3 && (
                    <button
                      type="button"
                      onClick={() => removeShopName(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addShopName}
                className="mt-2 text-sm text-primary-600 hover:text-primary-500"
              >
                + Add another shop name
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
