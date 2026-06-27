export const uploadImageToImgbb = async (imageFile) => {
  const imageHostingKey = import.meta.env.VITE_IMGBB_API_KEY;

  if (!imageHostingKey) {
    throw new Error("VITE_IMGBB_API_KEY is missing in .env.local file.");
  }

  if (!imageFile) {
    throw new Error("Please select an image file.");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${imageHostingKey}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();

  if (!response.ok || !result?.success) {
    throw new Error(result?.error?.message || "Image upload failed.");
  }

  return result.data?.display_url || result.data?.url;
};