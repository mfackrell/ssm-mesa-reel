// steps/selectTopic.js

// steps/selectTopic.js

// -------- AXIS 1: DOMAIN --------
const domains = [
  "cognitive",
  "emotional",
  "spiritual",
  "identity",
  "relational",
  "social",
  "communication",
  "autonomy",
  "behavioral",
  "financial",
  "physical",
  "family",
  "institutional",
  "digital",
  "work",
  "environmental"
];

// -------- AXIS 2: MECHANISM --------
const mechanisms = [
  "gaslighting",
  "projection",
  "minimization",
  "invalidation",
  "conditional approval",
  "withholding",
  "intermittent reinforcement",
  "moving goalposts",
  "dismissal",
  "shame induction",
  "devaluation",
  "triangulation",
  "isolation",
  "comparison",
  "stonewalling",
  "blame shifting",
  "fear conditioning",
  "hope manipulation",
  "spiritual bypass",
  "surveillance",
  "administrative pressure",
  "chaos injection"
];

// -------- AXIS 3: PERSPECTIVE --------
const perspectives = [
  "first-person realization",
  "second-person mirror",
  "inner voice",
  "pattern noticing",
  "somatic awareness",
  "moment of pause",
  "older self reflecting",
  "quiet truth emerging"
];

// -------- AXIS 4: INTENT --------
const intents = [
  "validate experience",
  "name gently",
  "invite reflection",
  "surface awareness",
  "reframe meaning",
  "normalize uncertainty",
  "ground in the present",
  "create pause"
];

// Utility
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// -------- TOPIC SYNTHESIS --------
function synthesizeTopic({ domain, mechanism, perspective, intent }) {
  // Keep this subtle and awakening — not diagnostic
  return `A ${perspective} around ${mechanism} in the ${domain} domain that helps ${intent}.`;
}

// -------- PUBLIC API --------
export async function selectTopic() {
  console.log("Selecting topic using MESA matrix...");

  const selection = {
    domain: pickRandom(domains),
    mechanism: pickRandom(mechanisms),
    perspective: pickRandom(perspectives),
    intent: pickRandom(intents)
  };

  console.log("MESA Topic Selection:", selection);

  return JSON.stringify(selection);
}
