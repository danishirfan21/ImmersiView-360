import React, { useState } from "react";
import { 
  Chip, 
  Paper, 
  Stack, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField 
} from "@mui/material";

const RoomNavigator = ({
  rooms,
  activeRoomId,
  onSelectRoom,
  onDeleteRoom,
  onUpdateRoomName,
  idField = "id",
}) => {
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [roomToRename, setRoomToRename] = useState(null);
  const [newName, setNewName] = useState("");

  if (!rooms.length) {
    return (
      <Paper sx={{ p: 2.5, borderRadius: 3 }}>
        <Typography color="text.secondary">No rooms yet. Add one above.</Typography>
      </Paper>
    );
  }

  const handleOpenRename = (room) => {
    setRoomToRename(room);
    setNewName(room.name);
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = () => {
    if (newName && newName.trim() && newName !== roomToRename.name) {
      onUpdateRoomName?.(roomToRename[idField], newName.trim());
    }
    setRenameDialogOpen(false);
  };

  return (
    <>
      <Paper sx={{ p: 2.5, borderRadius: 3 }}>
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {rooms.map((room) => {
            const id = room[idField];
            return (
              <Chip
                key={id}
                label={room.name}
                onClick={() => onSelectRoom?.(id)}
                onDelete={onDeleteRoom ? () => onDeleteRoom(id) : undefined}
                onDoubleClick={() => handleOpenRename(room)}
                color={id === activeRoomId ? "primary" : "default"}
                variant={id === activeRoomId ? "filled" : "outlined"}
                sx={{ cursor: "pointer" }}
              />
            );
          })}
        </Stack>
      </Paper>

      <Dialog open={renameDialogOpen} onClose={() => setRenameDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Rename Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
            fullWidth
            variant="outlined"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleRenameConfirm();
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setRenameDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRenameConfirm} variant="contained">Rename</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomNavigator;