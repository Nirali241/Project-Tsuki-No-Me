import { notification } from "antd";
import axios from "axios";
import { get } from "lodash";

let interceptor;
const createAxiosResponseInterceptor = () => {
  interceptor = axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Reject promise if usual error
      axios.interceptors.response.eject(interceptor);
      return Promise.reject(error);
    }
  );
};

export const makeHttpRequest = async ({
  path,
  body = {},
  method = "GET",
  header = {},
  timeout = 180000,
  isTimeoutEnabled = true,
}) => {
  axios.interceptors.response.eject(interceptor);

  const source = axios.CancelToken.source();
  createAxiosResponseInterceptor();
  try {
    if (isTimeoutEnabled) {
      setTimeout(() => {
        source.cancel("Cancelling after 100ms");
      }, timeout);
    }

    const headers = { "content-type": "application/json", "Accept": "*/*", ...header };

    const options = {
      url: `${path}`,
      method: method,
      headers,
      data: { ...body },
      cancelToken: source.token,
    };

    const response = await axios(options);
    let apiRes = {};
    if (response?.data) {
      apiRes = response.data;
    }
    return apiRes;
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(error);
    });
  } finally {
    axios.interceptors.response.eject(interceptor);
  }
};

export const notificationHandler = ({
  message = "",
  key = "",
  description = "",
  duration = 4.5,
  placement = "topRight",
}) => {
  notification.open({
    key,
    message,
    description,
    onClick: () => {
      notification.close(key);
    },
    duration,
    placement,
  });
};

export const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => ` ${letter.toUpperCase()}`);
export const firstLetterCapital = str => str.charAt(0).toUpperCase() + str.slice(1)

export const fetchMethod = (url) => axios.get(url)

const baseUrl = process.env.REACT_APP_API_BASE_URL

const getUrl = (location, params) => {
  try {
    const url = new URL(location)
    url.search = new URLSearchParams(params)
    return [null, url]
  } catch (err) {
    return [
      {
        description: err.message,
        title: "BAD_REQUEST",
        key: "URL",
        duration: 0,
      },
      null,
    ]
  }
}

export const ApiLocations = {
  GET_TRACE_DETAILS: () => {
    return [null, 'https://www.placeholder.com/todos']
  },
  GET_TRANSACTION_SEARCH: () => {
    return getUrl(`${baseUrl}/transactions/search`)
  },
  GET_API: () => {
    return getUrl(`${baseUrl}/500error`)
  },
}

const fetchWithTimeout = async (
  uri,
  options = {},
  timeout = 6000
) => {
  const controller = new AbortController()
  const config = { ...options, signal: controller.signal }

  setTimeout(() => {
    controller.abort()
  }, timeout)

  try {
    const response = await fetch(uri, config)
    return response
  } catch (err) {
    let error = err || {}

    if (error.name === "AbortError") {
      error = { code: "TIME_OUT", message: "RESPONSE_TIME_OUT" }
    }

    throw error
  }
}

const httpCall = (method) => async (url, token, body, timeout) => {
  const options = {
    method,
    headers: {
      "Accept": "*/*",
    },
    body: JSON.stringify(body),
  }

  try {
    const response = await fetchWithTimeout(url, options, timeout)
    return Promise.resolve(response)
  } catch (err) {
    return Promise.reject(err)
  }
}

export const POST = httpCall("POST")