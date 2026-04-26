"use client";
import type { LogoConfig } from "@/lib/generator";

export default function LogoView({ logo, selected, onClick }: {
  logo: LogoConfig; selected?: boolean; onClick?: () => void;
}) {
  const { name, slogan, iconPath, palette, layout, font, fontWeight, borderRadius, textColor, iconColor } = logo;
  const iconFilter = iconColor === "#ffffff" ? "brightness(0) invert(1)" : "brightness(0)";
  const iconSize = layout === "iconBig" ? 56 : layout === "badge" ? 28 : 40;

  const inner = () => {
    if (layout === "textOnly") return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
        <span style={{fontFamily:font,fontWeight,fontSize:24,color:textColor,letterSpacing:"0.04em"}}>{name}</span>
        {slogan && <span style={{fontFamily:font,fontSize:11,color:textColor,opacity:0.7,letterSpacing:"0.12em"}}>{slogan.toUpperCase()}</span>}
      </div>
    );
    if (layout === "iconLeft" || layout === "badge") return (
      <div style={{display:"flex",alignItems:"center",gap:layout==="badge"?8:14}}>
        <img src={iconPath} width={iconSize} height={iconSize} style={{filter:iconFilter}} alt="" />
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          <span style={{fontFamily:font,fontWeight,fontSize:layout==="badge"?14:18,color:textColor}}>{name}</span>
          {slogan && layout!=="badge" && <span style={{fontFamily:font,fontSize:10,color:textColor,opacity:0.65,letterSpacing:"0.1em"}}>{slogan.toUpperCase()}</span>}
        </div>
      </div>
    );
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
        <img src={iconPath} width={iconSize} height={iconSize} style={{filter:iconFilter}} alt="" />
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
          <span style={{fontFamily:font,fontWeight,fontSize:layout==="iconBig"?20:16,color:textColor,letterSpacing:"0.04em"}}>{name}</span>
          {slogan && <span style={{fontFamily:font,fontSize:10,color:textColor,opacity:0.65,letterSpacing:"0.12em"}}>{slogan.toUpperCase()}</span>}
        </div>
      </div>
    );
  };

  return (
    <div onClick={onClick} style={{background:palette.bg,borderRadius,width:"100%",height:160,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",border:selected?"2.5px solid #6366f1":"1.5px solid rgba(255,255,255,0.1)",transition:"transform 0.15s",padding:"1.25rem",boxSizing:"border-box"}}
      onMouseEnter={e=>(e.currentTarget.style.transform="translateY(-3px)")}
      onMouseLeave={e=>(e.currentTarget.style.transform="translateY(0)")}>
      {inner()}
    </div>
  );
}
