const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const EventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  startDateAndTime: {
    type: Date,
    required: true
  },
  endDateAndTime: {
    type: Date,
    required: true
  }
});

mongoose.model('events', EventSchema);