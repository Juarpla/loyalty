import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

const pagePath = path.resolve(__dirname, "../../src/app/admin/dashboard/page.tsx");
const clientPath = path.resolve(
  __dirname,
  "../../src/app/admin/dashboard/dashboard.client.tsx"
);

describe("page_manager_reports Integration Tests", () => {
  describe("R7: Page metadata", () => {
    it("R7: page.tsx SHALL export metadata with the correct title", () => {
      const content = readFileSync(pagePath, "utf-8");
      expect(content).toContain('title: "Manager Dashboard | Loyalty"');
      expect(content).toContain(
        'description: "View sales traffic and peak hours analytics"'
      );
    });

    it("R7: page.tsx SHALL be a Server Component (no use client)", () => {
      const content = readFileSync(pagePath, "utf-8");
      expect(content).not.toContain('"use client"');
    });

    it("R7: page.tsx SHALL render DashboardClient", () => {
      const content = readFileSync(pagePath, "utf-8");
      expect(content).toContain("<DashboardClient />");
    });
  });

  describe("R1, R2, R6, R8: DashboardClient", () => {
    it("R1: client SHALL render header with Manager Dashboard text", () => {
      const content = readFileSync(clientPath, "utf-8");
      expect(content).toContain("Manager Dashboard");
      expect(content).toContain("Traffic and peak hours analytics");
    });

    it("R2: client SHALL import and mount TrafficChartComponent", () => {
      const content = readFileSync(clientPath, "utf-8");
      expect(content).toContain('import { TrafficChartComponent } from "@/components/traffic/chart.component"');
      expect(content).toContain("<TrafficChartComponent");
    });

    it("R6: client SHALL contain navigation links to other admin routes", () => {
      const content = readFileSync(clientPath, "utf-8");
      expect(content).toContain('href="/admin/cash"');
      expect(content).toContain('href="/admin/promotions"');
      expect(content).toContain('href="/admin/social"');
    });

    it("R8: client SHALL use semantic landmarks (header, nav, main)", () => {
      const content = readFileSync(clientPath, "utf-8");
      expect(content).toContain("<header");
      expect(content).toContain("<nav");
      expect(content).toContain("<main");
    });

    it("R8: client SHALL use next/link for navigation", () => {
      const content = readFileSync(clientPath, "utf-8");
      expect(content).toContain('import Link from "next/link"');
    });
  });
});
