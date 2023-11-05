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
      query: ({ id, updatedFields, offerDetails }) => ({
        url: `tutor/update/${id}`,
        method: "PUT",
        body: { updatedFields, offerDetails },
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
      query: ({
        id,
        status,
        assignedTutor,
        feeTaken,
        feePercentage,
        offerLocation,
      }) => ({
        url: `offer/update/${id}`,
        method: "PUT", // or 'PATCH' based on your API
        body: { status, assignedTutor, feeTaken, feePercentage, offerLocation },
      }),
    }),
    updateConfirmedOffer: builder.mutation({
      query: ({ id, status, feeAmount }) => ({
        url: `offer/confirm/update/${id}`,
        method: "PUT", // or 'PATCH' based on your API
        body: { status, feeAmount },
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
    addLocation: builder.mutation({
      query: (subject) => ({
        url: "system/location/add",
        method: "POST",
        body: subject,
      }),
    }),
    getAllLocations: builder.query({
      query: () => "system/location/getAll",
    }),
    deleteLocation: builder.mutation({
      query: (id) => ({
        url: `/system/location/delete/${id}`,
        method: "DELETE",
      }),
    }),
    updateLocation: builder.mutation({
      query: ({ id, updatedFields }) => ({
        url: `system/location/update/${id}`,
        method: "PUT",
        body: updatedFields,
      }),
    }),
    getMonthlyData: builder.query({
      query: (year) => `system/monthlyData/get/${year}`,
    }),
    getAnalytics: builder.query({
      query: () => "system/analytics/get",
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
  useUpdateConfirmedOfferMutation,
  useUpdateMatchedTutorContactMutation,
  useAddSubjectMutation,
  useGetAllSubjectsQuery,
  useDeleteSubjectMutation,
  useAddLocationMutation,
  useGetAllLocationsQuery,
  useDeleteLocationMutation,
  useUpdateLocationMutation,
  useGetMonthlyDataQuery,
  useGetAnalyticsQuery,
} = api;
