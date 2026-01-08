// steps/triggerZapier.js

export async function triggerZapier(payload) {
  console.log("Triggering Zapier Webhook...");
  console.log("Payload being sent:", JSON.stringify(payload, null, 2)); // Log payload for debugging

  const webhookUrl = "https://hooks.zapier.com/hooks/catch/19867794/uw0y7qi/";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload) // Send the payload exactly as received
    });

    if (!response.ok) {
      throw new Error(`Zapier returned status: ${response.status}`);
    }

    console.log("✅ Zapier webhook triggered successfully.");
  } catch (error) {
    console.error("❌ Failed to trigger Zapier:", error.message);
  }
}
