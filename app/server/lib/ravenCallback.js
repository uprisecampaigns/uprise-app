module.exports = function (sendErr, eventId) {
  if (sendErr) {
    console.error('Failed to send captured exception to Sentry');
  } else {
    console.log('Captured exception and sent to Sentry successfully');
  }
}
