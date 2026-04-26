"use client";
import { useState } from "react";
import LogoView from "@/components/LogoView";
import { generateLogos, type LogoConfig } from "@/lib/generator";
import { inspoLogos } from "@/lib/inspoLogos";

const INDUSTRIES = [
  "Technology","AI & Machine Learning","Startup","Crypto & Web3",
  "Restaurant","Cafe & Coffee","Food & Beverage",
  "Fashion","Beauty & Wellness","Luxury",
  "Finance","Banking","Investment",
  "Fitness & Gym","Sports","Education",
  "Real Estate","Health & Medical","Travel & Hotel","Gaming",
  "Music","Media & Content","Online Learning","Construction",
];

const COLORS = [
  {name:"Blue",a:"#1d4ed8",b:"#93c5fd"},{name:"Purple",a:"#7c3aed",b:"#c4b5fd"},
  {name:"Pink",a:"#db2777",b:"#fbcfe8"},{name:"Red",a:"#dc2626",b:"#fca5a5"},
  {name:"Orange",a:"#ea580c",b:"#fdba74"},{name:"Yellow",a:"#ca8a04",b:"#fde68a"},
  {name:"Green",a:"#15803d",b:"#bbf7d0"},{name:"Teal",a:"#0f766e",b:"#99f6e4"},
  {name:"Gold",a:"#92400e",b:"#fef3c7"},{name:"Black",a:"#111111",b:"#6b7280"},
  {name:"Navy",a:"#1e3a8a",b:"#bfdbfe"},{name:"Gray",a:"#374151",b:"#e5e7eb"},
];

export default function GeneratePage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [slogan, setSlogan] = useState("");
  const [industry, setIndustry] = useState("");
  const [search, setSearch] = useState("");
  const [likedInspo, setLikedInspo] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [logos, setLogos] = useState<LogoConfig[]>([]);
  const [selectedLogo, setSelectedLogo] = useState<number|null>(null);

  const progress = Math.round((step/7)*100);

  function goTo(n: number) {
    if (n === 7) { setLogos(generateLogos({name,slogan,industry},6)); setSelectedLogo(null); }
    setStep(n);
    window.scrollTo(0,0);
  }

  const filtered = search ? INDUSTRIES.filter(i=>i.toLowerCase().includes(search.toLowerCase())) : INDUSTRIES;

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">Brandify</span>
        <div className="w-48 h-1 bg-gray-100 rounded-full">
          <div className="h-1 bg-indigo-500 rounded-full transition-all duration-500" style={{width:`${progress}%`}} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-10">

        {step===1 && (
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">Design your own beautiful brand</h1>
              <p className="text-gray-400 text-sm">Use our AI-powered platform to design a logo and brand you love.</p>
            </div>
            <div className="flex flex-col gap-3">
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Brand name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-indigo-400" />
              <button onClick={()=>goTo(2)} disabled={!name.trim()}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium disabled:opacity-40 hover:bg-indigo-700">
                Get started →
              </button>
            </div>
          </div>
        )}

        {step===2 && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <button onClick={()=>goTo(1)} className="text-sm text-gray-400">← Back</button>
              <button onClick={()=>goTo(3)} disabled={!industry} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm disabled:opacity-40">Continue →</button>
            </div>
            <div>
              <h2 className="text-xl font-medium">Pick your industry</h2>
              <p className="text-sm text-gray-400 mt-1">Knowing your industry helps us pick symbols, colors, and more.</p>
            </div>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Restaurant, Consulting, Beauty, Photography, Fitness..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-400" />
            <div className="flex flex-wrap gap-2">
              {filtered.map(ind=>(
                <button key={ind} onClick={()=>setIndustry(ind)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition-all ${industry===ind?"border-indigo-500 bg-indigo-50 text-indigo-700 font-medium":"border-gray-200 text-gray-500 hover:border-indigo-300"}`}>
                  {ind}
                </button>
              ))}
            </div>
          </div>
        )}

        {step===3 && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <button onClick={()=>goTo(2)} className="text-sm text-gray-400">← Back</button>
              <button onClick={()=>goTo(4)} className="text-sm text-gray-400 underline">Skip →</button>
            </div>
            <div>
              <h2 className="text-xl font-medium">Pick some logos you like</h2>
              <p className="text-sm text-gray-400 mt-1">We'll use these as inspiration.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {inspoLogos.map((logo,i)=>(
                <div key={i} onClick={()=>setLikedInspo(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i])}
                  className="rounded-xl overflow-hidden cursor-pointer"
                  style={{border:likedInspo.includes(i)?"2.5px solid #6366f1":"1.5px solid #e5e7eb"}}>
                  <div dangerouslySetInnerHTML={{__html:logo.svg}} />
                  <div className="text-xs text-center py-1.5 text-gray-400 border-t border-gray-100">{logo.name}</div>
                </div>
              ))}
            </div>
            <button onClick={()=>goTo(4)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700">Continue →</button>
          </div>
        )}

        {step===4 && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <button onClick={()=>goTo(3)} className="text-sm text-gray-400">← Back</button>
              <button onClick={()=>goTo(5)} className="text-sm text-gray-400 underline">Skip →</button>
            </div>
            <div>
              <h2 className="text-xl font-medium">Pick some colors you like</h2>
              <p className="text-sm text-gray-400 mt-1">Colors help convey emotion in your logo.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {COLORS.map(c=>(
                <div key={c.name} onClick={()=>setSelectedColors(p=>p.includes(c.name)?p.filter(x=>x!==c.name):[...p,c.name])}
                  className="h-16 rounded-xl cursor-pointer flex items-end overflow-hidden"
                  style={{background:`linear-gradient(135deg,${c.a},${c.b})`,border:selectedColors.includes(c.name)?"3px solid #6366f1":"2px solid transparent",transform:selectedColors.includes(c.name)?"scale(1.04)":"scale(1)",transition:"all 0.15s"}}>
                  <span className="text-xs font-semibold px-2 py-1 w-full text-white" style={{background:"rgba(0,0,0,0.3)"}}>{c.name}</span>
                </div>
              ))}
            </div>
            <button onClick={()=>goTo(5)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700">Continue →</button>
          </div>
        )}

        {step===5 && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <button onClick={()=>goTo(4)} className="text-sm text-gray-400">← Back</button>
              <button onClick={()=>goTo(6)} disabled={!name.trim()} className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm disabled:opacity-40">Continue →</button>
            </div>
            <div>
              <h2 className="text-xl font-medium">Enter your company name</h2>
              <p className="text-sm text-gray-400 mt-1">You can always change these later</p>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Company Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Brandify"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Slogan (optional)</label>
                <input value={slogan} onChange={e=>setSlogan(e.target.value)} placeholder="e.g. Build your brand"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-indigo-400" />
              </div>
            </div>
          </div>
        )}

        {step===6 && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <button onClick={()=>goTo(5)} className="text-sm text-gray-400">← Back</button>
              <button onClick={()=>goTo(7)} className="text-sm text-gray-400 underline">Skip →</button>
            </div>
            <div>
              <h2 className="text-xl font-medium">Pick some symbol types</h2>
              <p className="text-sm text-gray-400 mt-1">We've hand-curated symbols for these types.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Restaurant","Food","Food Truck","Meal","Organic","Drink","Food Shop","Pizza","Eat","Flame","Desserts","Ice Cream","Snacks","Abstract","Innovation","Strength","Excellence","Tranquility","Creativity","Technology","Nature","Minimal","Bold","Geometric"].map(sym=>(
                <button key={sym} className="px-4 py-1.5 rounded-full text-sm border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors">{sym}</button>
              ))}
            </div>
            <p className="text-xs text-indigo-500 cursor-pointer">I want to pick my own symbol →</p>
            <button onClick={()=>goTo(7)} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700">
              Generate logos →
            </button>
          </div>
        )}

        {step===7 && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">{industry}</p>
                <h2 className="text-xl font-medium">{name}</h2>
              </div>
              <div className="flex gap-2 text-xs text-gray-400">
                <span className="cursor-pointer border border-gray-200 px-3 py-1.5 rounded-lg" onClick={()=>goTo(7)}>↺ Symbols</span>
                <span className="cursor-pointer border border-gray-200 px-3 py-1.5 rounded-lg" onClick={()=>{setLogos(generateLogos({name,slogan,industry},6));setSelectedLogo(null);}}>↺ Layouts</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">Click a design to preview and see different versions</p>
            <div className="grid grid-cols-3 gap-3">
              {logos.map((logo,i)=>(
                <LogoView key={i} logo={logo} selected={selectedLogo===i} onClick={()=>setSelectedLogo(i)} />
              ))}
            </div>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700">
              Start customising →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}