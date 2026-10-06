// Supabase 客户端（浏览器侧，使用 anon key）。
// 懒加载：未配置环境变量时返回 null，而不是在模块加载时抛错，
// 这样 Contact 页在未填入凭证前仍可正常浏览，仅提交时提示未配置。
//
// 需要在 .env.local 中配置：
//   NEXT_PUBLIC_SUPABASE_URL=你的项目 URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=anon public key

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;
let initialized = false;

export function getSupabase(): SupabaseClient | null {
  if (initialized) return client;
  initialized = true;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    client = null;
    return null;
  }

  client = createClient(url, anonKey);
  return client;
}
