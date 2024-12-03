export const loginFunc = async (data) => {
  try {
    const response = await fetch("http://localhost:5000/api/users/login", {
      // Updated to local backend URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const signupFunc = async (data) => {
  try {
    const response = await fetch("http://localhost:5000/api/users/signup", {
      // Updated to local backend URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const uploadFunc = async (formData, user) => {
  try {
    const response = await fetch("http://localhost:5000/api/users/upload", {
      // Updated to local backend URL
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};
