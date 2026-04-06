import { configure, searchTrainBetweenStations } from "irctc-connect";
import 'dotenv/config';  // only if Node < 20; Node 22+ can use --env-file

configure(process.env.IRCTC_API_KEY);

(async () => {
  try {
    console.log("Fetching trains...");
    const trains = await searchTrainBetweenStations("NDLS", "BCT", "2024-04-10");
    console.log("✅ Received:");
    console.dir(trains, { depth: null });
  } catch (err) {
    console.error("❌ Error:", err.message || err);
  }
})();
