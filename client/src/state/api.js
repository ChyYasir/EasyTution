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
    updateTutor: builder.mutation({
      query: ({ id, updatedTutor }) => ({
        url: `tutor/update/${id}`,
        method: "PUT",
        body: updatedTutor,
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
    updateOffer: builder.mutation({
      query: ({ id, status, assignedTutor }) => ({
        url: `offer/update/${id}`,
        method: "PUT", // or 'PATCH' based on your API
        body: { status, assignedTutor },
      }),
    }),
    updateMatchedTutorContact: builder.mutation({
      query: ({ offerId, tutorId }) => ({
        url: `/offer/${offerId}/matchedTutors/${tutorId}/contact`,
        method: "PUT",
      }),
    }),
    addSubject: builder.mutation({
      query: (subject) => ({
        url: "system/subject/add",
        method: "POST",
        body: subject,
      }),
    }),
    getAllSubjects: builder.query({
      query: () => "system/subject/getAll",
    }),
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/system/subject/delete/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddTutorMutation,
  useUpdateTutorMutation,
  useGetAllTutorsQuery,
  useGetTutorQuery,
  useAddOfferMutation,
  useGetAvailableOfferQuery,
  useDeleteAvailableOfferMutation,
  useUpdateOfferMutation,
  useUpdateMatchedTutorContactMutation,
  useAddSubjectMutation,
  useGetAllSubjectsQuery,
  useDeleteSubjectMutation,
} = api;
