const fetch = require("node-fetch");
const baseUrl = process.env.TRACE_BASE_URL;

const fetchData = (endpoint, payload) => {
  const url = `${baseUrl}/${endpoint}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  };

  return fetch(url, options)
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = fetchData;
