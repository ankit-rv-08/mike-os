const { openUrl } = require("../services/system-action-service");

module.exports = {
  name: "open_app",
  validate(params) {
    const errors = [];
    if (!params.url) errors.push("url is required");
    return { valid: errors.length === 0, errors };
  },
  async execute({ params }) {
    const result = await openUrl(params.url);
    return {
      action: "open_app",
      data: result,
      message: "Opened target.",
    };
  },
};
