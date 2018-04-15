const path = require('path');

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const app = express();

// Connect to mongoose
mongoose.connect(
  'mongodb://localhost/event-manager-dev'
)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Set static resource folder
app.use(express.static(path.join(__dirname, '/public')));


// Load Event Model
require('./models/Event');
const Event = mongoose.model('events');

// Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome';
  res.render('index', {
    title: title
  });
});

// Event Index Page
app.get('/events', (req, res) => {
  Event.find({})
    .sort({
      startDateAndTime: 'desc'
    })
    .then(events => {
      res.render('events/index', {
        events: events
      });
    });
});

// Add Event Form
app.get('/events/add', (req, res) => {
  res.render('events/add');
});

// Edit Event Form
app.get('/events/edit/:id', (req, res) => {
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
app.post('/events', (req, res) => {
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
        res.redirect('/events');
      });
  }
});

// Edit Form Process
app.put('/events/:id', (req, res) => {
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
        res.redirect('/events');
      });
  });
});

// Delete Event
app.delete('/events/:id', (req, res) => {
  Event.remove({
    _id: req.params.id
  })
  .then(() => {
    res.redirect('/events');
  });
});

const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});