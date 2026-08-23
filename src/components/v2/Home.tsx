"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Bell,
  Brain,
  CircleUserRound,
  Copy,
  Flame,
  FolderOpen,
  House,
  MessageCircleQuestion,
  PlayCircle,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import { CONTENT_TABS } from "@/data/content";
import type { PerformanceSummary } from "@/lib/session";
import { PillarBars, Sheet, rise } from "./ui";

const TABS = [
  { label: "Home", icon: House, active: true },
  { label: "Explore", icon: FolderOpen, active: false },
  { label: "Contests", icon: Trophy, active: false },
  { label: "Account", icon: CircleUserRound, active: false },
] as const;

export function Home({
  nextLabel,
  nextReason,
  performance,
  onOpenCoach,
  onOpenProfile,
  showPersonalizing,
  onPersonalizingDone,
}: {
  /** The one thing to do next, shared with Hub/Profile — e.g. "The Difficult
   *  One — de-escalation practice." Null only before any signal exists. */
  nextLabel: string | null;
  /** Fix 6: the "why" behind the recommendation — a quoted real-call moment
   *  when CRM data backs it, a practice-session reference otherwise, or null
   *  when there's genuinely nothing to cite yet (honest empty state). */
  nextReason: string | null;
  /** The rep's actual standing — computed once in page.tsx via
   *  summarizePerformance, shared with Profile so the two screens can never
   *  quietly disagree on what counts as the weakest pillar. */
  performance: PerformanceSummary;
  onOpenCoach: () => void;
  onOpenProfile: () => void;
  /** True for one brief window right after the demo is switched to
   *  "CRM-integrated" with no session yet — folded into Home's own first
   *  mount rather than a separate forced onboarding gate. */
  showPersonalizing: boolean;
  onPersonalizingDone: () => void;
}) {
  const [personalizing, setPersonalizing] = useState(showPersonalizing);
  const [activeTab, setActiveTab] = useState(CONTENT_TABS[0].id);
  const [showInvite, setShowInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const activeContent = CONTENT_TABS.find((t) => t.id === activeTab) ?? CONTENT_TABS[0];

  useEffect(() => {
    if (!showPersonalizing) return;
    setPersonalizing(true);
    const t = setTimeout(() => {
      setPersonalizing(false);
      onPersonalizingDone();
    }, 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPersonalizing]);

  function copyInviteLink() {
    navigator.clipboard?.writeText("https://rocked.app/join/T-4F82");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="relative flex h-full flex-col bg-white">
      <motion.div className="flex items-center justify-between px-5 pb-3 pt-5" {...rise(0)}>
        <span className="flex items-center gap-2 rounded-full bg-r-sunk px-3 py-[7px] text-[13px] font-semibold text-r-ink-2">
          <Flame size={15} className="text-r-amber" fill="currentColor" strokeWidth={0} />
          0 of 1 day streak
        </span>
        <span className="flex items-center gap-3 text-r-ink-2">
          <Bell size={20} strokeWidth={1.8} />
          <Search size={20} strokeWidth={1.8} />
        </span>
      </motion.div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-8">
        {/* Fused "where you stand → what closes it" card — the actual
            answer to "this just looks like a checklist," not another
            reworded call-to-action. */}
        <motion.div className="card-lift mt-1 overflow-hidden" {...rise(0.05)}>
          <div className="p-4">
            {performance.state === "empty" ? (
              <>
                <p className="mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
                  Your standing
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-r-ink-2">
                  You haven&rsquo;t practiced yet — your first call becomes your starting line.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-r-ink-4">
                      {performance.headlineLabel}
                    </p>
                    <p className="mt-[2px] text-[28px] font-extrabold leading-none tracking-[-0.01em] text-r-ink">
                      {performance.headlineValue}
                    </p>
                  </div>
                  {performance.avgPillars && <PillarBars values={performance.avgPillars} />}
                </div>
                {performance.gapLabel && (
                  <p className="mt-3 text-[13px] font-semibold text-r-ink-2">{performance.gapLabel}</p>
                )}
              </>
            )}
            <button
              onClick={onOpenProfile}
              className="mt-2 text-[12px] font-semibold text-r-brand"
            >
              See full profile →
            </button>
          </div>

          <div className="h-px bg-r-line" />

          <motion.button
            onClick={onOpenCoach}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-start gap-4 p-4 text-left"
          >
            <span className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-r-brand-tint text-r-brand">
              <Brain size={20} strokeWidth={2.2} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="mono block text-[10.5px] font-semibold uppercase tracking-[0.08em] text-r-brand">
                Next up
              </span>
              <span className="mt-[2px] block text-[15px] font-bold leading-snug text-r-ink">
                {nextLabel ?? "Start your first practice call"}
              </span>
              {nextReason && (
                <span className="mt-[6px] block text-[12px] leading-snug text-r-ink-3">{nextReason}</span>
              )}
            </span>
          </motion.button>
        </motion.div>

        {/* Content Library — real RockED feature (short-form guide videos,
            tab-filtered by brand/vendor), replacing Browse by Brands: same
            tab-strip pattern, but with an actual destination per item
            instead of decorative icons that went nowhere. */}
        <motion.p className="mb-2 mt-6 text-[13px] font-bold text-r-ink" {...rise(0.1)}>
          Content Library
        </motion.p>
        <motion.div className="flex gap-2 overflow-x-auto pb-1" {...rise(0.12)}>
          {CONTENT_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 flex-col items-center gap-1.5 rounded-[14px] border p-2.5 ${
                tab.id === activeTab ? "border-r-brand-line bg-r-brand-tint" : "border-r-line bg-white"
              }`}
              style={{ minWidth: 74 }}
            >
              <span
                className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] text-[11px] font-bold text-white"
                style={{ background: tab.color }}
              >
                {tab.name[0]}
              </span>
              <span className={`text-[10px] font-medium leading-tight ${tab.id === activeTab ? "text-r-brand" : "text-r-ink-3"}`}>
                {tab.name}
              </span>
            </button>
          ))}
        </motion.div>

        <motion.div className="mt-3 flex gap-3 overflow-x-auto pb-1" {...rise(0.14)}>
          {activeContent.videos.map((video) => (
            <div
              key={video.id}
              className="flex w-[168px] shrink-0 flex-col overflow-hidden rounded-[18px] bg-gradient-to-b from-[#2b1f6b] to-[#16151f] text-white"
            >
              <div className="relative flex h-[140px] items-center justify-center">
                <span className="absolute left-2 top-2 rounded-full bg-black/40 px-2 py-[2px] text-[10px] font-semibold">
                  {video.progressPct}%
                </span>
                <PlayCircle size={30} strokeWidth={1.6} className="text-white/70" />
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wide text-amber-300">Guide</span>
                <span className="text-[12.5px] font-bold leading-snug">{video.chapterLabel}</span>
                <span className="mt-1 rounded-full bg-white/15 px-2.5 py-1 text-center text-[11px] font-semibold">
                  Start Now
                </span>
              </div>
            </div>
          ))}
        </motion.div>
        <motion.p className="mt-2 text-[12px] font-semibold text-r-brand" {...rise(0.16)}>
          View All {activeContent.name}
        </motion.p>

        {/* Two quiet utility strips — same size/weight class, cluster
            together so neither reads as a third checklist item. */}
        <motion.div
          className="mt-5 flex items-center justify-between rounded-[14px] bg-r-sunk px-4 py-3"
          {...rise(0.2)}
        >
          <span className="flex items-center gap-2 text-[12.5px] font-semibold text-r-ink-2">
            <span className="pulse-live h-[6px] w-[6px] rounded-full bg-emerald-500" />
            Fuel For Thought — 7 quizzes pending
          </span>
          <span className="text-[12px] font-bold text-r-brand">Take quiz</span>
        </motion.div>

        <motion.button
          onClick={() => setShowInvite(true)}
          className="mt-2 flex w-full items-center justify-between rounded-[14px] bg-r-sunk px-4 py-3 text-left"
          {...rise(0.22)}
        >
          <span className="flex items-center gap-2 text-[12.5px] font-semibold text-r-ink-2">
            <Users size={14} className="text-r-ink-3" strokeWidth={2} />
            Get better together — invite your team
          </span>
          <span className="text-[12px] font-bold text-r-brand">Invite</span>
        </motion.button>

        <motion.p className="mb-2 mt-6 text-[11px] font-semibold uppercase tracking-[0.08em] text-r-ink-4" {...rise(0.26)}>
          Also in RockED
        </motion.p>
        <div className="grid grid-cols-3 gap-2">
          <DiscoverTile icon={Brain} label="Practice with AI" onClick={onOpenCoach} delay={0.28} />
          <DiscoverTile icon={Award} label="Get Certified" delay={0.3} />
          <DiscoverTile icon={MessageCircleQuestion} label="Take a Quiz" badge delay={0.32} />
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-around border-t border-r-line bg-white py-3">
        {TABS.map(({ label, icon: Icon, active }) => (
          <span key={label} className={`flex flex-col items-center gap-1 text-[11px] font-medium ${active ? "text-r-brand" : "text-r-ink-4"}`}>
            <Icon size={20} strokeWidth={active ? 2.3 : 1.9} />
            {label}
          </span>
        ))}
      </div>

      <AnimatePresence>
        {personalizing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-white"
          >
            <motion.span
              className="h-[42px] w-[42px] rounded-full border-[3px] border-r-brand-line border-t-r-brand"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-[14.5px] font-medium text-r-ink-2">
              Personalizing your profile from your dealership&rsquo;s data&hellip;
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={showInvite} onClose={() => setShowInvite(false)}>
        <p className="flex items-center gap-[7px] text-[15px] font-bold text-r-ink">
          <Users size={16} className="text-r-brand" />
          Get better together
        </p>
        <p className="mt-1 text-[12.5px] text-r-ink-3">
          Anyone on your team who joins with this link starts practicing on the same scenarios you do.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-[14px] border border-r-line bg-r-sunk p-3">
          <span className="mono min-w-0 flex-1 truncate text-[13px] text-r-ink-2">
            https://rocked.app/join/T-4F82
          </span>
          <button
            onClick={copyInviteLink}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-r-brand px-3 py-[7px] text-[12px] font-semibold text-white"
          >
            <Copy size={13} strokeWidth={2.2} />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </Sheet>
    </div>
  );
}

function DiscoverTile({
  icon: Icon,
  label,
  badge,
  onClick,
  delay,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  badge?: boolean;
  onClick?: () => void;
  delay: number;
}) {
  const Comp = onClick ? motion.button : motion.div;
  return (
    <Comp
      onClick={onClick}
      whileTap={onClick ? { scale: 0.97 } : undefined}
      className="relative flex flex-col items-center gap-1.5 rounded-[14px] bg-r-sunk p-3 text-center"
      {...rise(delay)}
    >
      {badge && <span className="absolute right-2 top-2 h-[6px] w-[6px] rounded-full bg-r-brand" />}
      <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white text-r-ink-2">
        <Icon size={15} strokeWidth={2} />
      </span>
      <span className="text-[10.5px] font-medium leading-tight text-r-ink-3">{label}</span>
    </Comp>
  );
}
