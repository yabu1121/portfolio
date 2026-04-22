import path from "path";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "@/lib/supabase/server";

const BUCKET = "skill_images";
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml"]);
const MAX_BYTES = 2 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return Response.json({ success: false, message: "fileが見つかりません" }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return Response.json({ success: false, message: "対応していない形式です" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return Response.json({ success: false, message: "2MB以下にしてください" }, { status: 400 });
    }

    const ext = path.extname(file.name) || ".png";
    const filename = `${randomUUID()}${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filename, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      return Response.json(
        { success: false, message: uploadError.message },
        { status: 500 },
      );
    }

    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(filename);

    return Response.json({ success: true, url: data.publicUrl }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "アップロード失敗" }, { status: 500 });
  }
}
