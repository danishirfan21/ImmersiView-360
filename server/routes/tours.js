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

// Update a tour
router.patch('/:id', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    update.updatedAt = Date.now();

    const tour = await Tour.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json(tour);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a tour (and its rooms)
router.delete('/:id', auth, async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    
    // Also delete all rooms associated with this tour
    await Room.deleteMany({ tour: req.params.id });
    
    res.json({ message: 'Tour and associated rooms deleted' });
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
    // Bug Fix 1: Whitelist allowed fields to prevent arbitrary document overwrites
    const { name, panoramaUrl, initialView, hotspots, infoMarkers } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (panoramaUrl !== undefined) update.panoramaUrl = panoramaUrl;
    if (initialView !== undefined) update.initialView = initialView;
    if (hotspots !== undefined) update.hotspots = hotspots;
    if (infoMarkers !== undefined) update.infoMarkers = infoMarkers;

    const room = await Room.findByIdAndUpdate(
      req.params.id, 
      { $set: update }, 
      { new: true, runValidators: true } // Bug Fix 1: Enable schema validation
    );
    
    if (!room) return res.status(404).json({ message: 'Room not found' });
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
