import { useMapEvents } from "react-leaflet";

const ZoomController = ({ onZoomChange, onBoundsChange }) => {
  useMapEvents({
    zoomend: (e) => {
      const zoom = e.target.getZoom();
      onZoomChange(zoom);
      const bounds = e.target.getBounds();
      onBoundsChange(bounds);
    },
    moveend: (e) => {
      const bounds = e.target.getBounds();
      onBoundsChange(bounds);
    },
  });

  return null;
};

export default ZoomController;
