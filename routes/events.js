const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Event Model
require('../models/Event');
const Event = mongoose.model('events');

// Event Index Page
router.get('/', (req, res) => {
  Event.find({})
    .sort({
      startDateAndTime: 'desc'
    })
    .then(events => {
      events.forEach(event => {
        let startHours = new Date(event.startDateAndTime).getHours();
        let startMinutes = new Date(event.startDateAndTime).getMinutes();
        let startSeconds = new Date(event.startDateAndTime).getSeconds();

        let endHours = new Date(event.endDateAndTime).getHours();
        let endMinutes = new Date(event.endDateAndTime).getMinutes();
        let endSeconds = new Date(event.endDateAndTime).getSeconds();

        const startDateObj = formatTime(startHours, startMinutes, startSeconds);
        const endDateObj = formatTime(endHours, endMinutes, endSeconds);
        
        event.formattedStartDate = `${new Date(event.startDateAndTime).toDateString()} 
        ${startDateObj.hours}:${startDateObj.minutes}:${startDateObj.seconds}`;
        event.formattedEndDate = `${new Date(event.endDateAndTime).toDateString()} 
        ${endDateObj.hours}:${endDateObj.minutes}:${endDateObj.seconds}`;
      });
      
      res.render('events/index', {
        events: events
      });
    });
});

// Add Event Form
router.get('/add', (req, res) => {
  res.render('events/add');
});

// Edit Event Form
router.get('/edit/:id', (req, res) => {
  Event.findOne({
    _id: req.params.id
  })
  .then(event => {
    res.render('events/edit', {
      event: event
    });
  });
});

// Process Form
router.post('/', (req, res) => {
  let errors = [];
  if(!req.body.name) {
    errors.push({text: 'Please add event name'});
  }
  if(!req.body.location) {
    errors.push({text: 'Please add event location'});
  }
  if(!req.body.startDate) {
    errors.push({text: 'Please add event start date'});
  }
  if(!req.body.endDate) {
    errors.push({text: 'Please add event end date'});
  }

  if(errors.length > 0) {
    res.render('events/add', {
      errors: errors,
      name: req.body.name,
      location: req.body.location,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    });
  } else {
    const newEvent = {
      name: req.body.name,
      location: req.body.location,
      startDateAndTime: req.body.startDate,
      endDateAndTime: req.body.endDate
    };
    new Event(newEvent)
      .save()
      .then(event => {
        req.flash('success_msg', 'Event Added');
        res.redirect('/events');
      });
  }
});

// Edit Form Process
router.put('/:id', (req, res) => {
  Event.findOne({
    _id: req.params.id
  })
  .then(event => {
    event.name = req.body.name;
    event.location = req.body.location;
    event.startDateAndTime = req.body.startDate;
    event.endDateAndTime = req.body.endDate;

    event
      .save()
      .then(event => {
        req.flash('success_msg', 'Event Updated');
        res.redirect('/events');
      });
  });
});

// Delete Event
router.delete('/:id', (req, res) => {
  Event.remove({
    _id: req.params.id
  })
  .then(() => {
    req.flash('success_msg', 'Event Removed');
    res.redirect('/events');
  });
});

const formatTime = (hours, minutes, seconds) => {
  return {
    hours: hours < 10? `0${hours}` : hours,
    minutes: minutes < 10? `0${minutes}` : minutes,
    seconds: seconds < 10? `0${seconds}` : seconds
  };
};

module.exports = router;