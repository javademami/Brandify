"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type Dispatch,
  type ReactElement,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useSearchParams } from "next/navigation";

/* =========================================================
   TYPES
========================================================= */

export type MockupBlendMode =
  | "normal"
  | "multiply"
  | "overlay"
  | "screen";

export type MockupContrastMode =
  | "auto"
  | "normal"
  | "light"
  | "dark";

export interface Calibration {
  top: number;
  left: number;
  scale: number;
  perspective: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  opacity: number;
  contrastMode: MockupContrastMode;
  shadow: number;
  outline: number;
}

export interface MockupSpec {
  id: string;
  name: string;
  bgUrl: string;
  folder: number;
  imageNumber: number;

  defaultTop: number;
  defaultLeft: number;
  defaultScale: number;
  defaultPerspective: number;

  defaultRotateX: number;
  defaultRotateY: number;
  defaultRotateZ: number;

  transformStyle: string;
  mixBlendMode: MockupBlendMode;
  contrastMode?: MockupContrastMode;
  defaultOpacity?: number;
}

export type MockupSetter = (spec: MockupSpec) => void;

export interface UseMockupGeneratorResult {
  activeSpec: MockupSpec;
  calibration: Calibration;

  setActiveSpec: MockupSetter;

  setCalibration: Dispatch<SetStateAction<Calibration>>;

  resetCalibration: () => void;

  selectMockup: (spec: MockupSpec) => void;
}

type MockupLogoCSSProperties = CSSProperties & {
  "--mockup-logo-color"?: string;
};

/* =========================================================
   MOCKUP DATABASE
   2 FOLDERS
   15 IMAGES EACH
========================================================= */

export const USER_MOCKUPS: MockupSpec[] = Array.from(
  { length: 30 },
  (_, index): MockupSpec => {
    const folder = Math.floor(index / 15) + 1;
    const imageNumber = (index % 15) + 1;

    return {
      id: `folder-${folder}-mockup-${imageNumber}`,

      name: `Mockup ${folder}/${imageNumber}`,

      bgUrl: `/Mockup/${folder}/${imageNumber}.png`,

      folder,

      imageNumber,

      defaultTop: 50,

      defaultLeft: 50,

      defaultScale: 0.65,

      defaultPerspective: 800,

      defaultRotateX: 0,

      defaultRotateY: 0,

      defaultRotateZ: 0,

      transformStyle: "preserve-3d",

      mixBlendMode: "normal",

      contrastMode: "auto",

      defaultOpacity: 1,
    };
  },
);

/* =========================================================
   SAFE NUMBER
========================================================= */

function finiteNumber(
  value: unknown,
  fallback: number,
): number {
  const numberValue =
    typeof value === "number"
      ? value
      : Number(value);

  return Number.isFinite(numberValue)
    ? numberValue
    : fallback;
}

/* =========================================================
   CALIBRATION SANITIZER
========================================================= */

export function sanitizeCalibration(
  calibration?: Partial<Calibration> | null,
): Calibration {
  return {
    top: finiteNumber(
      calibration?.top,
      50,
    ),

    left: finiteNumber(
      calibration?.left,
      50,
    ),

    scale: finiteNumber(
      calibration?.scale,
      0.65,
    ),

    perspective: finiteNumber(
      calibration?.perspective,
      800,
    ),

    rotateX: finiteNumber(
      calibration?.rotateX,
      0,
    ),

    rotateY: finiteNumber(
      calibration?.rotateY,
      0,
    ),

    rotateZ: finiteNumber(
      calibration?.rotateZ,
      0,
    ),

    opacity: Math.min(
      1,
      Math.max(
        0,
        finiteNumber(
          calibration?.opacity,
          1,
        ),
      ),
    ),

    contrastMode:
      calibration?.contrastMode === "light" ||
      calibration?.contrastMode === "dark" ||
      calibration?.contrastMode === "normal"
        ? calibration.contrastMode
        : "auto",

    shadow: Math.min(
      1,
      Math.max(
        0,
        finiteNumber(
          calibration?.shadow,
          0.7,
        ),
      ),
    ),

    outline: Math.min(
      1,
      Math.max(
        0,
        finiteNumber(
          calibration?.outline,
          0.35,
        ),
      ),
    ),
  };
}

/* =========================================================
   DEFAULT CALIBRATION
========================================================= */

function getDefaultCalibration(
  spec: MockupSpec,
): Calibration {
  return sanitizeCalibration({
    top: spec.defaultTop,

    left: spec.defaultLeft,

    scale: spec.defaultScale,

    perspective:
      spec.defaultPerspective,

    rotateX:
      spec.defaultRotateX,

    rotateY:
      spec.defaultRotateY,

    rotateZ:
      spec.defaultRotateZ,

    opacity:
      spec.defaultOpacity ?? 1,

    contrastMode:
      spec.contrastMode ?? "auto",

    shadow: 0.7,

    outline: 0.35,
  });
}

/* =========================================================
   FOLDER LOGO COLOR
========================================================= */

export function getLogoColorForFolder(
  folder: number,
): string {
  return folder === 1
    ? "#111111"
    : "#FFFFFF";
}

/* =========================================================
   FOLDER LOGO MODE
========================================================= */

function getFolderLogoMode(
  folder: number,
): MockupContrastMode {
  return folder === 1
    ? "dark"
    : "light";
}

/* =========================================================
   LOGO ELEMENT TYPES
========================================================= */

interface LogoElementProps {
  style?: CSSProperties;
  children?: ReactNode;
  color?: string;
  fill?: string;
  stroke?: string;
}

/* =========================================================
   APPLY LOGO COLOR TO RENDERED REACT NODE
========================================================= */

function applyLogoColorToNode(
  node: ReactNode,
  logoColor: string,
): ReactNode {
  return Children.map(
    node,
    (child) => {
      if (!isValidElement(child)) {
        return child;
      }

      const element =
        child as ReactElement<LogoElementProps>;

      const existingStyle =
        element.props.style ?? {};

      const elementType =
        typeof element.type ===
        "string"
          ? element.type.toLowerCase()
          : "";

      const isSvgElement =
        elementType === "svg" ||
        elementType === "path" ||
        elementType === "g" ||
        elementType === "circle" ||
        elementType === "ellipse" ||
        elementType === "rect" ||
        elementType === "line" ||
        elementType === "polyline" ||
        elementType === "polygon" ||
        elementType === "text" ||
        elementType === "tspan" ||
        elementType === "use" ||
        elementType === "symbol";

      const colorStyle: CSSProperties = {
        color:
          "var(--mockup-logo-color)",
      };

      if (isSvgElement) {
        colorStyle.fill =
          "var(--mockup-logo-color)";

        colorStyle.stroke =
          "var(--mockup-logo-color)";
      }

      const mergedStyle: MockupLogoCSSProperties =
        {
          ...existingStyle,

          ...colorStyle,

          "--mockup-logo-color":
            logoColor,
        };

      const transformedChildren =
        element.props.children !==
        undefined
          ? applyLogoColorToNode(
              element.props.children,
              logoColor,
            )
          : undefined;

      return cloneElement(
        element,
        {
          style: mergedStyle,
          color: logoColor,
          ...(isSvgElement
            ? {
                fill: logoColor,
                stroke: logoColor,
              }
            : {}),
          ...(transformedChildren !==
          undefined
            ? {
                children:
                  transformedChildren,
              }
            : {}),
        },
      );
    },
  );
}

/* =========================================================
   COLORED LOGO
========================================================= */

function ColoredLogo({
  logoColor,
  renderLogoHTML,
}: {
  logoColor: string;
  renderLogoHTML: () => ReactNode;
}) {
  const renderedLogo =
    renderLogoHTML();

  return (
    <span
      aria-hidden="true"
      style={
        {
          "--mockup-logo-color":
            logoColor,

          color:
            "var(--mockup-logo-color)",

          fill:
            "var(--mockup-logo-color)",

          stroke:
            "var(--mockup-logo-color)",

          display:
            "inline-block",

          lineHeight:
            0,

          width:
            "max-content",

          maxWidth:
            "100%",
        } as MockupLogoCSSProperties
      }
    >
      {applyLogoColorToNode(
        renderedLogo,
        logoColor,
      )}
    </span>
  );
}

/* =========================================================
   CUSTOM HOOK
========================================================= */

export function useMockupGenerator(
  userMockups: MockupSpec[] = USER_MOCKUPS,
): UseMockupGeneratorResult {
  const database =
    Array.isArray(userMockups) &&
    userMockups.length > 0
      ? userMockups
      : USER_MOCKUPS;

  const initialSpec =
    database[0] ??
    USER_MOCKUPS[0];

  const [activeSpecState, setActiveSpecState] =
    useState<MockupSpec>(
      initialSpec,
    );

  const [calibrations, setCalibrations] =
    useState<
      Record<string, Calibration>
    >(() => ({
      [initialSpec.id]:
        getDefaultCalibration(
          initialSpec,
        ),
    }));

  const calibration =
    calibrations[
      activeSpecState.id
    ] ??
    getDefaultCalibration(
      activeSpecState,
    );

  const setCalibration: Dispatch<
    SetStateAction<Calibration>
  > = useCallback(
    (value) => {
      setCalibrations(
        (previous) => {
          const current =
            previous[
              activeSpecState.id
            ] ??
            getDefaultCalibration(
              activeSpecState,
            );

          const next =
            typeof value === "function"
              ? value(current)
              : value;

          return {
            ...previous,

            [activeSpecState.id]:
              sanitizeCalibration(
                next,
              ),
          };
        },
      );
    },
    [activeSpecState],
  );

  const resetCalibration =
    useCallback(() => {
      setCalibrations(
        (previous) => ({
          ...previous,

          [activeSpecState.id]:
            getDefaultCalibration(
              activeSpecState,
            ),
        }),
      );
    }, [activeSpecState]);

  const selectMockup =
    useCallback(
      (spec: MockupSpec) => {
        if (!spec) {
          return;
        }

        setActiveSpecState(
          spec,
        );

        setCalibrations(
          (previous) => {
            if (previous[spec.id]) {
              return previous;
            }

            return {
              ...previous,

              [spec.id]:
                getDefaultCalibration(
                  spec,
                ),
            };
          },
        );
      },
      [],
    );

  const setActiveSpec =
    useCallback(
      (spec: MockupSpec) => {
        selectMockup(spec);
      },
      [selectMockup],
    );

  const safeCalibration =
    useMemo(
      () =>
        sanitizeCalibration(
          calibration,
        ),
      [
        calibration.top,
        calibration.left,
        calibration.scale,
        calibration.perspective,
        calibration.rotateX,
        calibration.rotateY,
        calibration.rotateZ,
        calibration.opacity,
        calibration.contrastMode,
        calibration.shadow,
        calibration.outline,
      ],
    );

  return {
    activeSpec:
      activeSpecState,

    calibration:
      safeCalibration,

    setActiveSpec,

    setCalibration,

    resetCalibration,

    selectMockup,
  };
}

/* =========================================================
   STAGE TYPES
========================================================= */

export interface MockupStageProps {
  activeSpec: MockupSpec;

  calibration?: Calibration | null;

  logoColor?: string;

  renderLogoHTML: () => ReactNode;
}

/* =========================================================
   COLORS
========================================================= */

const MONO_FONT =
  "'JetBrains Mono', 'SFMono-Regular', Menlo, Consolas, monospace";

const PAPER =
  "#FBFAF7";

const BLUE_DEEP =
  "#0C1E30";

const INK =
  "#161A1F";

const INK_SOFT =
  "#585C63";

const INK_FAINT =
  "#9A9C97";

const RULE =
  "#E3E0D6";

const ACCENT =
  "#FF6A39";

const ACCENT_DEEP =
  "#D8501E";

const ACCENT_SOFT =
  "#FFE9DE";

/* =========================================================
   CORNER TICKS
========================================================= */

function CornerTicks() {
  const tick: CSSProperties = {
    position:
      "absolute",

    width: 14,

    height: 14,

    borderColor:
      ACCENT,

    borderStyle:
      "solid",

    borderWidth: 0,

    opacity: 0.85,

    pointerEvents:
      "none",

    zIndex: 10,
  };

  return (
    <>
      <span
        style={{
          ...tick,

          top: -1,

          left: -1,

          borderTopWidth: 2,

          borderLeftWidth: 2,
        }}
      />

      <span
        style={{
          ...tick,

          top: -1,

          right: -1,

          borderTopWidth: 2,

          borderRightWidth: 2,
        }}
      />

      <span
        style={{
          ...tick,

          bottom: -1,

          left: -1,

          borderBottomWidth: 2,

          borderLeftWidth: 2,
        }}
      />

      <span
        style={{
          ...tick,

          bottom: -1,

          right: -1,

          borderBottomWidth: 2,

          borderRightWidth: 2,
        }}
      />
    </>
  );
}

/* =========================================================
   CONTRAST FILTER
   Folder color is the source of truth.
========================================================= */

function getContrastFilter(
  logoColor: string,
  shadow = 0.7,
  outline = 0.35,
): string {
  const isDarkLogo =
    logoColor === "#111111";

  if (isDarkLogo) {
    const outlineAlpha =
      Math.min(
        0.8,
        0.18 +
          outline * 0.5,
      );

    const shadowAlpha =
      Math.min(
        0.45,
        shadow * 0.35,
      );

    return [
      `drop-shadow(0 0 1px rgba(255,255,255,${outlineAlpha}))`,
      `drop-shadow(0 1px 2px rgba(0,0,0,${shadowAlpha}))`,
    ].join(" ");
  }

  const outlineAlpha =
    Math.min(
      0.95,
      0.35 +
        outline * 0.8,
    );

  const shadowAlpha =
    Math.min(
      0.9,
      0.25 +
        shadow * 0.65,
    );

  return [
    `drop-shadow(0 0 1px rgba(0,0,0,${outlineAlpha}))`,
    `drop-shadow(0 1px 2px rgba(0,0,0,${shadowAlpha}))`,
    `drop-shadow(0 -1px 1px rgba(0,0,0,${shadowAlpha * 0.55}))`,
  ].join(" ");
}

/* =========================================================
   PRESENTATION STAGE
========================================================= */

export function MockupStage({
  activeSpec,
  calibration,
  renderLogoHTML,
}: MockupStageProps) {
  const safeCalibration =
    useMemo(
      () =>
        sanitizeCalibration(
          calibration,
        ),
      [
        calibration?.top,
        calibration?.left,
        calibration?.scale,
        calibration?.perspective,
        calibration?.rotateX,
        calibration?.rotateY,
        calibration?.rotateZ,
        calibration?.opacity,
        calibration?.contrastMode,
        calibration?.shadow,
        calibration?.outline,
      ],
    );

  const effectiveLogoColor =
    getLogoColorForFolder(
      activeSpec.folder,
    );

  const folderLogoMode =
    getFolderLogoMode(
      activeSpec.folder,
    );

  const logoTransform =
    useMemo(() => {
      return [
        "translate(-50%, -50%)",

        `scale(${safeCalibration.scale})`,

        `perspective(${safeCalibration.perspective}px)`,

        `rotateX(${safeCalibration.rotateX}deg)`,

        `rotateY(${safeCalibration.rotateY}deg)`,

        `rotateZ(${safeCalibration.rotateZ}deg)`,
      ].join(" ");
    }, [safeCalibration]);

  const safeTop =
    safeCalibration.top;

  const safeLeft =
    safeCalibration.left;

  return (
    <div
      style={{
        position:
          "relative",

        width:
          "100%",

        height:
          "100%",

        minHeight:
          0,

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        padding:
          20,

        boxSizing:
          "border-box",
      }}
    >
      <div
        style={{
          position:
            "relative",

          width:
            "100%",

          maxWidth:
            900,

          aspectRatio:
            "1 / 1",

          overflow:
            "hidden",

          background:
            "#ffffff",

          borderRadius:
            12,

          boxShadow:
            "0 24px 70px rgba(0,0,0,0.25)",

          border:
            "1px solid rgba(0,0,0,0.06)",

          isolation:
            "isolate",
        }}
      >
        <CornerTicks />

        <img
          src={
            activeSpec.bgUrl
          }
          alt={
            activeSpec.name
          }
          draggable={
            false
          }
          style={{
            position:
              "absolute",

            inset:
              0,

            width:
              "100%",

            height:
              "100%",

            objectFit:
              "cover",

            display:
              "block",

            pointerEvents:
              "none",

            userSelect:
              "none",
          }}
        />

        <div
          key={`${activeSpec.id}-${effectiveLogoColor}`}
          data-logo-mode={
            folderLogoMode
          }
          data-logo-color={
            effectiveLogoColor
          }
          style={
            {
              "--mockup-logo-color":
                effectiveLogoColor,

              position:
                "absolute",

              top:
                `${safeTop}%`,

              left:
                `${safeLeft}%`,

              transform:
                logoTransform,

              transformOrigin:
                "center center",

              color:
                "var(--mockup-logo-color)",

              fill:
                "var(--mockup-logo-color)",

              stroke:
                "var(--mockup-logo-color)",

              mixBlendMode:
                activeSpec.mixBlendMode,

              opacity:
                safeCalibration.opacity,

              filter:
                getContrastFilter(
                  effectiveLogoColor,
                  safeCalibration.shadow,
                  safeCalibration.outline,
                ),

              pointerEvents:
                "none",

              userSelect:
                "none",

              zIndex:
                5,
            } as MockupLogoCSSProperties
          }
        >
          <ColoredLogo
            logoColor={
              effectiveLogoColor
            }
            renderLogoHTML={
              renderLogoHTML
            }
          />
        </div>

        <div
          style={{
            position:
              "absolute",

            left:
              16,

            bottom:
              16,

            padding:
              "6px 12px",

            background:
              BLUE_DEEP,

            color:
              "#ffffff",

            borderRadius:
              4,

            fontFamily:
              MONO_FONT,

            fontSize:
              10,

            fontWeight:
              600,

            letterSpacing:
              "0.05em",

            zIndex:
              20,

            pointerEvents:
              "none",
          }}
        >
          LIVE_RENDER //
          {" "}
          {String(
            activeSpec.bgUrl ??
              "",
          ).toUpperCase()}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CONTROLS TYPES
========================================================= */

export interface MockupControlsProps {
  activeSpec: MockupSpec;

  calibration?: Calibration | null;

  setCalibration: Dispatch<
    SetStateAction<Calibration>
  >;

  setActiveSpec:
    MockupSetter;

  USER_MOCKUPS:
    MockupSpec[];
}

/* =========================================================
   SMALL UI
========================================================= */

function RuledLine({
  label,
}: {
  label: string;
}) {
  return (
    <div
      style={{
        display:
          "flex",

        alignItems:
          "center",

        gap:
          10,

        userSelect:
          "none",
      }}
      aria-hidden="true"
    >
      <span
        style={{
          fontSize:
            9,

          fontWeight:
            700,

          letterSpacing:
            "1.4px",

          color:
            INK_FAINT,

          fontFamily:
            MONO_FONT,

          whiteSpace:
            "nowrap",
        }}
      >
        {label}
      </span>

      <span
        style={{
          flex:
            1,

          height:
            1,

          background:
            RULE,
        }}
      />
    </div>
  );
}

/* =========================================================
   SLIDER
========================================================= */

interface CalibrationSliderProps {
  label: string;

  value: number;

  min: number;

  max: number;

  step?: number;

  suffix?: string;

  onChange:
    (value: number) => void;
}

function CalibrationSlider({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: CalibrationSliderProps) {
  const safeValue =
    finiteNumber(
      value,
      min,
    );

  return (
    <label
      style={{
        display:
          "flex",

        flexDirection:
          "column",

        gap:
          6,

        fontFamily:
          MONO_FONT,

        fontSize:
          11,

        color:
          INK,
      }}
    >
      <span
        style={{
          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          gap:
            10,
        }}
      >
        <span>
          {label}
        </span>

        <strong
          style={{
            color:
              ACCENT_DEEP,

            fontSize:
              10,

            fontWeight:
              700,
          }}
        >
          {safeValue}
          {suffix}
        </strong>
      </span>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        onChange={(
          event,
        ) => {
          const nextValue =
            Number(
              event.target
                .value,
            );

          if (
            Number.isFinite(
              nextValue,
            )
          ) {
            onChange(
              nextValue,
            );
          }
        }}
        style={{
          width:
            "100%",

          cursor:
            "pointer",

          accentColor:
            ACCENT,
        }}
      />
    </label>
  );
}

/* =========================================================
   LABEL
========================================================= */

function folderLabel(
  folder: number,
  imageNumber: number,
) {
  return `FOLDER ${folder} · ${imageNumber}.PNG`;
}

/* =========================================================
   CONTROLS
========================================================= */

export function MockupControls({
  activeSpec,
  calibration,
  setCalibration,
  setActiveSpec,
  USER_MOCKUPS,
}: MockupControlsProps) {
  const searchParams =
    useSearchParams();

  const isDevMode =
    searchParams.get(
      "dev",
    ) === "true";

  const safeCalibration =
    useMemo(
      () =>
        sanitizeCalibration(
          calibration,
        ),
      [
        calibration?.top,
        calibration?.left,
        calibration?.scale,
        calibration?.perspective,
        calibration?.rotateX,
        calibration?.rotateY,
        calibration?.rotateZ,
        calibration?.opacity,
        calibration?.contrastMode,
        calibration?.shadow,
        calibration?.outline,
      ],
    );

  const updateCalibration =
    useCallback(
      <
        K extends keyof Calibration
      >(
        key: K,
        value: Calibration[K],
      ) => {
        setCalibration(
          (previous) => {
            const previousSafe =
              sanitizeCalibration(
                previous,
              );

            if (
              key ===
              "contrastMode"
            ) {
              const nextMode: MockupContrastMode =
                value ===
                  "light" ||
                value ===
                  "dark" ||
                value ===
                  "normal"
                  ? value
                  : "auto";

              return {
                ...previousSafe,

                contrastMode:
                  nextMode,
              };
            }

            const numericValue =
              finiteNumber(
                value,
                previousSafe[
                  key
                ] as number,
              );

            return {
              ...previousSafe,

              [key]:
                numericValue,
            };
          },
        );
      },
      [setCalibration],
    );

  const copyConfigCode =
    useCallback(
      async () => {
        const snippet = `{
  defaultTop: ${safeCalibration.top},
  defaultLeft: ${safeCalibration.left},
  defaultScale: ${safeCalibration.scale},
  defaultPerspective: ${safeCalibration.perspective},
  defaultRotateX: ${safeCalibration.rotateX},
  defaultRotateY: ${safeCalibration.rotateY},
  defaultRotateZ: ${safeCalibration.rotateZ},
  opacity: ${safeCalibration.opacity},
  contrastMode: "${getFolderLogoMode(activeSpec.folder)}",
}`;

        try {
          await navigator.clipboard.writeText(
            snippet,
          );

          window.alert(
            "Configuration copied.",
          );
        } catch {
          window.alert(
            "Copy failed.",
          );
        }
      },
      [
        safeCalibration,
        activeSpec.folder,
      ],
    );

  const mockups: MockupSpec[] =
    Array.isArray(
      USER_MOCKUPS,
    ) &&
    USER_MOCKUPS.length > 0
      ? USER_MOCKUPS
      : [];

  const folders =
    [1, 2];

  const [
    selectedFolder,
    setSelectedFolder,
  ] = useState<number>(
    activeSpec?.folder ||
      1,
  );

  const visibleMockups =
    mockups.filter(
      (spec) =>
        spec.folder ===
        selectedFolder,
    );

  const handleSelect =
    useCallback(
      (spec: MockupSpec) => {
        setSelectedFolder(
          spec.folder,
        );

        setActiveSpec(
          spec,
        );
      },
      [setActiveSpec],
    );

  return (
    <aside
      style={{
        height:
          "100%",

        minHeight:
          0,

        background:
          PAPER,

        borderLeft:
          `1px solid ${RULE}`,

        padding:
          24,

        boxSizing:
          "border-box",

        display:
          "flex",

        flexDirection:
          "column",

        gap:
          24,

        overflowY:
          "auto",
      }}
    >
      <div>
        <span
          style={{
            display:
              "inline-flex",

            alignItems:
              "center",

            gap:
              6,

            fontFamily:
              MONO_FONT,

            fontSize:
              10,

            fontWeight:
              600,

            letterSpacing:
              "0.09em",

            color:
              INK_SOFT,
          }}
        >
          <span
            style={{
              width:
                5,

              height:
                5,

              borderRadius:
                1,

              background:
                ACCENT,
            }}
          />

          REAL-WORLD PREVIEW
        </span>

        <h3
          style={{
            fontSize:
              20,

            fontWeight:
              700,

            color:
              INK,

            margin:
              "6px 0 0",
          }}
        >
          Live Brand
        </h3>

        <p
          style={{
            fontSize:
              13,

            color:
              INK_SOFT,

            margin:
              "6px 0 0",

            lineHeight:
              1.6,
          }}
        >
          Preview your logo on
          real-world materials
          and commercial items.
        </p>
      </div>

      <RuledLine
        label="SELECT MOCKUP FOLDER"
      />

      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",

          gap:
            8,
        }}
      >
        {folders.map(
          (folder) => {
            const active =
              selectedFolder ===
              folder;

            return (
              <button
                key={folder}
                type="button"
                onClick={() =>
                  setSelectedFolder(
                    folder,
                  )
                }
                style={{
                  padding:
                    "10px 8px",

                  borderRadius:
                    8,

                  border:
                    `1px solid ${
                      active
                        ? ACCENT
                        : RULE
                    }`,

                  background:
                    active
                      ? ACCENT_SOFT
                      : "#F2F0EA",

                  color:
                    active
                      ? ACCENT_DEEP
                      : INK,

                  cursor:
                    "pointer",

                  fontFamily:
                    MONO_FONT,

                  fontSize:
                    10,

                  fontWeight:
                    700,
                }}
              >
                FOLDER {folder}
              </button>
            );
          },
        )}
      </div>

      <RuledLine
        label={`15 PNG MOCKUPS · FOLDER ${selectedFolder}`}
      />

      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "repeat(2, minmax(0, 1fr))",

          gap:
            10,
        }}
      >
        {visibleMockups.map(
          (spec) => {
            const isSelected =
              spec.id ===
              activeSpec.id;

            return (
              <button
                key={spec.id}
                type="button"
                onClick={() =>
                  handleSelect(
                    spec,
                  )
                }
                aria-pressed={
                  isSelected
                }
                style={{
                  minWidth:
                    0,

                  display:
                    "flex",

                  flexDirection:
                    "column",

                  gap:
                    7,

                  padding:
                    6,

                  borderRadius:
                    8,

                  background:
                    isSelected
                      ? ACCENT_SOFT
                      : "#F2F0EA",

                  border:
                    `1px solid ${
                      isSelected
                        ? ACCENT
                        : RULE
                    }`,

                  cursor:
                    "pointer",

                  textAlign:
                    "left",
                }}
              >
                <div
                  style={{
                    width:
                      "100%",

                    aspectRatio:
                      "1 / 1",

                    borderRadius:
                      4,

                    overflow:
                      "hidden",

                    background:
                      "#ffffff",

                    boxShadow:
                      isSelected
                        ? "0 4px 12px rgba(0,0,0,0.10)"
                        : "none",
                  }}
                >
                  <img
                    src={
                      spec.bgUrl
                    }
                    alt={
                      spec.name
                    }
                    draggable={
                      false
                    }
                    style={{
                      width:
                        "100%",

                      height:
                        "100%",

                      objectFit:
                        "cover",

                      display:
                        "block",
                    }}
                  />
                </div>

                <span
                  style={{
                    fontFamily:
                      MONO_FONT,

                    fontSize:
                      9,

                    fontWeight:
                      700,

                    color:
                      isSelected
                        ? ACCENT_DEEP
                        : INK,

                    overflow:
                      "hidden",

                    textOverflow:
                      "ellipsis",

                    whiteSpace:
                      "nowrap",
                  }}
                >
                  {folderLabel(
                    spec.folder,
                    spec.imageNumber,
                  )}
                </span>
              </button>
            );
          },
        )}
      </div>

      {!isDevMode && (
        <div
          style={{
            marginTop:
              "auto",

            background:
              BLUE_DEEP,

            padding:
              20,

            borderRadius:
              12,

            display:
              "flex",

            flexDirection:
              "column",

            gap:
              14,

            boxShadow:
              "0 16px 40px rgba(12,30,48,0.18)",
          }}
        >
          <span
            style={{
              fontFamily:
                MONO_FONT,

              fontSize:
                9,

              color:
                ACCENT,

              fontWeight:
                700,

              letterSpacing:
                "1px",
            }}
          >
            PREMIUM ACCESS
          </span>

          <div
            style={{
              color:
                "#ffffff",

              fontSize:
                15,

              fontWeight:
                700,

              lineHeight:
                1.5,
            }}
          >
            Complete Brand Kit
          </div>

          <p
            style={{
              color:
                "rgba(255,255,255,0.72)",

              fontSize:
                12,

              margin:
                0,

              lineHeight:
                1.7,
            }}
          >
            Professional brand
            assets, high-quality
            files and exclusive
            mockups.
          </p>

          <button
            type="button"
            onClick={() => {}}
            style={{
              width:
                "100%",

              background:
                ACCENT,

              color:
                "#ffffff",

              border:
                "none",

              borderRadius:
                7,

              padding:
                "13px 12px",

              fontSize:
                13,

              fontWeight:
                800,

              cursor:
                "pointer",

              boxShadow:
                "0 7px 18px rgba(216,80,30,0.30)",
            }}
          >
            Get Brand Kit
          </button>
        </div>
      )}

      {isDevMode && (
        <div
          style={{
            marginTop:
              "auto",

            background:
              "#F2F0EA",

            padding:
              16,

            borderRadius:
              8,

            display:
              "flex",

            flexDirection:
              "column",

            gap:
              18,

            border:
              `1px solid ${RULE}`,
          }}
        >
          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              gap:
                10,
            }}
          >
            <span
              style={{
                fontSize:
                  10,

                fontFamily:
                  MONO_FONT,

                fontWeight:
                  700,

                color:
                  BLUE_DEEP,
              }}
            >
              DEV CALIBRATION CORE
            </span>

            <span
              style={{
                fontFamily:
                  MONO_FONT,

                fontSize:
                  8,

                color:
                  ACCENT_DEEP,

                fontWeight:
                  700,
              }}
            >
              DEV MODE
            </span>
          </div>

          <div
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                13,
            }}
          >
            <CalibrationSlider
              label="Top"
              value={
                safeCalibration.top
              }
              min={0}
              max={100}
              step={1}
              suffix="%"
              onChange={(value) =>
                updateCalibration(
                  "top",
                  value,
                )
              }
            />

            <CalibrationSlider
              label="Left"
              value={
                safeCalibration.left
              }
              min={0}
              max={100}
              step={1}
              suffix="%"
              onChange={(value) =>
                updateCalibration(
                  "left",
                  value,
                )
              }
            />

            <CalibrationSlider
              label="Scale"
              value={
                safeCalibration.scale
              }
              min={0.3}
              max={4}
              step={0.05}
              onChange={(value) =>
                updateCalibration(
                  "scale",
                  value,
                )
              }
            />

            <CalibrationSlider
              label="Perspective"
              value={
                safeCalibration.perspective
              }
              min={200}
              max={2000}
              step={50}
              suffix="px"
              onChange={(value) =>
                updateCalibration(
                  "perspective",
                  value,
                )
              }
            />

            <CalibrationSlider
              label="Rotate X"
              value={
                safeCalibration.rotateX
              }
              min={-90}
              max={90}
              step={1}
              suffix="deg"
              onChange={(value) =>
                updateCalibration(
                  "rotateX",
                  value,
                )
              }
            />

            <CalibrationSlider
              label="Rotate Y"
              value={
                safeCalibration.rotateY
              }
              min={-90}
              max={90}
              step={1}
              suffix="deg"
              onChange={(value) =>
                updateCalibration(
                  "rotateY",
                  value,
                )
              }
            />

            <CalibrationSlider
              label="Rotate Z"
              value={
                safeCalibration.rotateZ
              }
              min={-180}
              max={180}
              step={1}
              suffix="deg"
              onChange={(value) =>
                updateCalibration(
                  "rotateZ",
                  value,
                )
              }
            />
          </div>

          <RuledLine
            label="LOGO VISIBILITY"
          />

          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(2, minmax(0, 1fr))",

              gap:
                8,
            }}
          >
            {(
              [
                [
                  "auto",
                  "AUTO",
                ],
                [
                  "normal",
                  "NORMAL",
                ],
                [
                  "light",
                  "LIGHT",
                ],
                [
                  "dark",
                  "DARK",
                ],
              ] as const
            ).map(
              ([
                value,
                label,
              ]) => {
                const active =
                  safeCalibration.contrastMode ===
                  value;

                return (
                  <button
                    key={
                      value
                    }
                    type="button"
                    onClick={() =>
                      updateCalibration(
                        "contrastMode",
                        value,
                      )
                    }
                    style={{
                      border:
                        `1px solid ${
                          active
                            ? ACCENT
                            : RULE
                        }`,

                      background:
                        active
                          ? ACCENT_SOFT
                          : "#F2F0EA",

                      color:
                        active
                          ? ACCENT_DEEP
                          : INK,

                      borderRadius:
                        7,

                      padding:
                        "9px 7px",

                      cursor:
                        "pointer",

                      fontFamily:
                        MONO_FONT,

                      fontSize:
                        9,

                      fontWeight:
                        700,
                    }}
                  >
                    {label}
                  </button>
                );
              },
            )}
          </div>

          <CalibrationSlider
            label="Opacity"
            value={
              safeCalibration.opacity *
              100
            }
            min={20}
            max={100}
            step={1}
            suffix="%"
            onChange={(value) =>
              updateCalibration(
                "opacity",
                value / 100,
              )
            }
          />

          <CalibrationSlider
            label="Shadow"
            value={
              safeCalibration.shadow *
              100
            }
            min={0}
            max={100}
            step={1}
            suffix="%"
            onChange={(value) =>
              updateCalibration(
                "shadow",
                value / 100,
              )
            }
          />

          <CalibrationSlider
            label="Outline"
            value={
              safeCalibration.outline *
              100
            }
            min={0}
            max={100}
            step={1}
            suffix="%"
            onChange={(value) =>
              updateCalibration(
                "outline",
                value / 100,
              )
            }
          />

          <div
            style={{
              background:
                "#050A0F",

              padding:
                13,

              borderRadius:
                7,

              color:
                "#A5B4FC",

              fontFamily:
                MONO_FONT,

              fontSize:
                10,

              position:
                "relative",

              border:
                "1px solid rgba(255,255,255,0.06)",

              boxShadow:
                "0 10px 30px rgba(0,0,0,0.16)",
            }}
          >
            <div
              style={{
                color:
                  "#ffffff",

                fontSize:
                  9,

                marginBottom:
                  8,

                opacity:
                  0.5,

                letterSpacing:
                  "0.06em",
              }}
            >
              OUTPUT
            </div>

            <pre
              style={{
                margin:
                  0,

                whiteSpace:
                  "pre-wrap",

                lineHeight:
                  1.65,
              }}
            >
{`defaultTop: ${safeCalibration.top},
defaultLeft: ${safeCalibration.left},
defaultScale: ${safeCalibration.scale},
defaultPerspective: ${safeCalibration.perspective},
defaultRotateX: ${safeCalibration.rotateX},
defaultRotateY: ${safeCalibration.rotateY},
defaultRotateZ: ${safeCalibration.rotateZ},
opacity: ${safeCalibration.opacity},
contrastMode: "${getFolderLogoMode(activeSpec.folder)}",
logoColor: "${getLogoColorForFolder(activeSpec.folder)}",`}
            </pre>

            <button
              type="button"
              onClick={
                copyConfigCode
              }
              style={{
                marginTop:
                  10,

                width:
                  "100%",

                background:
                  "rgba(255,255,255,0.10)",

                border:
                  "1px solid rgba(255,255,255,0.10)",

                color:
                  "#ffffff",

                padding:
                  "7px 0",

                borderRadius:
                  5,

                cursor:
                  "pointer",

                fontSize:
                  9,

                fontWeight:
                  700,

                fontFamily:
                  MONO_FONT,
              }}
            >
              COPY SPEC SNIPPET
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export interface DynamicMockupGeneratorProps {
  renderLogoHTML:
    () => ReactNode;

  logoColor?: string;

  userMockups?: MockupSpec[];
}

export default function DynamicMockupGenerator({
  renderLogoHTML,
  logoColor: _logoColor,
  userMockups = USER_MOCKUPS,
}: DynamicMockupGeneratorProps) {
  const {
    activeSpec,

    calibration,

    setActiveSpec,

    setCalibration,
  } =
    useMockupGenerator(
      userMockups,
    );

  return (
    <div
      style={{
        display:
          "grid",

        gridTemplateColumns:
          "minmax(0, 1fr) 360px",

        width:
          "100%",

        height:
          "100%",

        minHeight:
          0,

        background:
          "transparent",
      }}
    >
      <main
        style={{
          minWidth:
            0,

          minHeight:
            0,

          overflow:
            "hidden",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "center",
        }}
      >
        <MockupStage
          activeSpec={
            activeSpec
          }
          calibration={
            calibration
          }
          renderLogoHTML={
            renderLogoHTML
          }
        />
      </main>

      <MockupControls
        activeSpec={
          activeSpec
        }
        calibration={
          calibration
        }
        setCalibration={
          setCalibration
        }
        setActiveSpec={
          setActiveSpec
        }
        USER_MOCKUPS={
          userMockups
        }
      />
    </div>
  );
}