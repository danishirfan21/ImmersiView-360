const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('server/uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tours', require('./routes/tours'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/immersiview';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('ImmersiView API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
