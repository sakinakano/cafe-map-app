"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

type Cafe = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type CafeMapProps = {
  cafes: Cafe[];
};

export default function CafeMap({ cafes }: CafeMapProps) {
  return (
    <div className="mb-6 h-[400px] w-full overflow-hidden rounded-2xl">
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <Map
          defaultCenter={{ lat: 35.681236, lng: 139.767125 }}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {cafes.map((cafe) => (
            <Marker
              key={cafe.id}
              position={{
                lat: Number(cafe.latitude),
                lng: Number(cafe.longitude),
              }}
              title={cafe.name}
            />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}