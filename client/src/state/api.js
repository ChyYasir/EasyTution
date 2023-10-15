import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  reducerPath: "adminApi",

  endpoints: (builder) => ({
    addTutor: builder.mutation({
      query: (tutor) => ({
        url: "tutor/add",
        method: "POST",
        body: tutor,
      }),
    }),
    getTutors: builder.query({
      query: ({ start, size, filters, sorting, globalFilter }) => ({
        url: "tutor/getAllTutors?",
        method: "GET",
        params: { start, size, filters, sorting, globalFilter },
      }),
    }),
  }),
});

export const { useAddTutorMutation, useGetTutorsQuery } = api;
