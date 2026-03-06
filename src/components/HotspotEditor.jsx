import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
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
  const [hotspotForm, setHotspotForm] = useState(initialHotspot);
  const [markerForm, setMarkerForm] = useState(initialMarker);

  React.useEffect(() => {
    if (lastClickedCoords) {
      setHotspotForm(prev => ({ ...prev, yaw: Math.round(lastClickedCoords.yaw), pitch: Math.round(lastClickedCoords.pitch) }));
      setMarkerForm(prev => ({ ...prev, yaw: Math.round(lastClickedCoords.yaw), pitch: Math.round(lastClickedCoords.pitch) }));
    }
  }, [lastClickedCoords]);

  const linkableRooms = useMemo(
    () => rooms.filter((candidateRoom) => candidateRoom.id !== room?.id),
    [room?.id, rooms]
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
        <Box>
          <Typography variant="h6">Navigation hotspot</Typography>
          <Typography variant="body2" color="text.secondary">
            Link this room to another room with smooth transitions.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Label"
              value={hotspotForm.label}
              onChange={(event) => setHotspotForm((prev) => ({ ...prev, label: event.target.value }))}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              type="number"
              label="Yaw"
              value={hotspotForm.yaw}
              onChange={(event) => setHotspotForm((prev) => ({ ...prev, yaw: Number(event.target.value) }))}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              fullWidth
              type="number"
              label="Pitch"
              value={hotspotForm.pitch}
              onChange={(event) => setHotspotForm((prev) => ({ ...prev, pitch: Number(event.target.value) }))}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="target-room">Target room</InputLabel>
              <Select
                labelId="target-room"
                label="Target room"
                value={hotspotForm.targetRoomId}
                onChange={(event) => setHotspotForm((prev) => ({ ...prev, targetRoomId: event.target.value }))}
              >
                {linkableRooms.map((candidate) => (
                  <MenuItem key={candidate.id} value={candidate.id}>
                    {candidate.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          onClick={() => {
            if (!hotspotForm.targetRoomId) return;
            onAddHotspot?.(hotspotForm);
            setHotspotForm(initialHotspot);
          }}
        >
          Add hotspot
        </Button>

        <Divider />

        <Box>
          <Typography variant="h6">Info marker</Typography>
          <Typography variant="body2" color="text.secondary">
            Show useful room details when users hover over markers.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={markerForm.title}
              onChange={(event) => setMarkerForm((prev) => ({ ...prev, title: event.target.value }))}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Description"
              value={markerForm.description}
              onChange={(event) => setMarkerForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Yaw"
              value={markerForm.yaw}
              onChange={(event) => setMarkerForm((prev) => ({ ...prev, yaw: Number(event.target.value) }))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Pitch"
              value={markerForm.pitch}
              onChange={(event) => setMarkerForm((prev) => ({ ...prev, pitch: Number(event.target.value) }))}
            />
          </Grid>
        </Grid>

        <Button
          variant="outlined"
          onClick={() => {
            onAddInfoMarker?.(markerForm);
            setMarkerForm(initialMarker);
          }}
        >
          Add info marker
        </Button>

        {(room.hotspots?.length > 0 || room.infoMarkers?.length > 0) && <Divider />}

        {room.hotspots?.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Existing Hotspots
            </Typography>
            <List size="small" disablePadding>
              {room.hotspots.map((h) => (
                <ListItem key={h.id} dense disableGutters>
                  <ListItemText
                    primary={h.label || "Go to room"}
                    secondary={`Yaw: ${h.yaw} / Pitch: ${h.pitch}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size="small" onClick={() => onDeleteHotspot?.(h.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {room.infoMarkers?.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Existing Markers
            </Typography>
            <List size="small" disablePadding>
              {room.infoMarkers.map((m) => (
                <ListItem key={m.id} dense disableGutters>
                  <ListItemText
                    primary={m.title || "Info"}
                    secondary={`Yaw: ${m.yaw} / Pitch: ${m.pitch}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" size="small" onClick={() => onDeleteInfoMarker?.(m.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default HotspotEditor;