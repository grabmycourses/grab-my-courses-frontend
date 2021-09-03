const serverBaseUrl = "http://localhost:5000/TrackingService";

export const registerUrl = serverBaseUrl + "/auth/register";
export const loginUrl = serverBaseUrl + "/auth/login";
export const trackingsUrl = serverBaseUrl + "/track";
export const fetchSubjectsUrl = serverBaseUrl + "/subjects";
export const searchSearchResultsUrl = serverBaseUrl + "/search";
export const dropOptionsUrl = serverBaseUrl + "/swapping/options";
export const updateSharingPrferenceUrl = serverBaseUrl + "/swapping/options/sharing";
export const getFaqsUrl = serverBaseUrl + "/support/faqs";
export const sendFeedbackUrl = serverBaseUrl + "/support/feedback";
export const requestForgotPasswordUrl = serverBaseUrl + "/auth/forgot-password";
export const resetPasswordUrl = serverBaseUrl + "/auth/reset-password"; 

export const errorDialogMsg1="Okay, looks like something went wrong in the background 😰. Apologies for the inconvinience. Please drop a feedback if the error persists.";
export const errorDialogMsg2="Okay, looks like something went wrong in the background 😰. Apologies for the inconvinience. Make sure that you have a stable internet connection and retry after a few minutes. Try disabling your adblocker, if any. Please drop a feedback if the error persists.";