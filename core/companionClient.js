const http = require("http");

function buildUrl(host, port, endpoint = "/") {
  const safeEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `http://${host}:${port}${safeEndpoint}`;
}

function httpGet(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 300,
          statusCode: res.statusCode,
          body: data,
        });
      });
    });

    req.on("error", (error) => {
      resolve({
        success: false,
        error: error.message,
      });
    });

    req.setTimeout(3000, () => {
      req.destroy();
      resolve({
        success: false,
        error: "Connection timeout",
      });
    });
  });
}

function httpPost(url) {
  return new Promise((resolve) => {
    const req = http.request(
      url,
      {
        method: "POST",
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            statusCode: res.statusCode,
            body: data,
          });
        });
      }
    );

    req.on("error", (error) => {
      resolve({
        success: false,
        error: error.message,
      });
    });

    req.setTimeout(3000, () => {
      req.destroy();
      resolve({
        success: false,
        error: "Connection timeout",
      });
    });

    req.end();
  });
}

async function testCompanionConnection(host, port) {
  const url = buildUrl(host, port, "/");
  return await httpGet(url);
}

async function triggerCompanionAction({ host, port, endpoint = "/" }) {
  const url = buildUrl(host, port, endpoint);
  return await httpPost(url);
}

module.exports = {
  buildUrl,
  testCompanionConnection,
  triggerCompanionAction,
};