"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewProfilePage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUserId(data.user.id);
    };

    getUser();
  }, [router]);

  const handleSubmit = async () => {
    if (!name) {
      alert("ユーザー名を入力してください");
      return;
    }

    const { error } = await supabase.from("users").insert({
      id: userId,
      name,
      avatar_url: avatarUrl || null,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
  };

  return (
    <main style={{ padding: 40 }}>
      <h1 className="text-3xl font-bold">プロフィール登録</h1>

      <div>
        <input
          type="text"
          placeholder="ユーザー名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-4
                py-3
                text-base
                focus:outline-none
                focus:ring-2
                focus:ring-black
          "
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="アイコン画像URL"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-4
                py-3
                text-base
                focus:outline-none
                focus:ring-2
                focus:ring-black
          "
        />
      </div>

      <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 rounded-full">登録する</button>
    </main>
  );
}