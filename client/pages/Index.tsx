import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Brain,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Command,
  Cpu,
  Download,
  Filter,
  Globe,
  Grid2X2,
  Info,
  Layers,
  Layers3,
  Layout,
  MapPin,
  MoreHorizontal,
  PanelLeft,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Settings2,
  Share2,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  COMPANIES_LIST,
  CONFLICTS,
  ConflictItem,
  DOMAINS,
  DomainInfo,
  SCHEDULE_ITEMS,
  STUDENTS_LIST,
  ScheduleItem,
} from "../data/placementData";

type ViewTab = "overview" | "schedule" | "domains" | "students" | "companies" | "settings";

const colorStyles: Record<string, string> = {
  violet: "border-l-[#9b8afb] bg-[#f5f2ff] text-[#5e4abb]",
  blue: "border-l-[#6d9efb] bg-[#eef5ff] text-[#3e6dc0]",
  orange: "border-l-[#ffab70] bg-[#fff4eb] text-[#b76128]",
  cyan: "border-l-[#5dd4dc] bg-[#ecfbfb] text-[#2b8991]",
  pink: "border-l-[#f38cb9] bg-[#fff0f6] text-[#b74c7c]",
  emerald: "border-l-[#34d399] bg-[#ecfdf5] text-[#065f46]",
  amber: "border-l-[#fbbf24] bg-[#fffbeb] text-[#92400e]",
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<ViewTab>("overview");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [activeDay, setActiveDay] = useState<number>(2);
  const [roomFilter, setRoomFilter] = useState<string>("All rooms");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showReplan, setShowReplan] = useState<boolean>(false);
  const [disruption, setDisruption] = useState<string>("Tech: Microsoft panel delayed by 30 min");
  const [isPreviewed, setIsPreviewed] = useState<boolean>(false);
  const [resolvedConflicts, setResolvedConflicts] = useState<string[]>([]);
  const [replanAppliedSuccess, setReplanAppliedSuccess] = useState<boolean>(false);
  const [apiPingStatus, setApiPingStatus] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Active domain info
  const currentDomainInfo = useMemo(() => {
    return DOMAINS.find((d) => d.id === selectedDomain) || DOMAINS[0];
  }, [selectedDomain]);

  // Dynamic schedule filtering by Domain, Day, Room, and Search
  const filteredSchedule = useMemo(() => {
    return SCHEDULE_ITEMS.filter((item) => {
      // Domain filter
      const matchesDomain = selectedDomain === "all" || item.domain === selectedDomain;
      // Day filter
      const matchesDay = item.day === activeDay;
      // Room filter
      const matchesRoom = roomFilter === "All rooms" || item.room === roomFilter;
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.company.toLowerCase().includes(q) ||
        item.student.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q) ||
        item.room.toLowerCase().includes(q) ||
        item.studentId.toLowerCase().includes(q);

      return matchesDomain && matchesDay && matchesRoom && matchesSearch;
    });
  }, [selectedDomain, activeDay, roomFilter, searchQuery]);

  // Conflicts filtered by domain and resolved state
  const activeConflicts = useMemo(() => {
    return CONFLICTS.filter((c) => {
      const matchesDomain = selectedDomain === "all" || c.domain === selectedDomain;
      const notResolved = !resolvedConflicts.includes(c.id);
      return matchesDomain && notResolved;
    });
  }, [selectedDomain, resolvedConflicts]);

  // Students filtered by domain and search
  const filteredStudents = useMemo(() => {
    return STUDENTS_LIST.filter((s) => {
      const matchesDomain = selectedDomain === "all" || s.domain === selectedDomain;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.rollNo.toLowerCase().includes(q) ||
        s.domainName.toLowerCase().includes(q) ||
        s.companies.some((c) => c.toLowerCase().includes(q));
      return matchesDomain && matchesSearch;
    });
  }, [selectedDomain, searchQuery]);

  // Companies filtered by domain and search
  const filteredCompanies = useMemo(() => {
    return COMPANIES_LIST.filter((c) => {
      const matchesDomain = selectedDomain === "all" || c.domain === selectedDomain;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.domainName.toLowerCase().includes(q) ||
        c.roles.some((r) => r.toLowerCase().includes(q));
      return matchesDomain && matchesSearch;
    });
  }, [selectedDomain, searchQuery]);

  // Dynamic available rooms based on domain
  const availableRooms = useMemo(() => {
    if (selectedDomain === "all") {
      return ["All rooms", "A-101", "A-102", "A-103", "B-201", "B-202", "B-204", "B-205", "C-301", "C-302", "D-401"];
    }
    return ["All rooms", ...currentDomainInfo.rooms];
  }, [selectedDomain, currentDomainInfo]);

  // Quick test API endpoint across host domains
  const testApiPing = async () => {
    try {
      setApiPingStatus("Testing API across current domain...");
      const res = await fetch("/api/ping");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setApiPingStatus(`Connected! Server: "${data.message}" at ${data.timestamp || "now"}`);
    } catch (err) {
      setApiPingStatus(`Offline or proxy issue: ${(err as Error).message}`);
    }
  };

  const handleResolveSingleConflict = (id: string) => {
    setResolvedConflicts((prev) => [...prev, id]);
  };

  const handleApplyReplan = () => {
    // Mark all conflicts as resolved in preview
    setResolvedConflicts(CONFLICTS.map((c) => c.id));
    setIsPreviewed(false);
    setShowReplan(false);
    setReplanAppliedSuccess(true);
    setTimeout(() => setReplanAppliedSuccess(false), 5000);
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#202338] antialiased">
      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-[260px] flex-col border-r border-[#e7e8f0] bg-white transition-transform duration-200 lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-[82px] items-center justify-between border-b border-[#eef0f5] px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6558d8] text-white shadow-lg shadow-indigo-200">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <div className="text-lg font-extrabold tracking-[-0.04em] text-[#282a40]">
                tempo<span className="text-[#7669e4]">.</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#a1a3b3]">
                Placement Ops
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-[#a1a3b3]">
          Workspace
        </div>

        <nav className="mt-3 space-y-1 px-3 text-sm font-semibold">
          <button
            onClick={() => {
              setActiveTab("overview");
              setIsMobileMenuOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
              activeTab === "overview"
                ? "bg-[#f0efff] text-[#5e50cf] shadow-sm font-bold"
                : "text-[#73768b] hover:bg-slate-50"
            }`}
          >
            <Grid2X2 size={18} />
            <span>Overview</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("schedule");
              setIsMobileMenuOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
              activeTab === "schedule"
                ? "bg-[#f0efff] text-[#5e50cf] shadow-sm font-bold"
                : "text-[#73768b] hover:bg-slate-50"
            }`}
          >
            <CalendarDays size={18} />
            <span>Schedule</span>
            <span className="ml-auto rounded-md bg-[#e7e4ff] px-2 py-0.5 text-[11px] font-bold text-[#6456d2]">
              {selectedDomain === "all" ? "842" : currentDomainInfo.totalInterviews}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("domains");
              setIsMobileMenuOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
              activeTab === "domains"
                ? "bg-[#f0efff] text-[#5e50cf] shadow-sm font-bold"
                : "text-[#73768b] hover:bg-slate-50"
            }`}
          >
            <Layers size={18} />
            <span>Domains & Tracks</span>
            <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              5 active
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("students");
              setIsMobileMenuOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
              activeTab === "students"
                ? "bg-[#f0efff] text-[#5e50cf] shadow-sm font-bold"
                : "text-[#73768b] hover:bg-slate-50"
            }`}
          >
            <Users size={18} />
            <span>Students</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("companies");
              setIsMobileMenuOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
              activeTab === "companies"
                ? "bg-[#f0efff] text-[#5e50cf] shadow-sm font-bold"
                : "text-[#73768b] hover:bg-slate-50"
            }`}
          >
            <Building2 size={18} />
            <span>Companies</span>
          </button>
        </nav>

        <div className="mt-8 px-4 text-[11px] font-bold uppercase tracking-[0.12em] text-[#a1a3b3]">
          System & Settings
        </div>
        <nav className="mt-3 space-y-1 px-3 text-sm font-semibold">
          <button
            onClick={() => {
              setActiveTab("settings");
              setIsMobileMenuOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition ${
              activeTab === "settings"
                ? "bg-[#f0efff] text-[#5e50cf] shadow-sm font-bold"
                : "text-[#73768b] hover:bg-slate-50"
            }`}
          >
            <Settings2 size={18} />
            <span>Settings & Domains</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("domains");
              setIsMobileMenuOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[#73768b] hover:bg-slate-50"
          >
            <CircleHelp size={18} />
            <span>Domain Guidelines</span>
          </button>
        </nav>

        {/* Domain Health Widget */}
        <div className="mt-auto m-4 rounded-2xl bg-[#f7f6ff] border border-[#e8e4ff] p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#5950ad]">
            <Sparkles size={15} /> All Domain Engine
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-[#85829f]">
            Managing <strong>5 tracks</strong> with automated cross-domain clash resolution.
          </p>
          <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-[#6256cf]">
            <span>Domain Health: 96.8%</span>
            <ChevronRight size={13} />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <section className="lg:pl-[260px]">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-[82px] items-center justify-between border-b border-[#e7e8f0] bg-white/95 backdrop-blur-md px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-lg p-2 text-[#8b8da0] hover:bg-slate-100 lg:hidden"
            >
              <PanelLeft size={20} />
            </button>
            <div className="relative">
              <Search className="absolute left-3.5 top-2.5 text-[#aaadba]" size={16} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-44 sm:w-72 rounded-xl border border-[#eaebf1] bg-[#fafbfe] pl-10 pr-4 text-xs font-medium outline-none transition focus:border-[#8a7dea] focus:bg-white focus:ring-2 focus:ring-indigo-100"
                placeholder="Search domain, company, student..."
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <kbd className="hidden rounded-lg border border-[#e5e6ec] bg-slate-50 px-2 py-1 text-[10px] font-semibold text-[#a0a2b0] sm:block">
              <Command size={11} className="inline mr-1" /> K
            </kbd>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/60 px-3 py-1 text-xs font-semibold text-emerald-700 md:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              All Domain Systems Live
            </div>

            <button
              onClick={() => setShowReplan(true)}
              className="relative rounded-xl p-2.5 text-[#85889c] hover:bg-slate-50 hover:text-[#5e50cf] transition"
              title="Conflict notifications"
            >
              <Bell size={19} />
              {activeConflicts.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ed6b7e] text-[9px] font-extrabold text-white ring-2 ring-white">
                  {activeConflicts.length}
                </span>
              )}
            </button>

            <div className="flex items-center gap-3 border-l border-[#ebecf2] pl-4 sm:pl-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#6558d8] to-[#9b8afb] text-xs font-extrabold text-white shadow-md shadow-indigo-100">
                SK
              </div>
              <div className="hidden text-xs sm:block">
                <div className="font-bold text-[#282a40]">Sangita K.</div>
                <div className="text-[11px] text-[#a0a2b0]">Placement Coordinator</div>
              </div>
            </div>
          </div>
        </header>

        {/* Top Domain Selection Toolbar (Always visible across all tabs) */}
        <div className="border-b border-[#e9ebf2] bg-white px-5 sm:px-8 py-3.5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#7a7d90]">
              <Globe size={15} className="text-[#6558d8]" />
              <span>Select Domain / Track:</span>
            </div>

            {/* Domain Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {DOMAINS.map((domain) => {
                const isSelected = selectedDomain === domain.id;
                return (
                  <button
                    key={domain.id}
                    onClick={() => {
                      setSelectedDomain(domain.id);
                      setRoomFilter("All rooms");
                    }}
                    className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                      isSelected
                        ? "bg-[#6558d8] text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-200"
                        : "border border-[#e7e8f1] bg-[#fafbfe] text-[#63667a] hover:bg-slate-100"
                    }`}
                  >
                    <span>{domain.shortName}</span>
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${
                        isSelected ? "bg-white/20 text-white" : "bg-[#ececf3] text-[#7a7d90]"
                      }`}
                    >
                      {domain.totalInterviews}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Replan Success Alert Banner */}
        {replanAppliedSuccess && (
          <div className="mx-5 sm:mx-8 mt-5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 shadow-sm animate-in fade-in duration-300">
            <div className="flex items-center gap-3 text-sm font-bold">
              <CheckCircle2 size={20} className="text-emerald-600" />
              <span>
                Schedule successfully replanned and synchronized across <strong>all 5 domains</strong>!
              </span>
            </div>
            <button
              onClick={() => setReplanAppliedSuccess(false)}
              className="text-xs font-semibold underline hover:text-emerald-950"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Body Container */}
        <div className="mx-auto max-w-[1440px] p-5 sm:p-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Header Hero */}
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#a0a2b0]">
                    <span className="rounded bg-[#ebe8ff] px-2 py-0.5 text-[#5e50cf] font-bold">
                      {currentDomainInfo.name}
                    </span>
                    <ChevronRight size={13} />
                    <span className="text-[#66687a]">Day {activeDay} of 4</span>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-[-0.045em] text-[#25273a] sm:text-[36px]">
                    Placement Operations · {selectedDomain === "all" ? "All Domains" : currentDomainInfo.shortName}
                  </h1>
                  <p className="mt-2 text-sm text-[#85889a]">
                    Coordinating {currentDomainInfo.companiesCount} companies & {currentDomainInfo.totalInterviews} interviews across campus.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowReplan(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#6558d8] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-[#5548c6] active:scale-95"
                  >
                    <RefreshCw size={16} /> Replan {selectedDomain === "all" ? "All Domains" : currentDomainInfo.shortName}
                  </button>
                  <button
                    onClick={() => setActiveTab("schedule")}
                    className="flex items-center gap-2 rounded-xl border border-[#e5e6ee] bg-white px-4 py-3 text-sm font-bold text-[#65687b] hover:bg-slate-50 transition"
                  >
                    <SlidersHorizontal size={16} /> Full Schedule
                  </button>
                </div>
              </div>

              {/* Dynamic Domain Metrics */}
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  icon={CalendarDays}
                  label={`Interviews (${currentDomainInfo.shortName})`}
                  value={String(currentDomainInfo.totalInterviews)}
                  sub={`${currentDomainInfo.activePanels} active panels`}
                  trend="+9.4%"
                  good
                />
                <MetricCard
                  icon={Check}
                  label="On Track Rate"
                  value={`${currentDomainInfo.onTrackPct}%`}
                  sub="Low churn & delays"
                  trend="+3.1%"
                  good
                />
                <MetricCard
                  icon={AlertTriangle}
                  label="Domain Bottlenecks"
                  value={String(activeConflicts.length).padStart(2, "0")}
                  sub={activeConflicts.length > 0 ? "Requires action" : "All resolved"}
                  trend={activeConflicts.length > 0 ? `${activeConflicts.length} active` : "Zero"}
                  good={activeConflicts.length === 0}
                />
                <MetricCard
                  icon={Clock3}
                  label="Avg. Student Wait"
                  value={currentDomainInfo.avgWaitTime}
                  sub="Target: ≤ 20 min"
                  trend="-3.5%"
                  good
                />
              </div>

              {/* Grid: Timeline Table + Right Sidebar (Conflicts & Health) */}
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                {/* Left: Domain Schedule Timeline */}
                <div className="min-w-0 rounded-2xl border border-[#e6e7ef] bg-white shadow-sm overflow-hidden">
                  {/* Timeline Header */}
                  <div className="flex flex-col justify-between gap-4 border-b border-[#eef0f4] px-6 py-5 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-extrabold tracking-[-0.02em] text-[#282a40]">
                          Domain Timeline
                        </h2>
                        <span className="rounded-md bg-[#f0efff] px-2 py-0.5 text-xs font-bold text-[#6256cf]">
                          {selectedDomain === "all" ? "All Tracks" : currentDomainInfo.name}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#979aaa]">
                        Day {activeDay} · Showing {filteredSchedule.length} active interviews
                      </p>
                    </div>

                    {/* Filter controls */}
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={roomFilter}
                        onChange={(e) => setRoomFilter(e.target.value)}
                        className="h-9 rounded-xl border border-[#e8e9ef] bg-[#fafbfe] px-3 text-xs font-bold text-[#64677b] outline-none hover:border-[#8a7dea] transition"
                      >
                        {availableRooms.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>

                      <div className="flex rounded-lg bg-[#f4f5fa] p-1">
                        {[1, 2, 3, 4].map((day) => (
                          <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`rounded-md px-3 py-1 text-xs font-bold transition ${
                              activeDay === day
                                ? "bg-white text-[#5d51cc] shadow-sm font-extrabold"
                                : "text-[#999bab] hover:text-[#5d51cc]"
                            }`}
                          >
                            Day {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Schedule Rows */}
                  <div className="overflow-x-auto">
                    <div className="min-w-[700px] p-6">
                      <div className="mb-3 grid grid-cols-[60px_80px_100px_1fr_130px_90px] gap-3 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#afb1bd]">
                        <span>Time</span>
                        <span>Room</span>
                        <span>Domain</span>
                        <span>Company & Role</span>
                        <span>Candidate</span>
                        <span>Status</span>
                      </div>

                      {filteredSchedule.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                          <p className="text-sm font-bold text-slate-600">
                            No interviews found for the selected filters.
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Try selecting "All Domains", "All rooms", or checking another Day.
                          </p>
                          <button
                            onClick={() => {
                              setSelectedDomain("all");
                              setRoomFilter("All rooms");
                              setSearchQuery("");
                            }}
                            className="mt-4 rounded-lg bg-[#6558d8] px-4 py-2 text-xs font-bold text-white"
                          >
                            Reset All Filters
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {filteredSchedule.map((item) => {
                            const domainObj = DOMAINS.find((d) => d.id === item.domain);
                            return (
                              <div
                                key={item.id}
                                className={`grid grid-cols-[60px_80px_100px_1fr_130px_90px] items-center gap-3 rounded-xl border border-[#eff0f5] border-l-4 px-4 py-3.5 transition hover:shadow-md ${
                                  colorStyles[item.color] || "border-l-indigo-400 bg-white text-slate-700"
                                }`}
                              >
                                <div className="text-xs font-extrabold text-[#3a3d52]">
                                  {item.time}
                                </div>
                                <div className="text-xs font-bold text-[#686b7e] flex items-center gap-1">
                                  <MapPin size={12} className="text-[#888ba0]" />
                                  {item.room}
                                </div>
                                <div>
                                  <span
                                    className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-extrabold ${
                                      domainObj?.bgColor || "bg-slate-100"
                                    } ${domainObj?.textColor || "text-slate-700"} border ${
                                      domainObj?.borderColor || "border-slate-200"
                                    }`}
                                  >
                                    {domainObj?.shortName || item.domain}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <div className="truncate text-xs font-extrabold text-[#282a40]">
                                    {item.company}
                                  </div>
                                  <div className="mt-0.5 truncate text-[11px] opacity-80">
                                    {item.role} · <span className="font-semibold">{item.duration}</span>
                                  </div>
                                </div>
                                <div className="min-w-0">
                                  <div className="truncate text-xs font-bold text-[#44475c]">
                                    {item.student}
                                  </div>
                                  <div className="truncate text-[10px] text-[#8e91a5]">
                                    {item.studentId}
                                  </div>
                                </div>
                                <div>
                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                                      item.status === "live"
                                        ? "bg-[#fff0dd] text-[#bf732e]"
                                        : item.status === "completed"
                                        ? "bg-[#ecfdf5] text-[#047857]"
                                        : item.status === "delayed"
                                        ? "bg-[#fff0f1] text-[#dc2626]"
                                        : "bg-white/80 text-[#727588]"
                                    }`}
                                  >
                                    {item.status === "live" && (
                                      <i className="h-1.5 w-1.5 animate-ping rounded-full bg-[#e89a4c]" />
                                    )}
                                    {item.status === "live"
                                      ? "Live"
                                      : item.status === "completed"
                                      ? "Done"
                                      : item.status === "delayed"
                                      ? "Delayed"
                                      : "Upcoming"}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <button
                        onClick={() => setActiveTab("schedule")}
                        className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#ececf5] bg-[#fafbfe] py-2.5 text-xs font-bold text-[#6256cf] hover:bg-slate-50 transition"
                      >
                        View Comprehensive Schedule Grid <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Active Domain Conflicts & Health Card */}
                <div className="space-y-6">
                  {/* Conflicts Card */}
                  <div className="rounded-2xl border border-[#e6e7ef] bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-extrabold tracking-[-0.02em] text-[#282a40]">
                          Domain Attention
                        </h2>
                        <p className="mt-1 text-xs text-[#979aaa]">
                          {selectedDomain === "all"
                            ? "Cross-domain bottlenecks"
                            : `${currentDomainInfo.shortName} track issues`}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                          activeConflicts.length > 0
                            ? "bg-[#fff0f1] text-[#dc6874]"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {activeConflicts.length} active
                      </span>
                    </div>

                    <div className="mt-5 space-y-3">
                      {activeConflicts.length === 0 ? (
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-center">
                          <CheckCircle2 size={24} className="mx-auto text-emerald-500" />
                          <p className="mt-2 text-xs font-bold text-emerald-800">
                            Zero conflicts in this domain!
                          </p>
                          <p className="mt-0.5 text-[11px] text-emerald-600">
                            All panels, rooms, and students are properly synchronized.
                          </p>
                        </div>
                      ) : (
                        activeConflicts.map((conf) => (
                          <div
                            key={conf.id}
                            className="flex flex-col gap-2 rounded-xl border border-[#f0f0f4] p-3.5 transition hover:border-[#d9d5fb]"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                                    conf.type === "critical"
                                      ? "bg-[#fff0f1] text-[#df6976]"
                                      : "bg-[#fff6e9] text-[#d88b3e]"
                                  }`}
                                >
                                  <AlertTriangle size={13} />
                                </span>
                                <span className="text-xs font-extrabold text-[#3d4053]">
                                  {conf.title}
                                </span>
                              </div>
                              <button
                                onClick={() => handleResolveSingleConflict(conf.id)}
                                className="text-[10px] font-bold text-[#6558d8] hover:underline"
                                title="Mark as resolved"
                              >
                                Resolve
                              </button>
                            </div>
                            <div className="text-[11px] leading-relaxed text-[#86899e] pl-8">
                              {conf.detail}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <button
                      onClick={() => setShowReplan(true)}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e4e1fb] bg-[#faf9ff] py-3 text-xs font-bold text-[#6256cf] hover:bg-[#f1efff] transition"
                    >
                      <Sparkles size={14} /> Smart Replan All Conflicts
                    </button>
                  </div>

                  {/* Multi-Domain Health & Utilization Card */}
                  <div className="rounded-2xl border border-[#3b3d5b] bg-[#272943] p-6 text-white shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#b9b4ff]">
                        <Zap size={15} fill="currentColor" /> Domain Efficiency
                      </div>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-[#a9a4fb]">
                        5 Domains Active
                      </span>
                    </div>

                    <div className="mt-5 flex items-end justify-between">
                      <div>
                        <div className="text-3xl font-extrabold tracking-[-0.05em]">
                          {currentDomainInfo.onTrackPct}
                          <span className="text-lg text-[#9e96f8]">%</span>
                        </div>
                        <div className="mt-1 text-[11px] text-[#a4a6bc]">
                          {currentDomainInfo.name} Performance
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-[#a4a6bc]">
                        <span className="font-bold text-white">Optimal</span>
                        <br />
                        <ArrowUpRight className="inline text-[#6dd59c]" size={14} /> 4.2% vs Day 1
                      </div>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#454660]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#8f83f4] to-[#45d4a1]"
                        style={{ width: `${currentDomainInfo.onTrackPct}%` }}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-[#a5a7be] border-t border-white/10 pt-3">
                      <div>
                        Panels: <strong className="text-white">{currentDomainInfo.activePanels}</strong>
                      </div>
                      <div>
                        Rooms: <strong className="text-white">{currentDomainInfo.rooms.length} Allocated</strong>
                      </div>
                      <div>
                        Coordinator: <strong className="text-white">{currentDomainInfo.leadCoordinator.split(" ")[0]}</strong>
                      </div>
                      <div>
                        Avg Wait: <strong className="text-white">{currentDomainInfo.avgWaitTime}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCHEDULE VIEW */}
          {activeTab === "schedule" && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#25273a]">
                    Campus Schedule Matrix
                  </h1>
                  <p className="mt-1 text-sm text-[#85889a]">
                    Cross-domain interview schedule with real-time room and panel assignments.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowReplan(true)}
                    className="flex items-center gap-2 rounded-xl bg-[#6558d8] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-100"
                  >
                    <RefreshCw size={14} /> Quick Replan
                  </button>
                </div>
              </div>

              {/* Schedule Table */}
              <div className="rounded-2xl border border-[#e6e7ef] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Day:</span>
                    {[1, 2, 3, 4].map((d) => (
                      <button
                        key={d}
                        onClick={() => setActiveDay(d)}
                        className={`rounded-lg px-3 py-1 text-xs font-bold ${
                          activeDay === d
                            ? "bg-[#6558d8] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Day {d}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500">Room:</span>
                    <select
                      value={roomFilter}
                      onChange={(e) => setRoomFilter(e.target.value)}
                      className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 outline-none"
                    >
                      {availableRooms.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="pb-3">Slot Time</th>
                        <th className="pb-3">Room</th>
                        <th className="pb-3">Domain</th>
                        <th className="pb-3">Company & Panel</th>
                        <th className="pb-3">Role & Round</th>
                        <th className="pb-3">Candidate</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredSchedule.map((item) => {
                        const dObj = DOMAINS.find((d) => d.id === item.domain);
                        return (
                          <tr key={item.id} className="hover:bg-slate-50 transition">
                            <td className="py-3.5 font-bold text-slate-800">{item.time}</td>
                            <td className="py-3.5 font-bold text-indigo-700">{item.room}</td>
                            <td className="py-3.5">
                              <span
                                className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                                  dObj?.bgColor || "bg-slate-100"
                                } ${dObj?.textColor || "text-slate-700"}`}
                              >
                                {dObj?.shortName || item.domain}
                              </span>
                            </td>
                            <td className="py-3.5">
                              <div className="font-bold text-slate-900">{item.company}</div>
                              <div className="text-[11px] text-slate-400">{item.panel}</div>
                            </td>
                            <td className="py-3.5">
                              <div className="font-semibold text-slate-700">{item.role}</div>
                              <div className="text-[11px] text-slate-400">{item.round}</div>
                            </td>
                            <td className="py-3.5">
                              <div className="font-bold text-slate-800">{item.student}</div>
                              <div className="text-[10px] text-slate-400">{item.studentId}</div>
                            </td>
                            <td className="py-3.5">
                              <span
                                className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                  item.status === "live"
                                    ? "bg-amber-100 text-amber-800"
                                    : item.status === "completed"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : item.status === "delayed"
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {item.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOMAINS & TRACKS MANAGEMENT */}
          {activeTab === "domains" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#25273a]">
                  Academic & Career Domains
                </h1>
                <p className="mt-1 text-sm text-[#85889a]">
                  Detailed breakdown of specialized tracks, panel allocations, and coordinator contacts.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {DOMAINS.filter((d) => d.id !== "all").map((domain) => {
                  const isSelected = selectedDomain === domain.id;
                  return (
                    <div
                      key={domain.id}
                      className={`rounded-2xl border p-6 transition shadow-sm hover:shadow-md ${
                        isSelected
                          ? "border-[#7b68ee] bg-[#faf9ff] ring-2 ring-indigo-200"
                          : "border-[#e6e7ef] bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold ${domain.bgColor} ${domain.textColor}`}
                          >
                            {domain.id === "tech" && <Code2 size={20} />}
                            {domain.id === "data-ai" && <Brain size={20} />}
                            {domain.id === "product" && <Layout size={20} />}
                            {domain.id === "core-eng" && <Cpu size={20} />}
                            {domain.id === "finance-consulting" && <TrendingUp size={20} />}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-900">{domain.name}</h3>
                            <div className="text-xs font-semibold text-slate-400">
                              Lead: {domain.leadCoordinator}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-xs">
                        <div>
                          <div className="text-slate-400">Scheduled:</div>
                          <div className="text-base font-extrabold text-slate-800">
                            {domain.totalInterviews}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400">On Track:</div>
                          <div className="text-base font-extrabold text-emerald-600">
                            {domain.onTrackPct}%
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400">Active Panels:</div>
                          <div className="text-sm font-bold text-slate-700">{domain.activePanels}</div>
                        </div>
                        <div>
                          <div className="text-slate-400">Companies:</div>
                          <div className="text-sm font-bold text-slate-700">
                            {domain.companiesCount}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                        <span>Rooms: {domain.rooms.join(", ")}</span>
                        <span>Wait: {domain.avgWaitTime}</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedDomain(domain.id);
                          setActiveTab("overview");
                        }}
                        className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
                      >
                        Filter Dashboard by this Domain
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: STUDENTS DIRECTORY */}
          {activeTab === "students" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#25273a]">
                  Candidate Directory
                </h1>
                <p className="mt-1 text-sm text-[#85889a]">
                  Track candidate schedules, shortlisted companies, and real-time status across all domains.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e6e7ef] bg-white p-6 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        <th className="pb-3">Candidate</th>
                        <th className="pb-3">Roll No</th>
                        <th className="pb-3">Domain</th>
                        <th className="pb-3">CGPA</th>
                        <th className="pb-3">Interviews</th>
                        <th className="pb-3">Target Companies</th>
                        <th className="pb-3">Next Slot</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((stu) => (
                        <tr key={stu.id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 font-extrabold text-slate-900">{stu.name}</td>
                          <td className="py-3.5 text-slate-500 font-mono">{stu.rollNo}</td>
                          <td className="py-3.5 font-semibold text-[#6558d8]">{stu.domainName}</td>
                          <td className="py-3.5 font-bold text-slate-700">{stu.cgpa}</td>
                          <td className="py-3.5 font-bold">{stu.interviewsCount} slots</td>
                          <td className="py-3.5 text-slate-600">{stu.companies.join(", ")}</td>
                          <td className="py-3.5 font-medium text-slate-700">
                            {stu.nextSlot} ({stu.nextRoom})
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                stu.status === "Interviewing"
                                  ? "bg-amber-100 text-amber-800"
                                  : stu.status === "Placed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-indigo-100 text-indigo-800"
                              }`}
                            >
                              {stu.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COMPANIES DIRECTORY */}
          {activeTab === "companies" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#25273a]">
                  Recruiting Companies
                </h1>
                <p className="mt-1 text-sm text-[#85889a]">
                  Hiring partners, panel arrangements, and assigned campus interview rooms.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredCompanies.map((comp) => (
                  <div
                    key={comp.id}
                    className="rounded-2xl border border-[#e6e7ef] bg-white p-6 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900">{comp.name}</h3>
                        <div className="text-xs font-semibold text-[#6558d8]">
                          {comp.domainName}
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        {comp.packageRange}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1 text-xs text-slate-600">
                      <div className="font-semibold text-slate-800">Roles Offered:</div>
                      <div className="text-slate-500">{comp.roles.join(" · ")}</div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs">
                      <div>
                        <span className="text-slate-400">Panels:</span>{" "}
                        <strong>{comp.activePanels} Active</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Target:</span>{" "}
                        <strong>{comp.hiringTarget} hires</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Rooms:</span>{" "}
                        <strong>{comp.assignedRooms.join(", ")}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Scheduled:</span>{" "}
                        <strong>{comp.interviewsScheduled}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS & HOST MULTI-DOMAIN DIAGNOSTICS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-[#25273a]">
                  System & Multi-Domain Settings
                </h1>
                <p className="mt-1 text-sm text-[#85889a]">
                  Network configuration, host headers, CORS diagnostics, and domain synchronizer.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e6e7ef] bg-white p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900">Host & Network Binding</h3>
                    <p className="text-xs text-slate-500">
                      Vite server binds to <code>0.0.0.0</code> with <code>allowedHosts: true</code>.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    All Hosts Allowed
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900">CORS & Domain Origin Policy</h3>
                    <p className="text-xs text-slate-500">
                      Server accepts requests from any origin domain with full credentials.
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    Origin: True
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900">Live API Endpoint Ping Test</h3>
                    <p className="text-xs text-slate-500">
                      Verify `/api/ping` endpoint connectivity from the current browser domain.
                    </p>
                    {apiPingStatus && (
                      <div className="mt-2 text-xs font-mono font-bold text-[#6558d8]">
                        {apiPingStatus}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={testApiPing}
                    className="rounded-xl bg-[#6558d8] px-4 py-2 text-xs font-bold text-white hover:bg-[#5346c7]"
                  >
                    Test /api/ping
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">Reset Placement Data & Conflicts</h3>
                    <p className="text-xs text-slate-500">
                      Restore default mock conflicts and schedule allocations across all domains.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setResolvedConflicts([]);
                      setSelectedDomain("all");
                      setReplanAppliedSuccess(false);
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Reset Defaults
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SMART REPLAN MODAL (Domain-Aware) */}
      {showReplan && (
        <div className="fixed inset-0 z-50 flex items-end justify-end bg-[#202338]/30 backdrop-blur-[2px] sm:items-stretch">
          <div className="w-full max-w-[480px] overflow-y-auto bg-white p-6 shadow-2xl sm:p-8 flex flex-col">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#6558d8]">
                  <Sparkles size={15} /> Smart Domain Replan
                </div>
                <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">
                  Schedule Adjustment
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#888b9d]">
                  Select the disruption scenario to compute a zero-churn localized adjustment.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowReplan(false);
                  setIsPreviewed(false);
                }}
                className="rounded-lg p-2 text-[#9da0af] hover:bg-slate-50"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-7 space-y-2.5">
              {[
                "Tech: Microsoft panel delayed by 30 min",
                "Product: Zepto Panel 2 dropped out",
                "Finance: Room B-204 unavailable at 11:15",
                "Core: Tata Motors transit delay",
                "Candidate withdraws: Arjun Mehta (Cross-Domain)",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setDisruption(item);
                    setIsPreviewed(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left text-xs font-bold transition ${
                    disruption === item
                      ? "border-[#bcb5f4] bg-[#f7f5ff] text-[#5548c5]"
                      : "border-[#eaebf1] text-[#696b7e] hover:bg-slate-50"
                  }`}
                >
                  <span>{item}</span>
                  <span
                    className={`h-4 w-4 rounded-full border-2 ${
                      disruption === item
                        ? "border-[#6b5dde] bg-[#6b5dde] ring-2 ring-[#dcd8ff]"
                        : "border-[#d6d7df]"
                    }`}
                  />
                </button>
              ))}
            </div>

            {!isPreviewed ? (
              <div className="mt-6 space-y-6">
                <div className="rounded-xl bg-[#fafafd] border border-slate-100 p-4">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#9da0af]">
                    Target Domain Scope
                  </label>
                  <div className="mt-2 flex items-center justify-between rounded-lg border border-[#e7e8ef] bg-white px-3 py-2.5 text-xs font-bold text-[#55586d]">
                    <span>
                      {disruption.includes("Tech")
                        ? "Software & Tech Domain"
                        : disruption.includes("Product")
                        ? "Product & UI/UX Domain"
                        : disruption.includes("Finance")
                        ? "Finance & Advisory Domain"
                        : disruption.includes("Core")
                        ? "Core Engineering Domain"
                        : "Cross-Domain Impact"}
                    </span>
                    <ChevronDown size={15} className="text-[#999bab]" />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#8d8fa0]">
                  <Info size={15} className="text-[#7569df]" /> Churn budget:{" "}
                  <b className="text-[#55586d]">≤ 3.5% across domains</b>
                </div>

                <button
                  onClick={() => setIsPreviewed(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6558d8] py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-[#5446c9] transition"
                >
                  <Play size={15} fill="currentColor" /> Preview Domain Realignment
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-[#d4f0e0] bg-[#f2fcf6] p-4">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#278156]">
                    <Check size={17} /> Feasible Realignment Found
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#62907a]">
                    Cross-domain optimizer shifted slots into available rooms without disturbing unlinked interviews.
                  </p>
                </div>

                <div className="space-y-2">
                  <DiffRow label="Rescheduled Slots" value="4 interviews" color="purple" />
                  <DiffRow label="Room Swaps" value="2 rooms (A-104, B-205)" color="orange" />
                  <DiffRow label="Cross-Domain Clashes" value="0 remaining" color="purple" />
                  <DiffRow label="Notified Students" value="6 candidates" color="orange" />
                </div>

                <div className="rounded-xl bg-[#272943] p-4 text-xs text-[#b5b6ca]">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Clock3 size={14} /> Estimated Execution Time
                  </div>
                  <div className="mt-1.5">
                    1 min 20 sec · Overall churn impact{" "}
                    <span className="font-bold text-[#86dca9]">0.6%</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3 pt-2">
                  <button
                    onClick={() => setIsPreviewed(false)}
                    className="flex-1 rounded-xl border border-[#e5e6ee] py-3 text-xs font-bold text-[#77798c] hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleApplyReplan}
                    className="flex-1 rounded-xl bg-[#6558d8] py-3 text-xs font-bold text-white shadow-lg shadow-indigo-100 hover:bg-[#5446c9]"
                  >
                    Apply Replan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  good = false,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  sub: string;
  trend: string;
  good?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#e6e7ef] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1efff] text-[#6e62d8]">
          <Icon size={18} />
        </div>
        <span
          className={`flex items-center gap-0.5 text-[10px] font-bold ${
            good ? "text-[#4bb880]" : "text-[#df8a45]"
          }`}
        >
          {good ? <ArrowUpRight size={13} /> : <AlertTriangle size={12} />}
          {trend}
        </span>
      </div>
      <div className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-[#292b40]">
        {value}
      </div>
      <div className="mt-1 text-xs font-bold text-[#65687b]">{label}</div>
      <div className="mt-0.5 text-[11px] text-[#a0a2af]">{sub}</div>
    </div>
  );
}

function DiffRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#f0f0f4] px-3.5 py-2.5">
      <span className="flex items-center gap-2 text-xs font-semibold text-[#85889a]">
        <span
          className={`h-2 w-2 rounded-full ${
            color === "purple" ? "bg-[#8678e9]" : color === "orange" ? "bg-[#eda15c]" : "bg-[#b8bac4]"
          }`}
        />
        {label}
      </span>
      <span className="text-xs font-extrabold text-[#55586d]">{value}</span>
    </div>
  );
}
