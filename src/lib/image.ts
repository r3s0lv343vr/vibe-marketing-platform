/** Read an image File, resize, and return a JPEG/PNG data URL suitable for local profile storage. */
export async function fileToDataUrl(
  file: File,
  options: { maxWidth?: number; quality?: number } = {},
): Promise<string> {
  const maxWidth = options.maxWidth ?? 720;
  const quality = options.quality ?? 0.82;

  if (!file.type.startsWith("image/")) {
    throw new Error("Only PNG or JPEG images are allowed.");
  }
  if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
    throw new Error("Please upload a PNG or JPEG image.");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("Image must be under 8MB.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
  return canvas.toDataURL(mime, quality);
}
