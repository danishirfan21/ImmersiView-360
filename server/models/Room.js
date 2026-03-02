const mongoose = require('mongoose');

const HotspotSchema = new mongoose.Schema({
  pitch: { type: Number, required: true },
  yaw: { type: Number, required: true },
  targetRoomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  label: { type: String }
});

const MarkerSchema = new mongoose.Schema({
  pitch: { type: Number, required: true },
  yaw: { type: Number, required: true },
  title: { type: String },
  description: { type: String }
});

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  panoramaUrl: { type: String },
  resolutions: {
    low: { type: String },
    medium: { type: String },
    high: { type: String }
  },
  hotspots: [HotspotSchema],
  infoMarkers: [MarkerSchema],
  initialView: {
    yaw: { type: Number, default: 0 },
    pitch: { type: Number, default: 0 },
    hfov: { type: Number, default: 110 }
  },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true }
});

module.exports = mongoose.model('Room', RoomSchema);
