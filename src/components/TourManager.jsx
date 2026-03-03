import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
  alpha,
  useTheme,
  Divider,
} from "@mui/material";
import PanoramaViewer from "./PanoramaViewer";
import HotspotEditor from "./HotspotEditor";
import RoomNavigator from "./RoomNavigator";

const createId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const TourManager = () => {
  const theme = useTheme();
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState("");
  const [currentTour, setCurrentTour] = useState(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const loadInitialTour = async () => {
      try {
        const tours = await api.get("/tours");
        if (tours.length > 0) {
          const { tour, rooms: tourRooms } = await api.get(`/tours/${tours[0]._id}`);
          setCurrentTour(tour);
          setRooms(tourRooms);
          if (tourRooms.length > 0) setActiveRoomId(tourRooms[0]._id);
        } else {
          // Create a default tour if none exist
          const newTour = await api.post("/tours", { name: "My First Tour" });
          setCurrentTour(newTour);
        }
      } catch (err) {
        console.error("Failed to load tour", err);
      }
    };
    loadInitialTour();
  }, []);

  const roomMap = useMemo(
    () => rooms.reduce((acc, room) => ({ ...acc, [room._id]: room }), {}),
    [rooms]
  );

  const activeRoom = rooms.find((room) => room._id === activeRoomId) || null;

  const addRoom = async () => {
    if (!newRoomName.trim() || !currentTour) return;

    try {
      const newRoom = await api.post(`/tours/${currentTour._id}/rooms`, {
        name: newRoomName.trim(),
        hotspots: [],
        infoMarkers: [],
      });
      setRooms((prev) => [...prev, newRoom]);
      setActiveRoomId(newRoom._id);
      setNewRoomName("");
    } catch (err) {
      console.error("Failed to add room", err);
    }
  };

  const patchActiveRoom = async (recipe) => {
    if (!activeRoom) return;
    const updatedRoomData = recipe(activeRoom);
    try {
      const updatedRoom = await api.patch(`/tours/rooms/${activeRoom._id}`, updatedRoomData);
      setRooms((prev) => prev.map((room) => (room._id === activeRoom._id ? updatedRoom : room)));
    } catch (err) {
      console.error("Failed to update room", err);
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      await api.delete(`/tours/rooms/${roomId}`);
      setRooms((prev) => prev.filter((room) => room._id !== roomId));
      if (activeRoomId === roomId) {
        setActiveRoomId("");
      }
    } catch (err) {
      console.error("Failed to delete room", err);
    }
  };

  const onUploadPanorama = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !activeRoom) return;

    const formData = new FormData();
    formData.append("panorama", file);

    try {
      const updatedRoom = await api.post(`/tours/rooms/${activeRoom._id}/panorama`, formData, true);
      setRooms((prev) => prev.map((room) => (room._id === activeRoom._id ? updatedRoom : room)));
    } catch (err) {
      console.error("Failed to upload panorama", err);
    }
  };

  const navigateWithTransition = (targetRoomId) => {
    if (!targetRoomId || targetRoomId === activeRoomId) return;
    setIsTransitioning(true);
    window.setTimeout(() => {
      setActiveRoomId(targetRoomId);
      setIsTransitioning(false);
    }, 320);
  };

  const addHotspot = (hotspot) => {
    patchActiveRoom((room) => ({
      ...room,
      hotspots: [...room.hotspots, { ...hotspot, id: createId() }],
    }));
  };

  const addInfoMarker = (marker) => {
    patchActiveRoom((room) => ({
      ...room,
      infoMarkers: [...room.infoMarkers, { ...marker, id: createId() }],
    }));
  };

  const deleteHotspot = (hotspotId) => {
    patchActiveRoom((room) => ({
      ...room,
      hotspots: room.hotspots.filter((h) => h.id !== hotspotId),
    }));
  };

  const deleteInfoMarker = (markerId) => {
    patchActiveRoom((room) => ({
      ...room,
      infoMarkers: room.infoMarkers.filter((m) => m.id !== markerId),
    }));
  };

  const updateRoomName = async (roomId, newName) => {
    try {
      const updatedRoom = await api.patch(`/tours/rooms/${roomId}`, { name: newName });
      setRooms((prev) =>
        prev.map((room) => (room._id === roomId ? updatedRoom : room))
      );
    } catch (err) {
      console.error("Failed to update room name", err);
    }
  };

  const updateInitialView = async (roomId, view) => {
    try {
      const updatedRoom = await api.patch(`/tours/rooms/${roomId}`, { initialView: view });
      setRooms((prev) =>
        prev.map((room) => (room._id === roomId ? updatedRoom : room))
      );
    } catch (err) {
      console.error("Failed to update initial view", err);
    }
  };

  const exportTour = () => {
    const dataStr = JSON.stringify(rooms, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = "tour-config.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const importTour = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target.result);
        if (Array.isArray(content)) {
          setRooms(content);
          if (content.length > 0) setActiveRoomId(content[0].id);
        }
      } catch (err) {
        alert("Failed to parse tour file. Make sure it is a valid JSON array.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      <Stack spacing={4}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction={{ xs: "column", lg: "row" }} spacing={3} alignItems={{ xs: "stretch", lg: "center" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" gutterBottom>
                Tour Editor
              </Typography>
              <Typography color="text.secondary">
                {currentTour?.name || 'Loading tour...'}
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={exportTour}
                  sx={{ color: 'text.primary', borderColor: 'divider' }}
                >
                  Export JSON
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  component="label"
                  sx={{ color: 'text.primary', borderColor: 'divider' }}
                >
                  Import JSON
                  <input type="file" accept="application/json" hidden onChange={importTour} />
                </Button>
              </Stack>

              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />

              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  placeholder="New room name"
                  value={newRoomName}
                  onChange={(event) => setNewRoomName(event.target.value)}
                  sx={{ width: 200 }}
                />
                <Button variant="contained" onClick={addRoom} sx={{ whiteSpace: 'nowrap' }}>
                  Add Room
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Paper>

        <RoomNavigator
          rooms={rooms}
          activeRoomId={activeRoomId}
          onSelectRoom={setActiveRoomId}
          onDeleteRoom={deleteRoom}
          onUpdateRoomName={updateRoomName}
          idField="_id"
        />

        {activeRoom ? (
          <Alert
            severity="info"
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'info.light',
              bgcolor: alpha(theme.palette.info.main, 0.05),
              color: 'info.dark'
            }}
          >
            Tip: Use yaw and pitch values to place hotspots precisely. Example: yaw 45, pitch -5.
          </Alert>
        ) : null}

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Box sx={{ position: "relative" }}>
              <Box
                sx={{
                  transition: "opacity 320ms ease",
                  opacity: isTransitioning ? 0.15 : 1,
                }}
              >
                <PanoramaViewer
                  room={activeRoom}
                  roomMap={roomMap}
                  onNavigateRoom={navigateWithTransition}
                  onUpdateInitialView={updateInitialView}
                />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={2}>
              <Paper sx={{ p: 3, borderRadius: 4 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Panorama Image
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Upload a 2:1 equirectangular image for the current room.
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  disabled={!activeRoom}
                  sx={{
                    py: 1.5,
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2 }
                  }}
                >
                  {activeRoom?.panoramaUrl ? 'Replace Image' : 'Select 360 Image'}
                  <input type="file" accept="image/*" hidden onChange={onUploadPanorama} />
                </Button>
              </Paper>

              <HotspotEditor
                room={activeRoom}
                rooms={rooms}
                onAddHotspot={addHotspot}
                onAddInfoMarker={addInfoMarker}
                onDeleteHotspot={deleteHotspot}
                onDeleteInfoMarker={deleteInfoMarker}
              />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default TourManager;