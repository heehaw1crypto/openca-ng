const fetch = require("node-fetch");
const baseUrl = `http://localhost:8000`;

const socketIoClient = require("socket.io-client");

const FormData = require("form-data");

exports.postNoAuth = async (route, body, suppress = false) => {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
};

exports.putNoAuth = async (route, body, suppress = false) => {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
};

exports.getNoAuth = async (route, suppress = false) => {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
};

exports.get = async (route, token, suppress = false) => {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
};

exports.getWithHeaders = async (route, headers, suppress = false) => {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
};

exports.post = async (route, body, token, suppress = false) => {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
};

exports.put = async (route, body, token, suppress = false) => {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
};

exports.putWithHeaders = async (route, body, headers, suppress = false) => {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
};

exports.postWithHeaders = async (route, body, headers, suppress = false) => {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
};

exports.patch = async (route, body, token, suppress = false) => {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
};

exports.patchWithHeaders = async (route, body, headers, suppress = false) => {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
};

exports.deleteReq = async (route, token, suppress = false) => {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
};

exports.deleteWithHeaders = async (route, headers, suppress = false) => {
  const res = await fetch(`${baseUrl}${route}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
};

exports.uploadWithHeaders = async (
  route,
  { method, fileSizeInBytes, readStream },
  headers,
  suppress = false
) => {
  const formData = new FormData();
  formData.append("file", readStream);

  const res = await fetch(`${baseUrl}${route}`, {
    method,
    headers: {
      Accept: "application/json",
      //"Content-Type": "multipart/form-data",
      //"Content-length": fileSizeInBytes,
      ...headers,
    },
    body: formData,
    credentials: "include",
  });

  if (res.status == 204) {
    return res;
  }

  const resJson = await res.json();

  if (resJson.statusCode >= 400 && !suppress) {
    console.error(resJson);
  }

  return resJson;
};

exports.connectSocketIo = ({ query = {}, namespace = "" }) => {
  return new Promise((resolve, reject) => {
    const fullUrl = `${baseUrl}/${namespace}`;

    const client = socketIoClient(fullUrl, {
      query,
    });

    client.on("connect", (data) => {
      client.close();
      return resolve({ data, status: "connected" });
    });

    client.on("error", (err) => {
      client.close();
      return reject(err);
    });
  });
};

exports.waitOnSocketIoEvent = ({ query = {}, namespace = "", event }) => {
  return new Promise((resolve, reject) => {
    const fullUrl = `${baseUrl}/${namespace}`;

    const client = socketIoClient(fullUrl, {
      query,
    });

    client.on("connect", () => {});

    client.on(event, (data) => {
      client.close();
      return resolve(data);
    });

    client.on("error", (err) => {
      client.close();
      return reject(err);
    });
  });
};

exports.waitMs = ({ ms }) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
};
