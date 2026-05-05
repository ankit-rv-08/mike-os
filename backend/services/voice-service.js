async function processVoice({ transcript, parser }) {
  return parser(transcript);
}

module.exports = { processVoice };
