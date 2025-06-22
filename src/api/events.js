import axios from "axios";

// Create a new event (POST)
export const createEvent = async (formData, accessToken) => {
  return axios.post(
    "http://127.0.0.1:8000/api/events/create/",
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// Get events created by the logged-in poster (GET)
export const getMyEvents = async (accessToken) => {
  return axios.get(
    "http://127.0.0.1:8000/api/events/mine/", // Adjust this endpoint to match your backend
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

// Delete an event
export const deleteEvent = async (id, accessToken) => {
  return axios.delete(
    `http://127.0.0.1:8000/api/events/${id}/delete/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

// Update an event
export const updateEvent = async (id, formData, accessToken) => {
  return axios.put(
    `http://127.0.0.1:8000/api/events/${id}/edit/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};