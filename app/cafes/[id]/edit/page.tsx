"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

type Cafe = {
  id: string;
  name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  description: string | null;
  image_urls: string[] | null;
};

export default function EditCafePage() {
  const router = useRouter();
  const params = useParams();

  const cafeId = params.id as string;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchCafe = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("cafes")
        .select("id, name, address, latitude, longitude, description, image_urls, user_id")
        .eq("id", cafeId)
        .maybeSingle();

      if (error) {
        alert(error.message);
        return;
      }

      if (!data) {
        alert("投稿が見つかりません");
        router.push("/mypage");
        return;
      }

      if (data.user_id !== userData.user.id) {
        alert("この投稿は編集できません");
        router.push("/mypage");
        return;
      }

      setName(data.name);
      setAddress(data.address || "");
      setLatitude(String(data.latitude));
      setLongitude(String(data.longitude));
      setDescription(data.description || "");
      setImageUrls(data.image_urls || []);
    };

    fetchCafe();
  }, [cafeId, router]);

  const handleRemoveExistingImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    if (!name) {
      alert("カフェ名を入力してください");
      return;
    }

    if (!latitude || !longitude) {
      alert("緯度・経度を入力してください");
      return;
    }

    const newImageUrls: string[] = [];

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

      newImageUrls.push(result.imageUrl);
    }

    const mergedImageUrls = [...imageUrls, ...newImageUrls];

    const { error } = await supabase
      .from("cafes")
      .update({
        name,
        address: address || null,
        latitude: Number(latitude),
        longitude: Number(longitude),
        description: description || null,
        image_urls: mergedImageUrls,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cafeId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("投稿を更新しました");
    router.push("/mypage");
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1000px] px-4 py-8">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">カフェ投稿を編集</h1>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">カフェ名</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3"
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">住所</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3"
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-sm font-medium">緯度</label>
            <input
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">経度</label>
            <input
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">画像</label>

          <input
            id="cafe-images"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              const files = e.target.files;

              if (!files) return;

              setImageFiles((prev) => [...prev, ...Array.from(files)]);
            }}
            className="hidden"
          />

          <label
            htmlFor="cafe-images"
            className="inline-flex cursor-pointer rounded-full bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
          >
            画像を追加
          </label>
        </div>

        <div className="mb-4 space-y-2">
          {imageUrls.map((url, index) => (
            <div
              key={url}
              className="flex items-center justify-between rounded-lg bg-gray-100 p-3"
            >
              <img
                src={url}
                alt=""
                className="h-14 w-14 rounded-lg object-cover"
              />

              <button
                type="button"
                onClick={() => handleRemoveExistingImage(index)}
                className="text-sm text-red-500"
              >
                削除
              </button>
            </div>
          ))}

          {imageFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-gray-100 p-3"
            >
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="h-14 w-14 rounded-lg object-cover"
              />

              <button
                type="button"
                onClick={() => handleRemoveNewImage(index)}
                className="text-sm text-red-500"
              >
                削除
              </button>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">メモ</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-28 w-full rounded-2xl border border-gray-200 px-4 py-3"
          />
        </div>

        <button
          type="button"
          onClick={handleUpdate}
          className="w-full rounded-full bg-black px-6 py-3 font-bold text-white"
        >
          更新する
        </button>
      </div>
    </main>
  );
}