"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
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

      <p>ここにカフェの地図を表示します</p>

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