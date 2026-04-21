"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.03] blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative flex flex-col items-center"
      >
        <div className="mb-10 h-28 w-28 overflow-hidden rounded-2xl">
          <Image
            src="/icon.png"
            alt="LoudFlow"
            width={224}
            height={224}
            priority
            className="h-full w-full object-cover"
          />
        </div>

        <h1 className="text-center text-3xl font-medium tracking-tight text-white md:text-4xl">
          Welcome to LoudFlow
        </h1>

        <p className="mt-5 text-center text-[11px] font-medium uppercase tracking-[0.35em] text-white/40">
          Coming Soon
        </p>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="absolute bottom-8 text-xs tracking-widest text-white/30"
      >
        loudflow.xyz
      </motion.footer>
    </main>
  );
}
