import { describe, it, expect } from "vitest";
import {
  findContinent,
  findRegion,
  findSpot,
  getContinents,
  getRegions,
  getSpotsInRegion,
  slugify,
} from "./spots-data";

// End-to-end navigation chain test: /spots -> Africa -> South Africa -> Big Bay.
// Mirrors what each route loader does, so if any link or slug breaks, this fails.
describe("spots navigation e2e: Big Bay", () => {
  it("resolves continent -> region -> spot and exposes the spot name", () => {
    // Level 1: /spots renders continents from getContinents("kite")
    const continents = getContinents("kite");
    const africa = continents.find((c) => c.name === "Africa");
    expect(africa, "Africa continent must exist in spots index").toBeTruthy();
    expect(africa!.slug).toBe("africa");

    // Level 2: /spots/$continent loader -> findContinent
    const continent = findContinent("kite", africa!.slug);
    expect(continent?.name).toBe("Africa");

    const regions = getRegions("kite", continent!.name);
    const southAfrica = regions.find((r) => r.name === "South Africa");
    expect(southAfrica, "South Africa region must exist under Africa").toBeTruthy();
    expect(southAfrica!.slug).toBe("south-africa");

    // Level 3: /spots/$continent/$region loader -> findRegion + getSpotsInRegion
    const region = findRegion("kite", continent!.name, southAfrica!.slug);
    expect(region?.name).toBe("South Africa");

    const spots = getSpotsInRegion("kite", continent!.name, region!.name);
    const bigBay = spots.find((s) => s.name === "Big Bay");
    expect(bigBay, "Big Bay spot must exist in South Africa").toBeTruthy();
    expect(slugify(bigBay!.name)).toBe("big-bay");

    // Level 4: /spots/$continent/$region/$spot loader -> findSpot
    const spot = findSpot("kite", continent!.name, region!.name, "big-bay");
    expect(spot, "findSpot must resolve Big Bay by slug").toBeTruthy();
    expect(spot!.name).toBe("Big Bay");
  });
});