import React, { useMemo, useState } from "react";
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
} from "@mui/material";
import PanoramaViewer from "./PanoramaViewer";
import HotspotEditor from "./HotspotEditor";
import RoomNavigator from "./RoomNavigator";

const createId = () => `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

const TourManager = () => {
  const theme = useTheme();
  const [rooms, setRooms] = useState([]);
  const [activeRoomId, setActiveRoomId] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const roomMap = useMemo(
    () => rooms.reduce((acc, room) => ({ ...acc, [room.id]: room }), {}),
    [rooms]
  );

  const activeRoom = rooms.find((room) => room.id === activeRoomId) || null;

  const addRoom = () => {
    if (!newRoomName.trim()) return;

    const id = createId();
    const room = {
      id,
      name: newRoomName.trim(),
      panoramaUrl: "",
      hotspots: [],
      infoMarkers: [],
      initialView: { yaw: 0, pitch: 0, hfov: 110 },
    };

    setRooms((prev) => [...prev, room]);
    setActiveRoomId(id);
    setNewRoomName("");
  };

  const patchActiveRoom = (recipe) => {
    if (!activeRoom) return;
    setRooms((prev) => prev.map((room) => (room.id === activeRoom.id ? recipe(room) : room)));
  };

  const onUploadPanorama = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    patchActiveRoom((room) => ({ ...room, panoramaUrl: objectUrl }));
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

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, mx: "auto" }}>
      <Stack spacing={3}>
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.14)} 0%, ${alpha(
              theme.palette.common.white,
              0.9
            )} 100%)`,
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700}>
                ImmersiView 360 · Tour Admin
              </Typography>
              <Typography color="text.secondary">
                Upload panoramas, link rooms with hotspots, and craft a smooth property walkthrough.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <TextField
                size="small"
                label="Room name"
                value={newRoomName}
                onChange={(event) => setNewRoomName(event.target.value)}
              />
              <Button variant="contained" onClick={addRoom}>
                Create room
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <RoomNavigator rooms={rooms} activeRoomId={activeRoomId} onSelectRoom={setActiveRoomId} />

        {activeRoom ? (
          <Alert severity="info">Tip: use yaw/pitch values to place hotspots. Example: yaw 45, pitch -5.</Alert>
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
                <PanoramaViewer room={activeRoom} roomMap={roomMap} onNavigateRoom={navigateWithTransition} />
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Stack spacing={2}>
              <Paper sx={{ p: 2.5, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Panorama upload
                </Typography>
                <Button variant="outlined" component="label" fullWidth disabled={!activeRoom}>
                  Select 360 image
                  <input type="file" accept="image/*" hidden onChange={onUploadPanorama} />
                </Button>
                <Typography mt={1} variant="caption" color="text.secondary">
                  For production use, send files to Node/Express and store in AWS S3 with compression and progressive variants.
                </Typography>
              </Paper>

              <HotspotEditor room={activeRoom} rooms={rooms} onAddHotspot={addHotspot} onAddInfoMarker={addInfoMarker} />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};

export default TourManager;