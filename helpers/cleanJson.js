export function cleanAndParseJson(rawText) {
  if (!rawText) return {};

  console.log("Cleaning and parsing JSON...");

  // Step 1: Remove unwanted characters (Javascript equivalent of your Python logic)
  let processedText = rawText
    // Remove all line breaks (replace \r\n, \n, \r with empty string)
    .replace(/[\r\n]+/g, '') 
    // Replace smart quotes
    .replace(/[\u201C\u201D]/g, '"') 
    .replace(/[\u2018\u2019]/g, "'")
    // Remove Markdown code blocks
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // Step 2: Attempt to parse
  try {
    const cleanedJson = JSON.parse(processedText);
    return cleanedJson;
  } catch (error) {
    console.error("JSON Parse Error:", error);
    // Return error object (preserving your error logic)
    return { 
      error: `Invalid JSON: ${error.message}`, 
      raw_input: processedText 
    };
  }
}
