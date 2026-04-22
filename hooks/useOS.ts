"use client";

import { useEffect, useState } from "react";
import { detectOS, type OS } from "@/lib/os";

export function useOS(): OS {
  const [os, setOs] = useState<OS>("unknown");
  useEffect(() => {
    setOs(detectOS());
  }, []);
  return os;
}
