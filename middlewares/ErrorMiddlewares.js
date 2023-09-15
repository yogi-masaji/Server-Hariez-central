function ErrorMiddlewares(error, req, res, next) {
    let code = error.status || 500;
    let message = error.message || "Internal server error";

    if (error.name === "JsonWebTokenError") {
        code = 401;
        message = "invalid token";
    } else if (error.name === "InvalidToken") {
        code = 401;
        message = "invalid token";
    } else if (error.name === "SequelizeForeignKeyConstraintError") {
        code = 404;
        message = "Kode Perbaikan tidak ditemukan";
    } else if (
        error.name === "Unauthorized" ||
        error.name === "NoAuthorization"
    ) {
        code = 401;
        message = "unauthorized";
    } else if (error.name === "ErrNotFound") {
        code = 404;
        message = "data not found";
    } else if (error.name === "SequelizeUniqueConstraintError") {
        code = 400;
        message = error.errors.map((e) => e.message);
    } else if (error.name === "SequelizeValidationError") {
        code = 400;
        message = error.errors.map((e) => e.message);
    } else if (
        error.name === "EmailNotFound" ||
        error.name === "WrongPassword" ||
        error.name === "EmailOrPasswordEmpty"
    ) {
        code = 401;
        message = "wrong email/password";
    } else if (error.name === "SequelizeUniqueConstraintError") {
        code = 400;
        message = "bad request";
    } else if (error.name === "PageNotFound") {
        code = 404;
        message = "Oops... nothing here";
    }

    name: "SequelizeForeignKeyConstraintError";

    return res.status(code).json({ message });
}

module.exports = ErrorMiddlewares;
