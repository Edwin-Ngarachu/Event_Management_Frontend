import axios from "axios";

// Create a new event (POST)
export const createEvent = async (formData, accessToken) => {
  return axios.post(
    "https://event-management-kq5b.onrender.com/api/events/create/",
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
    "https://event-management-kq5b.onrender.com/api/events/mine/", // Adjust this endpoint to match your backend
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
    `https://event-management-kq5b.onrender.com/api/events/${id}/delete/`,
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
    `https://event-management-kq5b.onrender.com/api/events/${id}/edit/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};