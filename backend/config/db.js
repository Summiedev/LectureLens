import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

export const supabase = createClient(
  "https://noebaxzcqhhsnzzlclqg.supabase.co",
  process.env.SUPABASE_KEY
);
