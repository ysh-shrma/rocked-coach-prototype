/**
 * Mocked "Content Library" data — real RockED feature (short-form guide
 * videos, tab-filtered by brand/vendor), mined from Yash's own screenshots.
 * Same spirit as the old Browse-by-Brands badge list, but with an actual
 * destination per item instead of decorative icons that went nowhere.
 */

export type ContentVideo = {
  id: string;
  chapterLabel: string;
  title: string;
  progressPct: number;
};

export type ContentTab = {
  id: string;
  name: string;
  color: string;
  videos: ContentVideo[];
};

export const CONTENT_TABS: ContentTab[] = [
  {
    id: "amc",
    name: "AMC",
    color: "#16151f",
    videos: [
      { id: "amc-1", chapterLabel: "Chapter 1: Meet Brian Benstock", title: "Automotive Masterclass", progressPct: 0 },
      { id: "amc-2", chapterLabel: "Chapter 2: The Service Drive Playbook", title: "Automotive Masterclass", progressPct: 0 },
    ],
  },
  {
    id: "bizzycar",
    name: "BizzyCar",
    color: "#e8871e",
    videos: [
      { id: "bizzy-1", chapterLabel: "Getting Started with BizzyCar", title: "Fixed Ops Guide", progressPct: 0 },
    ],
  },
  {
    id: "dealerware",
    name: "Dealerware",
    color: "#2563eb",
    videos: [
      { id: "dw-1", chapterLabel: "Loaner Fleet Basics", title: "Dealerware 101", progressPct: 0 },
    ],
  },
];
