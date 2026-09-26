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

// End-to-end navigation chain test using a curated public spot.
// Mirrors what each route loader does, so if any link or slug breaks, this fails.
describe("spots navigation e2e: Cumbuco", () => {
  it("resolves continent -> region -> spot and exposes the spot name", () => {
    // Level 1: /spots renders continents from getContinents("kite")
    const continents = getContinents("kite");
    const southAmerica = continents.find((c) => c.name === "South America");
    expect(southAmerica, "South America must exist in spots index").toBeTruthy();
    expect(southAmerica!.slug).toBe("south-america");

    // Level 2: /spots/$continent loader -> findContinent
    const continent = findContinent("kite", southAmerica!.slug);
    expect(continent?.name).toBe("South America");

    const regions = getRegions("kite", continent!.name);
    const brazil = regions.find((r) => r.name === "Ceará (Brazil)");
    expect(brazil, "Ceará must exist under South America").toBeTruthy();
    expect(brazil!.slug).toBe("ceara-brazil");

    // Level 3: /spots/$continent/$region loader -> findRegion + getSpotsInRegion
    const region = findRegion("kite", continent!.name, brazil!.slug);
    expect(region?.name).toBe("Ceará (Brazil)");

    const spots = getSpotsInRegion("kite", continent!.name, region!.name);
    const cumbuco = spots.find((s) => s.name === "Cumbuco");
    expect(cumbuco, "Cumbuco must exist in Ceará").toBeTruthy();
    expect(slugify(cumbuco!.name)).toBe("cumbuco");

    // Level 4: /spots/$continent/$region/$spot loader -> findSpot
    const spot = findSpot("kite", continent!.name, region!.name, "cumbuco");
    expect(spot, "findSpot must resolve Cumbuco by slug").toBeTruthy();
    expect(spot!.name).toBe("Cumbuco");
  });
});
