"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function EditMyPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("name, img_url")
        .eq("id", userData.user.id)
        .maybeSingle();

        console.log("LOGIN USER ID", userData.user.id);

        console.log("PROFILE DATA", data);
console.log("PROFILE ERROR", error);

      if (error) {
        alert(error.message);
        return;
      }

      if (!data) {
        alert("プロフィールが見つかりません");
        return;
      }

      setName(data.name);
      setAvatarUrl(data.img_url || "");
    };

    fetchProfile();
  }, [router]);

  const handleUpdate = async () => {
    if (!name) {
      alert("ユーザー名を入力してください");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push("/login");
      return;
    }

    let newImgUrl: string | null = avatarUrl || null;

    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);

      const res = await fetch("/api/upload/cafe", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error);
        return;
      }

      newImgUrl = result.imageUrl;
    }

    const { data, error } = await supabase
      .from("users")
      .update({
        name,
        img_url: newImgUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userData.user.id)
      .select();

    if (error) {
      alert(error.message);
      return;
    }

    if (!data || data.length === 0) {
      alert("更新対象のユーザーが見つかりませんでした");
      return;
    }

    alert("プロフィールを更新しました");
    router.push("/mypage");
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1000px] px-4 py-8">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">プロフィール編集</h1>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">ユーザー名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">アイコン画像</label>

          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              setAvatarFile(file);
              setAvatarUrl(URL.createObjectURL(file));
            }}
            className="hidden"
          />

          <label
            htmlFor="avatar-upload"
            className="inline-flex cursor-pointer rounded-full bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
          >
            アイコン画像を選択
          </label>
        </div>

        {avatarUrl && (
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium">プレビュー</p>
            <img
              src={avatarUrl}
              alt="アイコンプレビュー"
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
        )}

        <button
          type="button"
          onClick={handleUpdate}
          className="w-full rounded-full bg-black px-6 py-3 font-bold text-white hover:opacity-80"
        >
          更新する
        </button>
      </div>
    </main>
  );
}