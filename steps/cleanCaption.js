export async function cleanCaption(rawCaption) {
  console.log("Cleaning caption...");

  // Handle missing input, default to empty string like the Python script
  const textToClean = rawCaption || "";

  // Logic: 
  // 1. JSON.stringify() behaves like json.dumps() (escapes quotes, handles newlines)
  // 2. .slice(1, -1) removes the surrounding quotes added by stringify
  const safeCaption = JSON.stringify(textToClean).slice(1, -1);

  return safeCaption;
}
