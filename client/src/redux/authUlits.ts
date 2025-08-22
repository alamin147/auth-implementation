import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export type TUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  photo: string;
  bio: string;
  shopNames?: string[];
};

const isValidJwt = (token: string): boolean => {
  return token.split(".").length === 3;
};

export const getUserInfo = (): TUser | null => {
  const token = useSelector((state: any) => state.auth.token);

  // const token = getAuthToken();
  if (token && isValidJwt(token)) {
    try {
      return jwtDecode<TUser>(token);
    } catch {
      console.error("Invalid token format");
      return null;
    }
  }
  return null;
};
export const useUserVerification = (): TUser | null => {
  const [user, setUser] = useState<TUser | null>(null);

  useEffect(() => {
    // const token = getAuthToken();
    const token = useSelector((state: any) => state.auth.token);

    if (token) {
      const decodedUser = jwtDecode<TUser>(token);
      setUser(decodedUser);
    }
  }, []);

  return user;
};

// Sign out function
export const signOut = (): void => {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.removeItem("persist:auth");
  }
};
