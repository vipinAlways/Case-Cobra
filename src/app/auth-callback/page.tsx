"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAuthStatus } from "./action";

function Page() {
  const [configId, setConfigId] = useState<string | null>(null);
  const router = useRouter();

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["authStatus"],
    queryFn: getAuthStatus,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const id = localStorage.getItem("configurationID");
    if (id) setConfigId(id);
  }, []);

  useEffect(() => {
    if (isSuccess && data?.success) {
      if (configId) {
        localStorage.removeItem("configurationID");
        router.push(`/configure/preview?id=${configId}`);
      } else {
        router.push(`/`);
      }
    }
  }, [isSuccess, data, configId, router]);

  useEffect(() => {
    if (isError) {
      router.push("/");
    }
  }, [isError, router]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <h3 className="font-semibold text-xl">Logging you in...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
}

export default Page;
