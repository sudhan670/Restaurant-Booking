const express = require('express');
const cors = require('cors');
const app = express();
// new exrress
app.use(cors());
app.use(express.json());

// In-memory storage for bookings (replace with a database in production)
let bookings = [];

// Create a booking
app.post('/api/bookings', (req, res) => {
  const booking = {
    id: Date.now().toString(),
    ...req.body,
  };
  
  // Check for existing booking
  const existingBooking = bookings.find(
    b => b.date === booking.date && b.time === booking.time
  );
  
  if (existingBooking) {
    return res.status(400).json({ error: 'Time slot already booked' });
  }
  
  bookings.push(booking);
  res.status(201).json(booking);
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// Delete a booking
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const index = bookings.findIndex(b => b.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  
  bookings.splice(index, 1);
  res.status(204).send();
});

// Configure CORS for production
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  };
  
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
