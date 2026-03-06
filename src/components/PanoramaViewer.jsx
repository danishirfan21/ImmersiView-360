import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, IconButton, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import CameraIcon from "@mui/icons-material/Camera";
import { Pannellum } from "pannellum-react";

const createTooltipNode = (label, details, color) => {
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "6px";
  wrapper.style.padding = "8px 10px";
  wrapper.style.borderRadius = "10px";
  wrapper.style.background = "rgba(15, 23, 42, 0.9)";
  wrapper.style.color = "#fff";
  wrapper.style.boxShadow = "0 8px 16px rgba(0,0,0,0.24)";
  wrapper.style.border = `1px solid ${color}`;

  const dot = document.createElement("span");
  dot.style.width = "10px";
  dot.style.height = "10px";
  dot.style.borderRadius = "999px";
  dot.style.background = color;

  const text = document.createElement("div");
  text.style.display = "flex";
  text.style.flexDirection = "column";

  const title = document.createElement("strong");
  title.innerText = label;
  title.style.fontSize = "12px";

  text.appendChild(title);

  if (details) {
    const sub = document.createElement("span");
    sub.innerText = details;
    sub.style.fontSize = "11px";
    sub.style.opacity = "0.85";
    text.appendChild(sub);
  }

  wrapper.appendChild(dot);
  wrapper.appendChild(text);
  return wrapper;
};

const PanoramaViewer = ({
  room,
  roomMap,
  onNavigateRoom,
  onUpdateInitialView,
  isEditing = false,
  onPanoramaClick,
  autoRotate = 0,
  customHfov,
  isPublic = false,
  containerHeight
}) => {
  const rootRef = useRef(null);
  const pannellumRef = useRef(null);
  const viewerInstance = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [displaySrc, setDisplaySrc] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [transitionOpacity, setTransitionOpacity] = useState(1);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (!room?.panoramaUrl) {
      setDisplaySrc("");
      return;
    }

    setIsImageLoading(true);
    setTransitionOpacity(0);

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = room.panoramaUrl;

    image.onload = () => {
      setTimeout(() => {
        setDisplaySrc(room.panoramaUrl);
        setIsImageLoading(false);
        setTransitionOpacity(1);
      }, 300); // Give time for fade out
    };

    image.onerror = () => {
      setDisplaySrc(room.panoramaUrl);
      setIsImageLoading(false);
      setTransitionOpacity(1);
    };
  }, [room?._id, room?.panoramaUrl]);

  const handleSaveView = useCallback(() => {
    if (!pannellumRef.current) return;
    const viewer = pannellumRef.current.getViewer();
    if (viewer) {
      onUpdateInitialView?.(room.id, {
        pitch: viewer.getPitch(),
        yaw: viewer.getYaw(),
        hfov: viewer.getHfov(),
      });
    }
  }, [onUpdateInitialView, room?.id]);

  const toggleFullscreen = useCallback(async () => {
    if (!rootRef.current) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await rootRef.current.requestFullscreen();
  }, []);

  const handleHotspotClick = useCallback((targetRoomId, pitch, yaw) => {
    if (!targetRoomId) return;

    const viewer = pannellumRef.current?.getViewer();
    if (viewer) {
      // Cinematic transition: Zoom in first
      setIsZooming(true);
      viewer.lookAt(pitch, yaw, viewer.getHfov() * 0.7, 500);

      setTimeout(() => {
        setTransitionOpacity(0);
        setTimeout(() => {
          onNavigateRoom?.(targetRoomId);
          setIsZooming(false);
        }, 500);
      }, 500);
    } else {
      onNavigateRoom?.(targetRoomId);
    }
  }, [onNavigateRoom]);

  const panoramaHotspots = useMemo(() => {
    if (!room) return [];

    const navigationHotspots = (room.hotspots || []).map((hotspot) => ({
      id: hotspot.id,
      pitch: hotspot.pitch,
      yaw: hotspot.yaw,
      cssClass: "immersiview-hotspot",
      createTooltipFunc: (div) => {
        div.appendChild(
          createTooltipNode(
            hotspot.label || "Go to room",
            roomMap?.[hotspot.targetRoomId]?.name || "Unlinked room",
            "#60a5fa"
          )
        );
      },
      clickHandlerFunc: () => handleHotspotClick(hotspot.targetRoomId, hotspot.pitch, hotspot.yaw),
    }));

    const infoMarkers = (room.infoMarkers || []).map((marker) => ({
      id: marker.id,
      pitch: marker.pitch,
      yaw: marker.yaw,
      cssClass: "immersiview-marker",
      createTooltipFunc: (div) => {
        div.appendChild(createTooltipNode(marker.title || "Info", marker.description, "#34d399"));
      },
    }));

    return [...navigationHotspots, ...infoMarkers];
  }, [onNavigateRoom, room, roomMap]);

  if (!room) {
    return (
      <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
        <Typography variant="h6">Create your first room to start a tour.</Typography>
      </Box>
    );
  }

  const handlePannellumLoad = useCallback(() => {
    if (!pannellumRef.current) return;
    const viewer = pannellumRef.current.getViewer();
    if (viewer) {
      viewerInstance.current = viewer;
    }
  }, []);

  useEffect(() => {
    const viewer = viewerInstance.current || pannellumRef.current?.getViewer();
    if (!viewer) return;

    const handler = (e) => {
      if (isEditing) {
        const [pitch, yaw] = viewer.mouseEventToCoords(e);
        onPanoramaClick?.({ pitch, yaw });
      }
    };

    viewer.on('mousedown', handler);
    return () => {
      viewer.off('mousedown', handler);
    };
  }, [isEditing, onPanoramaClick, displaySrc]);

  const finalHeight = containerHeight || (isPublic ? "100vh" : "560px");

  return (
    <Box
      ref={rootRef}
      sx={{
        position: "relative",
        borderRadius: isPublic ? 0 : 3,
        overflow: "hidden",
        bgcolor: "grey.900",
        height: finalHeight
      }}
    >
      {!isPublic && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ position: "absolute", zIndex: 2, top: 12, left: 12, right: 12, pointerEvents: "none" }}
        >
          <Box sx={{ bgcolor: "rgba(17,24,39,0.6)", px: 1.5, py: 0.5, borderRadius: 2, pointerEvents: "auto" }}>
            <Typography variant="subtitle2" color="common.white">
              {room.name}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ pointerEvents: "auto" }}>
            <Tooltip title="Set current view as default">
              <IconButton onClick={handleSaveView} sx={{ color: "white", bgcolor: "rgba(17,24,39,0.6)" }}>
                <CameraIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      )}

      {isImageLoading && <LinearProgress sx={{ position: "absolute", zIndex: 3, top: 0, left: 0, right: 0 }} />}

      {displaySrc ? (
        <Box
          sx={{
            transition: "opacity 500ms ease-in-out",
            opacity: transitionOpacity,
            height: "100%",
            '& .pnlm-container': {
              height: `${finalHeight} !important`
            }
          }}
        >
          <Pannellum
            ref={pannellumRef}
            width="100%"
            height={finalHeight}
            image={displaySrc}
            crossOrigin="anonymous"
            onLoad={handlePannellumLoad}
            pitch={room.initialView?.pitch ?? 0}
            yaw={room.initialView?.yaw ?? 0}
            hfov={customHfov ?? (room.initialView?.hfov ?? 110)}
            autoLoad
            autoRotate={autoRotate}
            showControls={!isPublic}
            hotSpots={panoramaHotspots}
          />
        </Box>
      ) : (
        <Box sx={{ height: 560, display: "grid", placeItems: "center", color: "grey.200" }}>
          <Typography variant="body1">Upload a panorama image for this room.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default PanoramaViewer;