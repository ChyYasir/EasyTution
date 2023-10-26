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
    getAllTutors: builder.query({
      query: ({ start, size, filters, sorting, globalFilter }) => ({
        url: "tutor/getAllTutors?",
        method: "GET",
        params: { start, size, filters, sorting, globalFilter },
      }),
    }),
    getTutor: builder.query({
      query: (id) => `tutor/getTutor/${id}`,
    }),
    addOffer: builder.mutation({
      query: (offer) => ({
        url: "offer/add",
        method: "POST",
        body: offer,
      }),
    }),
    getAvailableOffer: builder.query({
      query: (id) => `offer/getAvailableOffer/${id}`,
    }),
    deleteAvailableOffer: builder.mutation({
      query: (id) => ({
        url: `/offer/available/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddTutorMutation,
  useGetAllTutorsQuery,
  useGetTutorQuery,
  useAddOfferMutation,
  useGetAvailableOfferQuery,
  useDeleteAvailableOfferMutation,
} = api;
