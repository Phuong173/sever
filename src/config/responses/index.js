class Responts {
  success200(data) {
    return {
      status: "success",
      code: 200,
      message: null,
      data: data,
    };
  }

  error400(message) {
    return {
        status: "error",
        code: 400,
        message,
        data: null,
      };
  }

  error401(message) {
    return {
      status: "error",
        code: 401,
        message,
        data: null,
    }
  }

  error404(message) {
    return {
      status: "error",
      code: 404,
      message,
      data: null,
    };
  }

  error500(err, message) {
    return {
      status: "error",
      code: 500,
      message: message == null ? err.message : message,
      data: null,
    };
  }
}

module.exports = new Responts();
