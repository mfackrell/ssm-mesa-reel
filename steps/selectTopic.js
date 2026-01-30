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

// -------- AXIS 4: AGENCY EFFECT --------
const agencyEffects = [
  "self-recognition",
  "permission without instruction",
  "internal validation",
  "choice awareness",
  "cognitive slowing",
  "emotional containment",
  "self-trust reactivation",
  "meaning without conclusion",
  "felt safety",
  "ownership of interpretation"
];

// Utility
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// -------- PUBLIC API --------
export async function selectTopic() {
  console.log("Selecting topic using MESA matrix...");

  const selection = {
    domain: pickRandom(domains),
    mechanism: pickRandom(mechanisms),
    perspective: pickRandom(perspectives),
    agencyEffect: pickRandom(agencyEffects)
  };

  console.log("MESA Topic Selection:", selection);

  return JSON.stringify(selection);
}
