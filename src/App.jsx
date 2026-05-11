
import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// SENMAP — The Definitive Local Discovery Platform for Senegal
// Inspired by GnakryMap (Guinea) but rebuilt for Senegal
// with AI, WhatsApp, verification, analytics & modern UX
// ============================================================

// ---------- DESIGN TOKENS ----------
const tokens = {
  primary: "#1A6B4A",      // deep Senegal green
  primaryLight: "#2D9E6B",
  primaryDark: "#0F3F2C",
  accent: "#F5A623",       // warm gold/amber
  accentLight: "#FFCB6B",
  danger: "#E53E3E",
  text: "#1A1A2E",
  textMuted: "#6B7280",
  surface: "#FFFFFF",
  surfaceAlt: "#F7F9F7",
  border: "#E5E7EB",
  verified: "#059669",
};

// ---------- MOCK DATA ----------
const CITIES = ["Dakar","Thiès","Saint-Louis","Mbour","Touba","Ziguinchor","Kaolack","Diourbel","Louga","Tambacounda"];

const CATEGORIES = [
  { id:"restaurants", label:"Restaurants", icon:"🍽️", count:1247 },
  { id:"health", label:"Santé", icon:"🏥", count:843 },
  { id:"hotels", label:"Hôtels", icon:"🏨", count:392 },
  { id:"banking", label:"Banques & Mobile Money", icon:"💳", count:614 },
  { id:"education", label:"Écoles & Formation", icon:"📚", count:521 },
  { id:"transport", label:"Transport", icon:"🚌", count:287 },
  { id:"market", label:"Marchés & Commerce", icon:"🛍️", count:2103 },
  { id:"artisan", label:"Artisanat", icon:"🪡", count:438 },
  { id:"telecom", label:"Télécom & Tech", icon:"📱", count:193 },
  { id:"services", label:"Services Pro", icon:"💼", count:876 },
  { id:"beauty", label:"Beauté & Bien-être", icon:"💅", count:342 },
  { id:"religion", label:"Mosquées & Lieux saints", icon:"🕌", count:1876 },
];

const LISTINGS = [
  {
    id:"1", name:"Teranga Restaurant", category:"restaurants", city:"Dakar",
    neighborhood:"Plateau", address:"23 Avenue Léopold Sédar Senghor",
    phone:"+221 33 821 45 67", whatsapp:"+221 77 821 45 67",
    rating:4.7, reviews:128, verified:true, featured:true,
    hours:"08:00-23:00", tags:["Thiéboudienne","Yassa","Livraison"],
    description:"Le meilleur restaurant de cuisine sénégalaise traditionnelle à Dakar. Spécialités: Thiéboudienne, Yassa poulet, Mafé.",
    lat:14.6937, lng:-17.4441, image:"🍛",
    openNow:true, priceRange:"€€",
    aiSummary:"Plébiscité pour son thiéboudienne authentique et son service chaleureux. Idéal pour les familles et les groupes. Réservation recommandée le weekend.",
  },
  {
    id:"2", name:"Pharmacie Centrale Thiès", category:"health", city:"Thiès",
    neighborhood:"Centre-ville", address:"Place de l'Indépendance",
    phone:"+221 33 951 23 45", whatsapp:"+221 78 951 23 45",
    rating:4.5, reviews:67, verified:true, featured:false,
    hours:"08:00-22:00", tags:["Médicaments","Conseil","Garde"],
    description:"Pharmacie complète avec service de garde nocturne. Personnel bilingue français/wolof.",
    lat:14.7877, lng:-16.9243, image:"💊",
    openNow:true, priceRange:"€",
    aiSummary:"Pharmacie de confiance avec un stock complet. Équipe disponible 7j/7 incluant les jours fériés. Service de garde disponible la nuit.",
  },
  {
    id:"3", name:"Hôtel Savana Dakar", category:"hotels", city:"Dakar",
    neighborhood:"Almadies", address:"Route des Almadies",
    phone:"+221 33 869 11 11", whatsapp:"+221 77 869 11 11",
    rating:4.8, reviews:342, verified:true, featured:true,
    hours:"24/7", tags:["Piscine","WiFi","Parking","Restaurant"],
    description:"Hôtel 4 étoiles face à l'océan Atlantique. Chambres climatisées, piscine, restaurant gastronomique.",
    lat:14.7500, lng:-17.5000, image:"🏨",
    openNow:true, priceRange:"€€€",
    aiSummary:"Idéalement situé aux Almadies avec vue mer. Excellent rapport qualité-prix. Navette aéroport disponible sur demande.",
  },
  {
    id:"4", name:"Wave Money Saint-Louis", category:"banking", city:"Saint-Louis",
    neighborhood:"Sor", address:"Rue Abdoul Aziz Sy",
    phone:"+221 33 961 00 00", whatsapp:"+221 70 200 0000",
    rating:4.3, reviews:89, verified:true, featured:false,
    hours:"08:00-20:00", tags:["Mobile Money","Orange Money","Wave","Transferts"],
    description:"Point de service financier mobile money. Dépôts, retraits, transferts, paiements de factures.",
    lat:16.0279, lng:-16.4888, image:"💳",
    openNow:true, priceRange:"€",
    aiSummary:"Service rapide pour tous vos besoins mobile money. File d'attente courte tôt le matin. Accepte Wave, Orange Money et Free Money.",
  },
  {
    id:"5", name:"École Numérique Touba", category:"education", city:"Touba",
    neighborhood:"Darou Khoudoss", address:"Route de Diourbel",
    phone:"+221 33 976 55 44", whatsapp:"+221 76 976 55 44",
    rating:4.6, reviews:54, verified:true, featured:false,
    hours:"08:00-18:00", tags:["Informatique","Formation","Certifications"],
    description:"Centre de formation aux technologies numériques. Programmes de certification Microsoft, développement web, bureautique.",
    lat:14.8500, lng:-15.8833, image:"💻",
    openNow:true, priceRange:"€€",
    aiSummary:"Centre de référence pour la formation tech en région de Diourbel. Programmes flexibles matin et soir. Bourses disponibles.",
  },
  {
    id:"6", name:"Marché HLM Dakar", category:"market", city:"Dakar",
    neighborhood:"HLM", address:"Avenue Cheikh Anta Diop",
    phone:"+221 33 824 00 00", whatsapp:null,
    rating:4.4, reviews:215, verified:true, featured:true,
    hours:"07:00-21:00", tags:["Tissus","Confection","Wax","Prêt-à-porter"],
    description:"Le grand marché du tissu et de la confection de Dakar. Des centaines de boutiques, tailleurs sur place.",
    lat:14.7167, lng:-17.4500, image:"🛍️",
    openNow:true, priceRange:"€",
    aiSummary:"Incontournable pour les tissus wax et bazin. Négociation de mise. Tailleurs qualifiés sur place pour créations sur mesure en 24-48h.",
  },
];

const STATS = [
  { label:"Établissements", value:"45,000+", icon:"🏪" },
  { label:"Villes couvertes", value:"12", icon:"🏙️" },
  { label:"Utilisateurs actifs", value:"280K+", icon:"👥" },
  { label:"Avis vérifiés", value:"1.2M+", icon:"⭐" },
];

// ---------- UTILITY FUNCTIONS ----------
const formatPhone = (p) => p;
const getWhatsAppUrl = (num, msg) =>
  `https://wa.me/${num.replace(/\D/g,"")}?text=${encodeURIComponent(msg)}`;

// ---------- COMPONENTS ----------

function StarRating({ rating, size = 14 }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:2 }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ fontSize:size, color: s <= Math.round(rating) ? "#F5A623" : "#D1D5DB" }}>★</span>
      ))}
      <span style={{ fontSize:12, color:tokens.textMuted, marginLeft:2 }}>{rating}</span>
    </span>
  );
}

function Badge({ children, type = "default", small }) {
  const styles = {
    default: { bg:"#EFF6FF", color:"#1D4ED8" },
    verified: { bg:"#ECFDF5", color:"#065F46" },
    featured: { bg:"#FFF7ED", color:"#92400E" },
    open: { bg:"#ECFDF5", color:"#065F46" },
    closed: { bg:"#FEF2F2", color:"#991B1B" },
    ai: { bg:"#F5F3FF", color:"#5B21B6" },
  };
  const s = styles[type] || styles.default;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:3,
      background:s.bg, color:s.color,
      fontSize: small ? 10 : 11, fontWeight:600,
      padding: small ? "1px 6px" : "2px 8px",
      borderRadius:20, whiteSpace:"nowrap",
    }}>{children}</span>
  );
}

function AIBadge() {
  return <Badge type="ai">✦ IA</Badge>;
}

function VerifiedBadge() {
  return <Badge type="verified">✓ Vérifié</Badge>;
}

function Card({ listing, onClick, compact }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(listing)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: tokens.surface,
        border: `1px solid ${hovered ? tokens.primaryLight : tokens.border}`,
        borderRadius:16,
        padding: compact ? "12px 14px" : "18px 20px",
        cursor:"pointer",
        transition:"all 0.18s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(26,107,74,0.12)" : "0 1px 4px rgba(0,0,0,0.05)",
        position:"relative",
        overflow:"hidden",
      }}
    >
      {listing.featured && (
        <div style={{
          position:"absolute", top:0, right:0,
          background:"linear-gradient(135deg, #F5A623, #E8870A)",
          color:"white", fontSize:9, fontWeight:700, letterSpacing:0.5,
          padding:"3px 10px 3px 16px",
          borderBottomLeftRadius:12,
        }}>SPONSORISÉ</div>
      )}

      <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
        <div style={{
          width: compact ? 40 : 52, height: compact ? 40 : 52,
          borderRadius:12, background:tokens.surfaceAlt,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize: compact ? 22 : 28, flexShrink:0,
          border:`1px solid ${tokens.border}`,
        }}>{listing.image}</div>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:2 }}>
            <span style={{ fontWeight:700, fontSize: compact ? 13 : 15, color:tokens.text, lineHeight:1.2 }}>
              {listing.name}
            </span>
            {listing.verified && <VerifiedBadge />}
            {listing.openNow && <Badge type="open" small>Ouvert</Badge>}
          </div>

          <div style={{ fontSize:12, color:tokens.textMuted, marginBottom:4 }}>
            📍 {listing.neighborhood}, {listing.city} · {listing.priceRange}
          </div>

          <StarRating rating={listing.rating} size={12} />
          <span style={{ fontSize:11, color:tokens.textMuted, marginLeft:6 }}>({listing.reviews} avis)</span>

          {!compact && (
            <div style={{ marginTop:8, display:"flex", gap:6, flexWrap:"wrap" }}>
              {listing.tags.slice(0,3).map(t => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {!compact && listing.aiSummary && (
        <div style={{
          marginTop:12, padding:"10px 12px",
          background:"#F5F3FF", borderRadius:10,
          borderLeft:`3px solid #7C3AED`,
          fontSize:12, color:"#4C1D95", lineHeight:1.5,
        }}>
          <AIBadge /> {listing.aiSummary}
        </div>
      )}

      {!compact && (
        <div style={{ display:"flex", gap:8, marginTop:12 }}>
          <button
            onClick={(e) => { e.stopPropagation(); window.open(`tel:${listing.phone}`); }}
            style={{
              flex:1, padding:"8px 0",
              background:tokens.surface, border:`1px solid ${tokens.border}`,
              borderRadius:8, fontSize:12, fontWeight:600,
              color:tokens.text, cursor:"pointer", display:"flex",
              alignItems:"center", justifyContent:"center", gap:5,
            }}
          >📞 Appeler</button>

          {listing.whatsapp && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(getWhatsAppUrl(listing.whatsapp, `Bonjour, j'ai trouvé votre établissement sur SenMap. Je voudrais avoir des informations sur vos services.`));
              }}
              style={{
                flex:1, padding:"8px 0",
                background:"#25D366", border:"none",
                borderRadius:8, fontSize:12, fontWeight:600,
                color:"white", cursor:"pointer", display:"flex",
                alignItems:"center", justifyContent:"center", gap:5,
              }}
            >💬 WhatsApp</button>
          )}
        </div>
      )}
    </div>
  );
}

function MapPlaceholder({ listings, selected }) {
  const [mapCenter] = useState({ lat:14.6937, lng:-17.4441 });
  return (
    <div style={{
      width:"100%", height:"100%", minHeight:380,
      background:"linear-gradient(180deg, #e8f4f0 0%, #d4edde 100%)",
      borderRadius:16, position:"relative", overflow:"hidden",
      border:`1px solid ${tokens.border}`,
    }}>
      {/* Simulated map grid */}
      <svg width="100%" height="100%" style={{ position:"absolute", top:0, left:0, opacity:0.3 }}>
        {[...Array(10)].map((_,i) => (
          <line key={`h${i}`} x1="0" y1={`${i*10}%`} x2="100%" y2={`${i*10}%`} stroke="#1A6B4A" strokeWidth="0.5"/>
        ))}
        {[...Array(10)].map((_,i) => (
          <line key={`v${i}`} x1={`${i*10}%`} y1="0" x2={`${i*10}%`} y2="100%" stroke="#1A6B4A" strokeWidth="0.5"/>
        ))}
      </svg>

      {/* Map label */}
      <div style={{
        position:"absolute", top:"50%", left:"50%",
        transform:"translate(-50%,-50%)",
        textAlign:"center", zIndex:1,
      }}>
        <div style={{ fontSize:40, marginBottom:8 }}>🗺️</div>
        <div style={{ fontWeight:700, color:tokens.primaryDark, fontSize:15 }}>Carte Interactive</div>
        <div style={{ fontSize:12, color:tokens.textMuted, marginTop:4 }}>
          OpenStreetMap · {listings.length} établissements
        </div>
        <div style={{
          marginTop:12, fontSize:11, color:tokens.textMuted,
          background:"rgba(255,255,255,0.9)", padding:"6px 14px",
          borderRadius:20, border:`1px solid ${tokens.border}`,
        }}>
          Intégration Leaflet.js en production
        </div>
      </div>

      {/* Pins */}
      {listings.map((l, i) => (
        <div key={l.id} style={{
          position:"absolute",
          left:`${20 + (i*15) % 60}%`,
          top:`${25 + (i*17) % 50}%`,
          width:32, height:32,
          background: selected?.id === l.id ? tokens.accent : tokens.primary,
          borderRadius:"50% 50% 50% 0",
          transform:"rotate(-45deg)",
          border:"2px solid white",
          boxShadow:"0 2px 8px rgba(0,0,0,0.2)",
          cursor:"pointer",
          transition:"all 0.2s",
          zIndex: selected?.id === l.id ? 10 : 1,
          scale: selected?.id === l.id ? "1.3" : "1",
        }}>
          <span style={{
            display:"block", transform:"rotate(45deg)",
            textAlign:"center", lineHeight:"28px", fontSize:12
          }}>{l.image}</span>
        </div>
      ))}

      {/* Scale bar */}
      <div style={{
        position:"absolute", bottom:12, left:12,
        background:"rgba(255,255,255,0.9)", padding:"4px 10px",
        borderRadius:6, fontSize:10, color:tokens.textMuted,
        border:`1px solid ${tokens.border}`,
      }}>
        © OpenStreetMap · SenMap 2026
      </div>
    </div>
  );
}

function SearchBar({ value, onChange, city, onCityChange }) {
  const [focused, setFocused] = useState(false);
  const [aiSuggestions] = useState([
    "Restaurants avec livraison à Dakar",
    "Pharmacies ouvertes la nuit",
    "Hôtels bon marché Thiès",
    "Wave Money près de moi",
    "Écoles d'informatique Dakar",
  ]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div style={{ position:"relative", flex:1 }}>
      <div style={{
        display:"flex", gap:0,
        background: tokens.surface,
        border:`2px solid ${focused ? tokens.primary : tokens.border}`,
        borderRadius:14,
        overflow:"hidden",
        boxShadow: focused ? `0 0 0 4px rgba(26,107,74,0.08)` : "0 2px 8px rgba(0,0,0,0.06)",
        transition:"all 0.2s",
      }}>
        <div style={{ padding:"12px 14px", display:"flex", alignItems:"center", color:tokens.textMuted }}>
          🔍
        </div>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => { setFocused(true); setShowSuggestions(true); }}
          onBlur={() => { setFocused(false); setTimeout(() => setShowSuggestions(false), 150); }}
          placeholder="Restaurants, pharmacies, hôtels... (Fr/Wolof)"
          style={{
            flex:1, border:"none", outline:"none",
            fontSize:14, color:tokens.text, padding:"12px 0",
            background:"transparent",
          }}
        />
        {value && (
          <button
            onClick={() => onChange("")}
            style={{ padding:"12px 8px", border:"none", background:"transparent", cursor:"pointer", color:tokens.textMuted, fontSize:18 }}
          >×</button>
        )}
        <div style={{ width:1, background:tokens.border, margin:"8px 0" }} />
        <select
          value={city}
          onChange={e => onCityChange(e.target.value)}
          style={{
            border:"none", outline:"none", padding:"0 14px",
            fontSize:13, color:tokens.text, background:"transparent",
            cursor:"pointer", minWidth:100,
          }}
        >
          <option value="">Toutes les villes</option>
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {showSuggestions && !value && (
        <div style={{
          position:"absolute", top:"100%", left:0, right:0, zIndex:100,
          background:tokens.surface, border:`1px solid ${tokens.border}`,
          borderRadius:12, marginTop:6,
          boxShadow:"0 8px 32px rgba(0,0,0,0.12)",
          overflow:"hidden",
        }}>
          <div style={{ padding:"8px 14px 4px", fontSize:11, color:tokens.textMuted, fontWeight:600, letterSpacing:0.5 }}>
            ✦ SUGGESTIONS IA
          </div>
          {aiSuggestions.map((s, i) => (
            <div
              key={i}
              onMouseDown={() => { onChange(s); setShowSuggestions(false); }}
              style={{
                padding:"10px 14px", fontSize:13, cursor:"pointer",
                borderTop:`1px solid ${tokens.border}`,
                display:"flex", alignItems:"center", gap:8,
                transition:"background 0.1s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = tokens.surfaceAlt}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ color:"#7C3AED" }}>✦</span>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BusinessModal({ listing, onClose }) {
  const [activeTab, setActiveTab] = useState("info");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const tabs = [
    { id:"info", label:"Infos" },
    { id:"reviews", label:`Avis (${listing.reviews})` },
    { id:"ai", label:"✦ IA Résumé" },
    { id:"share", label:"Partager" },
  ];

  const mockReviews = [
    { user:"Fatou D.", rating:5, text:"Excellent service! Personnel très accueillant, prix raisonnables.", time:"Il y a 2 jours" },
    { user:"Moussa K.", rating:4, text:"Bon endroit, mais un peu d'attente aux heures de pointe.", time:"Il y a 1 semaine" },
    { user:"Aminata B.", rating:5, text:"Recommande vivement! Qualité constante depuis des années.", time:"Il y a 2 semaines" },
  ];

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:1000,
      background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)",
      display:"flex", alignItems:"flex-end",
      animation:"fadeIn 0.2s ease",
    }} onClick={onClose}>
      <div
        style={{
          width:"100%", maxWidth:680, margin:"0 auto",
          background:tokens.surface, borderRadius:"24px 24px 0 0",
          maxHeight:"90vh", overflow:"auto",
          animation:"slideUp 0.3s ease",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 0" }}>
          <div style={{ width:40, height:4, borderRadius:2, background:tokens.border }} />
        </div>

        {/* Header */}
        <div style={{ padding:"16px 24px 0", display:"flex", gap:14, alignItems:"flex-start" }}>
          <div style={{
            width:64, height:64, borderRadius:16,
            background:tokens.surfaceAlt, display:"flex",
            alignItems:"center", justifyContent:"center",
            fontSize:36, border:`1px solid ${tokens.border}`, flexShrink:0,
          }}>{listing.image}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <h2 style={{ margin:0, fontSize:20, color:tokens.text }}>{listing.name}</h2>
              {listing.verified && <VerifiedBadge />}
            </div>
            <div style={{ fontSize:13, color:tokens.textMuted, marginTop:4 }}>
              📍 {listing.address}, {listing.city}
            </div>
            <div style={{ marginTop:6 }}>
              <StarRating rating={listing.rating} size={16} />
            </div>
          </div>
          <button onClick={onClose} style={{
            width:32, height:32, borderRadius:"50%", border:`1px solid ${tokens.border}`,
            background:tokens.surfaceAlt, cursor:"pointer", fontSize:18, flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>×</button>
        </div>

        {/* CTA Buttons */}
        <div style={{ display:"flex", gap:8, padding:"14px 24px", borderBottom:`1px solid ${tokens.border}` }}>
          <button style={{
            flex:1, padding:"10px 0",
            background:tokens.primary, border:"none",
            borderRadius:10, color:"white", fontWeight:600,
            fontSize:13, cursor:"pointer", display:"flex",
            alignItems:"center", justifyContent:"center", gap:6,
          }}>📞 Appeler</button>
          {listing.whatsapp && (
            <button
              onClick={() => window.open(getWhatsAppUrl(listing.whatsapp, `Bonjour ${listing.name}, je vous contacte via SenMap.`))}
              style={{
                flex:1, padding:"10px 0",
                background:"#25D366", border:"none",
                borderRadius:10, color:"white", fontWeight:600,
                fontSize:13, cursor:"pointer", display:"flex",
                alignItems:"center", justifyContent:"center", gap:6,
              }}
            >💬 WhatsApp</button>
          )}
          <button style={{
            width:42, padding:"10px 0",
            background:tokens.surfaceAlt, border:`1px solid ${tokens.border}`,
            borderRadius:10, cursor:"pointer", fontSize:18,
            display:"flex", alignItems:"center", justifyContent:"center",
          }}>🔖</button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", borderBottom:`1px solid ${tokens.border}`, padding:"0 24px" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding:"12px 16px", border:"none", background:"transparent",
              cursor:"pointer", fontSize:13, fontWeight:600,
              color: activeTab === t.id ? tokens.primary : tokens.textMuted,
              borderBottom: activeTab === t.id ? `2px solid ${tokens.primary}` : "2px solid transparent",
              transition:"all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding:"20px 24px 32px" }}>
          {activeTab === "info" && (
            <div>
              <p style={{ fontSize:14, color:tokens.text, lineHeight:1.7, marginTop:0 }}>
                {listing.description}
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
                {[
                  { icon:"🕐", label:"Horaires", value:listing.hours },
                  { icon:"💰", label:"Prix", value:listing.priceRange === "€" ? "Économique" : listing.priceRange === "€€" ? "Moyen" : "Premium" },
                  { icon:"📱", label:"Téléphone", value:listing.phone },
                  { icon:"🏙️", label:"Ville", value:listing.city },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{
                    padding:"12px", background:tokens.surfaceAlt,
                    borderRadius:10, border:`1px solid ${tokens.border}`,
                  }}>
                    <div style={{ fontSize:11, color:tokens.textMuted, marginBottom:4 }}>{icon} {label}</div>
                    <div style={{ fontSize:13, fontWeight:600, color:tokens.text }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {listing.tags.map(t => <Badge key={t}>{t}</Badge>)}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              {mockReviews.map((r, i) => (
                <div key={i} style={{
                  padding:"14px 0",
                  borderBottom: i < mockReviews.length - 1 ? `1px solid ${tokens.border}` : "none",
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{
                        width:32, height:32, borderRadius:"50%",
                        background:tokens.primaryLight, color:"white",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:13, fontWeight:700,
                      }}>{r.user[0]}</div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:600, color:tokens.text }}>{r.user}</div>
                        <div style={{ fontSize:11, color:tokens.textMuted }}>{r.time}</div>
                      </div>
                    </div>
                    <StarRating rating={r.rating} size={13} />
                  </div>
                  <p style={{ margin:0, fontSize:13, color:tokens.text, lineHeight:1.6, paddingLeft:40 }}>{r.text}</p>
                </div>
              ))}

              {/* Add review */}
              {!reviewSubmitted ? (
                <div style={{
                  marginTop:20, padding:16, background:tokens.surfaceAlt,
                  borderRadius:12, border:`1px solid ${tokens.border}`,
                }}>
                  <div style={{ fontWeight:600, fontSize:14, marginBottom:12 }}>Laisser un avis</div>
                  <div style={{ display:"flex", gap:6, marginBottom:12 }}>
                    {[1,2,3,4,5].map(s => (
                      <span
                        key={s}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(s)}
                        style={{ fontSize:28, cursor:"pointer", color: s <= (hoverRating || rating) ? "#F5A623" : "#D1D5DB" }}
                      >★</span>
                    ))}
                  </div>
                  <textarea
                    value={review}
                    onChange={e => setReview(e.target.value)}
                    placeholder="Partagez votre expérience..."
                    style={{
                      width:"100%", minHeight:80, border:`1px solid ${tokens.border}`,
                      borderRadius:8, padding:"10px 12px", fontSize:13,
                      fontFamily:"inherit", resize:"vertical", outline:"none",
                      boxSizing:"border-box",
                    }}
                  />
                  <button
                    onClick={() => setReviewSubmitted(true)}
                    style={{
                      marginTop:10, padding:"10px 20px",
                      background:tokens.primary, border:"none",
                      borderRadius:8, color:"white", fontWeight:600,
                      fontSize:13, cursor:"pointer",
                    }}
                  >Publier l'avis</button>
                </div>
              ) : (
                <div style={{
                  marginTop:20, padding:16, background:"#ECFDF5",
                  borderRadius:12, border:`1px solid #A7F3D0`,
                  textAlign:"center", color:"#065F46",
                }}>
                  ✅ Merci pour votre avis! Il sera vérifié avant publication.
                </div>
              )}
            </div>
          )}

          {activeTab === "ai" && (
            <div>
              <div style={{
                padding:16, background:"#F5F3FF",
                borderRadius:12, borderLeft:`4px solid #7C3AED`,
                marginBottom:16,
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <span style={{ fontSize:18 }}>✦</span>
                  <span style={{ fontWeight:700, color:"#5B21B6", fontSize:14 }}>Résumé Intelligent SenMap</span>
                </div>
                <p style={{ margin:0, fontSize:14, color:"#4C1D95", lineHeight:1.7 }}>
                  {listing.aiSummary}
                </p>
              </div>

              <div style={{
                padding:14, background:tokens.surfaceAlt,
                borderRadius:10, border:`1px solid ${tokens.border}`,
                fontSize:12, color:tokens.textMuted,
              }}>
                ℹ️ Ce résumé est généré automatiquement par l'IA SenMap à partir des avis clients et des informations de l'établissement. Mise à jour hebdomadaire.
              </div>

              <div style={{ marginTop:16 }}>
                <div style={{ fontWeight:600, fontSize:14, marginBottom:12 }}>Points forts</div>
                {["Service client", "Rapport qualité-prix", "Localisation"].map((p, i) => (
                  <div key={p} style={{
                    display:"flex", alignItems:"center", gap:10,
                    padding:"10px 0",
                    borderBottom: i < 2 ? `1px solid ${tokens.border}` : "none",
                  }}>
                    <div style={{
                      width:8, height:8, borderRadius:"50%",
                      background:[tokens.primary, tokens.accent, "#7C3AED"][i],
                    }} />
                    <span style={{ fontSize:13, color:tokens.text }}>{p}</span>
                    <div style={{ flex:1, height:4, background:tokens.border, borderRadius:2, overflow:"hidden" }}>
                      <div style={{
                        height:"100%", borderRadius:2,
                        background:[tokens.primary, tokens.accent, "#7C3AED"][i],
                        width:`${[92,88,95][i]}%`,
                      }} />
                    </div>
                    <span style={{ fontSize:12, color:tokens.textMuted }}>{[92,88,95][i]}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "share" && (
            <div>
              <div style={{ fontWeight:600, fontSize:14, marginBottom:16 }}>Partager cet établissement</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {[
                  { icon:"💬", label:"WhatsApp", color:"#25D366", action:() => window.open(`https://wa.me/?text=J'ai trouvé ${listing.name} sur SenMap! ${listing.address}, ${listing.city}`) },
                  { icon:"📋", label:"Copier le lien", color:tokens.primary, action:() => {} },
                  { icon:"📱", label:"SMS", color:"#3B82F6", action:() => {} },
                  { icon:"📨", label:"Email", color:"#EF4444", action:() => {} },
                ].map(s => (
                  <button key={s.label} onClick={s.action} style={{
                    padding:"14px 16px", background:tokens.surfaceAlt,
                    border:`1px solid ${tokens.border}`, borderRadius:12,
                    cursor:"pointer", display:"flex", alignItems:"center",
                    gap:10, fontSize:13, fontWeight:600, color:tokens.text,
                    transition:"all 0.15s",
                  }}>
                    <span style={{ fontSize:22 }}>{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BusinessDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState("7j");
  const data = {
    views:[120,145,132,167,188,201,178],
    calls:[8,12,9,15,18,22,16],
    whatsapp:[14,18,12,23,27,31,24],
    labels:["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"],
  };

  const maxVal = Math.max(...data.views);
  const chartH = 140;

  return (
    <div style={{ maxWidth:760, margin:"0 auto", padding:"0 0 40px" }}>
      {/* Header */}
      <div style={{
        background:`linear-gradient(135deg, ${tokens.primaryDark} 0%, ${tokens.primary} 100%)`,
        borderRadius:"0 0 24px 24px",
        padding:"24px 24px 32px",
        color:"white", marginBottom:-16, position:"relative",
      }}>
        <button onClick={onBack} style={{
          background:"rgba(255,255,255,0.15)", border:"none",
          borderRadius:8, color:"white", padding:"6px 14px",
          cursor:"pointer", fontSize:13, marginBottom:16,
        }}>← Retour</button>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <h2 style={{ margin:0, fontSize:22 }}>Tableau de bord</h2>
            <div style={{ fontSize:13, opacity:0.8, marginTop:4 }}>Teranga Restaurant · Dakar</div>
          </div>
          <div style={{
            background:"rgba(255,255,255,0.2)", borderRadius:10,
            padding:"6px 14px", fontSize:12, fontWeight:600,
          }}>✓ Vérifié Premium</div>
        </div>
      </div>

      <div style={{ padding:"32px 16px 0" }}>
        {/* KPIs */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
          {[
            { label:"Vues (7j)", value:"1,131", change:"+23%", icon:"👁️" },
            { label:"Appels", value:"100", change:"+18%", icon:"📞" },
            { label:"WhatsApp", value:"149", change:"+31%", icon:"💬" },
            { label:"Clics carte", value:"67", change:"+12%", icon:"📍" },
          ].map(k => (
            <div key={k.label} style={{
              background:tokens.surface, border:`1px solid ${tokens.border}`,
              borderRadius:14, padding:"14px 12px",
              boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize:20, marginBottom:6 }}>{k.icon}</div>
              <div style={{ fontSize:20, fontWeight:700, color:tokens.text }}>{k.value}</div>
              <div style={{ fontSize:11, color:tokens.textMuted }}>{k.label}</div>
              <div style={{ fontSize:11, color:"#059669", fontWeight:600, marginTop:3 }}>{k.change}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{
          background:tokens.surface, border:`1px solid ${tokens.border}`,
          borderRadius:16, padding:"20px", marginBottom:20,
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:15, color:tokens.text }}>Visites cette semaine</div>
            <select
              value={period} onChange={e => setPeriod(e.target.value)}
              style={{ border:`1px solid ${tokens.border}`, borderRadius:8, padding:"4px 10px", fontSize:12, background:tokens.surfaceAlt }}
            >
              <option value="7j">7 jours</option>
              <option value="30j">30 jours</option>
              <option value="90j">90 jours</option>
            </select>
          </div>
          <svg width="100%" viewBox={`0 0 500 ${chartH+40}`} style={{ overflow:"visible" }}>
            {data.views.map((v, i) => {
              const barH = (v / maxVal) * chartH;
              const x = 30 + i * 66;
              return (
                <g key={i}>
                  <rect
                    x={x} y={chartH - barH + 10}
                    width={44} height={barH}
                    fill={tokens.primary} rx={6} opacity={0.85}
                  />
                  <text x={x+22} y={chartH + 28} textAnchor="middle" fontSize={11} fill={tokens.textMuted}>
                    {data.labels[i]}
                  </text>
                  <text x={x+22} y={chartH - barH + 5} textAnchor="middle" fontSize={10} fill={tokens.primary} fontWeight="600">
                    {v}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Actions */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {[
            { icon:"✏️", label:"Modifier la fiche", desc:"Mettre à jour infos et photos", color:tokens.primary },
            { icon:"📢", label:"Booster la fiche", desc:"Sponsoriser pour +500% de visibilité", color:tokens.accent },
            { icon:"💬", label:"Répondre aux avis", desc:"3 nouveaux avis en attente", color:"#7C3AED" },
            { icon:"📊", label:"Rapport complet", desc:"Analyse détaillée du mois", color:"#3B82F6" },
          ].map(a => (
            <div key={a.label} style={{
              background:tokens.surface, border:`1px solid ${tokens.border}`,
              borderRadius:14, padding:"16px", cursor:"pointer",
              display:"flex", alignItems:"center", gap:12,
              transition:"all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.08)`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = tokens.border; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{
                width:42, height:42, borderRadius:10,
                background:`${a.color}15`, display:"flex",
                alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0,
              }}>{a.icon}</div>
              <div>
                <div style={{ fontWeight:600, fontSize:13, color:tokens.text }}>{a.label}</div>
                <div style={{ fontSize:11, color:tokens.textMuted, marginTop:2 }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ onBack }) {
  const [activeTab, setActiveTab] = useState("listings");
  const pendingItems = [
    { id:"A1", name:"Boulangerie La Dakaroise", city:"Dakar", type:"Nouveau", submitted:"il y a 2h", status:"pending" },
    { id:"A2", name:"Clinique du Plateau", city:"Dakar", type:"Modification", submitted:"il y a 5h", status:"pending" },
    { id:"A3", name:"Hotel du Rail Thiès", city:"Thiès", type:"Nouveau", submitted:"il y a 8h", status:"pending" },
    { id:"A4", name:"Marché Sandaga", city:"Dakar", type:"Réclamation", submitted:"il y a 1j", status:"flagged" },
  ];

  return (
    <div style={{ maxWidth:800, margin:"0 auto", padding:"0 0 40px" }}>
      <div style={{
        background:"#1A1A2E",
        borderRadius:"0 0 24px 24px",
        padding:"24px 24px 32px",
        color:"white", marginBottom:-16,
      }}>
        <button onClick={onBack} style={{
          background:"rgba(255,255,255,0.1)", border:"none",
          borderRadius:8, color:"white", padding:"6px 14px",
          cursor:"pointer", fontSize:13, marginBottom:16,
        }}>← Retour</button>
        <h2 style={{ margin:0, fontSize:22 }}>Administration SenMap</h2>
        <div style={{ fontSize:13, opacity:0.6, marginTop:4 }}>Panneau de modération et gestion</div>
      </div>

      <div style={{ padding:"32px 16px 0" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
          {[
            { label:"En attente", value:"47", color:"#F5A623" },
            { label:"Approuvés (7j)", value:"234", color:tokens.primary },
            { label:"Signalés", value:"8", color:"#EF4444" },
            { label:"Total fiches", value:"45,231", color:"#7C3AED" },
          ].map(k => (
            <div key={k.label} style={{
              background:tokens.surface, border:`1px solid ${tokens.border}`,
              borderRadius:14, padding:"14px", textAlign:"center",
            }}>
              <div style={{ fontSize:22, fontWeight:700, color:k.color }}>{k.value}</div>
              <div style={{ fontSize:11, color:tokens.textMuted, marginTop:2 }}>{k.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          background:tokens.surface, border:`1px solid ${tokens.border}`,
          borderRadius:16, overflow:"hidden",
        }}>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${tokens.border}`, fontWeight:700, fontSize:14, color:tokens.text }}>
            File de modération — {pendingItems.length} éléments
          </div>
          {pendingItems.map((item, i) => (
            <div key={item.id} style={{
              display:"flex", alignItems:"center", gap:14,
              padding:"14px 20px",
              borderBottom: i < pendingItems.length-1 ? `1px solid ${tokens.border}` : "none",
            }}>
              <div style={{
                padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:600,
                background: item.status === "flagged" ? "#FEF2F2" : "#FFF7ED",
                color: item.status === "flagged" ? "#991B1B" : "#92400E",
              }}>{item.type}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:tokens.text }}>{item.name}</div>
                <div style={{ fontSize:11, color:tokens.textMuted }}>{item.city} · {item.submitted}</div>
              </div>
              <div style={{ display:"flex", gap:6 }}>
                <button style={{
                  padding:"5px 14px", background:"#ECFDF5",
                  border:"1px solid #A7F3D0", borderRadius:7,
                  color:"#065F46", fontSize:12, fontWeight:600, cursor:"pointer",
                }}>✓ Approuver</button>
                <button style={{
                  padding:"5px 14px", background:"#FEF2F2",
                  border:"1px solid #FECACA", borderRadius:7,
                  color:"#991B1B", fontSize:12, fontWeight:600, cursor:"pointer",
                }}>✕ Rejeter</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- MAIN APP ----------
export default function SenMap() {
  const [view, setView] = useState("home"); // home | search | business | dashboard | admin
  const [selectedListing, setSelectedListing] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState("list"); // list | map | split
  const [showModal, setShowModal] = useState(false);

  const filteredListings = LISTINGS.filter(l => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || l.name.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q) || l.tags.some(t => t.toLowerCase().includes(q)) ||
      l.description.toLowerCase().includes(q);
    const matchCity = !selectedCity || l.city === selectedCity;
    const matchCat = !selectedCategory || l.category === selectedCategory;
    return matchSearch && matchCity && matchCat;
  });

  const handleListingClick = (listing) => {
    setSelectedListing(listing);
    setShowModal(true);
  };

  // Styles
  const navStyle = {
    position:"sticky", top:0, zIndex:200,
    background:"rgba(255,255,255,0.95)", backdropFilter:"blur(12px)",
    borderBottom:`1px solid ${tokens.border}`,
    padding:"0 20px",
    display:"flex", alignItems:"center", justifyContent:"space-between",
    height:60,
  };

  if (view === "dashboard") return (
    <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background:tokens.surfaceAlt, minHeight:"100vh" }}>
      <BusinessDashboard onBack={() => setView("home")} />
    </div>
  );

  if (view === "admin") return (
    <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background:tokens.surfaceAlt, minHeight:"100vh" }}>
      <AdminPanel onBack={() => setView("home")} />
    </div>
  );

  return (
    <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background:tokens.surfaceAlt, minHeight:"100vh" }}>
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }
        @keyframes shimmer { 0% { background-position:-200% 0 } 100% { background-position:200% 0 } }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-thumb { background:#D1D5DB; border-radius:3px; }
      `}</style>

      {/* Navigation */}
      <nav style={navStyle}>
        <div
          onClick={() => { setView("home"); setSearchQuery(""); setSelectedCategory(""); }}
          style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}
        >
          <div style={{
            width:34, height:34, borderRadius:10,
            background:`linear-gradient(135deg, ${tokens.primary}, ${tokens.primaryLight})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:18, color:"white",
          }}>🗺️</div>
          <div>
            <div style={{ fontWeight:800, fontSize:18, color:tokens.primary, lineHeight:1 }}>SenMap</div>
            <div style={{ fontSize:9, color:tokens.textMuted, letterSpacing:0.5 }}>DÉCOUVREZ LE SÉNÉGAL</div>
          </div>
        </div>

        <div style={{ display:"flex", gap:6 }}>
          <button
            onClick={() => setView("dashboard")}
            style={{
              padding:"7px 14px", background:tokens.surfaceAlt,
              border:`1px solid ${tokens.border}`, borderRadius:8,
              fontSize:12, fontWeight:600, cursor:"pointer", color:tokens.text,
            }}
          >📊 Tableau de bord</button>
          <button
            onClick={() => setView("admin")}
            style={{
              padding:"7px 14px", background:tokens.surfaceAlt,
              border:`1px solid ${tokens.border}`, borderRadius:8,
              fontSize:12, fontWeight:600, cursor:"pointer", color:tokens.text,
            }}
          >⚙️ Admin</button>
          <button style={{
            padding:"7px 16px",
            background:`linear-gradient(135deg, ${tokens.primary}, ${tokens.primaryLight})`,
            border:"none", borderRadius:8, color:"white",
            fontSize:12, fontWeight:700, cursor:"pointer",
          }}>+ Ajouter</button>
        </div>
      </nav>

      {/* HOME / SEARCH PAGE */}
      {view === "home" && (
        <div>
          {/* Hero */}
          <div style={{
            background:`linear-gradient(160deg, ${tokens.primaryDark} 0%, ${tokens.primary} 60%, ${tokens.primaryLight} 100%)`,
            padding:"48px 20px 60px",
            position:"relative", overflow:"hidden",
          }}>
            {/* Decorative circles */}
            {[["-80px","-60px",240,"rgba(255,255,255,0.04)"],["-40px","60%",160,"rgba(255,255,255,0.06)"],["auto","-60px",200,"rgba(245,166,35,0.12)"]].map(([t,r,s,bg],i) => (
              <div key={i} style={{
                position:"absolute", width:s, height:s, borderRadius:"50%",
                background:bg, top:t, right:r, pointerEvents:"none",
              }} />
            ))}

            <div style={{ maxWidth:680, margin:"0 auto", position:"relative" }}>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:6,
                background:"rgba(255,255,255,0.15)", borderRadius:20,
                padding:"4px 14px 4px 6px", marginBottom:16,
              }}>
                <span style={{ fontSize:18 }}>🇸🇳</span>
                <span style={{ fontSize:12, color:"rgba(255,255,255,0.9)", fontWeight:600 }}>La plateforme N°1 au Sénégal</span>
              </div>

              <h1 style={{
                color:"white", fontSize:32, fontWeight:800,
                lineHeight:1.2, marginBottom:8,
              }}>
                Trouvez tout ce dont vous<br/>avez besoin au Sénégal
              </h1>
              <p style={{ color:"rgba(255,255,255,0.75)", fontSize:15, marginBottom:28, lineHeight:1.6 }}>
                Restaurants, pharmacies, hôtels, services — avis vérifiés,<br/>
                contact WhatsApp direct, disponible même hors ligne.
              </p>

              <div style={{ display:"flex", gap:10, marginBottom:28 }}>
                <SearchBar
                  value={searchQuery}
                  onChange={q => { setSearchQuery(q); if(q) setView("search"); }}
                  city={selectedCity}
                  onCityChange={setSelectedCity}
                />
                <button
                  onClick={() => setView("search")}
                  style={{
                    padding:"0 24px",
                    background:`linear-gradient(135deg, ${tokens.accent}, #E8870A)`,
                    border:"none", borderRadius:14,
                    color:"white", fontWeight:700, fontSize:14,
                    cursor:"pointer", whiteSpace:"nowrap",
                    flexShrink:0,
                  }}
                >Rechercher</button>
              </div>

              {/* Quick stats */}
              <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
                {STATS.map(s => (
                  <div key={s.label} style={{ textAlign:"center" }}>
                    <div style={{ fontSize:18, fontWeight:800, color:"white" }}>{s.value}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div style={{ padding:"32px 20px", maxWidth:760, margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:tokens.text }}>Catégories</h2>
              <span style={{ fontSize:12, color:tokens.primary, fontWeight:600, cursor:"pointer" }}>Voir tout →</span>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))", gap:10 }}>
              {CATEGORIES.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setView("search"); }}
                  style={{
                    background:tokens.surface,
                    border:`1px solid ${selectedCategory === cat.id ? tokens.primary : tokens.border}`,
                    borderRadius:14, padding:"14px 12px",
                    cursor:"pointer", textAlign:"center",
                    transition:"all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = tokens.primary; e.currentTarget.style.background = "#F0FAF5"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = tokens.border; e.currentTarget.style.background = tokens.surface; }}
                >
                  <div style={{ fontSize:26, marginBottom:6 }}>{cat.icon}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:tokens.text, lineHeight:1.3 }}>{cat.label}</div>
                  <div style={{ fontSize:10, color:tokens.textMuted, marginTop:3 }}>{cat.count.toLocaleString()} lieux</div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Listings */}
          <div style={{ padding:"0 20px 32px", maxWidth:760, margin:"0 auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h2 style={{ fontSize:18, fontWeight:700, color:tokens.text }}>⭐ Établissements Vedettes</h2>
              <span onClick={() => setView("search")} style={{ fontSize:12, color:tokens.primary, fontWeight:600, cursor:"pointer" }}>Voir tout →</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {LISTINGS.filter(l => l.featured).map(l => (
                <Card key={l.id} listing={l} onClick={handleListingClick} />
              ))}
            </div>
          </div>

          {/* WhatsApp Banner */}
          <div style={{
            margin:"0 20px 32px", maxWidth:720, marginLeft:"auto", marginRight:"auto",
            background:"linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
            borderRadius:20, padding:"24px 28px",
            display:"flex", alignItems:"center", gap:20,
          }}>
            <div style={{ fontSize:48, flexShrink:0 }}>💬</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:16, color:"white", marginBottom:6 }}>
                Contactez directement par WhatsApp
              </div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.85)", lineHeight:1.5 }}>
                Tous les établissements vérifiés ont un bouton WhatsApp direct. Pas besoin de chercher le numéro.
              </div>
            </div>
            <button style={{
              padding:"10px 20px", background:"rgba(255,255,255,0.2)",
              border:"1px solid rgba(255,255,255,0.4)", borderRadius:10,
              color:"white", fontWeight:700, fontSize:13,
              cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
            }}>En savoir plus</button>
          </div>

          {/* CTA for businesses */}
          <div style={{
            margin:"0 20px 40px", maxWidth:720, marginLeft:"auto", marginRight:"auto",
            background:tokens.surface, border:`1px solid ${tokens.border}`,
            borderRadius:20, padding:"28px", textAlign:"center",
          }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🏪</div>
            <h3 style={{ fontSize:18, fontWeight:700, color:tokens.text, marginBottom:8 }}>
              Vous êtes propriétaire d'un établissement?
            </h3>
            <p style={{ fontSize:14, color:tokens.textMuted, lineHeight:1.6, marginBottom:20 }}>
              Inscrivez votre business gratuitement et rejoignez 45,000+ établissements déjà référencés.
              Accédez aux statistiques, répondez aux avis, et boostez votre visibilité.
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              <button style={{
                padding:"12px 28px",
                background:`linear-gradient(135deg, ${tokens.primary}, ${tokens.primaryLight})`,
                border:"none", borderRadius:10, color:"white",
                fontWeight:700, fontSize:14, cursor:"pointer",
              }}>Ajouter mon établissement — Gratuit</button>
              <button style={{
                padding:"12px 24px",
                background:tokens.surfaceAlt, border:`1px solid ${tokens.border}`,
                borderRadius:10, color:tokens.text,
                fontWeight:600, fontSize:14, cursor:"pointer",
              }}>Voir les offres Premium</button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH PAGE */}
      {view === "search" && (
        <div>
          {/* Search bar sticky */}
          <div style={{
            background:tokens.surface,
            borderBottom:`1px solid ${tokens.border}`,
            padding:"12px 16px",
            position:"sticky", top:60, zIndex:100,
          }}>
            <div style={{ display:"flex", gap:10, maxWidth:900, margin:"0 auto", alignItems:"center" }}>
              <button
                onClick={() => { setView("home"); setSearchQuery(""); setSelectedCategory(""); }}
                style={{
                  padding:"8px 12px", background:"transparent",
                  border:`1px solid ${tokens.border}`, borderRadius:8,
                  cursor:"pointer", fontSize:13, color:tokens.textMuted, flexShrink:0,
                }}
              >←</button>
              <SearchBar
                value={searchQuery} onChange={setSearchQuery}
                city={selectedCity} onCityChange={setSelectedCity}
              />
              <div style={{ display:"flex", border:`1px solid ${tokens.border}`, borderRadius:8, overflow:"hidden", flexShrink:0 }}>
                {[{v:"list",icon:"☰"},{v:"split",icon:"⊞"},{v:"map",icon:"🗺️"}].map(m => (
                  <button key={m.v} onClick={() => setViewMode(m.v)} style={{
                    padding:"8px 12px", border:"none",
                    background: viewMode === m.v ? tokens.primaryLight : "transparent",
                    color: viewMode === m.v ? "white" : tokens.textMuted,
                    cursor:"pointer", fontSize:14, transition:"all 0.15s",
                  }}>{m.icon}</button>
                ))}
              </div>
            </div>

            {/* Category pills */}
            <div style={{ display:"flex", gap:8, marginTop:10, overflowX:"auto", paddingBottom:2, maxWidth:900, margin:"10px auto 0" }}>
              <button
                onClick={() => setSelectedCategory("")}
                style={{
                  padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:600,
                  background: !selectedCategory ? tokens.primary : tokens.surface,
                  color: !selectedCategory ? "white" : tokens.textMuted,
                  border: !selectedCategory ? "none" : `1px solid ${tokens.border}`,
                  cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
                }}
              >Tout</button>
              {CATEGORIES.slice(0,8).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? "" : cat.id)}
                  style={{
                    padding:"5px 14px", borderRadius:20, fontSize:12, fontWeight:600,
                    background: selectedCategory === cat.id ? tokens.primary : tokens.surface,
                    color: selectedCategory === cat.id ? "white" : tokens.textMuted,
                    border: selectedCategory === cat.id ? "none" : `1px solid ${tokens.border}`,
                    cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
                  }}
                >{cat.icon} {cat.label}</button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div style={{ maxWidth:900, margin:"0 auto", padding:"16px" }}>
            <div style={{ marginBottom:12, fontSize:13, color:tokens.textMuted }}>
              <span style={{ fontWeight:600, color:tokens.text }}>{filteredListings.length}</span> établissements trouvés
              {searchQuery && <span> pour "<span style={{ color:tokens.primary }}>{searchQuery}</span>"</span>}
              {selectedCity && <span> à <span style={{ color:tokens.primary }}>{selectedCity}</span></span>}
            </div>

            {viewMode === "split" ? (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, height:600 }}>
                <div style={{ overflowY:"auto", display:"flex", flexDirection:"column", gap:12 }}>
                  {filteredListings.map(l => (
                    <Card key={l.id} listing={l} onClick={handleListingClick} compact />
                  ))}
                </div>
                <MapPlaceholder listings={filteredListings} selected={selectedListing} />
              </div>
            ) : viewMode === "map" ? (
              <MapPlaceholder listings={filteredListings} selected={selectedListing} />
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {filteredListings.length === 0 ? (
                  <div style={{
                    textAlign:"center", padding:"60px 20px",
                    background:tokens.surface, borderRadius:16,
                    border:`1px solid ${tokens.border}`,
                  }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
                    <div style={{ fontWeight:700, color:tokens.text, marginBottom:8 }}>Aucun résultat trouvé</div>
                    <div style={{ fontSize:13, color:tokens.textMuted }}>
                      Essayez d'autres mots-clés ou supprimez les filtres
                    </div>
                  </div>
                ) : filteredListings.map(l => (
                  <Card key={l.id} listing={l} onClick={handleListingClick} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showModal && selectedListing && (
        <BusinessModal listing={selectedListing} onClose={() => setShowModal(false)} />
      )}

      {/* Bottom Nav (Mobile) */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0,
        background:"rgba(255,255,255,0.97)", backdropFilter:"blur(12px)",
        borderTop:`1px solid ${tokens.border}`,
        display:"grid", gridTemplateColumns:"repeat(4,1fr)",
        padding:"8px 0 max(8px, env(safe-area-inset-bottom))",
        zIndex:150,
      }}>
        {[
          { label:"Accueil", icon:"🏠", v:"home" },
          { label:"Recherche", icon:"🔍", v:"search" },
          { label:"Carte", icon:"🗺️", v:"search", extra:() => { setView("search"); setViewMode("map"); } },
          { label:"Mon espace", icon:"👤", v:"dashboard" },
        ].map(item => (
          <button
            key={item.v + item.label}
            onClick={() => item.extra ? item.extra() : setView(item.v)}
            style={{
              background:"transparent", border:"none", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:2,
              padding:"6px 0",
            }}
          >
            <span style={{ fontSize:22 }}>{item.icon}</span>
            <span style={{
              fontSize:10, fontWeight:600,
              color: view === item.v ? tokens.primary : tokens.textMuted,
            }}>{item.label}</span>
          </button>
        ))}
      </div>

      <div style={{ height:70 }} />
    </div>
  );
}
