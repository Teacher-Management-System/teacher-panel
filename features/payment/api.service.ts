import axios from 'axios';

// Using a fresh axios instance without the request interceptor that adds the token
// because this is a public route and should not trigger 401 redirects.
const publicApiClient = axios.create({
  baseURL: "/api/public",
  timeout: 10000,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export const paymentService = {
  getPaymentDetails: async (id: string) => {
    try {
      const response = await publicApiClient.get(`/payment/${id}`);
      const payload = response.data;
      return payload?.data || payload;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Failed to fetch payment details");
    }
  }
};
