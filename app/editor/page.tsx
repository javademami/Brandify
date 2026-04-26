"use client";

import { useState, useEffect, useRef } from "react";
import LogoView from "@/components/LogoView";
import * as htmlToImage from "html-to-image";

export default function Editor() {
  const [logo, setLogo] = useState<any>(null);
  const [paid, setPaid] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedLogo");
    if (saved) setLogo(JSON.parse(saved));
  }, []);

  if (!logo) return <p className="p-10">No logo selected</p>;

  async function downloadPNG() {
    if (!ref.current) return;

    const dataUrl = await htmlToImage.toPng(ref.current, {
      backgroundColor: "white",
      pixelRatio: 4,
    });

    const a = document.createElement("a");
    a.download = `${logo.name}.png`;
    a.href = dataUrl;
    a.click();
  }

  function updateBg(index: number, value: string) {
    if (logo.bg.type !== "gradient") return;

    const newBg = [...logo.bg.value];
    newBg[index] = value;

    setLogo({
      ...logo,
      bg: {
        ...logo.bg,
        value: newBg,
      },
    });
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Customize your logo
      </h1>

      {/* PREVIEW */}
      <div
        ref={ref}
        className="border p-10 mb-8 flex justify-center bg-white rounded-xl shadow"
      >
        <LogoView logo={logo} />
      </div>

      {/* CONTROLS */}
      <div className="space-y-6">

        {/* 🎨 TEXT COLOR */}
        <div>
          <p className="mb-2 font-medium">Text Color</p>
          <input
            type="color"
            value={logo.color}
            onChange={(e) =>
              setLogo({ ...logo, color: e.target.value })
            }
          />
        </div>

        {/* 🎨 ICON COLOR */}
        <div>
          <p className="mb-2 font-medium">Icon Color</p>
          <input
            type="color"
            value={logo.iconColor}
            onChange={(e) =>
              setLogo({ ...logo, iconColor: e.target.value })
            }
          />
        </div>

        {/* 🌈 BACKGROUND */}
        {logo.bg.type === "gradient" && (
          <div>
            <p className="mb-2 font-medium">Background</p>
            <div className="flex gap-2">
              <input
                type="color"
                value={logo.bg.value[0]}
                onChange={(e) =>
                  updateBg(0, e.target.value)
                }
              />
              <input
                type="color"
                value={logo.bg.value[1]}
                onChange={(e) =>
                  updateBg(1, e.target.value)
                }
              />
            </div>
          </div>
        )}

        {/* 🔤 FONT */}
        <div>
          <p className="mb-2 font-medium">Font</p>
          <select
            value={logo.font}
            onChange={(e) =>
              setLogo({ ...logo, font: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="Inter">Inter</option>
            <option value="Poppins">Poppins</option>
            <option value="DM Sans">DM Sans</option>
          </select>
        </div>

        {/* 📐 LAYOUT */}
        <div>
          <p className="mb-2 font-medium">Layout</p>
          <select
            value={logo.layout}
            onChange={(e) =>
              setLogo({ ...logo, layout: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="iconTop">Icon Top</option>
            <option value="iconLeft">Icon Left</option>
            <option value="iconBig">Icon Big</option>
            <option value="badge">Badge</option>
            <option value="textOnly">Text Only</option>
          </select>
        </div>

        {/* DOWNLOAD */}
        {paid ? (
          <button
            onClick={downloadPNG}
            className="bg-green-600 text-white px-6 py-3 rounded w-full"
          >
            Download PNG
          </button>
        ) : (
          <button
            onClick={() => setPaid(true)}
            className="bg-black text-white px-6 py-3 rounded w-full"
          >
            Unlock Download ($5)
          </button>
        )}
      </div>
    </div>
  );
}
