import React from "react";
import { Chip, Paper, Stack, Typography } from "@mui/material";

const RoomNavigator = ({ rooms, activeRoomId, onSelectRoom, onDeleteRoom, onUpdateRoomName }) => {
  if (!rooms.length) {
    return (
      <Paper sx={{ p: 2.5, borderRadius: 3 }}>
        <Typography color="text.secondary">No rooms yet. Add one from the dashboard.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2.5, borderRadius: 3 }}>
      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
        {rooms.map((room) => (
          <Chip
            key={room.id}
            label={room.name}
            onClick={() => onSelectRoom?.(room.id)}
            onDelete={onDeleteRoom ? () => onDeleteRoom(room.id) : undefined}
            onDoubleClick={() => {
              const newName = window.prompt("Enter new room name:", room.name);
              if (newName && newName.trim() && newName !== room.name) {
                onUpdateRoomName?.(room.id, newName.trim());
              }
            }}
            color={room.id === activeRoomId ? "primary" : "default"}
            variant={room.id === activeRoomId ? "filled" : "outlined"}
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Stack>
    </Paper>
  );
};

export default RoomNavigator;