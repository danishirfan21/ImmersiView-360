import React from "react";
import { Chip, Paper, Stack, Typography } from "@mui/material";

const RoomNavigator = ({
  rooms,
  activeRoomId,
  onSelectRoom,
  onDeleteRoom,
  onUpdateRoomName,
  idField = "id",
}) => {
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
        {rooms.map((room) => {
          const id = room[idField];
          return (
            <Chip
              key={id}
              label={room.name}
              onClick={() => onSelectRoom?.(id)}
              onDelete={onDeleteRoom ? () => onDeleteRoom(id) : undefined}
              onDoubleClick={() => {
                const newName = window.prompt("Enter new room name:", room.name);
                if (newName && newName.trim() && newName !== room.name) {
                  onUpdateRoomName?.(id, newName.trim());
                }
              }}
              color={id === activeRoomId ? "primary" : "default"}
              variant={id === activeRoomId ? "filled" : "outlined"}
              sx={{ cursor: "pointer" }}
            />
          );
        })}
      </Stack>
    </Paper>
  );
};

export default RoomNavigator;