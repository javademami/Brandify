"use client";

/* =========================================================
   DYNAMIC MOCKUP GENERATOR — "SPEC SHEET" EDITION
   ----------------------------------------------------------
   Pure-CSS compositing mockup engine. No canvas libraries.
   - USER_MOCKUPS acts as the hardcoded calibration sheet.
   - Built-in developer sliders output paste-ready config.
   - Logo is injected via renderLogoHTML() — the FULL logo with
     its background color block, icon and typography.
   - Live 3D transform controllers (perspective + rotateX/Y/Z)
     are bound directly into the composited logo layer and the
     paste-ready config.

   LAYOUT SPLIT (editor integration):
     <MockupStage />     → central canvas presentation (4:3 stage)
     <MockupControls />  → right-sidebar calibration tools
   Both share state through useMockupGenerator().
   The default export keeps the legacy all-in-one UI.
========================================================= */

import { useCallback, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

/* =========================================================
   TYPES
========================================================= */

export type MockupBlendMode =
  | "normal"
  | "multiply"
  | "overlay"
  | "screen";

export interface MockupSpec {
  /** Stable identifier used for React keys + export snippet */
  id: string;
  /** Human-readable label shown in the selector rail */
  name: string;
  /** Public-root path of the raw JPEG background */
  bgUrl: string;
  /** Vertical anchor of the logo center (% of frame height) */
  defaultTop: number;
  /** Horizontal anchor of the logo center (% of frame width) */
  defaultLeft: number;
  /** Uniform scale multiplier (1 = natural size) */
  defaultScale: number;
  /** Perspective depth in px (smaller = stronger distortion) */
  defaultPerspective: number;
  /** X-axis tilt forward/backward (deg) */
  defaultRotateX: number;
  /** Y-axis turn left/right (deg) */
  defaultRotateY: number;
  /** Z-axis flat rotation (deg) */
  defaultRotateZ: number;
  /** Advanced CSS transform chain (3D perspective / rotation / skew) */
  transformStyle: string;
  /** Blend mode fusing the logo into the photo's light & texture */
  mixBlendMode: MockupBlendMode;
}

export interface Calibration {
  top: number;
  left: number;
  scale: number;
  /** Perspective depth in px (smaller = stronger distortion) */
  perspective: number;
  /** X-axis tilt forward/backward (deg) */
  rotateX: number;
  /** Y-axis turn left/right (deg) */
  rotateY: number;
  /** Z-axis flat rotation (deg) */
  rotateZ: number;
}

interface DynamicMockupGeneratorProps {
  /**
   * Renders the FULL logo — icon, typography AND its background
   * color block — for compositing inside the mockup stage.
   */
  renderLogoHTML: () => ReactNode;
}

interface MockupStageProps {
  activeSpec: MockupSpec;
  calibration: Calibration;
  renderLogoHTML: () => ReactNode;
  /** "dark" → clean white border for dark canvases; "light" → subtle rule border */
  variant?: "dark" | "light";
}

/* =========================================================
   SPEC SHEET — hardcoded calibration database
   (fine-tune values here via the built-in dev tools)
========================================================= */

export const USER_MOCKUPS: MockupSpec[] = [
  {
    id: "mock-101",
    name: "Flat Lay / Card",
    bgUrl: "/Mockup/1/1.jpg",
    defaultTop: 50,
    defaultLeft: 50,
    defaultScale: 0.9,
    defaultPerspective: 800,
    defaultRotateX: 0,
    defaultRotateY: 0,
    defaultRotateZ: 0,
    transformStyle: "none",
    mixBlendMode: "normal",
  },
  {
    id: "mock-102",
    name: "Angled Print",
    bgUrl: "/Mockup/1/2.jpg",
    defaultTop: 48,
    defaultLeft: 52,
    defaultScale: 0.82,
    defaultPerspective: 600,
    defaultRotateX: 6,
    defaultRotateY: 0,
    defaultRotateZ: -7,
    transformStyle: "perspective(600px) rotateX(6deg) rotateZ(-7deg)",
    mixBlendMode: "normal",
  },
  {
    id: "mock-103",
    name: "Tilted Surface",
    bgUrl: "/Mockup/1/3.jpg",
    defaultTop: 46,
    defaultLeft: 50,
    defaultScale: 0.78,
    defaultPerspective: 500,
    defaultRotateX: 14,
    defaultRotateY: -6,
    defaultRotateZ: 0,
    transformStyle: "perspective(500px) rotateX(14deg) rotateY(-6deg)",
    mixBlendMode: "normal",
  },
  {
    id: "mock-104",
    name: "Studio Sheet",
    bgUrl: "/Mockup/1/4.jpg",
    defaultTop: 52,
    defaultLeft: 49,
    defaultScale: 0.88,
    defaultPerspective: 800,
    defaultRotateX: 0,
    defaultRotateY: 0,
    defaultRotateZ: -2,
    transformStyle: "rotate(-2deg)",
    mixBlendMode: "normal",
  },
  {
    id: "mock-201",
    name: "Laptop Screen",
    bgUrl: "/Mockup/2/michael-dolejs-YN_BOe5zCYA-unsplash.jpg",
    defaultTop: 44,
    defaultLeft: 51,
    defaultScale: 0.72,
    defaultPerspective: 900,
    defaultRotateX: 18,
    defaultRotateY: -10,
    defaultRotateZ: 2,
    transformStyle:
      "perspective(900px) rotateX(18deg) rotateY(-10deg) rotateZ(2deg)",
    mixBlendMode: "normal",
  },
  {
    id: "mock-202",
    name: "Desk Scene",
    bgUrl: "/Mockup/2/paul-seling-KSNbLx1AWPQ-unsplash.jpg",
    defaultTop: 55,
    defaultLeft: 47,
    defaultScale: 0.85,
    defaultPerspective: 700,
    defaultRotateX: 8,
    defaultRotateY: 0,
    defaultRotateZ: 0,
    transformStyle: "perspective(700px) rotateX(8deg)",
    mixBlendMode: "normal",
  },
  {
    id: "mock-203",
    name: "Poster Wall",
    bgUrl: "/Mockup/2/planet-volumes-5rEXSophcxs-unsplash.jpg",
    defaultTop: 42,
    defaultLeft: 53,
    defaultScale: 0.8,
    defaultPerspective: 800,
    defaultRotateX: 0,
    defaultRotateY: 9,
    defaultRotateZ: -3,
    transformStyle: "perspective(800px) rotateY(9deg) rotateZ(-3deg)",
    mixBlendMode: "normal",
  },
  {
    id: "mock-301",
    name: "Card Stack",
    bgUrl: "/Mockup/3/jakub-zerdzicki-jSQCLQA99Og-unsplash.jpg",
    defaultTop: 47,
    defaultLeft: 50,
    defaultScale: 0.75,
    defaultPerspective: 550,
    defaultRotateX: 22,
    defaultRotateY: 0,
    defaultRotateZ: 4,
    transformStyle: "perspective(550px) rotateX(22deg) rotateZ(4deg)",
    mixBlendMode: "normal",
  },
  {
    id: "mock-302",
    name: "Device Frame",
    bgUrl: "/Mockup/3/mockupnest-com-z1Hq3zufiW8-unsplash.jpg",
    defaultTop: 45,
    defaultLeft: 49,
    defaultScale: 0.68,
    defaultPerspective: 1000,
    defaultRotateX: 12,
    defaultRotateY: -14,
    defaultRotateZ: 0,
    transformStyle:
      "perspective(1000px) rotateX(12deg) rotateY(-14deg) skewX(-2deg)",
    mixBlendMode: "normal",
  },
];

/* =========================================================
   DESIGN TOKENS — engineering blueprint palette
========================================================= */

/* Harmonized with the editor's "Spec Sheet" blueprint palette */
const MONO_FONT =
  "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace";

const PAPER = "#FBFAF7";      // document background
const BLUE_DEEP = "#0C1E30";  // drafting dark — output block
const INK = "#161A1F";
const INK_SOFT = "#585C63";
const INK_FAINT = "#9A9C97";
const RULE = "#E3E0D6";
const ACCENT = "#FF6A39";     // hi-vis marker orange
const ACCENT_DEEP = "#D8501E";
const ACCENT_SOFT = "#FFE9DE";

/* =========================================================
   MICRO COMPONENTS
========================================================= */

/** Ruled horizontal divider with an optional mono caption */
function RuledLine({ label }: { label?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        userSelect: "none",
      }}
      aria-hidden="true"
    >
      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.4px", color: INK_FAINT, fontFamily: MONO_FONT, whiteSpace: "nowrap" }}>
        {label}
      </span>
      <span style={{ flex: 1, height: 1, background: RULE }} />
    </div>
  );
}

/** Blueprint corner ticks around the preview stage */
function CornerTicks() {
  const tick: CSSProperties = {
    position: "absolute",
    width: 14,
    height: 14,
    borderColor: ACCENT,
    borderStyle: "solid",
    borderWidth: 0,
    opacity: 0.85,
    pointerEvents: "none",
    zIndex: 3,
  };
  return (
    <>
      <span style={{ ...tick, top: -1, left: -1, borderTopWidth: 2, borderLeftWidth: 2 }} />
      <span style={{ ...tick, top: -1, right: -1, borderTopWidth: 2, borderRightWidth: 2 }} />
      <span style={{ ...tick, bottom: -1, left: -1, borderBottomWidth: 2, borderLeftWidth: 2 }} />
      <span style={{ ...tick, bottom: -1, right: -1, borderBottomWidth: 2, borderRightWidth: 2 }} />
    </>
  );
}

/** Industrial range slider */
function CalibSlider({
  label,
  unit,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: MONO_FONT,
        }}
      >
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", color: INK_SOFT }}>
          {label}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT_DEEP }}>
          {Number.isInteger(step) ? value.toFixed(0) : value.toFixed(2)}
          <span style={{ color: INK_FAINT, marginLeft: 2 }}>{unit}</span>
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="dmg-range"
        aria-label={label}
        style={{
          width: "100%",
          height: 18,
          margin: 0,
          cursor: "ew-resize",
          accentColor: ACCENT,
        }}
      />
    </div>
  );
}

/* =========================================================
   SHARED STATE HOOK
   ----------------------------------------------------------
   Holds the active plate + calibration. Both MockupStage and
   MockupControls consume it so the center and sidebar always
   stay in sync.
========================================================= */

export function useMockupGenerator() {
  const [activeId, setActiveId] = useState<string>(USER_MOCKUPS[0].id);
  const [calibration, setCalibration] = useState<Calibration>({
    top: USER_MOCKUPS[0].defaultTop,
    left: USER_MOCKUPS[0].defaultLeft,
    scale: USER_MOCKUPS[0].defaultScale,
    perspective: USER_MOCKUPS[0].defaultPerspective,
    rotateX: USER_MOCKUPS[0].defaultRotateX,
    rotateY: USER_MOCKUPS[0].defaultRotateY,
    rotateZ: USER_MOCKUPS[0].defaultRotateZ,
  });
  const [copied, setCopied] = useState(false);

  const activeSpec = useMemo(
    () => USER_MOCKUPS.find((m) => m.id === activeId) ?? USER_MOCKUPS[0],
    [activeId]
  );

  const activeIndex = useMemo(
    () => USER_MOCKUPS.findIndex((m) => m.id === activeId),
    [activeId]
  );

  /** Seamless swap: load the new spec's defaults instantly */
  const selectMockup = useCallback((spec: MockupSpec) => {
    setActiveId(spec.id);
    setCalibration({
      top: spec.defaultTop,
      left: spec.defaultLeft,
      scale: spec.defaultScale,
      perspective: spec.defaultPerspective,
      rotateX: spec.defaultRotateX,
      rotateY: spec.defaultRotateY,
      rotateZ: spec.defaultRotateZ,
    });
    setCopied(false);
  }, []);

  const resetCalibration = useCallback(() => {
    setCalibration({
      top: activeSpec.defaultTop,
      left: activeSpec.defaultLeft,
      scale: activeSpec.defaultScale,
      perspective: activeSpec.defaultPerspective,
      rotateX: activeSpec.defaultRotateX,
      rotateY: activeSpec.defaultRotateY,
      rotateZ: activeSpec.defaultRotateZ,
    });
  }, [activeSpec]);

  /** Paste-ready TS fragment for USER_MOCKUPS */
  const calibratedSnippet = useMemo(() => {
    /* Live 3D matrix built straight from the sidebar controllers */
    const liveTransform =
      `perspective(${calibration.perspective}px) ` +
      `rotateX(${calibration.rotateX}deg) ` +
      `rotateY(${calibration.rotateY}deg) ` +
      `rotateZ(${calibration.rotateZ}deg)`;
    return [
      `{`,
      `  id: "${activeSpec.id}",`,
      `  name: "${activeSpec.name}",`,
      `  bgUrl: "${activeSpec.bgUrl}",`,
      `  defaultTop: ${calibration.top.toFixed(1)},`,
      `  defaultLeft: ${calibration.left.toFixed(1)},`,
      `  defaultScale: ${calibration.scale.toFixed(2)},`,
      `  transformStyle: "${liveTransform}",`,
      `  mixBlendMode: "${activeSpec.mixBlendMode}",`,
      `}`,
    ].join("\n");
  }, [activeSpec, calibration]);

  const copySnippet = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(calibratedSnippet);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — ignore silently */
    }
  }, [calibratedSnippet]);

  return {
    activeId,
    calibration,
    setCalibration,
    copied,
    activeSpec,
    activeIndex,
    totalCount: USER_MOCKUPS.length,
    selectMockup,
    resetCalibration,
    calibratedSnippet,
    copySnippet,
  };
}

export type MockupGenerator = ReturnType<typeof useMockupGenerator>;

/* =========================================================
   MOCKUP STAGE — central canvas presentation
   ----------------------------------------------------------
   The spacious 4:3 live composite. Opaque #ffffff container
   with a clean border so the JPEG edges never bleed into the
   dark blueprint backdrop.
========================================================= */

export function MockupStage({
  activeSpec,
  calibration,
  renderLogoHTML,
  variant = "dark",
}: MockupStageProps) {
  /* Live logo layer — composited over the JPEG via advanced CSS.
     The 3D matrix (perspective + rotateX/Y/Z) is driven by the
     sidebar controllers so the user gets full creative control. */
  const logoLayerStyle: CSSProperties = {
    position: "absolute",
    top: `${calibration.top}%`,
    left: `${calibration.left}%`,
    width: "38%",
    aspectRatio: "2 / 1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    /* Anchor by center, then apply the live 3D transform chain */
    transform:
      `translate(-50%, -50%) scale(${calibration.scale}) ` +
      `perspective(${calibration.perspective}px) ` +
      `rotateX(${calibration.rotateX}deg) ` +
      `rotateY(${calibration.rotateY}deg) ` +
      `rotateZ(${calibration.rotateZ}deg)`,
    transformOrigin: "center center",
    transformStyle: "preserve-3d",
    mixBlendMode: activeSpec.mixBlendMode,
    pointerEvents: "none",
    zIndex: 2,
    willChange: "transform",
  };

  const stageStyle: CSSProperties =
    variant === "dark"
      ? {
          /* Contrasts beautifully against theme.blueDeep blueprint */
          border: "2px solid rgba(255,255,255,0.18)",
          borderRadius: 12,
          boxShadow: "0 24px 70px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)",
        }
      : {
          border: `1px solid ${RULE}`,
          borderRadius: 10,
          boxShadow: "0 10px 30px rgba(17, 24, 39, 0.08)",
        };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "4 / 3",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        ...stageStyle,
      }}
    >
      <style>{`
        @keyframes dmg-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <CornerTicks />

      {/* Raw JPEG plate — keyed for seamless crossfade */}
      <img
        key={activeSpec.bgUrl}
        src={activeSpec.bgUrl}
        alt={activeSpec.name}
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          animation: "dmg-fade-in 0.35s ease both",
          userSelect: "none",
        }}
      />

      {/* Live logo composite layer */}
      <div style={logoLayerStyle}>{renderLogoHTML()}</div>

      {/* Technical metadata overlay */}
      <div
        style={{
          position: "absolute",
          left: 10,
          bottom: 8,
          zIndex: 3,
          display: "flex",
          gap: 10,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "1px",
          color: "rgba(17, 24, 39, 0.55)",
          textShadow: "0 1px 0 rgba(255,255,255,0.8)",
          pointerEvents: "none",
        }}
      >
        <span>ID:{activeSpec.id.toUpperCase()}</span>
        <span>BLEND:{activeSpec.mixBlendMode.toUpperCase()}</span>
        <span>T:{calibration.top.toFixed(1)}%</span>
        <span>L:{calibration.left.toFixed(1)}%</span>
        <span>S:{calibration.scale.toFixed(2)}×</span>
        <span>P:{calibration.perspective}px</span>
        <span>RX:{calibration.rotateX.toFixed(0)}°</span>
        <span>RY:{calibration.rotateY.toFixed(0)}°</span>
        <span>RZ:{calibration.rotateZ.toFixed(0)}°</span>
      </div>
    </div>
  );
}

/* =========================================================
   PLATE RAIL — 01 to 09 mockup item selectors
========================================================= */

export function MockupPlateRail({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (spec: MockupSpec) => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))",
        gap: 8,
      }}
      role="listbox"
      aria-label="Mockup plates"
    >
      {USER_MOCKUPS.map((spec, i) => {
        const isActive = spec.id === activeId;
        return (
          <button
            key={spec.id}
            role="option"
            aria-selected={isActive}
            onClick={() => onSelect(spec)}
            className="dmg-rail-item"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 8,
              border: `1px solid ${isActive ? ACCENT : RULE}`,
              background: isActive ? ACCENT_SOFT : "#ffffff",
              color: isActive ? ACCENT_DEEP : INK_SOFT,
              cursor: "pointer",
              textAlign: "left",
              minWidth: 0,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                opacity: 0.65,
                flexShrink: 0,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.3px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {spec.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================
   CALIBRATION CONSOLE — TOP / LEFT / SCALE + live 3D matrix
   (perspective + rotateX / rotateY / rotateZ)
========================================================= */

function MockupCalibrationConsole({
  calibration,
  onChange,
  onReset,
}: {
  calibration: Calibration;
  onChange: (patch: Partial<Calibration>) => void;
  onReset: () => void;
}) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <CalibSlider
          label="TOP"
          unit="%"
          value={calibration.top}
          min={0}
          max={100}
          step={0.5}
          onChange={(top) => onChange({ top })}
        />
        <CalibSlider
          label="LEFT"
          unit="%"
          value={calibration.left}
          min={0}
          max={100}
          step={0.5}
          onChange={(left) => onChange({ left })}
        />
        <CalibSlider
          label="SCALE"
          unit="×"
          value={calibration.scale}
          min={0.2}
          max={2.5}
          step={0.01}
          onChange={(scale) => onChange({ scale })}
        />
        <CalibSlider
          label="PERSPECTIVE"
          unit="px"
          value={calibration.perspective}
          min={200}
          max={2000}
          step={10}
          onChange={(perspective) => onChange({ perspective })}
        />
        <CalibSlider
          label="ROTATE X"
          unit="deg"
          value={calibration.rotateX}
          min={-90}
          max={90}
          step={1}
          onChange={(rotateX) => onChange({ rotateX })}
        />
        <CalibSlider
          label="ROTATE Y"
          unit="deg"
          value={calibration.rotateY}
          min={-90}
          max={90}
          step={1}
          onChange={(rotateY) => onChange({ rotateY })}
        />
        <CalibSlider
          label="ROTATE Z"
          unit="deg"
          value={calibration.rotateZ}
          min={-180}
          max={180}
          step={1}
          onChange={(rotateZ) => onChange({ rotateZ })}
        />
      </div>

      <button
        type="button"
        onClick={onReset}
        className="dmg-rail-item"
        style={{
          alignSelf: "flex-start",
          fontFamily: MONO_FONT,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "1.2px",
          color: INK_SOFT,
          background: "transparent",
          border: `1px solid ${RULE}`,
          borderRadius: 6,
          padding: "5px 10px",
          cursor: "pointer",
        }}
      >
        ↺ RESET TO SPEC DEFAULTS
      </button>
    </>
  );
}

/* =========================================================
   OUTPUT BLOCK — black paste-ready code box
========================================================= */

function MockupOutputBlock({
  snippet,
  copied,
  onCopy,
}: {
  snippet: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        background: BLUE_DEEP,
        borderRadius: 10,
        padding: "12px 12px 12px",
        overflow: "hidden",
      }}
    >
      <pre
        style={{
          margin: 0,
          fontFamily: MONO_FONT,
          fontSize: 10,
          lineHeight: 1.65,
          color: "rgba(245, 244, 239, 0.92)",
          whiteSpace: "pre",
          overflowX: "auto",
        }}
      >
        {snippet}
      </pre>

      <button
        type="button"
        onClick={onCopy}
        className="dmg-rail-item"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          fontFamily: MONO_FONT,
          fontSize: 8,
          fontWeight: 700,
          letterSpacing: "1px",
          color: copied ? "#7EE2B8" : "#FFB59E",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.16)",
          borderRadius: 5,
          padding: "4px 8px",
          cursor: "pointer",
        }}
      >
        {copied ? "✓ COPIED" : "COPY"}
      </button>
    </div>
  );
}

/* =========================================================
   MOCKUP CONTROLS — right-sidebar calibration tools
   ----------------------------------------------------------
   Plate selectors + sliders + reset + output code block,
   styled to slot into the editor's right control panel.
========================================================= */

export function MockupControls({ generator }: { generator: MockupGenerator }) {
  const {
    activeId,
    calibration,
    copied,
    selectMockup,
    setCalibration,
    resetCalibration,
    calibratedSnippet,
    copySnippet,
  } = generator;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Scoped slider + rail chrome */}
      <style>{`
        .dmg-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 2px;
          background: ${ACCENT};
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px ${ACCENT};
          cursor: ew-resize;
          transition: transform 0.12s ease;
        }
        .dmg-range::-webkit-slider-thumb:hover { transform: scale(1.25); }
        .dmg-range::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 2px;
          background: ${ACCENT};
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px ${ACCENT};
          cursor: ew-resize;
        }
        .dmg-rail-item { transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease; }
      `}</style>

      {/* ── PLATE INDEX — mockup item selectors ── */}
      <div style={{ paddingBottom: 18, borderBottom: `1px solid ${RULE}` }}>
        <RuledLine label="PLATE INDEX" />
        <div style={{ marginTop: 12 }}>
          <MockupPlateRail activeId={activeId} onSelect={selectMockup} />
        </div>
      </div>

      {/* ── CALIBRATION — TOP / LEFT / SCALE ── */}
      <div style={{ paddingBottom: 18, borderBottom: `1px solid ${RULE}` }}>
        <RuledLine label="CALIBRATION // LIVE" />
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 16 }}>
          <MockupCalibrationConsole
            calibration={calibration}
            onChange={(patch) => setCalibration((c) => ({ ...c, ...patch }))}
            onReset={resetCalibration}
          />
        </div>
      </div>

      {/* ── OUTPUT — black code block ── */}
      <div>
        <RuledLine label="OUTPUT // PASTE INTO USER_MOCKUPS" />
        <div style={{ marginTop: 14 }}>
          <MockupOutputBlock snippet={calibratedSnippet} copied={copied} onCopy={copySnippet} />
        </div>
        <p
          style={{
            margin: "12px 0 0",
            fontSize: 9,
            lineHeight: 1.7,
            letterSpacing: "0.4px",
            color: INK_FAINT,
          }}
        >
          DRAG SLIDERS OVER THE LIVE PLATE, THEN COPY THE BLOCK ABOVE AND
          REPLACE THE MATCHING ENTRY IN <strong>USER_MOCKUPS</strong>.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT — legacy all-in-one UI
   ----------------------------------------------------------
   Kept for backward compatibility: composes the same parts in
   the original single-section layout (stage left, console right).
========================================================= */

export default function DynamicMockupGenerator({
  renderLogoHTML,
}: DynamicMockupGeneratorProps) {
  const g = useMockupGenerator();
  const { activeSpec, calibration } = g;

  return (
    <section
      style={{
        fontFamily: MONO_FONT,
        background: PAPER,
        border: `1px solid ${RULE}`,
        borderRadius: 16,
        overflow: "hidden",
        color: INK,
      }}
    >
      {/* Scoped keyframes + slider chrome */}
      <style>{`
        @keyframes dmg-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .dmg-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 2px;
          background: ${ACCENT};
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px ${ACCENT};
          cursor: ew-resize;
          transition: transform 0.12s ease;
        }
        .dmg-range::-webkit-slider-thumb:hover { transform: scale(1.25); }
        .dmg-range::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 2px;
          background: ${ACCENT};
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 1px ${ACCENT};
          cursor: ew-resize;
        }
        .dmg-rail-item { transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease; }
      `}</style>

      {/* ═══════════ HEADER — document title block ═══════════ */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 18px",
          borderBottom: `1px solid ${RULE}`,
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "1px",
              color: "#1A0E08",
              background: ACCENT,
              padding: "3px 7px",
              borderRadius: 4,
            }}
          >
            MOCKUP
          </span>
          <h3
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.6px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            DYNAMIC MOCKUP GENERATOR
          </h3>
        </div>

        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "1.2px",
            color: INK_FAINT,
            whiteSpace: "nowrap",
          }}
        >
          SHEET {String(g.activeIndex + 1).padStart(2, "0")} /{" "}
          {String(g.totalCount).padStart(2, "0")}
        </span>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 264px",
          gap: 0,
        }}
      >
        {/* ═══════════ LEFT — PREVIEW STAGE + PLATE RAIL ═══════════ */}
        <div
          style={{
            padding: 18,
            borderRight: `1px solid ${RULE}`,
            display: "flex",
            flexDirection: "column",
            gap: 14,
            minWidth: 0,
          }}
        >
          <RuledLine label="FIG. A — COMPOSITED OUTPUT" />

          <MockupStage
            activeSpec={activeSpec}
            calibration={calibration}
            renderLogoHTML={renderLogoHTML}
            variant="light"
          />

          <RuledLine label="PLATE INDEX" />
          <MockupPlateRail activeId={g.activeId} onSelect={g.selectMockup} />
        </div>

        {/* ═══════════ RIGHT — CALIBRATION CONSOLE ═══════════ */}
        <aside
          style={{
            padding: 18,
            background: "#ffffff",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            minWidth: 0,
          }}
        >
          <RuledLine label="CALIBRATION // LIVE" />

          <MockupCalibrationConsole
            calibration={g.calibration}
            onChange={(patch) => g.setCalibration((c) => ({ ...c, ...patch }))}
            onReset={g.resetCalibration}
          />

          <RuledLine label="OUTPUT // PASTE INTO USER_MOCKUPS" />

          <MockupOutputBlock
            snippet={g.calibratedSnippet}
            copied={g.copied}
            onCopy={g.copySnippet}
          />

          <p
            style={{
              margin: 0,
              fontSize: 9,
              lineHeight: 1.7,
              letterSpacing: "0.4px",
              color: INK_FAINT,
            }}
          >
            DRAG SLIDERS OVER THE LIVE PLATE, THEN COPY THE BLOCK ABOVE AND
            REPLACE THE MATCHING ENTRY IN <strong>USER_MOCKUPS</strong>.
          </p>
        </aside>
      </div>
    </section>
  );
}