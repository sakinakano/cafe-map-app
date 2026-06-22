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


  return (
    <div>

      <CafeMap cafes={cafes} />

    </div>
  );
}