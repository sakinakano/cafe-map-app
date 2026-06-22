"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Profile = {
  id: string;
  name: string;
  avatar_url: string | null;
};

type Cafe = {
  id: string;
  name: string;
  address: string | null;
  description: string | null;
  image_urls: string[] | null;
};

export default function MyPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [cafes, setCafes] = useState<Cafe[]>([]);

  useEffect(() => {
    const fetchMyPage = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("users")
        .select("id, name, avatar_url")
        .eq("id", userData.user.id)
        .single();

      setProfile(profileData);

      const { data: cafeData, error } = await supabase
        .from("cafes")
        .select("id, name, address, description, image_urls")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        alert(error.message);
        return;
      }

      setCafes(cafeData || []);
    };

    fetchMyPage();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    alert("ログアウトしました");

    router.push("/");
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">マイページ</h1>

      <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl">
              {profile?.name?.[0] || "?"}
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500">ユーザー名</p>
            <p className="text-lg font-bold">{profile?.name}</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">自分の投稿</h2>

        <div className="space-y-4">
          {cafes.map((cafe) => (
            <div key={cafe.id} className="rounded-2xl bg-white p-4 shadow-sm">
              {cafe.image_urls?.[0] && (
                <img
                  src={cafe.image_urls[0]}
                  alt={cafe.name}
                  className="mb-3 h-40 w-full rounded-xl object-cover"
                />
              )}

              <h3 className="text-lg font-bold">{cafe.name}</h3>

              {cafe.address && (
                <p className="mt-1 text-sm text-gray-600">{cafe.address}</p>
              )}

              {cafe.description && (
                <p className="mt-2 text-sm">{cafe.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <button onClick={handleLogout} className="bg-black text-white px-4 py-2 rounded-full">
        ログアウト
      </button>
    </div>
  );
}