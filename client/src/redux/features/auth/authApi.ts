import { baseApi } from '../../api/baseApi';

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    loginUser: builder.mutation({
      query: (data) => ({
        url: '/signin',
        method: 'POST',
        body: data,
      }),
    }),

    registerUser: builder.mutation({
      query: (data) => {
        return {
          url: "/signup",
          method: "POST",
          body: data,
        };
      },
    }),

    getUserShops: builder.query({
      query: (userId) => ({
        url: `/user/${userId}`,
        method: 'GET',
      }),
    }),

  }),
});

export const { useRegisterUserMutation, useLoginUserMutation, useGetUserShopsQuery } = authApi;
