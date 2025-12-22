"use client";

import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

function Page() {
  const [configId, setConfigId] = useState<string | null>(null);
  const router = useRouter();

 

  const { user } = useKindeBrowserClient();
  useEffect(() => {
    const id = localStorage.getItem("configurationID");
    if (id) setConfigId(id);
  }, []);
  useEffect(() => {
    if (user) {
      if (configId) {
        localStorage.removeItem("configurationID");
        router.push(`/configure/preview?id=${configId}`);
      } else {
        router.push(`/`);
      }
    }
  }, [user,configId,router]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <h3 className="font-semibold text-xl">Logging you in ...</h3>
        <p>You will be rediracted automatically.</p>
      </div>
    </div>
  );
}

export default Page;
