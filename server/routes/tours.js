const express = require('express');
const router = express.Router();
const Tour = require('../models/Tour');
const Room = require('../models/Room');
const auth = require('../middleware/auth');
const multer = require('multer');
const { processAndUploadPanorama } = require('../services/storageService');

const upload = multer({ storage: multer.memoryStorage() });

// --- Tour Routes ---

// Get all tours
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a tour
router.post('/', auth, async (req, res) => {
  const tour = new Tour({
    name: req.body.name,
    description: req.body.description,
    createdBy: req.user.id
  });

  try {
    const newTour = await tour.save();
    res.status(201).json(newTour);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single tour with rooms
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    const rooms = await Room.find({ tour: req.params.id });
    res.json({ tour, rooms });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Room Routes ---

// Add a room to a tour
router.post('/:tourId/rooms', auth, async (req, res) => {
  const room = new Room({
    ...req.body,
    tour: req.params.tourId
  });

  try {
    const newRoom = await room.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a room
router.patch('/rooms/:id', auth, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Upload panorama for a room
router.post('/rooms/:id/panorama', auth, upload.single('panorama'), async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const resolutions = await processAndUploadPanorama(req.file);
    room.resolutions = resolutions;
    room.panoramaUrl = resolutions.high; // Default to high
    await room.save();

    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a room
router.delete('/rooms/:id', auth, async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
