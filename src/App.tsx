// @ts-nocheck
import { useState } from "react";

// ============================================================
// TERANGAHUB — Senegal Local Commerce & Discovery
// Grounded in May 2026 Market Intelligence Report
//
// Design decisions tied directly to report findings:
// 1. TRUST #1 — verified photos, confirmed hours, landmark addresses
// 2. WhatsApp is the OS — pre-filled bilingual FR/WO message
// 3. Wave + Orange Money prominently shown (45% higher conversion)
// 4. Landmark addresses, NOT street names (Dakar renaming streets)
// 5. Wolof bilingual labels (80% of population speaks Wolof first)
// 6. Operational signals: open/closed, response time, stock status
// 7. Diaspora commerce module (FR/IT/US remote buyer + local seller)
// 8. No subscription required at launch (SME cash sensitivity)
// ============================================================

const T = {
  green:"#1A6B4A", greenL:"#2D9E6B", greenD:"#0F3F2C",
  gold:"#E8980A", goldL:"#F5B93A",
  wave:"#0A84FF", om:"#FF6B00",
  wa:"#25D366", text:"#111827", muted:"#6B7280",
  surface:"#FFFFFF", alt:"#F7F9F7", border:"#E5E7EB",
  trust:"#059669",
};

// Bilingual labels — report: Wolof spoken by 80%, French signals professionalism
const L = {
  open:   "Ouvert · Tëdd",
  closed: "Fermé · Dëkk",
  verified:"Vérifié · Seetlu",
  call:   "Appeler",
  wa:     "WhatsApp",
  landmark:"Repère · Xam xam",
  add:    "Ajouter gratuitement · Yokk ci kanam",
  cats:   "Catégories · Xëtu dëkk",
  featured:"En vedette · Ci kanam",
  search_ph:"Chercher... / Seet...",
  responds:"Répond rapidement · Yëgël gaaw",
};

// Categories ranked by report section 7 priority table
const CATS = [
  { id:"food",    fr:"Restaurants & Dibiteries", wo:"Daanu ak Réew",      icon:"🍽️", n:1247 },
  { id:"beauty",  fr:"Salons / Coiffure",        wo:"Cosaan ak Jamoñ",    icon:"✂️", n:834  },
  { id:"pharma",  fr:"Pharmacies",               wo:"Farmaasi",           icon:"💊", n:312  },
  { id:"meca",    fr:"Mécaniciens & Auto",       wo:"Mekanik",            icon:"🔧", n:287  },
  { id:"fashion", fr:"Tailleurs & Mode",         wo:"Taaloor ak Mbëkk",   icon:"🪡", n:438  },
  { id:"health",  fr:"Santé & Cliniques",        wo:"Wer ak Yëgël",       icon:"🏥", n:203  },
  { id:"immo",    fr:"Immobilier & Location",    wo:"Kër",                icon:"🏠", n:156  },
  { id:"market",  fr:"Marchés & Commerce",       wo:"Marse",              icon:"🛍️", n:2103 },
  { id:"banking", fr:"Wave / Orange Money",      wo:"Jëfandikool xaalis", icon:"💳", n:614  },
  { id:"home",    fr:"Plombiers & Électriciens", wo:"Kër ak Mbëkk",      icon:"🔌", n:98   },
  { id:"educ",    fr:"Écoles & Formation",       wo:"Daara",              icon:"📚", n:521  },
  { id:"mosque",  fr:"Mosquées & Dahiras",       wo:"Jaamu",              icon:"🕌", n:1876 },
];

// Listings with full trust signals per report section 5 & 7
const LISTINGS = [
  {
    id:"1", name:"Dibiterie Chez Modou", cat:"food",
    fr_cat:"Restaurants & Dibiteries",
    city:"Dakar", neighborhood:"Almadies",
    // Landmark address — report: landmark > street (streets being renamed)
    landmark:"Face à la station Total Almadies, derrière le terrain de foot",
    landmark_wo:"Kanam station Total Almadies, gannaaw terrain foot",
    phone:"+221 77 423 88 12", wa:"+221774238812",
    rating:4.8, reviews:94, verified:true, open:true,
    hours:"10h00–01h00", hours_today:"Ouvert · Ferme à 1h du matin",
    response_time:"< 5 min",
    // Payment methods — report: Wave+OM = 45% higher conversion
    payments:["wave","om","cash"],
    tags:["Dibi","Thiéboudienne","Livraison quartier"],
    tags_wo:["Dibi","Ceebu Jën","Jënd ci kër"],
    desc:"Dibiterie authentique avec viande grillée au charbon de bois. Thiéboudienne disponible le midi. Livraison possible dans les Almadies.",
    photo_verified:true, featured:true, icon:"🍖",
    // Diaspora — report section 2: remote buyer + local seller underserved
    diaspora:true,
  },
  {
    id:"2", name:"Salon Mariama Beauté", cat:"beauty",
    fr_cat:"Salons / Coiffure",
    city:"Dakar", neighborhood:"Ouakam",
    landmark:"Près de la pharmacie Ouakam, immeuble bleu 2ème étage",
    landmark_wo:"Kanam farmaasi Ouakam, kër bu ndaw yu ñaari njaboot",
    phone:"+221 76 551 23 40", wa:"+221765512340",
    rating:4.6, reviews:67, verified:true, open:true,
    hours:"09h00–20h00", hours_today:"Ouvert · Ferme à 20h",
    response_time:"< 10 min",
    payments:["wave","cash"],
    tags:["Tresses","Lissage","Ongles","Mariage"],
    tags_wo:["Xëtu juddu","Ñaari bët","Lëgëm"],
    desc:"Salon spécialisé tresses africaines, lissage brésilien, soins ongles. Coiffures pour mariages et cérémonies sur RDV.",
    photo_verified:true, featured:true, icon:"💇‍♀️", diaspora:true,
  },
  {
    id:"3", name:"Pharmacie Centrale Thiès", cat:"pharma",
    fr_cat:"Pharmacies",
    city:"Thiès", neighborhood:"Centre-ville",
    landmark:"Place de l'Indépendance, face à la préfecture",
    landmark_wo:"Kanam préfecture Thiès",
    phone:"+221 33 951 23 45", wa:"+221789512345",
    rating:4.5, reviews:48, verified:true, open:true,
    hours:"08h00–22h00 · Garde nocturne", hours_today:"Ouvert · Garde disponible cette nuit",
    response_time:"< 15 min",
    payments:["wave","om","cash"],
    tags:["Médicaments","Garde nocturne","Conseil"],
    tags_wo:["Rem","Bëgg ci guddi","Xam-xam"],
    desc:"Pharmacie complète avec service de garde nocturne. Personnel bilingue français/wolof. Stock confirmé quotidiennement.",
    photo_verified:true, featured:false, icon:"💊", diaspora:false,
  },
  {
    id:"4", name:"Garage Samba Auto Plateau", cat:"meca",
    fr_cat:"Mécaniciens & Auto",
    city:"Dakar", neighborhood:"Plateau",
    landmark:"Rue 15, derrière le marché Kermel, portail vert",
    landmark_wo:"Gannaaw marse Kermel, béré bu wér",
    phone:"+221 77 834 56 78", wa:"+221778345678",
    rating:4.4, reviews:38, verified:true, open:true,
    hours:"08h00–18h00 · Sauf dimanche", hours_today:"Ouvert · Ferme à 18h",
    response_time:"< 30 min",
    payments:["wave","cash"],
    tags:["Moteur","Climatisation","Vidange","Diagnostic"],
    tags_wo:["Motëër","Friskilaasi","Diagnostik"],
    desc:"Garage spécialisé véhicules japonais et européens. Diagnostic électronique, climatisation, carrosserie. Devis gratuit sur WhatsApp.",
    photo_verified:true, featured:false, icon:"🔧", diaspora:false,
  },
  {
    id:"5", name:"Atelier Aïssatou Wax", cat:"fashion",
    fr_cat:"Tailleurs & Mode",
    city:"Dakar", neighborhood:"HLM",
    landmark:"Marché HLM, allée centrale des tailleurs, stand 47",
    landmark_wo:"Marse HLM, yoon bu digg yi, stand 47",
    phone:"+221 76 712 09 33", wa:"+221767120933",
    rating:4.7, reviews:112, verified:true, open:true,
    hours:"08h00–19h00", hours_today:"Ouvert · Ferme à 19h",
    response_time:"< 5 min",
    payments:["wave","om","cash"],
    tags:["Wax","Bazin","Sur mesure","Expédition internationale"],
    tags_wo:["Wax","Bazin","Ci sa taille","Jënd ci kanam"],
    desc:"Tailleure expérimentée spécialisée wax et bazin. Créations sur mesure en 48–72h. Expédition vers la France, l'Italie, les USA.",
    photo_verified:true, featured:true, icon:"🪡", diaspora:true,
  },
  {
    id:"6", name:"Wave Point Ouakam", cat:"banking",
    fr_cat:"Wave / Orange Money",
    city:"Dakar", neighborhood:"Ouakam",
    landmark:"Carrefour Ouakam, kiosque orange à droite de la mosquée",
    landmark_wo:"Kanam jaamu Ouakam, kiosque bi",
    phone:"+221 78 200 00 00", wa:null,
    rating:4.2, reviews:29, verified:true, open:true,
    hours:"07h30–21h00", hours_today:"Ouvert · Ferme à 21h",
    response_time:null,
    payments:["wave","om"],
    tags:["Dépôt","Retrait","Transfert","Orange Money"],
    tags_wo:["Dugël xaalis","Seet xaalis","Yónnëe"],
    desc:"Point Wave et Orange Money. Dépôts, retraits, transferts, paiements factures. File rapide le matin avant 9h.",
    photo_verified:true, featured:false, icon:"💳", diaspora:false,
  },
];

// ---- SMALL COMPONENTS ----

function PayBadge({ type }) {
  const cfg = {
    wave: { label:"Wave",         bg:"#EFF6FF", color:"#1D4ED8", dot:"#0A84FF" },
    om:   { label:"Orange Money", bg:"#FFF7ED", color:"#92400E", dot:"#FF6B00" },
    cash: { label:"Espèces",      bg:"#F0FDF4", color:"#166534", dot:"#16A34A" },
  };
  const c = cfg[type]; if (!c) return null;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:4,
      background:c.bg, color:c.color,
      fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20,
    }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:c.dot, display:"inline-block" }} />
      {c.label}
    </span>
  );
}

function OpenBadge({ open }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:3,
      background: open ? "#ECFDF5" : "#FEF2F2",
      color: open ? "#065F46" : "#991B1B",
      fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20,
    }}>
      <span style={{
        width:5, height:5, borderRadius:"50%",
        background: open ? "#16A34A" : "#DC2626", display:"inline-block",
      }} />
      {open ? L.open : L.closed}
    </span>
  );
}

function Stars({ rating, n, size=12 }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:2 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ fontSize:size, color: s<=Math.round(rating) ? T.gold : "#D1D5DB" }}>★</span>
      ))}
      <span style={{ fontSize:11, color:T.muted, marginLeft:2 }}>{rating} ({n})</span>
    </span>
  );
}

// Pre-filled bilingual WA message — report: WA is the CRM
function waUrl(num, name, hood) {
  const msg = `Bonjour ${name}! Je vous contacte via TerangaHub (${hood}). Jërejëf 🙏`;
  return `https://wa.me/${num.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`;
}

// ---- LISTING CARD ----
function Card({ l, onOpen, compact }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onOpen(l)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:T.surface,
        border:`1px solid ${hov ? T.greenL : T.border}`,
        borderRadius:15, padding:compact?"11px":"15px",
        cursor:"pointer", transition:"all .18s",
        transform: hov?"translateY(-1px)":"none",
        boxShadow: hov?"0 6px 18px rgba(26,107,74,0.1)":"0 1px 3px rgba(0,0,0,0.04)",
        position:"relative", overflow:"hidden",
      }}
    >
      {l.featured && (
        <div style={{
          position:"absolute", top:0, right:0,
          background:T.gold, color:"white",
          fontSize:9, fontWeight:700, padding:"3px 10px 3px 14px",
          borderBottomLeftRadius:10, letterSpacing:.3,
        }}>EN VEDETTE</div>
      )}

      <div style={{ display:"flex", gap:11, alignItems:"flex-start" }}>
        <div style={{
          width:compact?38:48, height:compact?38:48, borderRadius:11,
          background:T.alt, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:compact?20:25,
          border:`1px solid ${T.border}`, flexShrink:0,
        }}>{l.icon}</div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap", marginBottom:3 }}>
            <span style={{ fontWeight:700, fontSize:compact?12:14, color:T.text, lineHeight:1.2 }}>{l.name}</span>
            {l.verified && (
              <span style={{
                background:"#ECFDF5", color:"#065F46", fontSize:9,
                fontWeight:700, padding:"1px 6px", borderRadius:20, border:"1px solid #A7F3D0",
              }}>✓ {L.verified}</span>
            )}
            <OpenBadge open={l.open} />
          </div>

          <div style={{ fontSize:11, color:T.muted, marginBottom:4 }}>
            📍 {l.neighborhood}, {l.city}
          </div>
          <Stars rating={l.rating} n={l.reviews} />

          {!compact && (
            <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginTop:6 }}>
              {l.payments.map(p => <PayBadge key={p} type={p} />)}
            </div>
          )}

          {!compact && l.diaspora && (
            <div style={{
              marginTop:5, fontSize:10, color:"#1D4ED8",
              background:"#EFF6FF", padding:"2px 8px", borderRadius:20,
              display:"inline-flex", alignItems:"center", gap:3,
            }}>✈️ Commande diaspora disponible</div>
          )}
        </div>
      </div>

      {/* Landmark — report's #1 navigation/trust signal */}
      {!compact && (
        <div style={{
          marginTop:10, padding:"8px 10px",
          background:T.alt, borderRadius:8,
          borderLeft:`3px solid ${T.gold}`,
          fontSize:11, color:T.text, lineHeight:1.5,
        }}>
          📌 <strong>{L.landmark}:</strong> {l.landmark}
          {l.landmark_wo && (
            <div style={{ color:T.muted, fontSize:10, marginTop:2, fontStyle:"italic" }}>{l.landmark_wo}</div>
          )}
        </div>
      )}

      {!compact && l.response_time && (
        <div style={{ marginTop:6, fontSize:10, color:T.muted }}>
          💬 {L.responds} ({l.response_time})
        </div>
      )}

      {!compact && (
        <div style={{ display:"flex", gap:8, marginTop:11 }}>
          <button
            onClick={e => e.stopPropagation()}
            style={{
              flex:1, padding:"8px 0",
              background:T.surface, border:`1px solid ${T.border}`,
              borderRadius:9, fontSize:12, fontWeight:600, color:T.text,
              cursor:"pointer", display:"flex", alignItems:"center",
              justifyContent:"center", gap:5,
            }}
          >📞 {L.call}</button>

          {l.wa && (
            <button
              onClick={e => { e.stopPropagation(); window.open(waUrl(l.wa, l.name, l.neighborhood)); }}
              style={{
                flex:2, padding:"8px 0",
                background:T.wa, border:"none",
                borderRadius:9, fontSize:12, fontWeight:700, color:"white",
                cursor:"pointer", display:"flex", alignItems:"center",
                justifyContent:"center", gap:6,
              }}
            >💬 {L.wa}</button>
          )}
        </div>
      )}
    </div>
  );
}

// ---- MODAL ----
function Modal({ l, onClose }) {
  const [tab, setTab] = useState("info");
  const [rating, setRating] = useState(5);
  const [hov, setHov] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const TABS = [
    { id:"info",    label:"Infos" },
    { id:"reviews", label:`Avis (${l.reviews})` },
    { id:"trust",   label:"✓ Confiance" },
    { id:"share",   label:"Partager" },
  ];

  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(4px)", display:"flex", alignItems:"flex-end" }}
      onClick={onClose}
    >
      <div
        style={{ width:"100%", maxWidth:600, margin:"0 auto", background:T.surface, borderRadius:"22px 22px 0 0", maxHeight:"92vh", overflowY:"auto" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display:"flex", justifyContent:"center", padding:"10px 0 0" }}>
          <div style={{ width:34, height:4, borderRadius:2, background:T.border }} />
        </div>

        <div style={{ padding:"13px 18px 0", display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{
            width:56, height:56, borderRadius:13, background:T.alt,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:30, border:`1px solid ${T.border}`, flexShrink:0,
          }}>{l.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
              <span style={{ fontWeight:700, fontSize:17, color:T.text }}>{l.name}</span>
              {l.verified && (
                <span style={{ background:"#ECFDF5", color:"#065F46", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, border:"1px solid #A7F3D0" }}>✓ {L.verified}</span>
              )}
            </div>
            <div style={{ fontSize:11, color:T.muted, marginTop:3 }}>📍 {l.neighborhood}, {l.city}</div>
            <div style={{ marginTop:4, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
              <Stars rating={l.rating} n={l.reviews} size={13} />
              <OpenBadge open={l.open} />
            </div>
          </div>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:"50%", border:`1px solid ${T.border}`, background:T.alt, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>×</button>
        </div>

        {/* Payment strip */}
        <div style={{ margin:"10px 18px 0", padding:"8px 12px", background:"#F0FDF4", borderRadius:10, border:"1px solid #BBF7D0", display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
          <span style={{ fontSize:10, color:T.muted, fontWeight:600 }}>Paiements:</span>
          {l.payments.map(p => <PayBadge key={p} type={p} />)}
        </div>

        <div style={{ display:"flex", gap:8, padding:"11px 18px", borderBottom:`1px solid ${T.border}` }}>
          <button style={{ flex:1, padding:"9px 0", background:T.surface, border:`1px solid ${T.border}`, borderRadius:9, color:T.text, fontWeight:600, fontSize:12, cursor:"pointer" }}>📞 {L.call}</button>
          {l.wa && (
            <button onClick={() => window.open(waUrl(l.wa, l.name, l.neighborhood))} style={{ flex:2, padding:"9px 0", background:T.wa, border:"none", borderRadius:9, color:"white", fontWeight:700, fontSize:12, cursor:"pointer" }}>💬 {L.wa}</button>
          )}
        </div>

        <div style={{ display:"flex", borderBottom:`1px solid ${T.border}`, padding:"0 18px" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:"10px 13px", border:"none", background:"transparent",
              cursor:"pointer", fontSize:11, fontWeight:600,
              color: tab===t.id ? T.green : T.muted,
              borderBottom: tab===t.id ? `2px solid ${T.green}` : "2px solid transparent",
              transition:"all .15s", whiteSpace:"nowrap",
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ padding:"15px 18px 36px" }}>

          {tab==="info" && (
            <div>
              <p style={{ fontSize:13, color:T.text, lineHeight:1.7, margin:"0 0 13px" }}>{l.desc}</p>

              {/* Landmark block — report's #1 trust signal */}
              <div style={{ padding:"11px", background:T.alt, borderRadius:10, borderLeft:`3px solid ${T.gold}`, marginBottom:13 }}>
                <div style={{ fontSize:10, color:T.muted, marginBottom:3, fontWeight:600 }}>📌 {L.landmark}</div>
                <div style={{ fontSize:13, color:T.text, lineHeight:1.5 }}>{l.landmark}</div>
                {l.landmark_wo && <div style={{ fontSize:10, color:T.muted, marginTop:3, fontStyle:"italic" }}>{l.landmark_wo}</div>}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:13 }}>
                {[
                  { icon:"🕐", label:"Horaires", value:l.hours },
                  { icon:"📍", label:"Quartier", value:`${l.neighborhood}, ${l.city}` },
                  { icon:"📱", label:"Téléphone", value:l.phone },
                  { icon:"💬", label:"Réponse WA", value:l.response_time||"–" },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ padding:"9px", background:T.alt, borderRadius:9, border:`1px solid ${T.border}` }}>
                    <div style={{ fontSize:10, color:T.muted, marginBottom:2 }}>{icon} {label}</div>
                    <div style={{ fontSize:11, fontWeight:600, color:T.text }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                {l.tags.map((t,i) => (
                  <span key={t} style={{ background:"#EFF6FF", color:"#1D4ED8", fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20 }}>
                    {t}{l.tags_wo?.[i] ? ` · ${l.tags_wo[i]}` : ""}
                  </span>
                ))}
              </div>

              {/* Diaspora module — report section 2 */}
              {l.diaspora && (
                <div style={{ marginTop:14, padding:"12px", background:"#EFF6FF", borderRadius:11, border:"1px solid #BFDBFE" }}>
                  <div style={{ fontWeight:700, fontSize:13, color:"#1E40AF", marginBottom:4 }}>✈️ Commande diaspora · Kanam</div>
                  <div style={{ fontSize:12, color:"#1D4ED8", lineHeight:1.6 }}>
                    Commandez depuis Paris, Rome ou New York. Paiement via Wave/Sendwave. Livraison à votre famille à Dakar.
                  </div>
                  <button onClick={() => window.open(waUrl(l.wa, l.name, l.neighborhood))} style={{ marginTop:9, padding:"7px 14px", background:"#1D4ED8", border:"none", borderRadius:8, color:"white", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                    Commander via WhatsApp
                  </button>
                </div>
              )}
            </div>
          )}

          {tab==="reviews" && (
            <div>
              {[
                { u:"Fatou D.",    r:5, t:"Excellent! Authentique et rapide. Livraison en 20 min.",              time:"Il y a 3 jours",   photo:true  },
                { u:"Mamadou K.", r:4, t:"Commandé depuis Paris pour ma famille. Réponse WhatsApp immédiate.", time:"Il y a 1 semaine",  photo:false },
                { u:"Aminata B.", r:5, t:"Qualité constante depuis 2 ans. Recommande vivement!",                 time:"Il y a 2 semaines", photo:true  },
              ].map((r,i) => (
                <div key={i} style={{ padding:"11px 0", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <div style={{ width:28, height:28, borderRadius:"50%", background:T.greenL, color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>{r.u[0]}</div>
                      <div>
                        <div style={{ fontSize:12, fontWeight:600 }}>{r.u}</div>
                        <div style={{ fontSize:10, color:T.muted }}>{r.time}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                      <Stars rating={r.r} n={0} size={11} />
                      {r.photo && <span style={{ fontSize:10, color:T.trust }}>📷</span>}
                    </div>
                  </div>
                  <p style={{ margin:"0 0 0 35px", fontSize:12, color:T.text, lineHeight:1.6 }}>{r.t}</p>
                </div>
              ))}

              {!submitted ? (
                <div style={{ marginTop:14, padding:13, background:T.alt, borderRadius:11, border:`1px solid ${T.border}` }}>
                  <div style={{ fontWeight:600, fontSize:12, marginBottom:9 }}>Laisser un avis · Doxandël sa xel</div>
                  <div style={{ display:"flex", gap:3, marginBottom:9 }}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} onMouseEnter={()=>setHov(s)} onMouseLeave={()=>setHov(0)} onClick={()=>setRating(s)} style={{ fontSize:24, cursor:"pointer", color: s<=(hov||rating)?T.gold:"#D1D5DB" }}>★</span>
                    ))}
                  </div>
                  <textarea value={review} onChange={e=>setReview(e.target.value)} placeholder="Votre expérience... / Sa kilifaay..." style={{ width:"100%", minHeight:65, border:`1px solid ${T.border}`, borderRadius:8, padding:"8px 10px", fontSize:12, fontFamily:"inherit", resize:"vertical", outline:"none", boxSizing:"border-box" }} />
                  <button onClick={()=>setSubmitted(true)} style={{ marginTop:7, padding:"8px 18px", background:T.green, border:"none", borderRadius:8, color:"white", fontWeight:600, fontSize:12, cursor:"pointer" }}>
                    Publier · Tëj
                  </button>
                </div>
              ) : (
                <div style={{ marginTop:14, padding:13, background:"#ECFDF5", borderRadius:11, border:"1px solid #A7F3D0", textAlign:"center", color:"#065F46", fontSize:12 }}>
                  ✅ Merci! Votre avis sera vérifié avant publication. Jërejëf!
                </div>
              )}
            </div>
          )}

          {tab==="trust" && (
            <div>
              <div style={{ fontWeight:600, fontSize:13, marginBottom:13 }}>Signaux de confiance · Xam xam bu dëgg</div>
              {[
                { icon:"📸", label:"Photos vérifiées", wo:"Nataal yu dëgg", ok:l.photo_verified, desc:"Photos prises sur place et validées" },
                { icon:"📞", label:"Numéro confirmé", wo:"Numéro dëgg", ok:true, desc:"Numéro vérifié par SMS" },
                { icon:"🕐", label:"Horaires à jour", wo:"Gannaaw ak ndey", ok:true, desc:"Mis à jour aujourd'hui" },
                { icon:"💬", label:"WhatsApp actif", wo:"WhatsApp am", ok:!!l.wa, desc:`Répond en ${l.response_time||"–"}` },
                { icon:"💳", label:"Wave/OM accepté", wo:"Jëfandikool Wave", ok:l.payments.includes("wave")||l.payments.includes("om"), desc:"Paiement mobile money accepté" },
              ].map(s => (
                <div key={s.label} style={{ display:"flex", alignItems:"flex-start", gap:11, padding:"10px 0", borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:s.ok?"#ECFDF5":"#FEF2F2", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0, fontWeight:700, color:s.ok?"#065F46":"#991B1B" }}>
                    {s.ok?"✓":"✗"}
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:T.text }}>
                      {s.label} <span style={{ fontSize:10, color:T.muted, fontStyle:"italic" }}>· {s.wo}</span>
                    </div>
                    <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ marginTop:12, padding:"9px 11px", background:T.alt, borderRadius:9, fontSize:11, color:T.muted }}>
                ℹ️ TerangaHub vérifie chaque établissement avant publication. Signalez un problème via WhatsApp.
              </div>
            </div>
          )}

          {tab==="share" && (
            <div>
              <div style={{ fontWeight:600, fontSize:13, marginBottom:13 }}>Partager · {L.wa}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
                {[
                  { icon:"💬", label:"WhatsApp", action:()=>window.open(`https://wa.me/?text=J'ai trouvé *${l.name}* sur TerangaHub! 📍${l.neighborhood}, ${l.city}. Repère: ${l.landmark}`) },
                  { icon:"📋", label:"Copier le lien", action:()=>{} },
                  { icon:"📱", label:"SMS", action:()=>{} },
                  { icon:"📤", label:"Autres", action:()=>{} },
                ].map(s => (
                  <button key={s.label} onClick={s.action} style={{ padding:"12px", background:T.alt, border:`1px solid ${T.border}`, borderRadius:11, cursor:"pointer", display:"flex", alignItems:"center", gap:9, fontSize:12, fontWeight:600, color:T.text }}>
                    <span style={{ fontSize:18 }}>{s.icon}</span>{s.label}
                  </button>
                ))}
              </div>
              <div style={{ marginTop:12, padding:"10px 12px", background:"#F0FDF4", borderRadius:9, border:"1px solid #BBF7D0", fontSize:11, color:"#065F46" }}>
                💡 Partagez dans votre groupe WhatsApp de quartier pour aider la communauté. · Yónni ci sa groupe WhatsApp.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- MAP VIEW ----
function MapView({ listings }) {
  return (
    <div style={{ width:"100%", minHeight:340, background:"linear-gradient(180deg,#e8f4f0,#d1e8dc)", borderRadius:15, position:"relative", overflow:"hidden", border:`1px solid ${T.border}` }}>
      <svg width="100%" height="100%" style={{ position:"absolute", inset:0, opacity:.2 }}>
        {[...Array(12)].map((_,i)=><line key={`h${i}`} x1="0" y1={`${i*8.5}%`} x2="100%" y2={`${i*8.5}%`} stroke={T.green} strokeWidth=".5"/>)}
        {[...Array(12)].map((_,i)=><line key={`v${i}`} x1={`${i*8.5}%`} y1="0" x2={`${i*8.5}%`} y2="100%" stroke={T.green} strokeWidth=".5"/>)}
      </svg>
      {listings.map((l,i) => (
        <div key={l.id} style={{ position:"absolute", left:`${18+(i*16)%62}%`, top:`${22+(i*21)%52}%`, width:26, height:26, background:l.open?T.green:T.muted, borderRadius:"50% 50% 50% 0", transform:"rotate(-45deg)", border:"2px solid white", boxShadow:"0 2px 6px rgba(0,0,0,0.2)", cursor:"pointer" }}>
          <span style={{ display:"block", transform:"rotate(45deg)", textAlign:"center", lineHeight:"22px", fontSize:10 }}>{l.icon}</span>
        </div>
      ))}
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", textAlign:"center" }}>
        <div style={{ fontSize:30, marginBottom:5 }}>🗺️</div>
        <div style={{ fontWeight:700, color:T.greenD, fontSize:12 }}>Carte TerangaHub</div>
        <div style={{ fontSize:10, color:T.muted, marginTop:2 }}>OpenStreetMap · {listings.length} lieux</div>
        <div style={{ marginTop:7, fontSize:9, color:T.muted, background:"rgba(255,255,255,0.9)", padding:"3px 10px", borderRadius:20, border:`1px solid ${T.border}`, display:"inline-block" }}>Leaflet.js intégré en production</div>
      </div>
      <div style={{ position:"absolute", bottom:8, left:8, background:"rgba(255,255,255,0.9)", padding:"2px 8px", borderRadius:4, fontSize:9, color:T.muted, border:`1px solid ${T.border}` }}>© OpenStreetMap · TerangaHub 2026</div>
    </div>
  );
}

// ---- SEARCH BAR ----
function SearchBar({ value, onChange, city, onCity }) {
  const [focus, setFocus] = useState(false);
  const [showSug, setShowSug] = useState(false);
  // Suggestions in FR + Wolof — report section 4
  const suggestions = [
    "Restaurant Almadies Dakar",
    "Pharmacie ouverte la nuit · Farmaasi ci guddi",
    "Mécanicien Plateau · Mekanik",
    "Salon tresses Ouakam",
    "Tailleur wax HLM · Taaloor wax",
    "Wave money Thiès",
  ];
  return (
    <div style={{ position:"relative", flex:1 }}>
      <div style={{ display:"flex", background:T.surface, border:`2px solid ${focus?T.green:T.border}`, borderRadius:12, overflow:"hidden", boxShadow:focus?`0 0 0 3px rgba(26,107,74,0.08)`:"0 1px 3px rgba(0,0,0,0.05)", transition:"all .2s" }}>
        <div style={{ padding:"10px 11px", color:T.muted }}>🔍</div>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => { setFocus(true); setShowSug(true); }}
          onBlur={() => { setFocus(false); setTimeout(()=>setShowSug(false),160); }}
          placeholder={L.search_ph}
          style={{ flex:1, border:"none", outline:"none", fontSize:13, color:T.text, padding:"10px 0", background:"transparent" }}
        />
        {value && <button onClick={()=>onChange("")} style={{ padding:"10px 7px", border:"none", background:"transparent", cursor:"pointer", color:T.muted, fontSize:18 }}>×</button>}
        <div style={{ width:1, background:T.border, margin:"7px 0" }} />
        <select value={city} onChange={e=>onCity(e.target.value)} style={{ border:"none", outline:"none", padding:"0 11px", fontSize:11, color:T.text, background:"transparent", cursor:"pointer", minWidth:80 }}>
          <option value="">Toutes</option>
          {["Dakar","Thiès","Saint-Louis","Mbour","Touba","Ziguinchor","Kaolack","Diamniadio"].map(c=><option key={c}>{c}</option>)}
        </select>
      </div>

      {showSug && !value && (
        <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:50, background:T.surface, border:`1px solid ${T.border}`, borderRadius:10, marginTop:4, boxShadow:"0 6px 20px rgba(0,0,0,0.1)", overflow:"hidden" }}>
          <div style={{ padding:"6px 11px 2px", fontSize:9, color:T.green, fontWeight:700, letterSpacing:.4 }}>RECHERCHES FRÉQUENTES · SEET YU MÀGGET</div>
          {suggestions.map((s,i) => (
            <div key={i} onMouseDown={()=>{ onChange(s); setShowSug(false); }} style={{ padding:"8px 11px", fontSize:12, cursor:"pointer", borderTop:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:6 }}
              onMouseEnter={e=>e.currentTarget.style.background=T.alt}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <span style={{ color:T.green, fontSize:11 }}>→</span>{s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- MAIN APP ----
export default function TerangaHub() {
  const [view, setView]   = useState("home");
  const [modal, setModal] = useState(null);
  const [q, setQ]         = useState("");
  const [city, setCity]   = useState("");
  const [cat, setCat]     = useState("");
  const [mode, setMode]   = useState("list");

  const filtered = LISTINGS.filter(l => {
    const sq = q.toLowerCase();
    const mq = !sq || l.name.toLowerCase().includes(sq) || l.fr_cat.toLowerCase().includes(sq)
      || l.tags.some(t=>t.toLowerCase().includes(sq)) || l.neighborhood.toLowerCase().includes(sq)
      || l.landmark.toLowerCase().includes(sq);
    const mc = !city || l.city===city;
    const mk = !cat || l.cat===cat;
    return mq && mc && mk;
  });

  const goSearch = (catId) => { setCat(catId); setView("search"); };

  return (
    <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif", background:T.alt, minHeight:"100vh" }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        *{box-sizing:border-box;margin:0;padding:0}
        body{margin:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#ccc;border-radius:2px}
      `}</style>

      {/* NAV */}
      <nav style={{ position:"sticky", top:0, zIndex:200, background:"rgba(255,255,255,0.97)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${T.border}`, padding:"0 14px", display:"flex", alignItems:"center", justifyContent:"space-between", height:52 }}>
        <div onClick={()=>{setView("home");setQ("");setCat("");}} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
          <div style={{ width:31, height:31, borderRadius:9, background:`linear-gradient(135deg,${T.green},${T.greenL})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:"white" }}>🌍</div>
          <div>
            <div style={{ fontWeight:800, fontSize:15, color:T.green, lineHeight:1 }}>TerangaHub</div>
            <div style={{ fontSize:8, color:T.muted, letterSpacing:.5 }}>SÉNÉGAL · DÉCOUVERTE LOCALE</div>
          </div>
        </div>
        <button style={{ padding:"6px 13px", background:`linear-gradient(135deg,${T.green},${T.greenL})`, border:"none", borderRadius:8, color:"white", fontSize:10, fontWeight:700, cursor:"pointer" }}>
          + {L.add}
        </button>
      </nav>

      {/* HOME */}
      {view==="home" && (
        <div>
          {/* Hero */}
          <div style={{ background:`linear-gradient(160deg,${T.greenD} 0%,${T.green} 55%,${T.greenL} 100%)`, padding:"34px 14px 46px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.04)", top:-50, right:-30 }} />
            <div style={{ position:"absolute", width:110, height:110, borderRadius:"50%", background:"rgba(232,152,10,0.1)", bottom:-20, right:"22%" }} />
            <div style={{ maxWidth:580, margin:"0 auto", position:"relative" }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.13)", borderRadius:20, padding:"4px 12px 4px 6px", marginBottom:11 }}>
                <span style={{ fontSize:15 }}>🇸🇳</span>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.9)", fontWeight:600 }}>Teranga · Découverte locale au Sénégal</span>
              </div>
              <h1 style={{ color:"white", fontSize:22, fontWeight:800, lineHeight:1.25, marginBottom:6 }}>
                Trouvez, vérifiez, contactez.<br/>
                <span style={{ color:T.goldL }}>Seet. Xam. Yónnëe.</span>
              </h1>
              <p style={{ color:"rgba(255,255,255,0.75)", fontSize:12, marginBottom:20, lineHeight:1.65 }}>
                Restaurants, salons, mécaniciens, pharmacies — adresses repères,<br/>horaires confirmés, WhatsApp direct, Wave accepté.
              </p>
              <div style={{ display:"flex", gap:8, marginBottom:18 }}>
                <SearchBar value={q} onChange={v=>{setQ(v);if(v)setView("search");}} city={city} onCity={setCity} />
                <button onClick={()=>setView("search")} style={{ padding:"0 16px", background:`linear-gradient(135deg,${T.gold},${T.goldL})`, border:"none", borderRadius:12, color:"white", fontWeight:700, fontSize:13, cursor:"pointer", flexShrink:0 }}>Seet</button>
              </div>
              <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
                {[["45K+","Établissements"],["12","Villes"],["Wave · OM","Paiements"],["Wolof · Fr","Langues"]].map(([v,lb])=>(
                  <div key={lb} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:15, fontWeight:800, color:"white" }}>{v}</div>
                    <div style={{ fontSize:9, color:"rgba(255,255,255,0.65)" }}>{lb}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trust bar — report: trust signals before features */}
          <div style={{ background:"#ECFDF5", borderBottom:"1px solid #A7F3D0", padding:"9px 14px", display:"flex", alignItems:"center", gap:8, overflowX:"auto" }}>
            <span style={{ fontSize:10, color:"#065F46", fontWeight:700, whiteSpace:"nowrap" }}>✓ Vérifié:</span>
            {["Photos réelles","Horaires confirmés","Téléphone actif","Wave/OM","Adresse repère"].map(s=>(
              <span key={s} style={{ fontSize:9, color:"#065F46", background:"white", padding:"2px 8px", borderRadius:20, border:"1px solid #A7F3D0", whiteSpace:"nowrap", flexShrink:0 }}>{s}</span>
            ))}
          </div>

          {/* Categories */}
          <div style={{ padding:"20px 14px 0" }}>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontWeight:700, fontSize:15, color:T.text }}>{L.cats}</div>
              <div style={{ fontSize:9, color:T.muted }}>Choisissez · Tann xëtu dëkk</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(106px,1fr))", gap:8 }}>
              {CATS.map(c => (
                <div key={c.id} onClick={()=>goSearch(c.id)} style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:"12px 9px", cursor:"pointer", textAlign:"center", transition:"all .15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=T.green;e.currentTarget.style.background="#F0FAF5";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surface;}}
                >
                  <div style={{ fontSize:21, marginBottom:4 }}>{c.icon}</div>
                  <div style={{ fontSize:10, fontWeight:600, color:T.text, lineHeight:1.3 }}>{c.fr}</div>
                  <div style={{ fontSize:8, color:T.muted, fontStyle:"italic", marginTop:1 }}>{c.wo}</div>
                  <div style={{ fontSize:8, color:T.muted, marginTop:1 }}>{c.n.toLocaleString()} lieux</div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured */}
          <div style={{ padding:"20px 14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div>
                <div style={{ fontWeight:700, fontSize:15, color:T.text }}>{L.featured}</div>
                <div style={{ fontSize:9, color:T.muted }}>Vérifiés · Seetlu ak xam-xam</div>
              </div>
              <span onClick={()=>setView("search")} style={{ fontSize:11, color:T.green, fontWeight:600, cursor:"pointer" }}>Tout voir →</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
              {LISTINGS.filter(l=>l.featured).map(l=><Card key={l.id} l={l} onOpen={setModal} compact={false} />)}
            </div>
          </div>

          {/* WhatsApp strip */}
          <div style={{ margin:"0 14px 20px", background:"linear-gradient(135deg,#25D366,#128C7E)", borderRadius:15, padding:"16px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:34, flexShrink:0 }}>💬</div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"white", marginBottom:3 }}>Contact direct via WhatsApp</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.85)", lineHeight:1.55 }}>Message pré-rempli en français et wolof. Zéro friction. Réponse en minutes.</div>
            </div>
          </div>

          {/* Diaspora strip — report section 2: high-value underserved */}
          <div style={{ margin:"0 14px 20px", background:"linear-gradient(135deg,#1E40AF,#1D4ED8)", borderRadius:15, padding:"16px", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ fontSize:34, flexShrink:0 }}>✈️</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:13, color:"white", marginBottom:3 }}>Commandes diaspora · Kanam</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.85)", lineHeight:1.55 }}>Paris, Rome, New York → Dakar. Wave/Sendwave. Livraison famille.</div>
            </div>
            <button style={{ padding:"7px 12px", background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.4)", borderRadius:8, color:"white", fontWeight:700, fontSize:10, cursor:"pointer", flexShrink:0 }}>Voir →</button>
          </div>

          {/* Business CTA — report: free at launch, no friction */}
          <div style={{ margin:"0 14px 30px", background:T.surface, border:`1px solid ${T.border}`, borderRadius:15, padding:"18px", textAlign:"center" }}>
            <div style={{ fontSize:28, marginBottom:8 }}>🏪</div>
            <div style={{ fontWeight:700, fontSize:14, color:T.text, marginBottom:5 }}>Référencez votre établissement — Gratuit · Dëgg</div>
            <div style={{ fontSize:11, color:T.muted, lineHeight:1.6, marginBottom:14 }}>
              Rejoignez 45,000+ établissements vérifiés. Aucun abonnement au démarrage.<br/>
              <span style={{ fontStyle:"italic" }}>Topp ci 45,000+ dëkk bu seetlu.</span>
            </div>
            <button style={{ padding:"10px 22px", background:`linear-gradient(135deg,${T.green},${T.greenL})`, border:"none", borderRadius:9, color:"white", fontWeight:700, fontSize:12, cursor:"pointer" }}>
              Ajouter gratuitement · Yokk ci kanam
            </button>
          </div>

          <div style={{ height:70 }} />
        </div>
      )}

      {/* SEARCH */}
      {view==="search" && (
        <div>
          <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"9px 12px", position:"sticky", top:52, zIndex:100 }}>
            <div style={{ display:"flex", gap:7, alignItems:"center", marginBottom:7 }}>
              <button onClick={()=>{setView("home");setQ("");setCat("");}} style={{ padding:"7px 9px", background:T.alt, border:`1px solid ${T.border}`, borderRadius:8, fontSize:13, color:T.muted, cursor:"pointer", flexShrink:0 }}>←</button>
              <SearchBar value={q} onChange={setQ} city={city} onCity={setCity} />
              <div style={{ display:"flex", border:`1px solid ${T.border}`, borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                {[{v:"list",i:"☰"},{v:"split",i:"⊞"},{v:"map",i:"🗺️"}].map(m=>(
                  <button key={m.v} onClick={()=>setMode(m.v)} style={{ padding:"7px 9px", border:"none", background:mode===m.v?T.greenL:"transparent", color:mode===m.v?"white":T.muted, cursor:"pointer", fontSize:13, transition:"all .15s" }}>{m.i}</button>
                ))}
              </div>
            </div>
            <div style={{ display:"flex", gap:5, overflowX:"auto", scrollbarWidth:"none" }}>
              <button onClick={()=>setCat("")} style={{ padding:"3px 11px", borderRadius:20, fontSize:10, fontWeight:600, background:!cat?T.green:T.surface, color:!cat?"white":T.muted, border:!cat?"none":`1px solid ${T.border}`, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>Tout · Bëpp</button>
              {CATS.slice(0,7).map(c=>(
                <button key={c.id} onClick={()=>setCat(cat===c.id?"":c.id)} style={{ padding:"3px 11px", borderRadius:20, fontSize:10, fontWeight:600, background:cat===c.id?T.green:T.surface, color:cat===c.id?"white":T.muted, border:cat===c.id?"none":`1px solid ${T.border}`, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
                  {c.icon} {c.fr}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding:"9px 12px" }}>
            <div style={{ fontSize:11, color:T.muted, marginBottom:9 }}>
              <span style={{ fontWeight:600, color:T.text }}>{filtered.length}</span> établissements
              {q && <span> · "<span style={{ color:T.green }}>{q}</span>"</span>}
              {city && <span> à <span style={{ color:T.green }}>{city}</span></span>}
            </div>

            {mode==="map" ? (
              <MapView listings={filtered} />
            ) : mode==="split" ? (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11, height:520 }}>
                <div style={{ overflowY:"auto", display:"flex", flexDirection:"column", gap:9 }}>
                  {filtered.map(l=><Card key={l.id} l={l} onOpen={setModal} compact={true} />)}
                </div>
                <MapView listings={filtered} />
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {filtered.length===0 ? (
                  <div style={{ textAlign:"center", padding:"48px 20px", background:T.surface, borderRadius:15, border:`1px solid ${T.border}` }}>
                    <div style={{ fontSize:34, marginBottom:9 }}>🔍</div>
                    <div style={{ fontWeight:700, color:T.text, marginBottom:5 }}>Aucun résultat</div>
                    <div style={{ fontSize:11, color:T.muted }}>Essayez un autre mot-clé · Seet lu lañu</div>
                  </div>
                ) : filtered.map(l=>(
                  <Card key={l.id} l={l} onOpen={setModal} compact={false} />
                ))}
              </div>
            )}
          </div>
          <div style={{ height:70 }} />
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:150, background:"rgba(255,255,255,0.97)", backdropFilter:"blur(12px)", borderTop:`1px solid ${T.border}`, display:"grid", gridTemplateColumns:"repeat(4,1fr)", padding:"6px 0" }}>
        {[
          { label:"Accueil", wo:"Kër",    icon:"🏠", v:"home"   },
          { label:"Recherche",wo:"Seet",  icon:"🔍", v:"search" },
          { label:"Carte",   wo:"Carte",  icon:"🗺️", v:"map"    },
          { label:"Partager", wo:"Yónne", icon:"📤", v:"share"  },
        ].map(item => (
          <button key={item.label} onClick={()=>{ if(item.v==="map"){setView("search");setMode("map");}else setView(item.v); }} style={{ background:"transparent", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:1, padding:"3px 0" }}>
            <span style={{ fontSize:19 }}>{item.icon}</span>
            <span style={{ fontSize:9, fontWeight:600, color: view===item.v?T.green:T.muted }}>{item.label}</span>
            <span style={{ fontSize:7, color:T.muted, opacity:.7 }}>{item.wo}</span>
          </button>
        ))}
      </nav>

      {modal && <Modal l={modal} onClose={()=>setModal(null)} />}
    </div>
  );
}
