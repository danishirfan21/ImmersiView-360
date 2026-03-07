import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const initialHotspot = { label: "", yaw: 0, pitch: 0, targetRoomId: "" };
const initialMarker = { title: "", description: "", yaw: 0, pitch: 0 };

const HotspotEditor = ({
  room,
  rooms,
  onAddHotspot,
  onAddInfoMarker,
  onDeleteHotspot,
  onDeleteInfoMarker,
  lastClickedCoords
}) => {
  // Bug Fix 2: Track which section is "active" so panorama clicks only update the relevant form
  const [activeSection, setActiveSection] = useState("hotspot");
  const [hotspotForm, setHotspotForm] = useState(initialHotspot);
  const [markerForm, setMarkerForm] = useState(initialMarker);

  React.useEffect(() => {
    if (!lastClickedCoords) return;
    const coords = {
      yaw: Math.round(lastClickedCoords.yaw * 100) / 100,
      pitch: Math.round(lastClickedCoords.pitch * 100) / 100,
    };
    // Bug Fix 2: Only update the form for the currently active section
    if (activeSection === "hotspot") {
      setHotspotForm((prev) => ({ ...prev, ...coords }));
    } else {
      setMarkerForm((prev) => ({ ...prev, ...coords }));
    }
  }, [lastClickedCoords]); // eslint-disable-line react-hooks/exhaustive-deps

  const linkableRooms = useMemo(
    () => rooms.filter((candidateRoom) => candidateRoom._id !== room?._id),
    [room?._id, rooms]
  );

  if (!room) {
    return (
      <Paper sx={{ p: 2.5, borderRadius: 3 }}>
        <Typography color="text.secondary">Select or create a room to configure hotspots.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2.5, borderRadius: 3 }}>
      <Stack spacing={3}>
        {/* ── Navigation Hotspot ─────────────────────── */}
        <Box
          onClick={() => setActiveSection("hotspot")}
          sx={{ cursor: "default" }}
        >
          <Typography variant="h6">Navigation hotspot</Typography>
          <Typography variant="body2" color="text.secondary">
            {activeSection === "hotspot"
              ? "Panorama clicks will fill in yaw & pitch below."
              : "Click here to activate — then click the panorama to set coordinates."}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              label="Label"
              value={hotspotForm.label}
              onFocus={() => setActiveSection("hotspot")}
              onChange={(event) => setHotspotForm((prev) => ({ ...prev, label: event.target.value }))}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Yaw"
              value={hotspotForm.yaw}
              onFocus={() => setActiveSection("hotspot")}
              onChange={(event) => setHotspotForm((prev) => ({ ...prev, yaw: Number(event.target.value) }))}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Pitch"
              value={hotspotForm.pitch}
              onFocus={() => setActiveSection("hotspot")}
              onChange={(event) => setHotspotForm((prev) => ({ ...prev, pitch: Number(event.target.value) }))}
            />
          </Grid>
          <Grid item xs={12}>
            {/* Bug Fix 3: Show disabled placeholder when no linkable rooms exist */}
            <FormControl fullWidth size="small">
              <InputLabel id="target-room">Target room</InputLabel>
              <Select
                labelId="target-room"
                label="Target room"
                value={hotspotForm.targetRoomId}
                onFocus={() => setActiveSection("hotspot")}
                onChange={(event) => setHotspotForm((prev) => ({ ...prev, targetRoomId: event.target.value }))}
              >
                {linkableRooms.length === 0 ? (
                  <MenuItem disabled value="">
                    <em>No other rooms — add more rooms first</em>
                  </MenuItem>
                ) : (
                  linkableRooms.map((candidate) => (
                    <MenuItem key={candidate._id} value={candidate._id}>
                      {candidate.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {linkableRooms.length === 0 && (
                <FormHelperText>You need at least 2 rooms to create a navigation hotspot.</FormHelperText>
              )}
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          disabled={!hotspotForm.targetRoomId || !hotspotForm.label}
          onClick={() => {
            onAddHotspot?.(hotspotForm);
            setHotspotForm(initialHotspot);
          }}
        >
          Add hotspot
        </Button>

        {room.hotspots?.length > 0 && (
          <>
            <Divider />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Existing Hotspots
              </Typography>
              <List size="small" disablePadding>
                {room.hotspots.map((h) => (
                  // Bug Fix 1: Use h._id || h.id to handle both Mongoose subdoc IDs and locally-created IDs
                  <ListItem key={h._id || h.id} dense disableGutters>
                    <ListItemText
                      primary={h.label || "Go to room"}
                      secondary={`Yaw: ${h.yaw} / Pitch: ${h.pitch}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small" onClick={() => onDeleteHotspot?.(h._id || h.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          </>
        )}

        <Divider />

        {/* ── Info Marker ────────────────────────────── */}
        <Box
          onClick={() => setActiveSection("marker")}
          sx={{ cursor: "default" }}
        >
          <Typography variant="h6">Info marker</Typography>
          <Typography variant="body2" color="text.secondary">
            {activeSection === "marker"
              ? "Panorama clicks will fill in yaw & pitch below."
              : "Click here to activate — then click the panorama to set coordinates."}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Title"
              value={markerForm.title}
              onFocus={() => setActiveSection("marker")}
              onChange={(event) => setMarkerForm((prev) => ({ ...prev, title: event.target.value }))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              multiline
              minRows={2}
              label="Description"
              value={markerForm.description}
              onFocus={() => setActiveSection("marker")}
              onChange={(event) => setMarkerForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Yaw"
              value={markerForm.yaw}
              onFocus={() => setActiveSection("marker")}
              onChange={(event) => setMarkerForm((prev) => ({ ...prev, yaw: Number(event.target.value) }))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Pitch"
              value={markerForm.pitch}
              onFocus={() => setActiveSection("marker")}
              onChange={(event) => setMarkerForm((prev) => ({ ...prev, pitch: Number(event.target.value) }))}
            />
          </Grid>
        </Grid>

        <Button
          variant="outlined"
          disabled={!markerForm.title}
          onClick={() => {
            onAddInfoMarker?.(markerForm);
            setMarkerForm(initialMarker);
          }}
        >
          Add info marker
        </Button>

        {room.infoMarkers?.length > 0 && (
          <>
            <Divider />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Existing Markers
              </Typography>
              <List size="small" disablePadding>
                {room.infoMarkers.map((m) => (
                  // Bug Fix 1: Use m._id || m.id to handle both Mongoose subdoc IDs and locally-created IDs
                  <ListItem key={m._id || m.id} dense disableGutters>
                    <ListItemText
                      primary={m.title || "Info"}
                      secondary={`Yaw: ${m.yaw} / Pitch: ${m.pitch}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" size="small" onClick={() => onDeleteInfoMarker?.(m._id || m.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default HotspotEditor;