import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

const VITE_SERVER_URI = import.meta.env.VITE_SERVER_URI;
const production = import.meta.env.VITE_PRODUCTION == "true" ? true : false;

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: production
      ? `${VITE_SERVER_URI}/api`
      : "http://localhost:5000/api",
    credentials: "include",

    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `${token}`);
      }

      if (!endpoint.includes("upload")) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  }),

  tagTypes: [],
  endpoints: () => ({}),
});
