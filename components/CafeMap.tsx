"use client";

import { useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Cafe = {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
  image_urls: string[] | null;
  latitude: number;
  longitude: number;
};

type CafeMapProps = {
  cafes: Cafe[];
};

export default function CafeMap({ cafes }: CafeMapProps) {

  const router = useRouter();

  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);

  const handleAddFavorite = async (
    cafeId: string
  ) => {
    const { data: userData } =
      await supabase.auth.getUser();

    if (!userData.user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("favorites")
      .insert({
        user_id: userData.user.id,
        cafe_id: cafeId,
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("お気に入りに追加しました");
  };

  return (
    <div>
      <div className="mb-4 h-[400px] w-full overflow-hidden rounded-2xl">
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
                onClick={() => setSelectedCafe(cafe)}
              />
            ))}
          </Map>
        </APIProvider>
      </div>

      {selectedCafe && (
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-xl font-bold">{selectedCafe.name}</h2>

          {selectedCafe.address && (
            <p className="mt-1 text-sm text-gray-600">
              {selectedCafe.address}
            </p>
          )}

          {selectedCafe.description && (
            <p className="mt-3 text-sm">{selectedCafe.description}</p>
          )}

          {selectedCafe.image_urls && selectedCafe.image_urls.length > 0 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {selectedCafe.image_urls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${selectedCafe.name}の画像${index + 1}`}
                  className="h-32 w-32 flex-shrink-0 rounded-xl object-cover"
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() =>
              handleAddFavorite(selectedCafe.id)
            }
            className="
              mt-4
              rounded-full
              bg-black
              px-4
              py-2
              text-white
            "
          >
            お気に入りに追加
          </button>

          <button
            type="button"
            onClick={() => setSelectedCafe(null)}
            className="mt-4 text-sm text-gray-500"
          >
            閉じる
          </button>
        </div>
      )}
    </div>
  );
}