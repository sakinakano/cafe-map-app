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