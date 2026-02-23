import React from "react";
import { Chip, Paper, Stack, Typography } from "@mui/material";

const RoomNavigator = ({ rooms, activeRoomId, onSelectRoom }) => {
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
            color={room.id === activeRoomId ? "primary" : "default"}
            variant={room.id === activeRoomId ? "filled" : "outlined"}
          />
        ))}
      </Stack>
    </Paper>
  );
};

export default RoomNavigator;