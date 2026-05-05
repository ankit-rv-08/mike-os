function toISODate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

module.exports = { toISODate };
