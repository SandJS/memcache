module.exports = {
  defaultTTL: 1800,
  servers: '127.0.0.1:11211',
  options: {
    factor: 1,      // exponential backoff factor, increases wait between attempts (feature of jackpot library)
    retries: 1,     // try to reconnect this many times
    retry: 30000    // if a server was unavailable, attempt to use it again in this many milliseconds
  }
};