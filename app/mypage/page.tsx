"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Profile = {
  id: string;
  name: string;
  img_url: string | null;
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

      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("id, name, img_url")
        .eq("id", userData.user.id)
        .maybeSingle();

      if (profileError) {
        alert(profileError.message);
        return;
      }

      setProfile(profileData);

      await fetchMyCafes(userData.user.id, 0, false);
    };

    fetchMyPage();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    alert("ログアウトしました");

    router.push("/");
  };

  const handleDeleteCafe = async (cafeId: string) => {
    const result = confirm("この投稿を削除しますか？");

    if (!result) return;

    const { error } = await supabase
      .from("cafes")
      .delete()
      .eq("id", cafeId);

    if (error) {
      alert(error.message);
      return;
    }

    setCafes((prev) => prev.filter((cafe) => cafe.id !== cafeId));

    alert("削除しました");
  };

  const PAGE_SIZE = 10;

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchMyCafes = async (
    userId: string,
    pageNumber: number,
    append: boolean
  ) => {
    const from = pageNumber * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("cafes")
      .select("id, name, address, description, image_urls")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      alert(error.message);
      return;
    }

    const newCafes = data || [];

    if (append) {
      setCafes((prev) => [...prev, ...newCafes]);
    } else {
      setCafes(newCafes);
    }

    setHasMore(newCafes.length === PAGE_SIZE);
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push("/login");
      setIsLoadingMore(false);
      return;
    }

    const nextPage = page + 1;

    await fetchMyCafes(userData.user.id, nextPage, true);

    setPage(nextPage);
    setIsLoadingMore(false);
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">マイページ</h1>

      <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          {profile?.img_url ? (
            <img
              src={profile.img_url}
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

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/cafes/${cafe.id}/edit`}
                  className="rounded-full bg-black px-4 py-2 text-sm text-white"
                >
                  編集
                </Link>

                <button
                  type="button"
                  onClick={() => handleDeleteCafe(cafe.id)}
                  className="rounded-full bg-red-500 px-4 py-2 text-sm text-white"
                >
                  削除
                </button>
              </div>
            </div>
          ))}
          {hasMore && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoadingMore ? "読み込み中..." : "もっと見る"}
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="mt-4">
        <button onClick={handleLogout} className="bg-black text-white px-4 py-2 rounded-full">
          ログアウト
        </button>
        <Link
          href="/mypage/edit"
          className="bg-black text-white px-4 py-2 rounded-full ml-2 inline-block"
        >
          プロフィールを編集
        </Link>
      </div>
    </div>
  );
}