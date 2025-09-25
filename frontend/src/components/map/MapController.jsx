import { useMap } from "react-leaflet";
import { useEffect } from "react";

const MapController = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 17, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [position]);

  return null;
};

export default MapController;
