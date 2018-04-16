if(process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://test:test@ds047504.mlab.com:47504/event-manager-prod'
  }
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/event-manager-dev'
  }
}