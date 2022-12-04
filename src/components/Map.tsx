import type { Listing } from "@prisma/client";
import { useMemo, useState } from "react";
import ReactMap, { Marker, Popup } from "react-map-gl";
import type { Coords } from "../hooks/useCurrenLocation";

type Props = {
  coords: Coords;
  listings: Listing[];
};

export default function Map({ coords, listings }: Props) {
  const [popupInfo, setPopupInfo] = useState<Listing>();

  const pins = useMemo(
    () =>
      listings.map((listing, index) => (
        <Marker
          key={`marker-${listing}`}
          longitude={listing.longitude}
          latitude={listing.latitude}
          color="#ef4444"
          anchor="bottom"
          onClick={(e) => {
            // If we let the click event propagates to the map, it will immediately close the popup
            // with `closeOnClick: true`
            e.originalEvent.stopPropagation();
            setPopupInfo(listing);
          }}
          style={{ cursor: "pointer" }}
        />
      )),
    []
  );

  return (
    <ReactMap
      initialViewState={{
        longitude: coords.longitude,
        latitude: coords.latitude,
        zoom: 14,
      }}
      style={{ width: "auto", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      mapboxAccessToken="pk.eyJ1Ijoicm9kcmlnbHUiLCJhIjoiY2prNXozbGQ4MGtqeDNwcDA5bnFwcGVobSJ9.0EBzSPf4YCLArgTpqhYDog"
    >
      {pins}

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={Number(popupInfo.longitude)}
          latitude={Number(popupInfo.latitude)}
          onClose={() => setPopupInfo(undefined)}
        >
          <div>
            {popupInfo.name}, {popupInfo.address}
          </div>
        </Popup>
      )}
    </ReactMap>
  );
}