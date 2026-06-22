"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NewCafePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const handleSubmit = async () => {
    if (!name) {
      alert("カフェ名を入力してください");
      return;
    }

    if (!latitude || !longitude) {
      alert("緯度・経度を入力してください");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push("/login");
      return;
    }

    let imageUrl: string | null = null;

    const imageUrls: string[] = [];

    for (const imageFile of imageFiles) {
      const formData = new FormData();

      formData.append("file", imageFile);

      const res = await fetch("/api/upload/cafe", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error);
        return;
      }

      imageUrls.push(result.imageUrl);
    }

    const { error } = await supabase.from("cafes").insert({
      user_id: userData.user.id,
      name,
      address: address || null,
      latitude: Number(latitude),
      longitude: Number(longitude),
      description: description || null,
      image_urls: imageUrls,
      is_public: true,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("カフェを投稿しました");
    router.push("/");
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  return (
    <div>
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">カフェを投稿</h1>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">カフェ名</label>
          <input
            type="text"
            placeholder="例：表参道カフェ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">住所</label>
          <input
            type="text"
            placeholder="例：東京都港区..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-sm font-medium">緯度</label>
            <input
              type="text"
              placeholder="35.681236"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">経度</label>
            <input
              type="text"
              placeholder="139.767125"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">画像</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              setImageFiles((prev) => [
                ...prev,
                ...Array.from(files),
              ]);
            }}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3"
          />
          <div className="mt-3 space-y-2">
            {imageFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 rounded-lg bg-gray-100 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                  />

                  <span className="truncate text-sm">
                    {file.name}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="flex-shrink-0 text-sm text-red-500"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>
        

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">メモ</label>
          <textarea
            placeholder="雰囲気・混雑具合・おすすめメニューなど"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-28 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-full bg-black px-6 py-3 font-bold text-white transition hover:opacity-80"
        >
          投稿する
        </button>
      </div>
    </div>
  );
}