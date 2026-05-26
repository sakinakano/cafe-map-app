"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("SIGNUP DATA", data);
    console.log("SIGNUP ERROR", error);

    if (error) {
      alert(error.message);
      return;
    }

    alert("登録成功");
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
  };

  return (
    <main style={{ padding: 40 }}>
      <h1 className="text-3xl font-bold">ログイン</h1>

      <div>
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

      <button onClick={handleLogin} className="bg-black text-white px-4 py-2 rounded-full">ログイン</button>
      <button onClick={handleSignUp} className="bg-black text-white px-4 py-2 rounded-full">新規登録</button>
    </main>
  );
}