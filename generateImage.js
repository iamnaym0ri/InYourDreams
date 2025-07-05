export async function generateImage({ prompt, model }) {
  console.log("⚙️ Starting generateImage with model:", model);
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, model }),
  });

  const data = await response.json();
  console.log("✅ Response from backend:", data);

  if (!data.imageUrl) {
    console.log("❌ No imageUrl in response");
    throw new Error("Image generation FAILED.");
  }

  return data.imageUrl;
}
