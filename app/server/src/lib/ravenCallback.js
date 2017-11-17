module.exports = (sendErr, eventId) => {
  if (sendErr) {
    console.error('Failed to send captured exception to Sentry');
  } else {
    console.info('Captured exception and sent to Sentry successfully');
  }
};
