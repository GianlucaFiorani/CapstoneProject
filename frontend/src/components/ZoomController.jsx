import { useMapEvents } from "react-leaflet";

const ZoomController = ({ onZoomChange }) => {
  useMapEvents({
    zoomend: (e) => {
      const zoom = e.target.getZoom();
      onZoomChange(zoom);
    },
  });

  return null;
};

export default ZoomController;
