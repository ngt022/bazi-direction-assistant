"use client";

import Link from "next/link";
import { Orbit } from "lucide-react";

export default function ServerError() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0f1114] px-4 text-center text-[#f3ede3]">
      <Orbit className="h-10 w-10 text-[#d8b48e]" strokeWidth={1.4} />
      <h1 className="font-display text-2xl">服务器暂时异常</h1>
      <p className="max-w-md text-sm leading-6 text-[#958e8e]">
        系统遇到了临时问题，我们的团队已收到通知。请稍后再试。
      </p>
      <Link
        href="/"
        className="mt-2 rounded-md border border-[#c25344] bg-[#c25344] px-5 py-3 text-sm font-medium text-white"
      >
        返回首页
      </Link>
    </main>
  );
}
