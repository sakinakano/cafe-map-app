"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CafeMap from "@/components/CafeMap";

type Cafe = {
  id: string;
  user_id: string;
  name: string;
  address: string | null;
  description: string | null;
  image_urls: string[] | null;
  latitude: number;
  longitude: number;
};

type FilterType = "all" | "favorites" | "mine";


export default function Home() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [favoriteCafeIds, setFavoriteCafeIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchPageData = async () => {
      const { data: cafeData, error: cafeError } = await supabase
        .from("cafes")
        .select(
          "id, user_id, name, address, description, image_urls, latitude, longitude"
        )
        .order("created_at", { ascending: false });

      if (cafeError) {
        alert(cafeError.message);
        return;
      }

      setCafes(cafeData || []);

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        setCurrentUserId(null);
        setFavoriteCafeIds([]);
        return;
      }

      setCurrentUserId(userData.user.id);

      const { data: favoriteData, error: favoriteError } = await supabase
        .from("favorites")
        .select("cafe_id")
        .eq("user_id", userData.user.id);

      if (favoriteError) {
        alert(favoriteError.message);
        return;
      }

      const ids = favoriteData?.map((favorite) => favorite.cafe_id) || [];
      setFavoriteCafeIds(ids);
    };
    fetchPageData();
  }, []);

  const router = useRouter();

  const handleAuthNavigate = async (path: string) => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/login");
      return;
    }

    router.push(path);
  };

  const filteredCafes = cafes.filter((cafe) => {
    if (filter === "favorites") {
      return favoriteCafeIds.includes(cafe.id);
    }

    if (filter === "mine") {
      return cafe.user_id === currentUserId;
    }

    return true;
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-2 text-sm ${
            filter === "all"
              ? "bg-black text-white"
              : "bg-white text-gray-700"
          }`}
        >
          すべて
        </button>

        <button
          type="button"
          onClick={() => {
            if (!currentUserId) {
              router.push("/login");
              return;
            }

            setFilter("favorites");
          }}
          className={`rounded-full px-4 py-2 text-sm ${
            filter === "favorites"
              ? "bg-black text-white"
              : "bg-white text-gray-700"
          }`}
        >
          お気に入り
        </button>

        <button
          type="button"
          onClick={() => {
            if (!currentUserId) {
              router.push("/login");
              return;
            }

            setFilter("mine");
          }}
          className={`rounded-full px-4 py-2 text-sm ${
            filter === "mine"
              ? "bg-black text-white"
              : "bg-white text-gray-700"
          }`}
        >
          自分の投稿
        </button>
      </div>
      <CafeMap cafes={filteredCafes} />

    </div>
  );
}