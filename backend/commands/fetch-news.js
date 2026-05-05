module.exports = {
  name: "fetch_news",
  async execute() {
    const articles = [
      { title: "AI tools reshape productivity workflows", source: "Tech Daily" },
      { title: "Global markets mixed ahead of earnings week", source: "Finance Wire" },
    ];
    return {
      action: "fetch_news",
      data: { articles },
      message: "News fetched.",
    };
  },
};
