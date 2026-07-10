const { GoogleGenAI } = require("@google/genai");

let client = null;

if (process.env.GEMINI_API_KEY) {
  client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
}

// --- Unsplash cover photo fetch ---
async function getDestinationPhoto(destination) {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.warn("UNSPLASH_ACCESS_KEY not set — skipping cover photo fetch");
    return "";
  }

  try {
    const query = encodeURIComponent(`${destination} travel landmark`);
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      console.error("Unsplash API error:", response.status, await response.text());
      return "";
    }

    const data = await response.json();
    const photo = data.results?.[0];

    // regular size is a good balance of quality vs. load time for cards/headers
    return photo?.urls?.regular || "";
  } catch (error) {
    console.error("Failed to fetch destination photo:", error.message);
    return "";
  }
}

const buildPrompt = ({ destination, budget, days, travelers }) => `
You are an expert travel planner. Create a detailed trip plan for:
- Destination: ${destination}
- Budget: ₹${budget} (total, in Indian Rupees)
- Duration: ${days} days
- Travelers: ${travelers}

Respond with ONLY valid JSON (no markdown, no commentary) matching this exact shape:
{
  "destination": "string",
  "country": "string",
  "bestTimeToVisit": "string",
  "estimatedBudgetBreakdown": {
    "accommodation": number,
    "food": number,
    "transport": number,
    "activities": number,
    "misc": number
  },
  "itinerary": [
    {
      "day": number,
      "title": "string",
      "activities": [
        {
          "time": "string e.g. 09:00 AM",
          "title": "string",
          "description": "string",
          "category": "sightseeing|food|travel|leisure|shopping|other",
          "estimatedCost": number
        }
      ]
    }
  ],
  "foodRecommendations": ["string"],
  "packingChecklist": ["string"],
  "places": [
    { "name": "string", "type": "attraction|hotel|restaurant", "description": "string", "lat": number, "lng": number, "rating": number }
  ]
}
Make sure the itinerary has exactly ${days} day objects and all estimated costs and budget values are in Indian Rupees (INR). The budget breakdown should roughly sum to ₹${budget}, and include real, well-known places with realistic latitude/longitude for ${destination}.
`;

// Deterministic offline fallback so the app is fully demoable without an API key
function generateMockPlan({ destination, budget, days, travelers }) {
  const perDayBudget = Math.round(budget / Math.max(days, 1));
  const itinerary = Array.from({ length: Number(days) }, (_, i) => ({
    day: i + 1,
    title: i === 0 ? `Arrival in ${destination}` : `Exploring ${destination} - Day ${i + 1}`,
    activities: [
      {
        time: "09:00 AM",
        title: `Breakfast near your stay in ${destination}`,
        description: "Start the day with a local breakfast spot recommended by locals.",
        category: "food",
        estimatedCost: Math.round(perDayBudget * 0.1),
      },
      {
        time: "11:00 AM",
        title: `Visit a top landmark in ${destination}`,
        description: "Explore one of the most iconic attractions of the destination.",
        category: "sightseeing",
        estimatedCost: Math.round(perDayBudget * 0.25),
      },
      {
        time: "02:00 PM",
        title: "Local lunch experience",
        description: "Try authentic local cuisine at a well-rated restaurant.",
        category: "food",
        estimatedCost: Math.round(perDayBudget * 0.15),
      },
      {
        time: "05:00 PM",
        title: "Leisure & shopping",
        description: "Relax at a park, café, or local market.",
        category: "leisure",
        estimatedCost: Math.round(perDayBudget * 0.2),
      },
    ],
  }));

  return {
    destination,
    country: "",
    bestTimeToVisit: "October to March (mild weather, ideal for sightseeing)",
    estimatedBudgetBreakdown: {
      accommodation: Math.round(budget * 0.35),
      food: Math.round(budget * 0.25),
      transport: Math.round(budget * 0.15),
      activities: Math.round(budget * 0.2),
      misc: Math.round(budget * 0.05),
    },
    itinerary,
    foodRecommendations: [
      `Popular street food in ${destination}`,
      "Highly-rated local restaurant",
      "Traditional dessert spot",
      "Rooftop cafe with a view",
    ],
    packingChecklist: [
      "Passport & travel documents",
      "Comfortable walking shoes",
      "Weather-appropriate clothing",
      "Universal travel adapter",
      "Portable power bank",
      "Basic first-aid kit",
      "Camera",
      `Local currency / cards for ${travelers} traveler(s)`,
    ],
    places: [
      { name: `${destination} City Center`, type: "attraction", description: "Popular central attraction area.", lat: 0, lng: 0, rating: 4.5 },
      { name: `${destination} Grand Hotel`, type: "hotel", description: "Well-reviewed centrally located hotel.", lat: 0, lng: 0, rating: 4.3 },
      { name: `${destination} Local Bistro`, type: "restaurant", description: "Highly rated local restaurant.", lat: 0, lng: 0, rating: 4.6 },
    ],
  };
}

async function generateTripPlan({ destination, budget, days, travelers }) {
  let plan;

  if (!client) {
    plan = generateMockPlan({ destination, budget, days, travelers });
  } else {
    try {
      const response = await client.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-2.5-pro",
        contents: buildPrompt({ destination, budget, days, travelers }),
        config: {
          temperature: 0.7,
          responseMimeType: "application/json",
        },
      });

      const raw = response.text;
      plan = JSON.parse(raw);
    } catch (error) {
      console.error("AI generation failed, falling back to mock plan:", error.message);
      plan = generateMockPlan({ destination, budget, days, travelers });
    }
  }

  // Fetch a real destination photo separately — Gemini text generation
  // can't return genuine image URLs, so this is a dedicated Unsplash call.
  plan.coverImage = await getDestinationPhoto(plan.destination || destination);

  return plan;
}

module.exports = { generateTripPlan };