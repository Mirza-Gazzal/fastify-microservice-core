class ResponseFormatter {

    constructor(reply) {
     //   _sys.logger.log("formatter is Alive ---------------------------------------------------------------------")
        this.reply = reply;
        this.statusCode = 200;
        this.status = 'success';
        this.payload = null;
        this.message = null;
        this.meta = {
            pid: process.pid,
            requestId: reply.request?.id,
            duration: reply.elapsedTime
        };
    }

    unify(code, status, data = null, message = null, extraProps = {}) {
        const response = {
            code,
            status,
            ...(message ? {message} : {}),
            ...(data !== null ? {data} : {}),
            ...extraProps,
            meta: this.meta
        };
        _sys.logger.inReq(response.data)
        return this.reply.code(code).send(response);
    }

    created(data, message, extraProps) {
        return this.unify(201, 'created', data, message, extraProps);
    }

    fetched(data, message, extraProps) {
        return this.unify(200, 'fetched', data, message, extraProps);
    }

    updated(data, message, extraProps) {
        return this.unify(200, 'updated', data, message, extraProps);
    }

    deleted(data = null, message = null, extraProps = {}) {
        const code = data === null ? 204 : 200;
        return this.unify(code, 'deleted', data, message, extraProps);
    }

    success(data, message, extraProps) {
        return this.unify(200, 'success', data, message, extraProps);
    }

    clientError(message = 'Bad Request', extraProps = {}) {
        return this.unify(400, 'client error', null, message, extraProps);
    }

    unauthorized(message = 'Unauthorized', extraProps = {}) {
        return this.unify(401, 'unauthorized', null, message, extraProps);
    }

    forbidden(message = 'Forbidden', extraProps = {}) {
        return this.unify(403, 'forbidden', null, message, extraProps);
    }

    notFound(message = 'Resource not found', extraProps = {}) {
        return this.unify(404, 'not found', null, message, extraProps);
    }

    serverError(message = 'Internal Server Error', extraProps = {}) {
        return this.unify(500, 'server error', null, message, extraProps);
    }
}

module.exports = ResponseFormatter;