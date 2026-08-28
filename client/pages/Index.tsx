import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Command,
  Filter,
  Grid2X2,
  Info,
  Layers3,
  MapPin,
  MoreHorizontal,
  PanelLeft,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings2,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";

const schedule = [
  { time: "09:00", room: "A-101", company: "Zepto", role: "Product Analyst", student: "Ananya S.", duration: "45 min", color: "violet", status: "live" },
  { time: "09:00", room: "A-102", company: "Razorpay", role: "Backend Engineer", student: "Karthik R.", duration: "60 min", color: "blue", status: "soon" },
  { time: "09:15", room: "B-204", company: "Deloitte", role: "Business Analyst", student: "Meera P.", duration: "45 min", color: "orange", status: "soon" },
  { time: "09:30", room: "A-103", company: "Microsoft", role: "SDE — New Grad", student: "Rohan M.", duration: "60 min", color: "cyan", status: "soon" },
  { time: "09:45", room: "B-201", company: "Flipkart", role: "Data Scientist", student: "Ishita K.", duration: "45 min", color: "pink", status: "soon" },
];

const conflicts = [
  { title: "Student double-booked", detail: "Arjun Mehta · Razorpay / Microsoft · 10:30", type: "critical", icon: Users },
  { title: "Room unavailable", detail: "B-204 · Deloitte interview at 11:15", type: "warning", icon: MapPin },
  { title: "Panel capacity reduced", detail: "Zepto · Panel 2 dropped out", type: "warning", icon: Layers3 },
];

const colors: Record<string, string> = {
  violet: "border-l-[#9b8afb] bg-[#f2efff] text-[#5e4abb]",
  blue: "border-l-[#6d9efb] bg-[#eef5ff] text-[#3e6dc0]",
  orange: "border-l-[#ffab70] bg-[#fff4eb] text-[#b76128]",
  cyan: "border-l-[#5dd4dc] bg-[#ecfbfb] text-[#2b8991]",
  pink: "border-l-[#f38cb9] bg-[#fff0f6] text-[#b74c7c]",
};

export default function Index() {
  const [activeDay, setActiveDay] = useState(2);
  const [filter, setFilter] = useState("All rooms");
  const [showReplan, setShowReplan] = useState(false);
  const [disruption, setDisruption] = useState("Company arrives late");
  const [isPreviewed, setIsPreviewed] = useState(false);

  const visibleSchedule = useMemo(() => filter === "All rooms" ? schedule : schedule.filter((item) => item.room === filter), [filter]);

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-[#202338] antialiased">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[242px] flex-col border-r border-[#e7e8f0] bg-white lg:flex">
        <div className="flex h-[82px] items-center gap-3 border-b border-[#eef0f5] px-7">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6657d9] text-white shadow-lg shadow-indigo-200"><Zap size={19} fill="currentColor" /></div>
          <div><div className="font-extrabold tracking-[-0.04em] text-[#282a40]">tempo<span className="text-[#7669e4]">.</span></div><div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a1a3b3]">Placement ops</div></div>
        </div>
        <div className="px-4 pt-7 text-[11px] font-bold uppercase tracking-[0.12em] text-[#a1a3b3]">Workspace</div>
        <nav className="mt-3 space-y-1 px-3 text-sm font-semibold">
          <button className="flex w-full items-center gap-3 rounded-xl bg-[#f0efff] px-4 py-3 text-[#5e50cf]"><Grid2X2 size={18} /> Overview</button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[#73768b] hover:bg-slate-50"><CalendarDays size={18} /> Schedule <span className="ml-auto rounded-md bg-[#e7e4ff] px-2 py-0.5 text-[10px] text-[#6456d2]">842</span></button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[#73768b] hover:bg-slate-50"><Users size={18} /> Students</button>
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[#73768b] hover:bg-slate-50"><Layers3 size={18} /> Companies</button>
        </nav>
        <div className="mt-9 px-4 text-[11px] font-bold uppercase tracking-[0.12em] text-[#a1a3b3]">Manage</div>
        <nav className="mt-3 space-y-1 px-3 text-sm font-semibold"><button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[#73768b] hover:bg-slate-50"><Settings2 size={18} /> Settings</button><button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[#73768b] hover:bg-slate-50"><CircleHelp size={18} /> Help center</button></nav>
        <div className="mt-auto m-4 rounded-2xl bg-[#f7f6ff] p-4"><div className="flex items-center gap-2 text-xs font-bold text-[#5950ad]"><Sparkles size={15} /> Smart scheduling</div><p className="mt-2 text-[11px] leading-relaxed text-[#85829f]">Your schedule is 94% optimized for minimal student wait time.</p><button className="mt-3 text-[11px] font-bold text-[#6256cf]">View insights <ChevronRight className="inline" size={13} /></button></div>
      </aside>

      <section className="lg:pl-[242px]">
        <header className="flex h-[82px] items-center justify-between border-b border-[#e7e8f0] bg-white px-5 sm:px-8"><div className="flex items-center gap-4"><button className="rounded-lg p-2 text-[#8b8da0] lg:hidden"><PanelLeft size={20} /></button><div className="relative hidden sm:block"><Search className="absolute left-3 top-2.5 text-[#aaadba]" size={16} /><input className="h-9 w-56 rounded-lg border border-[#eaebf1] bg-[#fafbfe] pl-9 pr-3 text-xs outline-none focus:border-[#8a7dea]" placeholder="Search anything..." /></div><kbd className="hidden rounded-md border border-[#e5e6ec] px-2 py-1 text-[10px] text-[#a0a2b0] sm:block"><Command size={11} className="inline" /> K</kbd></div><div className="flex items-center gap-5"><div className="hidden items-center gap-2 text-xs font-semibold text-[#9699aa] sm:flex"><span className="h-2 w-2 rounded-full bg-[#45c68a]" /> All systems operational</div><button className="relative text-[#85889c]"><Bell size={19} /><span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#ed6b7e] ring-2 ring-white" /></button><div className="flex items-center gap-2 border-l border-[#ebecf2] pl-5"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6c9a9] text-xs font-bold text-[#8d5539]">SK</div><div className="hidden text-xs sm:block"><div className="font-bold">Sangita K.</div><div className="text-[#a0a2b0]">Coordinator</div></div><ChevronDown size={14} className="text-[#a0a2b0]" /></div></div></header>

        <div className="mx-auto max-w-[1440px] p-5 sm:p-8">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#a0a2b0]"><span>Placement week</span><ChevronRight size={13} /><span className="text-[#66687a]">Day {activeDay} of 4</span></div><h1 className="text-3xl font-extrabold tracking-[-0.045em] text-[#25273a] sm:text-[36px]">Good morning, Sangita <span className="text-[#8d84df]">.</span></h1><p className="mt-2 text-sm text-[#85889a]">Here’s what’s happening across campus today.</p></div><div className="flex gap-3"><button onClick={() => setShowReplan(true)} className="flex items-center justify-center gap-2 rounded-xl bg-[#6558d8] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-[#5548c6]"><RefreshCw size={16} /> Replan schedule</button><button className="rounded-xl border border-[#e5e6ee] bg-white p-3 text-[#7e8193] hover:bg-slate-50"><MoreHorizontal size={18} /></button></div></div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={CalendarDays} label="Interviews today" value="842" sub="of 856 scheduled" trend="+8.2%" good /><Metric icon={Check} label="On track" value="94.6%" sub="797 interviews" trend="+2.4%" good /><Metric icon={AlertTriangle} label="Needs attention" value="03" sub="active conflicts" trend="2 critical" /><Metric icon={Clock3} label="Avg. wait time" value="18 min" sub="student experience" trend="-4.1%" good /></div>

          <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 rounded-2xl border border-[#e6e7ef] bg-white shadow-sm"><div className="flex flex-col justify-between gap-4 border-b border-[#eef0f4] px-5 py-5 sm:flex-row sm:items-center"><div><h2 className="font-extrabold tracking-[-0.02em]">Today’s timeline</h2><p className="mt-1 text-xs text-[#979aaa]">Tuesday, 14 May 2024 · 842 interviews</p></div><div className="flex items-center gap-2"><select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-9 rounded-lg border border-[#e8e9ef] bg-white px-3 text-xs font-semibold text-[#77798c] outline-none"><option>All rooms</option><option>A-101</option><option>A-102</option><option>B-204</option></select><button className="flex h-9 items-center gap-2 rounded-lg border border-[#e8e9ef] px-3 text-xs font-semibold text-[#77798c]"><Filter size={14} /> Filter</button></div></div><div className="flex gap-2 border-b border-[#eef0f4] px-5 py-4"><div className="flex rounded-lg bg-[#f6f6fa] p-1">{[1,2,3,4].map(day => <button key={day} onClick={() => setActiveDay(day)} className={`rounded-md px-4 py-1.5 text-xs font-bold transition ${activeDay === day ? "bg-white text-[#5d51cc] shadow-sm" : "text-[#999bab]"}`}>Day {day}</button>)}</div><div className="ml-auto hidden items-center gap-4 text-[11px] font-semibold text-[#a1a3b0] sm:flex"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#51ca8d]" /> Completed</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-[#f2a55f]" /> In progress</span></div></div><div className="overflow-x-auto"><div className="min-w-[650px] p-5"><div className="mb-3 grid grid-cols-[54px_78px_1fr_110px_78px] gap-3 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#afb1bd]"><span>Time</span><span>Room</span><span>Interview</span><span>Student</span><span>Status</span></div><div className="space-y-2">{visibleSchedule.map((item) => <div key={item.time + item.room} className={`grid grid-cols-[54px_78px_1fr_110px_78px] items-center gap-3 rounded-xl border border-[#eff0f5] border-l-[3px] px-3 py-3 transition hover:shadow-sm ${colors[item.color]}`}><div className="text-xs font-bold text-[#5d6073]">{item.time}</div><div className="text-xs font-bold text-[#76798b]">{item.room}</div><div className="min-w-0"><div className="truncate text-xs font-extrabold">{item.company}</div><div className="mt-0.5 truncate text-[11px] opacity-75">{item.role} · {item.duration}</div></div><div className="truncate text-xs font-semibold text-[#626578]">{item.student}</div><div><span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold ${item.status === "live" ? "bg-[#fff0dd] text-[#bf732e]" : "bg-white/70 text-[#999aaa]"}`}>{item.status === "live" && <i className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e89a4c]" />}{item.status === "live" ? "Live" : "Upcoming"}</span></div></div>)}</div><button className="mt-4 flex w-full items-center justify-center gap-1 py-2 text-xs font-bold text-[#6e62d7]">View full schedule <ChevronRight size={14} /></button></div></div></div>

            <div className="space-y-6"><div className="rounded-2xl border border-[#e6e7ef] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-extrabold tracking-[-0.02em]">Needs attention</h2><p className="mt-1 text-xs text-[#979aaa]">Resolve before 10:30 AM</p></div><span className="rounded-full bg-[#fff0f1] px-2.5 py-1 text-[10px] font-extrabold text-[#dc6874]">3 active</span></div><div className="mt-5 space-y-3">{conflicts.map(({ title, detail, type, icon: Icon }) => <div key={title} className="flex gap-3 rounded-xl border border-[#f0f0f4] p-3"><div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${type === "critical" ? "bg-[#fff0f1] text-[#df6976]" : "bg-[#fff6e9] text-[#d88b3e]"}`}><Icon size={14} /></div><div className="min-w-0"><div className="text-xs font-bold text-[#4d4f62]">{title}</div><div className="mt-1 text-[11px] leading-relaxed text-[#999aaa]">{detail}</div></div><ChevronRight size={14} className="ml-auto mt-1 shrink-0 text-[#b1b3bf]" /></div>)}</div><button onClick={() => setShowReplan(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#e4e1fb] bg-[#faf9ff] py-2.5 text-xs font-bold text-[#6256cf]"><Sparkles size={14} /> Resolve with smart replan</button></div><div className="rounded-2xl border border-[#e6e7ef] bg-[#272943] p-5 text-white shadow-sm"><div className="flex items-center gap-2 text-xs font-bold text-[#b9b4ff]"><Zap size={15} fill="currentColor" /> Schedule health</div><div className="mt-4 flex items-end justify-between"><div><div className="text-3xl font-extrabold tracking-[-0.05em]">94.6<span className="text-lg">%</span></div><div className="mt-1 text-[11px] text-[#a4a6bc]">Overall efficiency score</div></div><div className="text-right text-[11px] text-[#a4a6bc]">Excellent<br /><ArrowUpRight className="inline text-[#6dd59c]" size={14} /> 3.8%</div></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#454660]"><div className="h-full w-[94.6%] rounded-full bg-gradient-to-r from-[#8f83f4] to-[#b3aaff]" /></div><div className="mt-3 flex justify-between text-[10px] text-[#8f91a9]"><span>Room utilization 87%</span><span>Panel utilization 92%</span></div></div></div>
          </div>
        </div>
      </section>

      {showReplan && <div className="fixed inset-0 z-50 flex items-end justify-end bg-[#202338]/20 backdrop-blur-[2px] sm:items-stretch"><div className="w-full max-w-[460px] overflow-y-auto bg-white p-6 shadow-2xl sm:p-8"><div className="flex items-start justify-between"><div><div className="flex items-center gap-2 text-xs font-bold text-[#6558d8]"><Sparkles size={15} /> Smart replan</div><h2 className="mt-3 text-2xl font-extrabold tracking-[-0.04em]">What changed?</h2><p className="mt-2 text-sm leading-relaxed text-[#888b9d]">Select a disruption to preview the smallest possible schedule adjustment.</p></div><button onClick={() => {setShowReplan(false); setIsPreviewed(false)}} className="rounded-lg p-2 text-[#9da0af] hover:bg-slate-50"><X size={19} /></button></div><div className="mt-8 space-y-2">{["Company arrives late", "Panel drops out", "Student withdraws", "Room unavailable"].map(item => <button key={item} onClick={() => {setDisruption(item); setIsPreviewed(false)}} className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm font-bold transition ${disruption === item ? "border-[#bcb5f4] bg-[#f7f5ff] text-[#5548c5]" : "border-[#eaebf1] text-[#696b7e] hover:bg-slate-50"}`}>{item}<span className={`h-4 w-4 rounded-full border-2 ${disruption === item ? "border-[#6b5dde] bg-[#6b5dde] ring-2 ring-[#dcd8ff]" : "border-[#d6d7df]"}`} /></button>)}</div>{!isPreviewed ? <><div className="mt-6 rounded-xl bg-[#fafafd] p-4"><label className="text-[11px] font-bold uppercase tracking-wider text-[#9da0af]">Affected target</label><div className="mt-3 flex items-center justify-between rounded-lg border border-[#e7e8ef] bg-white px-3 py-3 text-sm font-bold text-[#55586d]">{disruption === "Room unavailable" ? "Room B-204" : disruption === "Student withdraws" ? "Arjun Mehta" : disruption === "Panel drops out" ? "Zepto · Panel 2" : "Razorpay"}<ChevronDown size={15} className="text-[#999bab]" /></div></div><div className="mt-6 flex items-center gap-2 text-xs text-[#8d8fa0]"><Info size={15} className="text-[#7569df]" /> Churn budget: <b className="text-[#55586d]">≤ 5% of affected interviews</b></div><button onClick={() => setIsPreviewed(true)} className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6558d8] py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-100"><Play size={15} fill="currentColor" /> Preview changes</button></> : <div className="mt-7"><div className="rounded-xl border border-[#d4f0e0] bg-[#f2fcf6] p-4"><div className="flex items-center gap-2 text-sm font-extrabold text-[#278156]"><Check size={17} /> Preview is feasible</div><p className="mt-2 text-xs leading-relaxed text-[#62907a]">The schedule engine found a localized adjustment without disturbing unrelated interviews.</p></div><div className="mt-5 space-y-3"><DiffRow label="Moved" value="8 interviews" color="purple" /><DiffRow label="Cancelled" value="0 interviews" color="gray" /><DiffRow label="Need notifying" value="12 people" color="orange" /></div><div className="mt-5 rounded-xl bg-[#272943] p-4 text-xs text-[#b5b6ca]"><div className="flex items-center gap-2 font-bold text-white"><Clock3 size={14} /> Estimated completion</div><div className="mt-2">2 min · Churn impact <span className="font-bold text-[#86dca9]">0.9%</span></div></div><div className="mt-7 flex gap-3"><button onClick={() => setIsPreviewed(false)} className="flex-1 rounded-xl border border-[#e5e6ee] py-3 text-sm font-bold text-[#77798c]">Discard</button><button onClick={() => setShowReplan(false)} className="flex-1 rounded-xl bg-[#6558d8] py-3 text-sm font-bold text-white">Apply replan</button></div></div>}</div></div>}
    </main>
  );
}

function Metric({ icon: Icon, label, value, sub, trend, good = false }: { icon: typeof CalendarDays; label: string; value: string; sub: string; trend: string; good?: boolean }) { return <div className="rounded-2xl border border-[#e6e7ef] bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f1efff] text-[#6e62d8]"><Icon size={17} /></div><span className={`flex items-center gap-0.5 text-[10px] font-bold ${good ? "text-[#4bb880]" : "text-[#df8a45]"}`}>{good ? <ArrowUpRight size={13} /> : <AlertTriangle size={12} />}{trend}</span></div><div className="mt-4 text-2xl font-extrabold tracking-[-0.04em] text-[#292b40]">{value}</div><div className="mt-1 text-xs font-bold text-[#65687b]">{label}</div><div className="mt-1 text-[11px] text-[#a0a2af]">{sub}</div></div> }
function DiffRow({ label, value, color }: { label: string; value: string; color: string }) { return <div className="flex items-center justify-between rounded-lg border border-[#f0f0f4] px-3 py-3"><span className="flex items-center gap-2 text-xs font-semibold text-[#85889a]"><span className={`h-2 w-2 rounded-full ${color === "purple" ? "bg-[#8678e9]" : color === "orange" ? "bg-[#eda15c]" : "bg-[#b8bac4]"}`} />{label}</span><span className="text-xs font-extrabold text-[#55586d]">{value}</span></div> }
