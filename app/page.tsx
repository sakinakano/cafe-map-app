"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CafeMap from "@/components/CafeMap";

type Cafe = {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
  image_urls: string[] | null;
  latitude: number;
  longitude: number;
};


export default function Home() {
  const [cafes, setCafes] = useState<Cafe[]>([]);

  useEffect(() => {
    const fetchCafes = async () => {
      const { data, error } = await supabase
        .from("cafes")
        .select("id, name, address, description, image_urls, latitude, longitude")
        .order("created_at", { ascending: false });

      if (error) {
        alert(error.message);
        return;
      }

      setCafes(data);
    };

    fetchCafes();
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

  const handleLogout = async () => {
    await supabase.auth.signOut();

    alert("ログアウトしました");

    router.push("/");
  };

  return (
    <main style={{ padding: 40 }}>
      <h1 className="text-3xl font-bold">カフェマップ</h1>

      <div className="space-y-4">
        {cafes.map((cafe) => (
          <div
            key={cafe.id}
            className="rounded-2xl bg-white p-4 shadow-sm"
          >
            {cafe.image_urls?.[0] && (
              <img
                src={cafe.image_urls[0]}
                alt={cafe.name}
                className="mb-3 h-40 w-full rounded-xl object-cover"
              />
            )}

            <h2 className="text-lg font-bold">{cafe.name}</h2>

            {cafe.address && (
              <p className="mt-1 text-sm text-gray-600">
                {cafe.address}
              </p>
            )}

            {cafe.description && (
              <p className="mt-2 text-sm">
                {cafe.description}
              </p>
            )}
          </div>
        ))}
      </div>

      <p>ここにカフェの地図を表示します</p>

      <CafeMap cafes={cafes} />

      <button onClick={() => handleAuthNavigate("/favorites")} className="bg-black text-white px-4 py-2 rounded-full">
        お気に入り一覧
      </button>

      <button onClick={() => handleAuthNavigate("/cafes/new")} className="bg-black text-white px-4 py-2 rounded-full">
        カフェを投稿する
      </button>

      <button onClick={() => handleAuthNavigate("/mypage")} className="bg-black text-white px-4 py-2 rounded-full">
        マイページ
      </button>

      <button onClick={handleLogout} className="bg-black text-white px-4 py-2 rounded-full">
        ログアウト
      </button>
    </main>
  );
}