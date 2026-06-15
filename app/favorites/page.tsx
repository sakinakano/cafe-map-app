"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type FavoriteCafe = {
  id: string;
  cafes: {
    id: string;
    name: string;
    address: string | null;
    description: string | null;
    image_urls: string[] | null;
  };
};

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteCafe[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select(`
          id,
          cafes (
            id,
            name,
            address,
            description,
            image_urls
          )
        `)
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        alert(error.message);
        return;
      }

      setFavorites(data as unknown as FavoriteCafe[]);
    };

    fetchFavorites();
  }, [router]);

  return (
    <main className="min-h-screen bg-orange-50 px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">お気に入り一覧</h1>

      <div className="space-y-4">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="rounded-2xl bg-white p-4 shadow-sm"
          >
            {favorite.cafes.image_urls?.[0] && (
              <img
                src={favorite.cafes.image_urls[0]}
                alt={favorite.cafes.name}
                className="mb-3 h-40 w-full rounded-xl object-cover"
              />
            )}

            <h2 className="text-lg font-bold">
              {favorite.cafes.name}
            </h2>

            {favorite.cafes.address && (
              <p className="mt-1 text-sm text-gray-600">
                {favorite.cafes.address}
              </p>
            )}

            {favorite.cafes.description && (
              <p className="mt-2 text-sm">
                {favorite.cafes.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}