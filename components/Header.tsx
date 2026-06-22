"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-orange-100 bg-white">
      <div className="mx-auto flex max-w-[1000px] items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          Cafe Map
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/cafes/new" className="hover:text-orange-500">
            投稿する
          </Link>

          <Link href="/favorites" className="hover:text-orange-500">
            お気に入り
          </Link>

          <Link href="/mypage" className="hover:text-orange-500">
            マイページ
          </Link>
        </nav>
      </div>
    </header>
  );
}