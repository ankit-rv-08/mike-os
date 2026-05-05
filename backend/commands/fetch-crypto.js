module.exports = {
  name: "fetch_crypto",
  async execute() {
    const prices = [
      { symbol: "BTC", price: 64000, change24h: 1.8 },
      { symbol: "ETH", price: 3200, change24h: -0.9 },
    ];
    return {
      action: "fetch_crypto",
      data: { prices },
      message: "Crypto fetched.",
    };
  },
};
