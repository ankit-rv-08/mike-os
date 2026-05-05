function ok(data = {}, message = "success") {
  return { ok: true, message, ...data };
}

function fail(message = "error", data = {}) {
  return { ok: false, message, ...data };
}

module.exports = { ok, fail };
