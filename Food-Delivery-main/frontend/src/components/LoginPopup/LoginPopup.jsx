const onLogin = async (event) => {
  event.preventDefault();
  try {
    let newUrl = url;
    if (currentState === "Login") {
      newUrl += "/api/user/login";   // <-- FIXED
    } else {
      newUrl += "/api/user/register"; // <-- FIXED
    }

    const response = await axios.post(newUrl, data, {
      headers: { "Content-Type": "application/json" },
    });

    // ...rest of your code
  } catch (error) {
    // ...rest of your code
  }
};