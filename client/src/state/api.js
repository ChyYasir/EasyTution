import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const isProduction = true;
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: isProduction
      ? "https://easy-tution-backend.onrender.com"
      : "http://localhost:8080",
  }),
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
      query: ({ id, updatedFields }) => ({
        url: `tutor/update/${id}`,
        method: "PUT",
        body: updatedFields,
      }),
    }),
    updateTutorProfile: builder.mutation({
      query: ({ id, updatedFields }) => ({
        url: `tutor/update/profile/${id}`,
        method: "PUT",
        body: updatedFields,
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
    getOffer: builder.query({
      query: (id) => `offer/getOffer/${id}`,
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
        method: "PUT",
        body: { status, feeAmount },
      }),
    }),
    updateReviews: builder.mutation({
      query: ({ id, stars, feedback }) => ({
        url: `offer/updateReviews/${id}`,
        method: "PUT",
        body: { stars, feedback },
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
    getDemoClassSuccessRate: builder.query({
      query: (year) => `system/demoClassSuccessRate/${year}`,
    }),
    getAvailableYears: builder.query({
      query: () => `system/getAvailableYears`,
    }),
    getDailyDataByDateRange: builder.query({
      // query: ({ startDate, endDate }) => {
      //   console.log("Query parameters:", startDate, endDate);
      //   const params = new URLSearchParams();
      //   params.append("startDate", startDate);
      //   params.append("endDate", endDate);

      //   return {
      //     url: `system/dailyData?${params.toString()}`,
      //   };
      // },

      query: ({ startDate, endDate }) => ({
        url: `system/dailyData/${startDate}/${endDate}`,
        method: "GET",
        // params: { startDate, endDate },
      }),

      // query: ({ startDate, endDate }) =>
      //   `system/dailyData/${startDate}/${endDate}`,
    }),
    getAnalytics: builder.query({
      query: () => "system/analytics/get",
    }),
    updateTutorAvailability: builder.mutation({
      query: ({ tutorId, availability }) => ({
        url: `tutor/update/availability/${tutorId}`,
        method: "PUT",
        body: availability,
      }),
    }),

    getTutorAvailability: builder.query({
      query: (tutorId) => `tutor/${tutorId}/availability`,
    }),
  }),
});

export const {
  useAddTutorMutation,
  useUpdateTutorMutation,
  useUpdateTutorProfileMutation,
  useGetAllTutorsQuery,
  useGetTutorQuery,
  useAddOfferMutation,
  useGetOfferQuery,
  useDeleteAvailableOfferMutation,
  useUpdateOfferMutation,
  useUpdateConfirmedOfferMutation,
  useUpdateReviewsMutation,
  useUpdateMatchedTutorContactMutation,
  useAddSubjectMutation,
  useGetAllSubjectsQuery,
  useDeleteSubjectMutation,
  useAddLocationMutation,
  useGetAllLocationsQuery,
  useDeleteLocationMutation,
  useUpdateLocationMutation,
  useGetMonthlyDataQuery,
  useGetDemoClassSuccessRateQuery,
  useGetAvailableYearsQuery,
  useGetDailyDataByDateRangeQuery,
  useGetAnalyticsQuery,
  useGetTutorAvailabilityQuery,
  useUpdateTutorAvailabilityMutation,
} = api;
