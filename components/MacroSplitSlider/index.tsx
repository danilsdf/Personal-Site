import React, { useMemo, useRef, useState } from "react";

type Macro = "protein" | "fat" | "carbs";

type Props = {
  // Optional totals (used only to show grams like in your screenshot)
  totalProteinG?: number;
  totalFatG?: number;
  totalCarbsG?: number;

  // Starting split
  initial?: { protein: number; fat: number; carbs: number };

  // Minimum % per segment
  minPct?: number;

  // Callback when user changes split
  onChange?: (v: { protein: number; fat: number; carbs: number }) => void;
};

export default function MacroSplitSlider({
  totalProteinG = 189.8,
  totalFatG = 76.7,
  totalCarbsG = 212.8,
  initial = { protein: 33, fat: 30, carbs: 37 },
  minPct = 5,
  onChange,
}: Props) {
  // Handles represent boundaries:
  // h1 = end of protein
  // h2 = end of protein+fat
  const [h1, setH1] = useState(initial.protein);
  const [h2, setH2] = useState(initial.protein + initial.fat);

  const barRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef<null | "h1" | "h2">(null);

  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

  const split = useMemo(() => {
    const protein = Math.round(h1);
    const fat = Math.round(h2 - h1);
    const carbs = Math.round(100 - h2);
    return { protein, fat, carbs };
  }, [h1, h2]);

  const grams = useMemo(() => {
    // Scale grams proportionally from the provided “100% totals”
    const p = (totalProteinG * split.protein) / 100;
    const f = (totalFatG * split.fat) / 100;
    const c = (totalCarbsG * split.carbs) / 100;
    return { protein: p, fat: f, carbs: c };
  }, [split, totalProteinG, totalFatG, totalCarbsG]);

  const emit = (nextH1: number, nextH2: number) => {
    const protein = Math.round(nextH1);
    const fat = Math.round(nextH2 - nextH1);
    const carbs = Math.round(100 - nextH2);
    onChange?.({ protein, fat, carbs });
  };

  const pctFromClientX = (clientX: number) => {
    const el = barRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const x = clientX - r.left;
    return (x / r.width) * 100;
  };

  const onPointerDown = (which: "h1" | "h2") => (e: React.PointerEvent) => {
    dragging.current = which;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;

    const pct = pctFromClientX(e.clientX);

    if (dragging.current === "h1") {
      // protein boundary
      const nextH1 = clamp(pct, minPct, h2 - minPct);
      setH1(nextH1);
      emit(nextH1, h2);
    } else {
      // fat boundary
      const nextH2 = clamp(pct, h1 + minPct, 100 - minPct);
      setH2(nextH2);
      emit(h1, nextH2);
    }
  };

  const onPointerUp = () => {
    dragging.current = null;
  };

  return (
    <div style={styles.wrap}>
      {/* Top cards */}
      <div style={styles.cardsRow}>
        <MacroCard
          title="Protein"
          dot="#B26BCB"
          bg="#2B203A"
          pct={split.protein}
          grams={grams.protein}
        />
        <MacroCard title="Fat" dot="#7AC48B" bg="#1E2A24" pct={split.fat} grams={grams.fat} />
        <MacroCard
          title="Carbs"
          dot="#FF9A4D"
          bg="#3A241C"
          pct={split.carbs}
          grams={grams.carbs}
        />
      </div>

      {/* Slider */}
      <div style={styles.sliderArea}>
        <div
          ref={barRef}
          style={styles.bar}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* segments */}
          <div style={{ ...styles.seg, width: `${h1}%`, background: "#B26BCB" }} />
          <div style={{ ...styles.seg, width: `${h2 - h1}%`, background: "#7AC48B" }} />
          <div style={{ ...styles.seg, width: `${100 - h2}%`, background: "#FF9A4D" }} />

          {/* handle 1 */}
          <Handle leftPct={h1} onPointerDown={onPointerDown("h1")} />
          {/* handle 2 */}
          <Handle leftPct={h2} onPointerDown={onPointerDown("h2")} />
        </div>
      </div>
    </div>
  );
}

function MacroCard({
  title,
  dot,
  bg,
  pct,
  grams,
}: {
  title: string;
  dot: string;
  bg: string;
  pct: number;
  grams: number;
}) {
  return (
    <div style={{ ...styles.card, background: bg }}>
      <div style={styles.cardTop}>
        <div style={styles.cardTitle}>
          <span style={{ ...styles.dot, background: dot }} />
          <span style={styles.cardTitleText}>{title}</span>
        </div>

        {/* edit icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.9 }}>
          <path
            d="M14 3H7a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-7"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M21 3l-9 9"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M17 3h4v4"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div style={styles.cardValue}>
        {pct}%/{grams.toFixed(1)}g
      </div>
    </div>
  );
}

function Handle({
  leftPct,
  onPointerDown,
}: {
  leftPct: number;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  return (
    <div style={{ ...styles.handleWrap, left: `${leftPct}%` }}>
      <div style={styles.handleLine} />
      <div style={styles.handleKnob} onPointerDown={onPointerDown} role="slider" tabIndex={0}>
        {/* left/right arrows */}
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M10 8l-4 4 4 4"
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 8l4 4-4 4"
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    width: "100%",
    maxWidth: 980,
    margin: "0 auto",
    padding: 18,
    borderRadius: 24,
    background: "#0D0F10",
  },
  cardsRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 },
  card: {
    borderRadius: 18,
    padding: 16,
    color: "rgba(255,255,255,0.9)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
  },
  cardTop: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { display: "flex", alignItems: "center", gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 999 },
  cardTitleText: { fontSize: 18, opacity: 0.9 },
  cardValue: { marginTop: 10, fontSize: 34, fontWeight: 700, letterSpacing: -0.5 },

  sliderArea: { marginTop: 22, padding: "6px 2px 2px" },
  bar: {
    position: "relative",
    display: "flex",
    height: 74,
    borderRadius: 22,
    overflow: "hidden",
    background: "#15181A",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
    userSelect: "none",
    touchAction: "none",
  },
  seg: { height: "100%" },

  handleWrap: {
    position: "absolute",
    top: 0,
    bottom: 0,
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    pointerEvents: "none",
  },
  handleLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    background: "rgba(255,255,255,0.85)",
  },
  handleKnob: {
    pointerEvents: "auto",
    width: 32,
    height: 32,
    borderRadius: 999,
    background: "#FFFFFF",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
    marginBottom: "auto",
    marginTop: "auto",
    cursor: "grab",
  },
};
