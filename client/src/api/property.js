export const getAllProperties = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/properties/", // Update to the backend URL
      {
        method: "GET",
      }
    );
    return response.json();
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const postProperty = async (property, user) => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/properties/create", // Update to the backend URL
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(property),
      }
    );
    return response.json();
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const updateProperty = async (id, data, user) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/properties/${id}`, // Update to the backend URL
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const uploadPropertyImage = async (id, formData, user) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/properties/uploadimage/${id}`, // Update to the backend URL
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
        body: formData,
      }
    );
    return response.json();
  } catch (error) {}
};

export const deleteProperty = async (id, user) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/properties/${id}`, // Update to the backend URL
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    return response.json();
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const likeProperty = async (id, user) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/properties/like/${id}`, // Update to the backend URL
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    return response.json();
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const dislikeProperty = async (id, user) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/properties/dislike/${id}`, // Update to the backend URL
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    return response.json();
  } catch (error) {
    console.log("Error: ", error);
  }
};

export const bookProperty = async (id, fromDate, toDate, user) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/properties/book/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          from: fromDate,
          to: toDate,
        }),
      }
    );
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to book the property.");
    }
    return response.json();
  } catch (error) {
    console.log("Error booking property: ", error);
    throw error;
  }
};