import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Clapperboard,
  Film,
  AlertCircle,
  Play,
  Globe,
  Zap,
  Trophy,
  ShoppingBag,
  PenTool,
  Tv,
  Shirt,
  BookOpen,
  Trash,
  X,
  SkipForward,
  Gavel,
  BarChart3,
  Activity,
  UserCheck,
  UserX,
  Calendar,
  Clock,
  Scissors,
  CheckCircle,
  Plus,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Copyright,
} from "lucide-react";

// --- SAVE SYSTEM ---
const SAVE_KEY = "hollywood_big_boss_v28_final_fix";

// --- SAFE MATH UTILS ---
const safeNum = (val) => {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
};

const FormatMoney = ({ amount }) => {
  const val = safeNum(amount);
  const formatted = Math.floor(val).toLocaleString();
  return (
    <span
      className={`font-mono tracking-tight font-bold ${
        val < 0 ? "text-red-400" : "text-emerald-400"
      }`}
    >
      ${formatted}
    </span>
  );
};

// --- ENHANCED UI COMPONENTS ---

const StatBar = ({ label, value, max = 100, color = "bg-blue-500" }) => (
  <div className="w-full group">
    <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium tracking-wide uppercase">
      <span className="group-hover:text-white transition-colors duration-300">
        {label}
      </span>
      <span className="font-mono text-white">{safeNum(value).toFixed(1)}</span>
    </div>
    <div className="h-2 bg-slate-950/50 rounded-full overflow-hidden border border-white/5 backdrop-blur-sm">
      <div
        className={`h-full ${color} shadow-[0_0_12px_currentColor] transition-all duration-1000 ease-out`}
        style={{ width: `${Math.min(100, (safeNum(value) / max) * 100)}%` }}
      />
    </div>
  </div>
);

const Card = ({ children, className = "", onClick, selected, disabled }) => (
  <div
    onClick={!disabled ? onClick : undefined}
    className={`
      relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 group
      ${
        disabled
          ? "opacity-50 cursor-not-allowed border-slate-800 bg-slate-900/20"
          : "cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/10 hover:border-slate-500/50"
      }
      ${
        selected
          ? "border-yellow-500/80 bg-slate-800/80 shadow-[0_0_25px_rgba(234,179,8,0.1)] ring-1 ring-yellow-500/50"
          : "border-white/5 bg-slate-800/40 backdrop-blur-md"
      } 
      ${className}
    `}
  >
    {selected && (
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-500/20 via-yellow-500/5 to-transparent -mr-8 -mt-8 rounded-bl-full" />
    )}
    {children}
  </div>
);

const Button = ({
  children,
  onClick,
  disabled,
  variant = "primary",
  className = "",
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-yellow-600 to-yellow-500 text-black shadow-lg shadow-yellow-900/20 hover:from-yellow-500 hover:to-yellow-400 hover:shadow-yellow-500/40 border-t border-white/20",
    secondary:
      "bg-slate-800/50 text-white border border-white/10 hover:bg-slate-700/50 hover:border-white/20 hover:text-white shadow-lg backdrop-blur-sm",
    danger:
      "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-900/20 hover:from-red-500 hover:to-red-400 border-t border-white/10",
    success:
      "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-900/20 hover:from-emerald-500 hover:to-emerald-400 border-t border-white/20",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-xl font-bold text-sm tracking-wide uppercase transition-all duration-200 active:scale-95 flex items-center justify-center gap-2
        ${variants[variant]} 
        ${disabled ? "opacity-50 grayscale cursor-not-allowed" : ""} 
        ${className}
      `}
    >
      {children}
    </button>
  );
};

const Modal = ({ title, children, onClose, isOpen }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative ring-1 ring-white/5 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase tracking-tight">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

// --- DATA ---

const GENRES = [
  { id: "action", name: "Action", costMod: 1.5, audienceMod: 1.2 },
  { id: "drama", name: "Drama", costMod: 0.8, audienceMod: 0.9 },
  { id: "comedy", name: "Komedi", costMod: 1.0, audienceMod: 1.1 },
  { id: "horror", name: "Skräck", costMod: 0.6, audienceMod: 0.8 },
  { id: "scifi", name: "Sci-Fi", costMod: 1.8, audienceMod: 1.3 },
];

const CLASSIC_MOVIES = [
  {
    id: "gf",
    title: "The Godfather",
    genre: "drama",
    cost: 25000000,
    hype: 40,
  },
  { id: "sw", title: "Star Wars", genre: "scifi", cost: 40000000, hype: 50 },
  { id: "jw", title: "Jaws", genre: "horror", cost: 15000000, hype: 35 },
  {
    id: "pf",
    title: "Pulp Fiction",
    genre: "action",
    cost: 12000000,
    hype: 30,
  },
  { id: "tt", title: "Titanic", genre: "drama", cost: 30000000, hype: 45 },
  { id: "et", title: "E.T.", genre: "scifi", cost: 20000000, hype: 35 },
  { id: "psy", title: "Psycho", genre: "horror", cost: 8000000, hype: 25 },
  { id: "gf2", title: "The Matrix", genre: "scifi", cost: 22000000, hype: 35 },
];

const TRAITS = [
  {
    id: "diva",
    name: "Diva",
    desc: "Hög Fame, men skapar konflikter.",
    cost: 1.2,
    conflict: 5,
  },
  {
    id: "pro",
    name: "Proffs",
    desc: "Stabil, minskar risk för förseningar.",
    cost: 1.1,
    conflict: -2,
  },
  {
    id: "visionary",
    name: "Visionär",
    desc: "Dyr kvalitet",
    cost: 1.3,
    conflict: 2,
  },
  { id: "humble", name: "Ödmjuk", desc: "Bra kemi", cost: 0.8, conflict: -5 },
  { id: "hack", name: "Medelmåtta", desc: "Billig", cost: 0.5, conflict: 0 },
];

const UPGRADES_DATA = [
  {
    id: "vfx",
    name: "VFX Studio",
    baseCost: 10000000,
    desc: "Minskar kostnad för Action/Sci-Fi",
    icon: <Zap size={16} />,
    maxLevel: 5,
  },
  {
    id: "pr",
    name: "PR-Team",
    baseCost: 5000000,
    desc: "Ökar start-hype för filmer",
    icon: <Star size={16} />,
    maxLevel: 5,
  },
  {
    id: "scouts",
    name: "Scouter",
    baseCost: 8000000,
    desc: "Bättre talanger i poolen",
    icon: <Users size={16} />,
    maxLevel: 3,
  },
  {
    id: "merch",
    name: "Merch",
    baseCost: 15000000,
    desc: "Ökar intäkter från merchandise",
    icon: <Shirt size={16} />,
    maxLevel: 3,
  },
];

const REAL_STUDIOS = [
  { name: "Walt Disney Studios", share: 24, color: "bg-indigo-600" },
  { name: "Warner Bros.", share: 18, color: "bg-blue-600" },
  { name: "Universal Pictures", share: 16, color: "bg-emerald-600" },
  { name: "Sony Pictures", share: 12, color: "bg-slate-500" },
  { name: "Paramount", share: 10, color: "bg-sky-500" },
  { name: "Lionsgate", share: 6, color: "bg-orange-600" },
  { name: "A24", share: 4, color: "bg-slate-200 text-black" },
];

const REAL_DIRECTORS_LIST = [
  "Steven Spielberg",
  "Christopher Nolan",
  "Martin Scorsese",
  "Quentin Tarantino",
  "Greta Gerwig",
  "James Cameron",
  "Ridley Scott",
  "Sofia Coppola",
  "Denis Villeneuve",
  "Wes Anderson",
  "David Fincher",
  "Spike Lee",
  "Kathryn Bigelow",
  "Peter Jackson",
  "Tim Burton",
];

const REAL_ACTORS_LIST = [
  "Leonardo DiCaprio",
  "Meryl Streep",
  "Tom Cruise",
  "Denzel Washington",
  "Brad Pitt",
  "Margot Robbie",
  "Florence Pugh",
  "Robert De Niro",
  "Scarlett Johansson",
  "Viola Davis",
  "Dwayne Johnson",
  "Timothée Chalamet",
  "Zendaya",
  "Joaquin Phoenix",
  "Emma Stone",
  "Keanu Reeves",
  "Robert Downey Jr.",
  "Chris Hemsworth",
  "Jennifer Lawrence",
  "Ryan Gosling",
  "Anne Hathaway",
  "Will Smith",
  "Samuel L. Jackson",
  "Morgan Freeman",
  "Natalie Portman",
  "Charlize Theron",
  "Johnny Depp",
  "Angelina Jolie",
  "Christian Bale",
  "Cate Blanchett",
  "Tom Hanks",
  "Julia Roberts",
  "Harrison Ford",
  "Al Pacino",
  "Alexander Skarsgård",
  "Alicia Vikander",
  "Mads Mikkelsen",
  "Cillian Murphy",
  "Emily Blunt",
  "Adam Driver",
  "Austin Butler",
  "Jenna Ortega",
  "Pedro Pascal",
  "Millie Bobby Brown",
  "Henry Cavill",
];

const RANDOM_EVENTS = [
  {
    title: "Skandal!",
    text: "Din huvudrollsinnehavare greps för fortkörning. Dålig press men bra publicitet?",
    effect: (m) => ({ ...m, hype: m.hype + 15, quality: m.quality - 10 }),
  },
  {
    title: "Viral Succé",
    text: "Trailern blev en meme på TikTok.",
    effect: (m) => ({ ...m, hype: m.hype + 20 }),
  },
  {
    title: "Strejk",
    text: "Manusförfattarna strejkar. Produktionen blev dyrare.",
    effect: (m) => ({ ...m, budgetProd: m.budgetProd * 1.2 }),
  },
  {
    title: "Tekniskt Genombrott",
    text: "Ditt team hittade ett billigare sätt att göra explosioner.",
    effect: (m) => ({ ...m, budgetProd: m.budgetProd * 0.8 }),
  },
];

const uid = () => Math.random().toString(36).substring(2, 9);

const generateTalent = (role, level, scoutLevel = 0) => {
  const isReal = Math.random() < 0.3 + level * 0.2;
  const trait = TRAITS[Math.floor(Math.random() * TRAITS.length)];
  let name = "Okänd Talang";

  if (isReal && role !== "writer") {
    const list = role === "director" ? REAL_DIRECTORS_LIST : REAL_ACTORS_LIST;
    name = list[Math.floor(Math.random() * list.length)];
  } else {
    const firstNames = [
      "James",
      "Mary",
      "Robert",
      "John",
      "Jennifer",
      "Michael",
      "Linda",
      "David",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
    ];
    name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * lastNames.length)]
    }`;
  }

  let skill = Math.floor(Math.random() * 30) + level * 20 + scoutLevel * 5;
  if (isReal) skill += 25;
  skill = Math.min(100, Math.max(10, skill));

  let fame = Math.floor(skill * 0.8 + Math.random() * 20);
  fame = Math.min(100, Math.max(5, fame));

  let salary = Math.floor(skill * fame * 100 * trait.cost);

  return { id: uid(), name, role, skill, fame, salary, trait, isReal };
};

const generateScript = () => {
  const adjectives = ["Dark", "Last", "Hidden", "Silent", "Lost", "Infinite"];
  const nouns = ["Kingdom", "Horizon", "Empire", "Protocol", "Dream", "Night"];
  const title = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
    nouns[Math.floor(Math.random() * nouns.length)]
  }`;
  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const qualityBonus = Math.floor(Math.random() * 15) + 5;
  const cost = 500000 + qualityBonus * 100000;
  return { id: uid(), title, genre, qualityBonus, cost };
};

// --- MAIN GAME COMPONENT ---

export default function HollywoodTycoon() {
  const [phase, setPhase] = useState("menu");
  const [studioName, setStudioName] = useState("Nordic Pictures");
  const [money, setMoney] = useState(25000000);
  const [loan, setLoan] = useState(0);
  const [marketShare, setMarketShare] = useState(5);
  const [turn, setTurn] = useState(1);
  const [history, setHistory] = useState([]);

  // Upgrades are now an object with levels
  const [studioLevels, setStudioLevels] = useState({
    vfx: 0,
    pr: 0,
    scouts: 0,
    merch: 0,
  });

  const [franchises, setFranchises] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [ownedRights, setOwnedRights] = useState([]); // New: IP Rights

  // Trend System
  const [activeTrend, setActiveTrend] = useState({
    genreId: null,
    type: "neutral",
    duration: 0,
  });

  // Active Projects List
  const [activeProjects, setActiveProjects] = useState([]);
  const [turnReport, setTurnReport] = useState([]);

  // Game State
  const [currentMovie, setCurrentMovie] = useState(null);
  const [talentPool, setTalentPool] = useState({
    directors: [],
    actors: [],
    writers: [],
  });
  const [scriptsForSale, setScriptsForSale] = useState([]);
  const [scriptMode, setScriptMode] = useState("write");
  const [modal, setModal] = useState(null);
  const [saveExists, setSaveExists] = useState(false);
  const [biddingWar, setBiddingWar] = useState(null);
  const [sequelPrompt, setSequelPrompt] = useState(null);
  const [showAwards, setShowAwards] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(SAVE_KEY)) setSaveExists(true);
    } catch (e) {}
  }, []);

  const clearData = () => {
    localStorage.removeItem(SAVE_KEY);
    window.location.reload();
  };

  const loadGame = () => {
    try {
      const d = JSON.parse(localStorage.getItem(SAVE_KEY));
      if (d) {
        setStudioName(d.studioName || "Studio");
        setMoney(safeNum(d.money));
        setLoan(safeNum(d.loan));
        setMarketShare(safeNum(d.marketShare));
        setTurn(safeNum(d.turn));
        setHistory(d.history || []);
        setStudioLevels(
          d.studioLevels || { vfx: 0, pr: 0, scouts: 0, merch: 0 }
        );
        setFranchises(d.franchises || []);
        setOwnedRights(d.ownedRights || []);
        setCompetitors(
          d.competitors ||
            REAL_STUDIOS.map((s) => ({
              ...s,
              share: s.share + (Math.random() * 2 - 1),
            }))
        );
        setActiveProjects(d.activeProjects || []);
        setActiveTrend(
          d.activeTrend || { genreId: null, type: "neutral", duration: 0 }
        );
        setPhase("dashboard");
      } else {
        clearData();
      }
    } catch (e) {
      clearData();
    }
  };

  const saveGame = () => {
    const data = {
      studioName,
      money,
      loan,
      marketShare,
      turn,
      history,
      studioLevels,
      franchises,
      competitors,
      activeProjects,
      activeTrend,
      ownedRights,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    setSaveExists(true);
  };

  const startGame = () => {
    setMoney(25000000);
    setLoan(0);
    setMarketShare(5);
    setTurn(1);
    setHistory([]);
    setStudioLevels({ vfx: 0, pr: 0, scouts: 0, merch: 0 });
    setFranchises([]);
    setActiveProjects([]);
    setOwnedRights([]);
    setCompetitors(
      REAL_STUDIOS.map((s) => ({
        ...s,
        share: s.share + (Math.random() * 4 - 2),
      }))
    );
    setActiveTrend({ genreId: null, type: "neutral", duration: 0 });
    setPhase("dashboard");
  };

  const advanceTurn = () => {
    let newReport = [];

    let nextTrend = { ...activeTrend };
    if (nextTrend.duration > 0) {
      nextTrend.duration -= 1;
      if (nextTrend.duration === 0) {
        newReport.push(
          `📉 Trenden för ${
            GENRES.find((g) => g.id === nextTrend.genreId)?.name
          } är över.`
        );
        nextTrend = { genreId: null, type: "neutral", duration: 0 };
      }
    } else if (Math.random() < 0.3) {
      const newGenre = GENRES[Math.floor(Math.random() * GENRES.length)];
      const isHot = Math.random() > 0.3;
      nextTrend = {
        genreId: newGenre.id,
        type: isHot ? "hot" : "cold",
        duration: Math.floor(Math.random() * 6) + 3,
      };
      newReport.push(
        isHot
          ? `🔥 TREND: Publiken älskar ${newGenre.name} just nu!`
          : `❄️ KYLA: Publiken är trött på ${newGenre.name}.`
      );
    }
    setActiveTrend(nextTrend);

    let updatedProjects = activeProjects.map((p) => {
      let updated = { ...p };
      updated.progress += 1;

      const team = [p.director, p.writer, ...p.cast].filter(Boolean);
      let conflict = team.reduce((s, m) => s + m.trait.conflict, 0);

      if (Math.random() < 0.2) {
        if (Math.random() * 20 < conflict) {
          updated.quality -= 5;
          newReport.push(`⚠️ ${p.title}: Konflikt i teamet sänkte kvaliteten.`);
        } else {
          updated.quality += 2;
          newReport.push(`✨ ${p.title}: Bra framsteg denna månad.`);
        }
      }

      if (updated.stage === "pre-production" && updated.progress >= 2) {
        updated.stage = "production";
        updated.progress = 0;
        newReport.push(`🎬 ${p.title} har börjat spelas in.`);
      } else if (updated.stage === "production" && updated.progress >= 4) {
        updated.stage = "post-production";
        updated.progress = 0;
        newReport.push(`✂️ ${p.title} har gått in i klipprummet.`);
      } else if (updated.stage === "post-production" && updated.progress >= 3) {
        updated.stage = "finished";
        newReport.push(`✅ ${p.title} är klar för premiär!`);
      }
      return updated;
    });

    if (loan > 0) {
      const interest = Math.floor(loan * 0.01);
      setMoney((m) => m - interest);
      newReport.push(`💸 Betalade ${interest.toLocaleString()} i ränta.`);
    }

    setTurn((t) => t + 1);
    setActiveProjects(updatedProjects);
    setTurnReport(newReport);
    setModal("report");
    saveGame();
  };

  const buyRights = (rights) => {
    if (money < rights.cost) return alert("Inte tillräckligt med pengar.");
    setMoney((m) => m - rights.cost);
    setOwnedRights([...ownedRights, rights]);
    setModal(null);
  };

  const startNewProjectWizard = (
    franchiseId = null,
    sourceMovie = null,
    rights = null
  ) => {
    let title = "";
    let genre = null;
    let sequelNum = 1;
    let hypeBonus = 0;
    let sourceData = null;
    let isRemake = false;

    if (rights) {
      title = `Remake: ${rights.title}`;
      genre = GENRES.find((g) => g.id === rights.genre);
      hypeBonus = rights.hype;
      isRemake = true;
    } else if (franchiseId) {
      const franchise = franchises.find((f) => f.id === franchiseId);
      if (franchise) {
        title = `${franchise.name} ${franchise.movies.length + 1}`;
        genre = franchise.genre;
        sequelNum = franchise.movies.length + 1;
        hypeBonus = 20;
        if (franchise.movies && franchise.movies.length > 0)
          sourceData = franchise.movies[franchise.movies.length - 1];
      }
    } else if (sourceMovie) {
      sequelNum = (sourceMovie.sequelNumber || 1) + 1;
      title = `${sourceMovie.title.replace(/\s\d+$/, "")} ${sequelNum}`;
      genre = sourceMovie.genre;
      hypeBonus = 15;
      sourceData = sourceMovie;
    }

    const movie = {
      id: uid(),
      title,
      genre,
      franchiseId,
      isSequel: !!sourceMovie || !!franchiseId,
      isRemake,
      sequelNumber: sequelNum,
      director: null,
      writer: null,
      cast: [],
      budgetProd: 5000000,
      budgetMkt: 2000000,
      budgetMerch: 0,
      releaseType: "cinema",
      quality: 0,
      hype: hypeBonus,
      scriptBonus: 0,
      logs: [],
    };

    setCurrentMovie(movie);
    setScriptMode("write");
    setScriptsForSale([generateScript(), generateScript(), generateScript()]);

    const level = marketShare / 20;
    const scoutLevel = studioLevels.scouts || 0;
    setTalentPool({
      directors: Array.from({ length: 4 }, () =>
        generateTalent("director", level, scoutLevel)
      ),
      actors: Array.from({ length: 12 }, () =>
        generateTalent("actor", level, scoutLevel)
      ),
      writers: Array.from({ length: 3 }, () =>
        generateTalent("writer", level, scoutLevel)
      ),
    });

    if (sourceData) {
      const returnees = [];
      const successFactor = sourceData.profit > 0 ? 1.5 : 0.8;
      const baseWillingness = sourceData.profit > 0 ? 0.9 : 0.5;

      if (sourceData.director && Math.random() < baseWillingness) {
        returnees.push({
          ...sourceData.director,
          id: uid(),
          salary: Math.floor(sourceData.director.salary * successFactor),
          roleLabel: "Regissör",
          type: "director",
          selected: true,
        });
      }
      if (sourceData.cast) {
        sourceData.cast.forEach((actor) => {
          if (Math.random() < baseWillingness) {
            returnees.push({
              ...actor,
              id: uid(),
              salary: Math.floor(actor.salary * successFactor),
              roleLabel: "Skådespelare",
              type: "actor",
              selected: true,
            });
          }
        });
      }
      if (returnees.length > 0) {
        setSequelPrompt({ movie, returnees });
        return;
      }
    }
    setPhase(franchiseId || sourceMovie || rights ? "casting" : "development");
  };

  const confirmSequelCast = () => {
    const { movie, returnees } = sequelPrompt;
    const updatedMovie = { ...movie };
    returnees.forEach((p) => {
      if (p.selected) {
        if (p.type === "director") updatedMovie.director = p;
        else if (updatedMovie.cast.length < 6) updatedMovie.cast.push(p);
      }
    });
    setCurrentMovie(updatedMovie);
    setSequelPrompt(null);
    setPhase("casting");
  };
  const toggleReturnee = (id) => {
    setSequelPrompt({
      ...sequelPrompt,
      returnees: sequelPrompt.returnees.map((p) =>
        p.id === id ? { ...p, selected: !p.selected } : p
      ),
    });
  };

  const attemptHire = (talent, type) => {
    const isDirector = type === "director";
    if (isDirector) {
      if (currentMovie.director?.id === talent.id) {
        setCurrentMovie({ ...currentMovie, director: null });
        return;
      }
    } else {
      if (currentMovie.cast.find((a) => a.id === talent.id)) {
        setCurrentMovie({
          ...currentMovie,
          cast: currentMovie.cast.filter((a) => a.id !== talent.id),
        });
        return;
      }
    }

    if (!isDirector && currentMovie.cast.length >= 6)
      return alert("Max 6 skådespelare.");

    if (talent.isReal || talent.fame > 70) {
      if (Math.random() < 0.3) {
        const rival = competitors[
          Math.floor(Math.random() * competitors.length)
        ] || { name: "Rival Studio" };
        const bidFactor = 1.3 + Math.random() * 0.5;
        const newSalary = Math.floor(talent.salary * bidFactor);

        setBiddingWar({
          talent,
          type,
          competitor: rival.name,
          bid: newSalary,
          originalSalary: talent.salary,
        });
        return;
      }
    }
    confirmHire(talent, type, talent.salary);
  };

  const confirmHire = (talent, type, salary) => {
    const hired = { ...talent, salary };
    if (type === "director")
      setCurrentMovie({ ...currentMovie, director: hired });
    else
      setCurrentMovie({ ...currentMovie, cast: [...currentMovie.cast, hired] });
    setBiddingWar(null);
  };

  const loseTalent = (talentId, type) => {
    if (type === "director") {
      setTalentPool({
        ...talentPool,
        directors: talentPool.directors.filter((d) => d.id !== talentId),
      });
    } else {
      setTalentPool({
        ...talentPool,
        actors: talentPool.actors.filter((a) => a.id !== talentId),
      });
    }
    setBiddingWar(null);
  };

  const toggleActor = (actor) => {
    const exists = currentMovie.cast.find((a) => a.id === actor.id);
    if (exists)
      setCurrentMovie({
        ...currentMovie,
        cast: currentMovie.cast.filter((a) => a.id !== actor.id),
      });
    else if (currentMovie.cast.length < 6)
      setCurrentMovie({ ...currentMovie, cast: [...currentMovie.cast, actor] });
  };

  const buyUpgradeLevel = (upgradeData) => {
    const currentLevel = studioLevels[upgradeData.id] || 0;
    if (currentLevel >= upgradeData.maxLevel) return;

    const cost = Math.floor(upgradeData.baseCost * Math.pow(1.5, currentLevel));

    if (money >= cost) {
      setMoney((m) => m - cost);
      setStudioLevels((prev) => ({
        ...prev,
        [upgradeData.id]: currentLevel + 1,
      }));
    }
  };

  const runProduction = () => {
    let cost =
      currentMovie.budgetProd +
      currentMovie.budgetMkt +
      currentMovie.budgetMerch;
    const team = [
      currentMovie.director,
      currentMovie.writer,
      ...currentMovie.cast,
    ].filter(Boolean);
    cost += team.reduce((sum, p) => sum + p.salary, 0);
    setMoney((m) => m - cost);

    let quality = 50 + (currentMovie.scriptBonus || 0);
    if (currentMovie.director) quality += currentMovie.director.skill / 10;
    if (currentMovie.cast.length > 0)
      quality +=
        currentMovie.cast.reduce((s, a) => s + a.skill, 0) /
        currentMovie.cast.length /
        5;
    quality += currentMovie.budgetProd / 2000000;
    if (currentMovie.isSequel) quality *= 0.9;

    if (
      studioLevels.vfx > 0 &&
      ["action", "scifi", "horror"].includes(currentMovie.genre.id)
    ) {
      quality += studioLevels.vfx * 3;
    }

    let hype = currentMovie.hype + 10 + currentMovie.budgetMkt / 500000;
    team.forEach((p) => (hype += p.fame / 10));

    if (studioLevels.pr > 0) {
      hype += studioLevels.pr * 5;
    }

    // Remake logic
    if (currentMovie.isRemake) {
      hype += 25; // Massive hype
      quality *= 0.8; // Hard to please fans
    }

    const newProject = {
      ...currentMovie,
      quality: Math.min(100, Math.max(10, Math.floor(quality))),
      hype: Math.min(100, Math.max(5, Math.floor(hype))),
      totalCost: cost,
      stage: "pre-production",
      progress: 0,
    };

    setActiveProjects([...activeProjects, newProject]);
    setPhase("dashboard");
  };

  const releaseMovie = (project) => {
    setCurrentMovie({
      ...project,
      finalLogs: [
        `Produktionen är klar! Kvalitet: ${project.quality}%`,
        `Hype inför premiären: ${project.hype}`,
      ],
    });

    if (Math.random() < 0.25) {
      const event =
        RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
      setActiveEvent(event);
    } else {
      setActiveEvent(null);
    }

    setPhase("release");
    setActiveProjects(activeProjects.filter((p) => p.id !== project.id));
  };

  const finishRelease = (results) => {
    let revenue = results.revenue + results.merch;

    if (activeTrend.genreId === currentMovie.genre.id) {
      if (activeTrend.type === "hot") revenue *= 1.5;
      else revenue *= 0.6;
    }

    const profit = revenue - currentMovie.totalCost;
    setMoney((m) => m + revenue);

    let shareDelta = 0;
    if (currentMovie.quality > 80) shareDelta = 1.5;
    else if (currentMovie.quality < 40) shareDelta = -0.5;
    if (profit > 10000000) shareDelta += 1.0;
    setMarketShare((s) =>
      Math.min(100, Math.max(0.1, safeNum(s) + shareDelta))
    );

    const record = {
      ...currentMovie,
      revenue,
      profit,
      year: 2024 + Math.floor(turn / 12),
    };
    setHistory([...history, record]);

    if (
      !currentMovie.franchiseId &&
      currentMovie.quality > 75 &&
      profit > 10000000
    ) {
      setFranchises([
        ...franchises,
        {
          id: uid(),
          name: `${currentMovie.title} Universe`,
          genre: currentMovie.genre,
          movies: [record],
          value: 10,
        },
      ]);
    } else if (currentMovie.franchiseId) {
      setFranchises(
        franchises.map((f) =>
          f.id === currentMovie.franchiseId
            ? { ...f, movies: [...f.movies, record] }
            : f
        )
      );
    }

    const newCompetitors = competitors.map((c) => ({
      ...c,
      share: Math.max(
        0.1,
        c.share - shareDelta / competitors.length + (Math.random() * 0.5 - 0.25)
      ),
    }));
    setCompetitors(newCompetitors);

    saveGame();
    if (money + profit < -10000000) setPhase("gameover");
    else setPhase("dashboard");
  };

  const Header = () => (
    <div className="bg-slate-950 p-4 border-b border-slate-800 sticky top-0 z-20 backdrop-blur-md bg-slate-950/90">
      <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg shadow-lg flex items-center justify-center font-black text-black text-xl border border-yellow-400/50">
            {studioName.charAt(0)}
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase">
              {studioName}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <Calendar size={12} />
              <span>Månad {turn}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-6 text-sm">
          <div
            onClick={() => setModal("bank")}
            className="cursor-pointer group"
          >
            <div className="text-xs text-slate-500 mb-0.5 group-hover:text-white transition-colors">
              Likvida Medel
            </div>
            <FormatMoney amount={money} />
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Marknadsandel</div>
            <span className="font-mono font-bold text-blue-400 text-lg">
              {safeNum(marketShare).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  if (phase === "menu")
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
        <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-xl p-10 rounded-3xl text-center shadow-2xl border border-white/10 ring-1 ring-white/5">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 mb-2 tracking-tighter">
            BIG HOLLYWOOD
            <br />
            STUDIO BOSS
          </h1>
          <div className="space-y-4 mt-8">
            {saveExists && (
              <Button
                onClick={loadGame}
                variant="success"
                className="w-full py-4 text-lg shadow-emerald-900/20"
              >
                Återuppta Karriär
              </Button>
            )}
            <input
              className="w-full bg-slate-950 p-4 rounded-xl text-center text-white border border-slate-800 outline-none"
              placeholder="Namnge din studio..."
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
            />
            <Button onClick={startGame} className="w-full py-4 text-lg">
              Starta Ny Studio
            </Button>
            <button
              onClick={clearData}
              className="text-xs text-red-500 flex items-center justify-center gap-2 mx-auto pt-4"
            >
              <Trash size={12} /> Återställ Data
            </button>
          </div>
        </div>
      </div>
    );

  if (phase === "dashboard")
    return (
      <div className="min-h-screen bg-slate-900 text-white bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800/30 via-slate-900 to-slate-950">
        <Header />
        <Modal isOpen={!!sequelPrompt} onClose={() => {}} title="Förhandlingar">
          {sequelPrompt && (
            <div className="space-y-4">
              <div className="text-sm text-slate-400">
                Förra filmen var en succé! Stjärnorna vill ha högre lön för att
                återvända.
              </div>
              {sequelPrompt.returnees.map((p) => (
                <div
                  key={p.id}
                  onClick={() => toggleReturnee(p.id)}
                  className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-all ${
                    p.selected
                      ? "bg-green-900/20 border-green-500/50"
                      : "bg-slate-950 border-slate-800 opacity-60"
                  }`}
                >
                  <div>
                    {p.name} ({p.roleLabel})
                  </div>
                  <div className="text-yellow-400">
                    <FormatMoney amount={p.salary} />
                  </div>
                </div>
              ))}
              <div className="flex gap-3 mt-4">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setSequelPrompt(null);
                    setPhase("casting");
                  }}
                >
                  Avböj Alla
                </Button>
                <Button className="flex-1" onClick={confirmSequelCast}>
                  Acceptera
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {modal === "report" && (
          <Modal
            title={`Månadsrapport: Månad ${turn - 1}`}
            isOpen={true}
            onClose={() => setModal(null)}
          >
            <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-sm">
              {turnReport.map((l, i) => (
                <div
                  key={i}
                  className="p-2 bg-slate-800/50 rounded border border-white/5"
                >
                  {l}
                </div>
              ))}
            </div>
          </Modal>
        )}
        {modal === "bank" && (
          <Modal
            title="Finansiell Översikt"
            isOpen={true}
            onClose={() => setModal(null)}
          >
            <div className="text-center space-y-6">
              <div className="p-6 bg-slate-950 rounded-xl border border-slate-800">
                <div className="text-sm text-slate-400 uppercase tracking-widest mb-2">
                  Aktuellt Lån
                </div>
                <div className="text-4xl text-red-400 font-mono tracking-tighter">
                  <FormatMoney amount={loan} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    setMoney((m) => m + 5000000);
                    setLoan((l) => l + 5000000);
                  }}
                >
                  Låna $5M
                </Button>
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={() => {
                    if (money >= 5000000) {
                      setMoney((m) => m - 5000000);
                      setLoan((l) => l - 5000000);
                    }
                  }}
                >
                  Betala
                </Button>
              </div>
            </div>
          </Modal>
        )}
        {modal === "franchise" && (
          <Modal
            title="Dina Filmserier"
            isOpen={true}
            onClose={() => setModal(null)}
          >
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {franchises.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  Inga franchiser än.
                </p>
              ) : (
                franchises.map((f) => (
                  <div
                    key={f.id}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center group hover:border-slate-600 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-lg text-purple-300">
                        {f.name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {f.movies.length} filmer
                      </div>
                    </div>
                    <Button
                      className="text-xs py-2 px-4"
                      onClick={() => {
                        startNewProjectWizard(f.id);
                        setModal(null);
                      }}
                    >
                      Starta Uppföljare
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Modal>
        )}
        {modal === "rights" && (
          <Modal
            title="IP Rättigheter"
            isOpen={true}
            onClose={() => setModal(null)}
          >
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {CLASSIC_MOVIES.map((c) => {
                const owned = ownedRights.find((r) => r.id === c.id);
                return (
                  <div
                    key={c.id}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-lg text-white">
                        {c.title}
                      </div>
                      <div className="text-xs text-slate-500 uppercase">
                        {c.genre} • Hype +{c.hype}
                      </div>
                    </div>
                    {owned ? (
                      <Button
                        onClick={() => {
                          startNewProjectWizard(null, null, c);
                          setModal(null);
                        }}
                        className="text-xs"
                      >
                        Gör Remake
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        className="text-xs"
                        onClick={() => buyRights(c)}
                      >
                        Köp <FormatMoney amount={c.cost} />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </Modal>
        )}

        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Trend Alert Card */}
            {activeTrend.genreId && (
              <div
                className={`p-4 rounded-xl border flex items-center justify-between animate-in slide-in-from-top-4 ${
                  activeTrend.type === "hot"
                    ? "bg-orange-900/20 border-orange-500/50 text-orange-200"
                    : "bg-blue-900/20 border-blue-500/50 text-blue-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  {activeTrend.type === "hot" ? (
                    <Flame className="text-orange-500" />
                  ) : (
                    <AlertCircle className="text-blue-500" />
                  )}
                  <div>
                    <div className="font-bold uppercase tracking-wider text-sm">
                      Marknadstrend
                    </div>
                    <div>
                      {GENRES.find((g) => g.id === activeTrend.genreId)?.name}{" "}
                      är {activeTrend.type === "hot" ? "HETT 🔥" : "ISKALLT ❄️"}{" "}
                      just nu!
                    </div>
                  </div>
                </div>
                <div className="text-xs font-mono opacity-70">
                  {activeTrend.duration} månader kvar
                </div>
              </div>
            )}

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Film size={20} /> Pågående Produktioner
                </h2>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setModal("rights")}
                    variant="secondary"
                    className="text-sm px-4 py-2"
                  >
                    <Copyright size={16} className="mr-2" /> Köp Rättigheter
                  </Button>
                  <Button
                    onClick={() => startNewProjectWizard()}
                    className="text-sm px-4 py-2"
                  >
                    <Plus size={16} /> Nytt Projekt
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                {activeProjects.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
                    Inga aktiva projekt. Starta ett nytt!
                  </div>
                ) : (
                  activeProjects.map((p) => (
                    <div
                      key={p.id}
                      className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-bold text-white">
                          {p.title}{" "}
                          {p.isRemake && (
                            <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded ml-2">
                              REMAKE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          {p.stage === "pre-production" && (
                            <span className="flex items-center gap-1 text-yellow-400">
                              <BookOpen size={12} /> Förproduktion
                            </span>
                          )}
                          {p.stage === "production" && (
                            <span className="flex items-center gap-1 text-red-400">
                              <Camera size={12} /> Inspelning
                            </span>
                          )}
                          {p.stage === "post-production" && (
                            <span className="flex items-center gap-1 text-blue-400">
                              <Scissors size={12} /> Efterarbete
                            </span>
                          )}
                          {p.stage === "finished" && (
                            <span className="flex items-center gap-1 text-green-400">
                              <CheckCircle size={12} /> Klar
                            </span>
                          )}
                        </div>
                      </div>
                      {p.stage === "finished" ? (
                        <Button
                          onClick={() => releaseMovie(p)}
                          variant="success"
                          className="py-2 px-4 text-xs"
                        >
                          PREMIÄR
                        </Button>
                      ) : (
                        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{
                              width: `${
                                (p.progress /
                                  (p.stage === "production"
                                    ? 4
                                    : p.stage === "post-production"
                                    ? 3
                                    : 2)) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={advanceTurn}
                className="py-4 px-8 text-lg bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/30 text-white"
              >
                <Clock className="mr-2" /> Nästa Månad
              </Button>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50">
              <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                <Activity size={18} className="text-slate-400" /> Senaste Släpp
              </h3>
              <div className="space-y-3">
                {history
                  .slice(-3)
                  .reverse()
                  .map((m) => (
                    <div
                      key={m.id}
                      className="flex justify-between items-center p-3 bg-slate-900/80 rounded-xl border border-slate-800"
                    >
                      <div>
                        <div className="font-bold text-slate-200">
                          {m.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {m.genre.name} • {m.quality}%
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`font-mono font-bold ${
                            m.profit > 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          <FormatMoney amount={m.profit} />
                        </div>
                        {m.profit > 0 && (
                          <button
                            onClick={() => startNewProjectWizard(null, m)}
                            className="text-xs bg-slate-800 border border-slate-600 px-2 py-1 rounded hover:bg-slate-700 text-white"
                          >
                            Uppföljare
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold text-slate-200 mb-6 flex items-center gap-2">
                <BarChart3 size={18} /> Marknadsandelar
              </h3>
              <div className="mb-6">
                <StatBar
                  label="Din Andel"
                  value={marketShare}
                  color="bg-yellow-500"
                />
              </div>
              <div className="space-y-3">
                {competitors
                  .sort((a, b) => safeNum(b.share) - safeNum(a.share))
                  .map((s) => (
                    <div
                      key={s.name}
                      className="flex justify-between items-center text-xs p-2 rounded hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            s.color.split(" ")[0]
                          }`}
                        ></div>
                        <span className="text-slate-300 font-medium">
                          {s.name}
                        </span>
                      </div>
                      <span className="font-mono text-slate-500">
                        {safeNum(s.share).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold text-slate-200 mb-6 flex items-center gap-2">
                <Zap size={18} /> Uppgraderingar
              </h3>
              <div className="grid gap-3">
                {UPGRADES_DATA.map((u) => {
                  const currentLevel = studioLevels[u.id] || 0;
                  const nextCost = Math.floor(
                    u.baseCost * Math.pow(1.5, currentLevel)
                  );
                  const isMaxed = currentLevel >= u.maxLevel;
                  return (
                    <div
                      key={u.id}
                      className="p-3 bg-slate-950/50 rounded-lg border border-slate-800"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex gap-2 items-center text-slate-300">
                          <div className="p-1.5 bg-slate-900 rounded text-slate-400">
                            {u.icon}
                          </div>
                          <div>
                            <div className="font-bold text-sm">
                              {u.name}{" "}
                              <span className="text-yellow-500 text-xs ml-1">
                                Lvl {currentLevel}
                              </span>
                            </div>
                          </div>
                        </div>
                        {isMaxed ? (
                          <div className="text-green-500 text-xs font-bold px-2 py-1 bg-green-500/10 rounded">
                            MAX
                          </div>
                        ) : (
                          <button
                            onClick={() => buyUpgradeLevel(u)}
                            className="text-xs bg-yellow-600/20 text-yellow-500 hover:bg-yellow-500 hover:text-black px-2 py-1 rounded transition-colors border border-yellow-600/30 font-bold"
                          >
                            Uppgradera (<FormatMoney amount={nextCost} />)
                          </button>
                        )}
                      </div>
                      <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full"
                          style={{
                            width: `${(currentLevel / u.maxLevel) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {u.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  // --- WIZARD PHASES ---
  if (phase === "development") {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Header
          studioName={studioName}
          turn={turn}
          money={money}
          marketShare={marketShare}
        />
        <div className="max-w-5xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Fas 1 av 3
              </div>
              <h2 className="text-3xl font-bold text-white">
                Utveckling & Manus
              </h2>
            </div>
            <div className="flex gap-1">
              <div className="w-12 h-1 bg-yellow-500 rounded-full"></div>
              <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
              <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Filmtitel
                </label>
                <input
                  className="w-full bg-slate-950 p-4 rounded-xl text-white border border-slate-800 focus:border-yellow-500 outline-none text-lg font-medium transition-all"
                  value={currentMovie.title}
                  onChange={(e) =>
                    setCurrentMovie({ ...currentMovie, title: e.target.value })
                  }
                  placeholder="Ange titel..."
                />
              </div>
              <div
                className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${
                  currentMovie.isSequel || currentMovie.isRemake
                    ? "opacity-50 pointer-events-none grayscale"
                    : ""
                }`}
              >
                {GENRES.map((g) => (
                  <Card
                    key={g.id}
                    onClick={() =>
                      setCurrentMovie({ ...currentMovie, genre: g })
                    }
                    selected={currentMovie.genre?.id === g.id}
                    className="flex flex-col items-center justify-center text-center py-6"
                  >
                    <div
                      className={`text-lg font-bold mb-1 ${
                        currentMovie.genre?.id === g.id
                          ? "text-yellow-400"
                          : "text-slate-300"
                      }`}
                    >
                      {g.name}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      Publik: x{g.audienceMod}
                    </div>
                  </Card>
                ))}
              </div>
              {(currentMovie.isSequel || currentMovie.isRemake) && (
                <div className="p-3 bg-yellow-900/20 border border-yellow-500/20 rounded text-center text-sm text-yellow-500">
                  Genre är låst.
                </div>
              )}
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-fit shadow-xl">
              <div className="flex p-1 bg-slate-900 rounded-lg mb-6">
                <button
                  onClick={() => setScriptMode("write")}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    scriptMode === "write"
                      ? "bg-slate-700 text-white shadow"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Skriv Själv
                </button>
                <button
                  onClick={() => setScriptMode("buy")}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                    scriptMode === "buy"
                      ? "bg-purple-600 text-white shadow"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Köp Premium
                </button>
              </div>
              {scriptMode === "write" ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    Tillgängliga Författare
                  </h4>
                  {talentPool.writers.map((w) => (
                    <div
                      key={w.id}
                      onClick={() =>
                        setCurrentMovie({ ...currentMovie, writer: w })
                      }
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        currentMovie.writer?.id === w.id
                          ? "bg-slate-700 border-green-500 ring-1 ring-green-500"
                          : "bg-slate-900 border-slate-800 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-bold text-slate-200">{w.name}</div>
                        <div className="text-yellow-500 font-mono text-xs">
                          <FormatMoney amount={w.salary} />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Färdighet: {w.skill}</span>
                        <span>{w.trait.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {scriptsForSale.map((s) => (
                    <div
                      key={s.id}
                      className="p-4 bg-slate-900/50 rounded-xl border border-purple-500/30 group hover:border-purple-500 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-white group-hover:text-purple-300 transition-colors">
                            {s.title}
                          </div>
                          <div className="text-xs text-purple-400 uppercase font-bold">
                            {s.genre.name}
                          </div>
                        </div>
                        <div className="bg-slate-950 px-2 py-1 rounded text-xs text-green-400 font-mono">
                          +{s.qualityBonus} QP
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (money >= s.cost) {
                            setMoney((m) => m - s.cost);
                            setCurrentMovie({
                              ...currentMovie,
                              title: s.title,
                              genre: s.genre,
                              scriptBonus: s.qualityBonus,
                            });
                          }
                        }}
                        className="w-full mt-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 rounded transition-colors"
                      >
                        Köp Rättigheter (<FormatMoney amount={s.cost} />)
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-8 pt-6 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setPhase("dashboard")}>
              Avbryt Projekt
            </Button>
            <Button
              disabled={
                !currentMovie.title ||
                !currentMovie.genre ||
                (!currentMovie.writer && !currentMovie.scriptBonus)
              }
              onClick={() => setPhase("casting")}
            >
              Gå till Casting <SkipForward size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "casting") {
    const talentCost = [currentMovie.director, ...currentMovie.cast]
      .filter(Boolean)
      .reduce((s, p) => s + p.salary, 0);
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Header
          studioName={studioName}
          turn={turn}
          money={money}
          marketShare={marketShare}
        />
        <Modal isOpen={!!biddingWar} onClose={() => {}} title="BUDGIVNINGSKRIG">
          {biddingWar && (
            <div className="space-y-6">
              <div className="bg-slate-800 p-4 rounded-xl border border-red-500/30 flex items-center gap-4">
                <div className="p-3 bg-red-500/20 rounded-full text-red-500">
                  <Gavel size={24} />
                </div>
                <div>
                  <p className="text-slate-300 text-sm">
                    Konkurrenten{" "}
                    <span className="font-bold text-white">
                      {biddingWar.competitor}
                    </span>{" "}
                    försöker stjäla talangen!
                  </p>
                  <div className="text-xl font-bold text-white mt-1">
                    {biddingWar.talent.name}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-xs text-slate-500 uppercase mb-1">
                    Ursprungligt Pris
                  </div>
                  <div className="text-lg font-mono text-slate-300 line-through decoration-red-500">
                    <FormatMoney amount={biddingWar.originalSalary} />
                  </div>
                </div>
                <div className="p-4 bg-slate-950 rounded-lg border border-yellow-500/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl">
                    MOTBUD
                  </div>
                  <div className="text-xs text-slate-500 uppercase mb-1">
                    Nytt Pris
                  </div>
                  <div className="text-xl font-mono text-yellow-400 font-bold">
                    <FormatMoney amount={biddingWar.bid} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() =>
                    loseTalent(biddingWar.talent.id, biddingWar.type)
                  }
                >
                  Låt dem gå
                </Button>
                <Button
                  className="flex-1 bg-red-600 hover:bg-red-500 border-none text-white shadow-red-900/20"
                  onClick={() =>
                    confirmHire(
                      biddingWar.talent,
                      biddingWar.type,
                      biddingWar.bid
                    )
                  }
                >
                  Matcha Budet
                </Button>
              </div>
            </div>
          )}
        </Modal>

        <div className="max-w-7xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Fas 2 av 3
              </div>
              <h2 className="text-3xl font-bold text-white">Casting & Crew</h2>
            </div>
            <div className="bg-slate-800 px-6 py-3 rounded-xl border border-slate-700 flex items-center gap-4">
              <div className="text-xs text-slate-400 uppercase font-bold text-right">
                Nuvarande
                <br />
                Lönekostnad
              </div>
              <div className="text-2xl font-mono text-red-400 font-bold">
                <FormatMoney amount={talentCost} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div>
                <h4 className="font-bold text-slate-400 mb-3 flex items-center gap-2">
                  <Camera size={16} /> Regissörer
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {talentPool.directors.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => attemptHire(d, "director")}
                      className={`p-3 rounded-xl border cursor-pointer transition-all hover:-translate-y-0.5 ${
                        currentMovie.director?.id === d.id
                          ? "bg-yellow-900/20 border-yellow-500 shadow-lg shadow-yellow-900/10"
                          : "bg-slate-800 border-slate-700 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-white text-sm">
                            {d.name} {d.isReal && "⭐"}
                          </div>
                          <div className="text-xs text-slate-400">
                            {d.trait.name}
                          </div>
                        </div>
                        <div className="bg-slate-950 px-2 py-1 rounded text-xs font-mono text-slate-300">
                          <FormatMoney amount={d.salary} />
                        </div>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full"
                          style={{ width: `${d.skill}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-400 mb-3 flex items-center gap-2">
                  <Users size={16} /> Skådespelare
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {talentPool.actors.map((a) => {
                    const isSelected = currentMovie.cast.find(
                      (c) => c.id === a.id
                    );
                    return (
                      <div
                        key={a.id}
                        onClick={() => attemptHire(a, "actor")}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-slate-900 border-slate-800 opacity-60"
                            : "bg-slate-800 border-slate-700 hover:border-slate-500 hover:shadow-lg hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-bold text-sm truncate pr-2">
                            {a.name}
                          </div>
                          {a.isReal && (
                            <span className="text-[10px] bg-yellow-500 text-black px-1 rounded font-bold">
                              ★
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center text-xs mb-2">
                          <span className="text-slate-400">{a.trait.name}</span>
                          <span className="font-mono">
                            <FormatMoney amount={a.salary} />
                          </span>
                        </div>
                        <div className="flex gap-1 h-1">
                          <div
                            className="bg-purple-500 rounded-full"
                            style={{ width: `${a.fame}%`, opacity: 0.7 }}
                          ></div>
                          <div
                            className="bg-blue-500 rounded-full"
                            style={{ width: `${a.skill}%`, opacity: 0.7 }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 sticky top-24 shadow-2xl">
                <h3 className="font-bold text-lg mb-4 text-white border-b border-slate-700 pb-2">
                  Rollbesättning ({currentMovie.cast.length}/6)
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-slate-500 uppercase font-bold mb-2">
                      Regi
                    </div>
                    {currentMovie.director ? (
                      <div className="bg-slate-900 p-3 rounded-lg border border-yellow-500/30 flex justify-between items-center group">
                        <div>
                          <div className="font-bold text-yellow-100">
                            {currentMovie.director.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            <FormatMoney
                              amount={currentMovie.director.salary}
                            />
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setCurrentMovie({ ...currentMovie, director: null })
                          }
                          className="text-slate-600 hover:text-red-400 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="p-4 border-2 border-dashed border-slate-700 rounded-lg text-center text-sm text-slate-500">
                        Ingen vald
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-xs text-slate-500 uppercase font-bold">
                        Skådespelare
                      </div>
                    </div>
                    <div className="space-y-2">
                      {currentMovie.cast.map((a, i) => (
                        <div
                          key={a.id}
                          className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex justify-between items-center group"
                        >
                          <div>
                            <div className="text-[10px] text-purple-400 font-bold uppercase mb-0.5">
                              {i === 0 ? "Huvudroll" : `Biroll ${i}`}
                            </div>
                            <div className="font-bold text-slate-200">
                              {a.name}
                            </div>
                          </div>
                          <button
                            onClick={() => attemptHire(a, "actor")}
                            className="text-slate-600 hover:text-red-400 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      {Array.from({
                        length: Math.max(0, 6 - currentMovie.cast.length),
                      }).map((_, i) => (
                        <div
                          key={i}
                          className="p-3 border border-dashed border-slate-800 rounded-lg text-center text-xs text-slate-700"
                        >
                          Ledig plats
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-12 pt-6 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setPhase("development")}>
              Tillbaka
            </Button>
            <Button
              disabled={
                !currentMovie.director || currentMovie.cast.length === 0
              }
              onClick={() => setPhase("production")}
            >
              Gå till Budgetering <SkipForward size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "production") {
    const talentCost = [
      currentMovie.director,
      currentMovie.writer,
      ...currentMovie.cast,
    ]
      .filter(Boolean)
      .reduce((s, p) => s + p.salary, 0);
    const total =
      talentCost +
      currentMovie.budgetProd +
      currentMovie.budgetMkt +
      currentMovie.budgetMerch;

    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <Header
          studioName={studioName}
          turn={turn}
          money={money}
          marketShare={marketShare}
        />
        <div className="max-w-4xl mx-auto p-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                Fas 3 av 3
              </div>
              <h2 className="text-3xl font-bold text-white">
                Produktion & Budget
              </h2>
            </div>
            <div className="flex gap-1">
              <div className="w-12 h-1 bg-yellow-500 rounded-full"></div>
              <div className="w-12 h-1 bg-yellow-500 rounded-full"></div>
              <div className="w-12 h-1 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <label className="font-bold flex justify-between mb-4">
                  <span>Produktionskvalitet</span>
                  <span className="text-blue-300 font-mono">
                    <FormatMoney amount={currentMovie.budgetProd} />
                  </span>
                </label>
                <input
                  type="range"
                  min="1000000"
                  max="50000000"
                  step="500000"
                  className="w-full accent-blue-500 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                  value={currentMovie.budgetProd}
                  onChange={(e) =>
                    setCurrentMovie({
                      ...currentMovie,
                      budgetProd: parseInt(e.target.value),
                    })
                  }
                />
                <div className="mt-2 text-xs text-slate-500">
                  Påverkar filmens betyg direkt.
                </div>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <label className="font-bold flex justify-between mb-4">
                  <span>Marknadsföring</span>
                  <span className="text-yellow-300 font-mono">
                    <FormatMoney amount={currentMovie.budgetMkt} />
                  </span>
                </label>
                <input
                  type="range"
                  min="500000"
                  max="30000000"
                  step="500000"
                  className="w-full accent-yellow-500 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                  value={currentMovie.budgetMkt}
                  onChange={(e) =>
                    setCurrentMovie({
                      ...currentMovie,
                      budgetMkt: parseInt(e.target.value),
                    })
                  }
                />
                <div className="mt-2 text-xs text-slate-500">
                  Ökar Hype och publiktillströmning.
                </div>
              </div>
              {studioLevels.merch > 0 && (
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <label className="font-bold flex justify-between mb-4">
                    <span>Merch Lager</span>
                    <span className="text-purple-300 font-mono">
                      <FormatMoney amount={currentMovie.budgetMerch} />
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="100000"
                    className="w-full accent-purple-500 h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                    value={currentMovie.budgetMerch}
                    onChange={(e) =>
                      setCurrentMovie({
                        ...currentMovie,
                        budgetMerch: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <h3 className="font-bold mb-4 text-slate-300">Distribution</h3>
                <div className="flex gap-4">
                  <div
                    onClick={() =>
                      setCurrentMovie({
                        ...currentMovie,
                        releaseType: "cinema",
                      })
                    }
                    className={`flex-1 p-4 rounded-xl border-2 text-center cursor-pointer transition-all ${
                      currentMovie.releaseType === "cinema"
                        ? "bg-blue-900/20 border-blue-500 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600"
                    }`}
                  >
                    <div className="font-bold text-lg mb-1">Biograf</div>
                    <div className="text-xs opacity-70">
                      Hög risk / Hög belöning
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      setCurrentMovie({
                        ...currentMovie,
                        releaseType: "stream",
                      })
                    }
                    className={`flex-1 p-4 rounded-xl border-2 text-center cursor-pointer transition-all ${
                      currentMovie.releaseType === "stream"
                        ? "bg-green-900/20 border-green-500 text-white"
                        : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600"
                    }`}
                  >
                    <div className="font-bold text-lg mb-1">Streaming</div>
                    <div className="text-xs opacity-70">Säker inkomst</div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-inner">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-2">
                  Kostnadsöversikt
                </h3>
                <div className="space-y-3 text-sm font-mono">
                  <div className="flex justify-between">
                    <span>Löner</span>
                    <span className="text-slate-300">
                      <FormatMoney amount={talentCost} />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Produktion</span>
                    <span className="text-slate-300">
                      <FormatMoney amount={currentMovie.budgetProd} />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marknadsföring</span>
                    <span className="text-slate-300">
                      <FormatMoney amount={currentMovie.budgetMkt} />
                    </span>
                  </div>
                  {currentMovie.budgetMerch > 0 && (
                    <div className="flex justify-between text-purple-400">
                      <span>Merchandise</span>
                      <span>
                        <FormatMoney amount={currentMovie.budgetMerch} />
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold border-t border-slate-800 pt-3 mt-2 text-lg">
                    <span>TOTALT</span>
                    <span
                      className={total > money ? "text-red-500" : "text-white"}
                    >
                      <FormatMoney amount={total} />
                    </span>
                  </div>
                </div>
                {total > money && (
                  <div className="mt-4 bg-red-900/20 border border-red-500/50 p-3 rounded text-red-200 text-xs text-center font-bold">
                    Varning: Budgeten överskrider kassan!
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-12 pt-6 border-t border-slate-800">
            <Button variant="secondary" onClick={() => setPhase("casting")}>
              Tillbaka
            </Button>
            <Button
              disabled={total > money}
              onClick={runProduction}
              className="text-lg px-8 py-4 shadow-yellow-500/20"
            >
              STARTA PRODUKTIONEN
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "release") {
    return (
      <ReleaseScreen
        currentMovie={currentMovie}
        studioName={studioName}
        onFinish={finishRelease}
        activeEvent={activeEvent}
        onEventClose={() => setActiveEvent(null)}
      />
    );
  }

  if (phase === "gameover")
    return (
      <div className="min-h-screen bg-red-950 text-white flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-8xl font-black mb-4 opacity-50">KONKURS</h1>
        <p className="text-2xl mb-8 font-light text-red-200">
          Studion har slut på kapital. Drömmen är över.
        </p>
        <Button onClick={startGame} className="text-xl px-12 py-6 shadow-2xl">
          Försök Igen
        </Button>
      </div>
    );

  return (
    <div className="bg-slate-900 min-h-screen text-white flex items-center justify-center">
      Laddar...
    </div>
  );
}

// --- SUB-COMPONENT: RELEASE SCREEN WITH CREDITS (FIXED CRASH) ---
const ReleaseScreen = ({
  currentMovie,
  studioName,
  onFinish,
  activeEvent,
  onEventClose,
}) => {
  const [viewState, setViewState] = useState("credits");
  const [creditIndex, setCreditIndex] = useState(0);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!currentMovie) return;
    const qual = safeNum(currentMovie.quality);
    const hype = safeNum(currentMovie.hype);

    let revenue = 0;
    if (currentMovie.releaseType === "cinema")
      revenue = Math.floor(
        hype *
          qual *
          (currentMovie.genre.audienceMod * 12000) *
          (0.8 + Math.random())
      );
    else revenue = Math.floor(qual * 400000 * (1 + hype / 100));

    let merch = 0;
    if (currentMovie.budgetMerch > 0)
      merch =
        currentMovie.budgetMerch *
        2 *
        Math.min(1, (hype / 100) * (qual / 100) * 1.5);

    setResults({ revenue, merch });
  }, [currentMovie]);

  // --- UPDATED CREDITS SEQUENCE ---
  const credits = [];
  if (currentMovie) {
    // 1. Studio Presents
    credits.push({
      pre: null,
      main: (studioName || "Studio").toUpperCase() + " PRESENTS",
    });

    // 2. Production Company
    credits.push({
      pre: "A",
      main: (studioName || "Studio").toUpperCase() + " PRODUCTION",
    });

    // 3. Possessory (Director)
    if (currentMovie.director) {
      credits.push({ pre: "A Film By", main: currentMovie.director.name });
    }

    // 4. Starring (Main Actor)
    const cast = Array.isArray(currentMovie.cast) ? currentMovie.cast : [];
    if (cast.length > 0) {
      credits.push({ pre: "Starring", main: cast[0].name });
    }

    // 5. Title
    credits.push({ pre: null, main: currentMovie.title, isTitle: true });

    // 6. Featuring (Rest of cast)
    cast.slice(1).forEach((actor, index) => {
      credits.push({ pre: index === 0 ? "With" : "And", main: actor.name });
    });

    // 7. Fake Crew (Random names for immersion)
    const randomName = () => {
      const f = [
        "John",
        "Sarah",
        "Mike",
        "Emily",
        "Chris",
        "Jessica",
        "David",
        "Laura",
      ];
      const l = [
        "Smith",
        "Jones",
        "Williams",
        "Brown",
        "Davis",
        "Miller",
        "Wilson",
        "Moore",
      ];
      return `${f[Math.floor(Math.random() * f.length)]} ${
        l[Math.floor(Math.random() * l.length)]
      }`;
    };

    credits.push({ pre: "Casting By", main: randomName() + " CSA" });
    credits.push({ pre: "Music By", main: randomName() });
    credits.push({ pre: "Edited By", main: randomName() + " ACE" });
    credits.push({
      pre: "Director of Photography",
      main: randomName() + " ASC",
    });

    // 8. Producers
    credits.push({ pre: "Executive Producer", main: "Studio Boss" });
    credits.push({ pre: "Produced By", main: randomName() + " p.g.a." });

    // 9. Writer
    if (currentMovie.writer) {
      credits.push({ pre: "Written By", main: currentMovie.writer.name });
    }

    // 10. Director
    if (currentMovie.director) {
      credits.push({ pre: "Directed By", main: currentMovie.director.name });
    }
  }

  useEffect(() => {
    if (viewState === "credits" && !activeEvent) {
      if (creditIndex < credits.length) {
        const timer = setTimeout(
          () => setCreditIndex((prev) => prev + 1),
          2500
        );
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setViewState("results"), 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [viewState, creditIndex, credits.length, activeEvent]);

  if (!currentMovie || !results)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">
        Förbereder premiär...
      </div>
    );

  if (activeEvent) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-8 rounded-2xl max-w-md w-full border border-yellow-500/50 shadow-2xl text-center space-y-4">
          <AlertCircle size={48} className="text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">{activeEvent.title}</h2>
          <p className="text-slate-300">{activeEvent.text}</p>
          <div className="bg-slate-900 p-2 rounded text-xs text-yellow-400">
            Effekt har applicerats på filmen.
          </div>
          <Button onClick={onEventClose} className="w-full">
            OK
          </Button>
        </div>
      </div>
    );
  }

  if (viewState === "credits") {
    if (creditIndex >= credits.length)
      return <div className="min-h-screen bg-black" />;
    const slide = credits[creditIndex];
    return (
      <div
        className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 cursor-pointer relative"
        onClick={() => setViewState("results")}
      >
        <div className="absolute top-8 right-8 text-slate-600 flex items-center gap-2 hover:text-white transition-colors">
          <span className="text-xs uppercase tracking-widest font-bold">
            Hoppa över
          </span>
          <SkipForward size={20} />
        </div>
        <div
          key={creditIndex}
          className="text-center animate-in fade-in zoom-in duration-1000 fill-mode-forwards max-w-4xl px-4"
        >
          {slide.pre && (
            <div className="text-slate-500 text-sm md:text-base uppercase tracking-[0.5em] mb-6 font-light animate-in slide-in-from-bottom-2 fade-in duration-700">
              {slide.pre}
            </div>
          )}
          <div
            className={`${
              slide.isTitle
                ? "text-5xl md:text-8xl font-black text-yellow-500 uppercase tracking-tighter leading-none"
                : "text-3xl md:text-6xl font-bold text-white tracking-wide"
            } animate-in scale-95 duration-1000`}
          >
            {slide.main}
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center bg-blend-multiply">
      <div className="max-w-3xl w-full text-center space-y-10 animate-in zoom-in duration-500 backdrop-blur-xl bg-black/60 p-12 rounded-3xl border border-white/10 shadow-2xl">
        <div>
          <div className="text-yellow-500 font-bold tracking-[0.5em] text-sm mb-2 uppercase">
            Premiärresultat
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white uppercase leading-tight mb-8">
            {currentMovie.title}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-8 md:gap-12 border-y border-white/10 py-8">
          <div>
            <div className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-2">
              Kritikerbetyg
            </div>
            <div
              className={`text-7xl font-black ${
                currentMovie.quality > 70
                  ? "text-emerald-400"
                  : currentMovie.quality > 40
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {currentMovie.quality}%
            </div>
          </div>
          <div>
            <div className="text-slate-400 uppercase text-xs font-bold tracking-wider mb-2">
              Publikhype
            </div>
            <div className="text-7xl font-black text-purple-400">
              {currentMovie.hype}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-slate-400 uppercase text-sm font-bold tracking-wider">
            Totala Intäkter
          </div>
          <div className="text-6xl font-mono font-bold text-white tracking-tighter">
            <FormatMoney amount={results.revenue + results.merch} />
          </div>
          {results.merch > 0 && (
            <div className="text-sm text-purple-300 font-mono bg-purple-900/30 inline-block px-3 py-1 rounded-full border border-purple-500/30">
              Merchandise: +<FormatMoney amount={results.merch} />
            </div>
          )}
        </div>

        <div className="pt-8">
          <Button
            onClick={() => onFinish(results)}
            className="mx-auto px-16 py-5 text-xl shadow-yellow-500/20"
          >
            Tillbaka till Studion
          </Button>
        </div>
      </div>
    </div>
  );
};
