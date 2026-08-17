import { useState, useMemo } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const COMUNAS = [
  "Todas las comunas",
  "Santiago","Providencia","Ñuñoa","La Florida","Maipú",
  "Las Condes","Vitacura","Lo Barnechea","Peñalolén","Macul",
  "San Miguel","La Cisterna","El Bosque","Pedro Aguirre Cerda",
  "Lo Espejo","Cerrillos","Estación Central","Pudahuel","Quilicura",
  "Huechuraba","Conchalí","Independencia","Recoleta","Renca",
  "Lo Prado","Cerro Navia","Quinta Normal","Lampa","Colina",
  "San Bernardo","Puente Alto","La Pintana","La Granja","San Ramón",
];

const CATEGORIES = [
  { id: "all",           label: "Todo",              emoji: "🎉" },
  { id: "food",          label: "Comida & Bebida",   emoji: "🍔" },
  { id: "inflables",     label: "Juegos Inflables",  emoji: "🏰" },
  { id: "entertainment", label: "Entretenimiento",   emoji: "🎪" },
  { id: "decoration",    label: "Decoración",        emoji: "🎊" },
  { id: "photo",         label: "Foto & Video",      emoji: "📸" },
  { id: "music",         label: "Música & DJ",       emoji: "🎧" },
];

const SORT_OPTIONS = [
  { value: "rating",     label: "Mejor calificados" },
  { value: "reviews",    label: "Más reseñas" },
  { value: "price_asc",  label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
];

// comunas con costos de despacho de ejemplo
const INITIAL_SERVICES = [
  {
    id: 1, category: "food",
    name: "Taco Truck Don Memo", owner: "Manuel Reyes", verified: true,
    desc: "Carrito de tacos y antojitos mexicanos para todo tipo de celebración. Menú personalizable.",
    price: 350000, priceLabel: "$350.000 / evento",
    rating: 4.9, reviews: 128, cancellations: 0,
    tags: ["Tacos","Carrito","Mexicana"], emoji: "🌮", color: "#FF6B35",
    comunasDespacho: {
      "Santiago": 0, "Providencia": 0, "Ñuñoa": 5000,
      "Macul": 8000, "Peñalolén": 10000, "La Florida": 12000
    },
    capacity: "hasta 200 personas", phone: "+56 9 8123 4567",
    cancellationReviews: [],
  },
  {
    id: 2, category: "inflables",
    name: "Inflables Felices", owner: "Carolina Soto", verified: true,
    desc: "Castillo inflable XL con tobogán doble. Incluye malla de seguridad y operador durante el evento.",
    price: 180000, priceLabel: "$180.000 / día",
    rating: 5.0, reviews: 74, cancellations: 0,
    tags: ["Inflable","Castillo","Niños"], emoji: "🏰", color: "#7B61FF",
    comunasDespacho: {
      "Maipú": 0, "Cerrillos": 5000, "Estación Central": 8000,
      "Lo Prado": 8000, "Pudahuel": 10000, "Quinta Normal": 10000, "San Bernardo": 15000
    },
    capacity: "hasta 8 niños", phone: "+56 9 7654 3210",
    cancellationReviews: [],
  },
  {
    id: 3, category: "music",
    name: "DJ Party Pro", owner: "Sebastián Mora", verified: true,
    desc: "DJ profesional con equipo de sonido 5000W e iluminación LED incluida.",
    price: 500000, priceLabel: "$500.000 / noche",
    rating: 3.8, reviews: 203, cancellations: 2,
    tags: ["Música","DJ","Audio"], emoji: "🎧", color: "#FF4D8D",
    comunasDespacho: {
      "Santiago": 0, "Providencia": 0, "Las Condes": 10000,
      "Vitacura": 10000, "Ñuñoa": 8000, "La Florida": 15000,
      "Peñalolén": 15000, "Macul": 8000
    },
    capacity: "cualquier tamaño", phone: "+56 9 6543 2109",
    cancellationReviews: [
      { date: "2024-11-14", type: "same_day", text: "Canceló el mismo día del evento sin aviso previo. Tuve que buscar otro DJ de urgencia." },
      { date: "2024-09-02", type: "day_before", text: "Canceló un día antes. Muy poco profesional, dejó la fiesta sin música." },
    ],
  },
  {
    id: 4, category: "photo",
    name: "Photo Booth Vintage", owner: "Valentina Cruz", verified: false,
    desc: "Cabina de fotos con props temáticos, impresión instantánea y fondo personalizable.",
    price: 250000, priceLabel: "$250.000 / 4 horas",
    rating: 4.7, reviews: 89, cancellations: 0,
    tags: ["Foto","Recuerdos","Entretenimiento"], emoji: "📸", color: "#FFD166",
    comunasDespacho: {
      "Santiago": 0, "Providencia": 0, "Las Condes": 8000,
      "Ñuñoa": 5000, "La Florida": 12000, "San Miguel": 5000
    },
    capacity: "ilimitado", phone: "+56 9 5432 1098",
    cancellationReviews: [],
  },
  {
    id: 5, category: "inflables",
    name: "Mega Inflables Norte", owner: "Rodrigo Fuentes", verified: true,
    desc: "Cancha inflable de fútbol y piscina de pelotas gigante. Perfecta para fiestas de 8 a 15 años.",
    price: 220000, priceLabel: "$220.000 / día",
    rating: 4.6, reviews: 55, cancellations: 0,
    tags: ["Inflable","Fútbol","Adolescentes"], emoji: "⚽", color: "#06D6A0",
    comunasDespacho: {
      "Quilicura": 0, "Huechuraba": 5000, "Conchalí": 8000,
      "Independencia": 8000, "Recoleta": 10000, "Renca": 8000,
      "Colina": 20000, "Lampa": 20000
    },
    capacity: "hasta 20 personas", phone: "+56 9 4321 0987",
    cancellationReviews: [],
  },
  {
    id: 6, category: "food",
    name: "Barra de Sushi Kimura", owner: "Kenji Kimura", verified: true,
    desc: "Chef sushiman en vivo preparando rolls y sashimi al momento. Experiencia gourmet.",
    price: 600000, priceLabel: "$600.000 / evento",
    rating: 4.8, reviews: 52, cancellations: 0,
    tags: ["Sushi","Japonesa","Gourmet"], emoji: "🍣", color: "#EF476F",
    comunasDespacho: {
      "Las Condes": 0, "Vitacura": 0, "Lo Barnechea": 5000,
      "Providencia": 8000, "Ñuñoa": 10000
    },
    capacity: "hasta 80 personas", phone: "+56 9 3210 9876",
    cancellationReviews: [],
  },
  {
    id: 7, category: "entertainment",
    name: "Mago Estelar", owner: "Felipe Astudillo", verified: true,
    desc: "Show de magia interactivo con globoflexia, humor y participación del público.",
    price: 180000, priceLabel: "$180.000 / show",
    rating: 2.9, reviews: 61, cancellations: 3,
    tags: ["Magia","Show","Niños"], emoji: "🎩", color: "#118AB2",
    comunasDespacho: {
      "Santiago": 0, "Providencia": 5000, "Ñuñoa": 5000,
      "La Florida": 10000, "Maipú": 12000,
      "San Bernardo": 15000, "Puente Alto": 15000
    },
    capacity: "hasta 60 niños", phone: "+56 9 2109 8765",
    cancellationReviews: [
      { date: "2025-01-10", type: "same_day", text: "Canceló el mismo día. El cumpleaños de mi hijo quedó sin show. Pésima experiencia." },
      { date: "2024-12-24", type: "same_day", text: "Canceló en Navidad el mismo día. Inaceptable." },
      { date: "2024-10-05", type: "day_before", text: "Canceló un día antes sin ninguna explicación." },
    ],
  },
  {
    id: 8, category: "decoration",
    name: "Globos & Eventos Lola", owner: "Lorena Pizarro", verified: false,
    desc: "Arcos, columnas y esculturas de globos a medida. Transformamos cualquier espacio.",
    price: 150000, priceLabel: "$150.000 / paquete",
    rating: 4.6, reviews: 145, cancellations: 0,
    tags: ["Globos","Decoración","Ambiente"], emoji: "🎈", color: "#FF4D8D",
    comunasDespacho: {
      "Santiago": 0, "La Florida": 8000, "Puente Alto": 10000,
      "La Pintana": 10000, "San Bernardo": 12000,
      "El Bosque": 10000, "La Cisterna": 8000
    },
    capacity: "cualquier espacio", phone: "+56 9 1098 7654",
    cancellationReviews: [],
  },
  {
    id: 9, category: "food",
    name: "Churros & Más", owner: "Andrea Vidal", verified: true,
    desc: "Carrito de churros artesanales con diferentes rellenos y coberturas.",
    price: 120000, priceLabel: "$120.000 / evento",
    rating: 4.5, reviews: 93, cancellations: 0,
    tags: ["Churros","Dulces","Familiar"], emoji: "🍩", color: "#FF6B35",
    comunasDespacho: {
      "Maipú": 0, "Cerrillos": 5000, "Pudahuel": 8000,
      "Lo Prado": 8000, "Estación Central": 5000,
      "Quinta Normal": 5000, "San Bernardo": 12000
    },
    capacity: "hasta 150 personas", phone: "+56 9 0987 6543",
    cancellationReviews: [],
  },
  {
    id: 10, category: "inflables",
    name: "Inflables Sur Express", owner: "Jorge Tapia", verified: false,
    desc: "Pista de obstáculos inflable 10 metros. Diversión garantizada para todas las edades.",
    price: 200000, priceLabel: "$200.000 / día",
    rating: 4.4, reviews: 38, cancellations: 0,
    tags: ["Inflable","Obstáculos","Familiar"], emoji: "🎯", color: "#FFD166",
    comunasDespacho: {
      "Puente Alto": 0, "La Florida": 8000, "La Pintana": 8000,
      "La Granja": 10000, "San Ramón": 10000, "El Bosque": 10000,
      "La Cisterna": 10000, "Pedro Aguirre Cerda": 12000, "Lo Espejo": 12000
    },
    capacity: "hasta 30 personas", phone: "+56 9 9876 5432",
    cancellationReviews: [],
  },
];

// ─── REVIEWS DATA ────────────────────────────────────────────────────────────

const SERVICE_REVIEWS = {
  1: [
    { id:1, author:"Camila R.", stars:5, date:"2025-03-12", title:"¡Increíble experiencia!", text:"El carrito llegó puntual, la comida estaba deliciosa y Manuel súper amable con todos los invitados. El hit de la fiesta sin duda." },
    { id:2, author:"Diego F.", stars:5, date:"2025-02-28", title:"Perfectos para mi matrimonio", text:"Contratamos para 150 personas y no hubo ningún problema. Los tacos volaron en minutos, tuvimos que pedir extras. 100% recomendado." },
    { id:3, author:"Sofía M.", stars:5, date:"2025-01-15", title:"Todos quedaron felices", text:"Fue el servicio que más se lució en el cumpleaños de mi mamá. Llegaron antes de hora a preparar todo. Excelente atención." },
    { id:4, author:"Tomás V.", stars:4, date:"2024-12-20", title:"Muy buena opción", text:"La comida riquísima, quizás el precio es un poco alto pero vale la pena. Cumplieron con todo lo que prometieron." },
    { id:5, author:"Valentina P.", stars:5, date:"2024-11-30", title:"Lo mejor del evento", text:"Mis amigos aún me preguntan quién era el del carrito de tacos. Definitivamente los volvería a contratar." },
    { id:6, author:"Rodrigo S.", stars:4, date:"2024-10-10", title:"Bien, pero tardaron un poco", text:"La comida estuvo exquisita pero llegaron 20 minutos tarde. Igual lo arreglaron rápido y no afectó mucho la fiesta." },
    { id:7, author:"Isidora C.", stars:5, date:"2024-09-05", title:"Maravilloso", text:"Atención impecable, variedad de sabores y muy buena presentación. El precio incluye todo, sin sorpresas." },
  ],
  2: [
    { id:1, author:"Antonia L.", stars:5, date:"2025-04-02", title:"Los niños enloquecieron", text:"El castillo es gigante y el operador estuvo pendiente todo el rato. Los niños no querían bajarse. ¡Perfectos!" },
    { id:2, author:"Matías G.", stars:5, date:"2025-03-20", title:"Impecables", text:"Llegaron con tiempo, armaron todo en 30 minutos y el operador fue muy cuidadoso con los niños. Sin duda los recomiendo." },
    { id:3, author:"Javiera T.", stars:5, date:"2025-02-14", title:"Mejor regalo de cumpleaños", text:"Mi hijo de 5 años quedó feliz. El inflable estaba en perfecto estado y la malla de seguridad da mucha tranquilidad." },
    { id:4, author:"Felipe A.", stars:5, date:"2025-01-08", title:"Excelente servicio", text:"Puntualidad, limpieza y buen trato. Nos explicaron todas las medidas de seguridad. Volveríamos a contratar." },
    { id:5, author:"Carolina B.", stars:4, date:"2024-12-15", title:"Muy bueno", text:"Todo perfecto, solo que el tobogán tenía un parche pequeño pero funcionaba bien. De todas formas lo recomiendo." },
  ],
  3: [
    { id:1, author:"Roberto M.", stars:2, date:"2025-03-01", title:"Decepcionante", text:"El sonido falló dos veces durante la noche y el DJ tardó mucho en arreglarlo. No cumplió las expectativas para el precio que cobra." },
    { id:2, author:"Francisca H.", stars:5, date:"2025-02-10", title:"Noche épica", text:"Sebastián es un crack. La música perfecta para el ambiente, leyó muy bien a la gente y la pista nunca se vació." },
    { id:3, author:"Cristóbal N.", stars:4, date:"2025-01-22", title:"Buen DJ", text:"Buena selección musical y el equipo de luces era impresionante. Solo le bajé una estrella por llegar un poco justo." },
    { id:4, author:"Daniela O.", stars:1, date:"2024-12-31", title:"Canceló sin avisar", text:"Confirmó la reserva para fin de año y simplemente no apareció. Arruinó la noche entera. Pésima irresponsabilidad." },
    { id:5, author:"Gonzalo P.", stars:5, date:"2024-11-20", title:"El mejor DJ que he visto", text:"No solo pone música, interactúa con la gente, hace dedicatorias y mantiene el nivel de energía toda la noche." },
    { id:6, author:"Andrea K.", stars:3, date:"2024-10-15", title:"Regular", text:"La música estuvo bien pero el equipo de sonido no era tan potente como decía en la publicación. Para una fiesta pequeña sí sirve." },
  ],
  4: [
    { id:1, author:"Beatriz C.", stars:5, date:"2025-03-18", title:"La gente hacía cola", text:"El photo booth fue lo más exitoso de la fiesta. Los props son lindos y las fotos salen perfectas. Valentina súper atenta." },
    { id:2, author:"Nicolás F.", stars:5, date:"2025-02-25", title:"Recuerdo increíble", text:"Todos los invitados se llevaron su foto impresa al tiro. El fondo que eligieron quedó espectacular con la decoración." },
    { id:3, author:"Macarena V.", stars:4, date:"2025-01-30", title:"Muy entretenido", text:"Buena calidad de fotos e impresión rápida. El único detalle es que se demoró un poco en instalar el equipo." },
    { id:4, author:"José M.", stars:5, date:"2024-12-22", title:"Imprescindible en una fiesta", text:"Nunca falta gente en la cabina. Valentina llegó puntual y estuvo atenta durante todo el evento." },
    { id:5, author:"Paola S.", stars:4, date:"2024-11-10", title:"Muy buena experiencia", text:"Los props son variados y divertidos. La impresión instantánea es un hit. Quizás podría tener más opciones de fondo." },
  ],
  5: [
    { id:1, author:"Andrés T.", stars:5, date:"2025-03-28", title:"Los adolescentes enloquecieron", text:"La cancha de fútbol inflable fue un éxito total. Los chicos jugaron horas y no querían parar. Muy recomendado." },
    { id:2, author:"Lorena M.", stars:4, date:"2025-02-15", title:"Buena alternativa", text:"Entretenido para los jóvenes. Solo que el armado tardó más de lo esperado pero al final todo salió bien." },
    { id:3, author:"Ignacio B.", stars:5, date:"2025-01-20", title:"Show total", text:"Rodrigo muy profesional, llegó a tiempo y armó todo rápido. El inflable estaba impecable." },
  ],
  6: [
    { id:1, author:"Alejandra F.", stars:5, date:"2025-03-10", title:"Una experiencia gourmet", text:"Kenji es un artista. Ver cómo prepara los rolls en vivo es un show en sí mismo. La calidad del sushi fue excepcional." },
    { id:2, author:"Hernán V.", stars:5, date:"2025-02-20", title:"Mis invitados quedaron impactados", text:"Nunca habían visto un chef sushiman en un evento privado. Kenji interactuó con todos y explicó cada plato. Perfecto." },
    { id:3, author:"Claudia S.", stars:4, date:"2025-01-05", title:"Muy bueno pero caro", text:"La calidad es indiscutible pero el precio es alto. Para una ocasión especial vale la pena. Puntual y muy profesional." },
    { id:4, author:"Marco P.", stars:5, date:"2024-12-10", title:"El mejor sushi que he comido", text:"Fresquísimo y preparado al momento. Los rolls de autor son increíbles. Sin duda el mejor dinero gastado en el evento." },
  ],
  7: [
    { id:1, author:"Cecilia R.", stars:1, date:"2025-01-10", title:"Arruinó el cumpleaños de mi hijo", text:"Canceló el mismo día sin ninguna explicación. Los niños estaban esperando el mago y nunca llegó. Inaceptable." },
    { id:2, author:"Luis A.", stars:5, date:"2024-11-15", title:"Cuando llegó fue genial", text:"Antes del problema de cancelaciones, lo vi en un evento y era muy bueno. Ojalá sea más responsable con los compromisos." },
    { id:3, author:"Paula M.", stars:1, date:"2024-12-24", title:"Canceló en Navidad", text:"¿Qué tipo de persona cancela el mismo día de Navidad? Dejó a 30 niños sin show. No lo contraten." },
    { id:4, author:"Sebastián C.", stars:4, date:"2024-08-20", title:"Buen show", text:"Antes de los problemas que tuvo después, su show era entretenido e interactivo. Los niños disfrutaron mucho." },
    { id:5, author:"Mónica T.", stars:1, date:"2024-10-05", title:"No cumplió", text:"Canceló un día antes del evento de mi hija. Sin devolución ni solución. Cero responsabilidad." },
  ],
  8: [
    { id:1, author:"Verónica C.", stars:5, date:"2025-04-01", title:"Transformó el espacio", text:"Llegué al salón y no lo reconocí. Lorena tiene un talento increíble para los globos. El arco de entrada era majestuoso." },
    { id:2, author:"Esteban M.", stars:5, date:"2025-03-15", title:"Excelente trabajo", text:"Muy creativa y prolija. Llegó temprano a instalar todo y quedó exactamente como lo habíamos conversado." },
    { id:3, author:"Daniela H.", stars:4, date:"2025-02-10", title:"Muy bonito", text:"La decoración quedó preciosa. Un globo se desinfló durante la tarde pero Lorena fue a cambiarlo de inmediato." },
    { id:4, author:"Ricardo V.", stars:5, date:"2025-01-20", title:"Arte puro", text:"Las esculturas de globos son impresionantes. Toda la gente preguntaba quién las hizo. Definitivamente la recomiendo." },
    { id:5, author:"Natalia S.", stars:5, date:"2024-12-05", title:"Puntual y creativa", text:"Cumplió 100%. El ambiente de la fiesta cambió completamente con su decoración. Precio muy justo para la calidad." },
  ],
  9: [
    { id:1, author:"Constanza L.", stars:5, date:"2025-03-25", title:"Deliciosos", text:"Los churros de Andrea son adictivos. Diferentes rellenos, todos ricos. El carrito era bonito y muy limpio." },
    { id:2, author:"Javier P.", stars:4, date:"2025-02-18", title:"Muy bueno", text:"Buen producto y buena presentación. Quizás le faltó un poco más de variedad en coberturas pero igual estuvieron ricos." },
    { id:3, author:"Gabriela T.", stars:5, date:"2025-01-10", title:"El postre perfecto", text:"Después de la comida, los churros fueron el complemento ideal. Todos los niños y adultos los adoraron." },
    { id:4, author:"Marcelo V.", stars:5, date:"2024-12-15", title:"Imprescindible", text:"Andrea es súper simpática y su producto es de primera. El carrito llama la atención y la gente se acerca sola." },
  ],
  10: [
    { id:1, author:"Álvaro C.", stars:5, date:"2025-03-20", title:"Entretenidísimo", text:"La pista de obstáculos fue un hit para todas las edades. Desde los niños hasta los papás se lanzaron." },
    { id:2, author:"Tamara F.", stars:4, date:"2025-02-05", title:"Buena opción", text:"Llegaron puntuales y armaron rápido. Solo que el inflable podría estar en mejor estado, tiene algunos remiendos visibles." },
    { id:3, author:"Eduardo M.", stars:4, date:"2024-12-28", title:"Cumplió", text:"Hizo lo que prometió. La pista es entretenida y resistente. El operador estuvo atento toda la tarde." },
  ],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function formatPrice(n) {
  if (!n) return "Gratis";
  return "$" + n.toLocaleString("es-CL");
}

function Stars({ rating, size = 13 }) {
  return (
    <span style={{ display: "inline-flex", gap: 1, alignItems: "center" }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? "#FFD166" : "#ddd", fontSize: size }}>★</span>
      ))}
      <span style={{ fontSize: size - 1, color: "#888", marginLeft: 3 }}>{rating.toFixed(1)}</span>
    </span>
  );
}

function Badge({ children, color, bg }) {
  return (
    <span style={{
      background: bg || color + "18", color,
      border: `1px solid ${color}33`,
      borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600,
    }}>{children}</span>
  );
}

function CancellationWarning({ service }) {
  if (!service.cancellations || service.cancellations === 0) return null;
  const isSevere = service.cancellations >= 3;
  const color = isSevere ? "#EF476F" : "#FF6B35";
  return (
    <div style={{
      background: color + "12", border: `1.5px solid ${color}44`,
      borderRadius: 12, padding: "10px 14px",
      display: "flex", gap: 10, alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{isSevere ? "🚨" : "⚠️"}</span>
      <div>
        <div style={{ fontSize: 12, fontWeight: 800, color, marginBottom: 2 }}>
          {isSevere ? "Historial de cancelaciones graves" : "Cancelaciones tardías registradas"}
        </div>
        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.4 }}>
          Este proveedor tiene <strong>{service.cancellations} cancelación{service.cancellations > 1 ? "es" : ""}</strong> con poco aviso registradas por la plataforma. Considera esto al contratar.
        </div>
      </div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

function btnStyle(color) {
  return {
    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
    color: "#fff", border: "none", borderRadius: 12,
    padding: "11px 20px", fontSize: 14, fontWeight: 700,
    cursor: "pointer", letterSpacing: "0.2px",
  };
}
function inputStyle(extra = {}) {
  return {
    width: "100%", boxSizing: "border-box",
    border: "1.5px solid #e8e0f5", borderRadius: 10,
    padding: "10px 12px", fontSize: 14, outline: "none",
    color: "#1A1035", fontFamily: "inherit", background: "#fff",
    ...extra,
  };
}

// ─── OVERLAY ─────────────────────────────────────────────────────────────────

function Overlay({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(10,6,30,0.65)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, backdropFilter: "blur(4px)",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 24, width: "100%", maxWidth: 540,
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── CANCEL MODAL ─────────────────────────────────────────────────────────────

function CancelModal({ service, onClose, onConfirm }) {
  const [cancelType, setCancelType] = useState(null); // 'same_day' | 'day_before'
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!cancelType) return;
    onConfirm(service.id, cancelType);
    setConfirmed(true);
  };

  if (confirmed) return (
    <Overlay onClose={onClose}>
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>📋</div>
        <h2 style={{ margin: "0 0 8px", color: "#1A1035" }}>Cancelación registrada</h2>
        <p style={{ color: "#666", fontSize: 14, margin: "0 0 8px" }}>
          Se ha descontado puntos al proveedor y se publicó una reseña automática de la plataforma.
        </p>
        <p style={{ color: "#EF476F", fontSize: 13, fontWeight: 600, margin: "0 0 24px" }}>
          {cancelType === "same_day"
            ? "⚠️ Cancelación el mismo día: −1.5 puntos en calificación"
            : "⚠️ Cancelación día anterior: −0.8 puntos en calificación"}
        </p>
        <button onClick={onClose} style={btnStyle("#7B61FF")}>Cerrar</button>
      </div>
    </Overlay>
  );

  return (
    <Overlay onClose={onClose}>
      <div style={{ padding: "28px 28px 24px" }}>
        <div style={{ fontSize: 48, textAlign: "center", marginBottom: 10 }}>😰</div>
        <h2 style={{ margin: "0 0 6px", color: "#1A1035", textAlign: "center", fontSize: 20 }}>
          Reportar cancelación tardía
        </h2>
        <p style={{ color: "#888", fontSize: 13, textAlign: "center", margin: "0 0 24px" }}>
          <strong>{service.name}</strong> canceló tu reserva con poco tiempo de anticipación
        </p>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 10 }}>
            ¿Cuándo canceló?
          </div>
          {[
            {
              type: "same_day",
              label: "El mismo día del evento",
              desc: "La cancelación ocurrió el día que era el evento",
              penalty: "−1.5 puntos", color: "#EF476F",
            },
            {
              type: "day_before",
              label: "Un día antes del evento",
              desc: "La cancelación fue con 24 horas o menos de anticipación",
              penalty: "−0.8 puntos", color: "#FF6B35",
            },
          ].map(opt => (
            <div
              key={opt.type}
              onClick={() => setCancelType(opt.type)}
              style={{
                border: `2px solid ${cancelType === opt.type ? opt.color : "#e8e0f5"}`,
                borderRadius: 14, padding: "14px 16px", marginBottom: 10,
                cursor: "pointer", background: cancelType === opt.type ? opt.color + "0d" : "#fff",
                transition: "all 0.15s",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1035", marginBottom: 2 }}>{opt.label}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{opt.desc}</div>
              </div>
              <div style={{
                background: opt.color + "18", color: opt.color,
                border: `1px solid ${opt.color}44`,
                borderRadius: 20, padding: "3px 10px",
                fontSize: 11, fontWeight: 800, whiteSpace: "nowrap",
              }}>{opt.penalty}</div>
            </div>
          ))}
        </div>

        <div style={{
          background: "#FFF8E1", border: "1px solid #FFD16644",
          borderRadius: 12, padding: "12px 14px", marginBottom: 20,
          fontSize: 12, color: "#9A6700", lineHeight: 1.5,
        }}>
          ⚠️ Al confirmar, la plataforma publicará automáticamente una reseña oficial indicando la cancelación tardía y se descontarán puntos de la calificación del proveedor.
        </div>

        <button
          onClick={handleConfirm}
          disabled={!cancelType}
          style={{
            ...btnStyle("#EF476F"), width: "100%", marginBottom: 10,
            opacity: cancelType ? 1 : 0.4,
          }}
        >
          Confirmar reporte
        </button>
        <button onClick={onClose} style={{
          width: "100%", background: "none", border: "none",
          color: "#aaa", cursor: "pointer", fontSize: 13, padding: "8px 0",
        }}>Cancelar</button>
      </div>
    </Overlay>
  );
}

// ─── QUOTE MODAL ──────────────────────────────────────────────────────────────

const DEPOSIT = 10000;
const FIESTA_FEE_PCT = 8;   // % que retiene LinkServ
const MP_FEE_PCT     = 3.5; // % comisión Mercado Pago

const PAYMENT_METHODS = [
  {
    id: "mp_card",
    label: "Tarjeta de crédito / débito",
    sub: "Visa, Mastercard, Amex — vía Mercado Pago",
    emoji: "💳",
    badge: null,
  },
  {
    id: "mp_onepay",
    label: "OnePay",
    sub: "Pago instantáneo desde tu banco — vía Mercado Pago",
    emoji: "📲",
    badge: "Popular",
  },
  {
    id: "mp_bank",
    label: "Pago por banco",
    sub: "Débito directo desde tu cuenta bancaria",
    emoji: "🏦",
    badge: null,
  },
  {
    id: "transfer",
    label: "Transferencia bancaria",
    sub: "Pago manual — confirmación en 1-2 horas hábiles",
    emoji: "↗️",
    badge: null,
  },
];

function calcSplit(total) {
  const mpFee       = Math.round(total * MP_FEE_PCT / 100);
  const fiestaFee   = Math.round(total * FIESTA_FEE_PCT / 100);
  const providerNet = total - mpFee - fiestaFee;
  return { mpFee, fiestaFee, providerNet };
}

function QuoteModal({ service, selectedCommune, onClose }) {
  const [step, setStep] = useState(1); // 1=form, 2=resumen, 3=pago, 4=confirmado
  const [form, setForm] = useState({
    name: "", phone: "", email: "", date: "",
    guests: "", commune: selectedCommune !== "Todas las comunas" ? selectedCommune : "",
    message: "",
  });
  const [payMethod, setPayMethod] = useState("mp_card");
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const shippingCost = form.commune && service.comunasDespacho?.[form.commune] !== undefined
    ? service.comunasDespacho[form.commune] : null;
  const availableComunas = Object.keys(service.comunasDespacho || {});
  const canContinue = form.name && form.phone && form.commune && shippingCost !== null;

  const totalAmount = (service.price || 0) + (shippingCost || 0);
  const split = calcSplit(totalAmount);

  // ── Step 4: Confirmed ──
  if (step === 4) return (
    <Overlay onClose={onClose}>
      <div style={{ padding: "40px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🎉</div>
        <h2 style={{ margin: "0 0 6px", color: "#1A1035", fontSize: 22 }}>¡Reserva confirmada!</h2>
        <p style={{ color: "#666", fontSize: 14, margin: "0 0 20px" }}>
          Tu depósito de <strong style={{ color: "#7B61FF" }}>{formatPrice(DEPOSIT)}</strong> fue procesado a través de Mercado Pago.
        </p>

        {/* Receipt */}
        <div style={{
          background: "#F8F4FF", borderRadius: 16, padding: "18px 20px",
          textAlign: "left", marginBottom: 16,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
            🧾 Comprobante de reserva
          </div>
          {[
            { label: "Servicio", val: service.name },
            { label: "Proveedor", val: service.owner },
            { label: "Fecha evento", val: form.date || "Por confirmar" },
            { label: "Tu comuna", val: form.commune },
            { label: "Despacho", val: shippingCost === 0 ? "Gratis" : formatPrice(shippingCost) },
            { label: "Método de pago", val: PAYMENT_METHODS.find(m => m.id === payMethod)?.label },
          ].map(r => (
            <div key={r.label} style={{
              display: "flex", justifyContent: "space-between",
              borderBottom: "1px solid #e8e0f5", padding: "7px 0", fontSize: 13,
            }}>
              <span style={{ color: "#888" }}>{r.label}</span>
              <span style={{ fontWeight: 600, color: "#1A1035" }}>{r.val}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", fontSize: 14 }}>
            <span style={{ fontWeight: 700, color: "#1A1035" }}>Depósito pagado hoy</span>
            <span style={{ fontWeight: 800, color: "#7B61FF" }}>{formatPrice(DEPOSIT)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0 0", fontSize: 13 }}>
            <span style={{ color: "#888" }}>Se descuenta del total el día del evento</span>
            <span style={{ fontWeight: 700, color: "#059669" }}>− {formatPrice(DEPOSIT)}</span>
          </div>
        </div>

        <div style={{
          background: "#FFF8E1", border: "1px solid #FFD16655",
          borderRadius: 12, padding: "10px 14px", marginBottom: 22,
          fontSize: 12, color: "#9A6700", lineHeight: 1.5, textAlign: "left",
        }}>
          💬 <strong>{service.name}</strong> se pondrá en contacto al <strong>{form.phone}</strong> para coordinar los detalles.
          Si el proveedor cancela, recibes el depósito de vuelta automáticamente.
        </div>

        <button onClick={onClose} style={{ ...btnStyle("#7B61FF"), width: "100%" }}>
          Listo 🎊
        </button>
      </div>
    </Overlay>
  );

  // ── Step 3: Payment ──
  if (step === 3) return (
    <Overlay onClose={onClose}>
      <div style={{ padding: "28px 28px 24px" }}>
        <button onClick={() => setStep(2)} style={{
          background: "none", border: "none", color: "#999",
          cursor: "pointer", fontSize: 13, marginBottom: 16, padding: 0,
        }}>← Volver</button>

        <h2 style={{ margin: "0 0 4px", color: "#1A1035", fontSize: 20 }}>Pagar depósito de reserva</h2>
        <p style={{ color: "#888", fontSize: 13, margin: "0 0 18px" }}>
          El pago es procesado de forma segura por <strong>Mercado Pago</strong>
        </p>

        {/* Amount box */}
        <div style={{
          background: "linear-gradient(135deg, #1A1035, #2D1B69)",
          borderRadius: 16, padding: "18px 20px", marginBottom: 18,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>Pagas ahora</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>{formatPrice(DEPOSIT)}</div>
            <div style={{ fontSize: 11, color: "#06D6A0", fontWeight: 600, marginTop: 2 }}>
              ✓ Se descuenta del total el día del evento
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Total del servicio</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>{formatPrice(totalAmount)}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
              Saldo: {formatPrice(Math.max(0, totalAmount - DEPOSIT))}
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 10 }}>Elige tu método de pago</div>
        {PAYMENT_METHODS.map(m => (
          <div key={m.id} onClick={() => setPayMethod(m.id)} style={{
            display: "flex", alignItems: "center", gap: 12,
            border: `2px solid ${payMethod === m.id ? "#7B61FF" : "#e8e0f5"}`,
            background: payMethod === m.id ? "#F0EBFF" : "#fff",
            borderRadius: 12, padding: "11px 14px", marginBottom: 8,
            cursor: "pointer", transition: "all 0.15s",
          }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{m.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1035" }}>{m.label}</span>
                {m.badge && (
                  <span style={{
                    background: "#06D6A0", color: "#fff",
                    borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 700,
                  }}>{m.badge}</span>
                )}
              </div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 1 }}>{m.sub}</div>
            </div>
            <div style={{
              width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
              border: `2px solid ${payMethod === m.id ? "#7B61FF" : "#ccc"}`,
              background: payMethod === m.id ? "#7B61FF" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {payMethod === m.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
            </div>
          </div>
        ))}

        {/* Transfer instructions */}
        {payMethod === "transfer" && (
          <div style={{
            background: "#F8F4FF", border: "1.5px solid #7B61FF33",
            borderRadius: 12, padding: "14px 16px", marginTop: 4, marginBottom: 4,
            fontSize: 13, color: "#555", lineHeight: 1.8,
          }}>
            <div style={{ fontWeight: 700, color: "#7B61FF", marginBottom: 6 }}>📋 Datos para transferir</div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "2px 12px" }}>
              {[
                ["Banco", "BancoEstado"],
                ["Cuenta corriente", "12345678"],
                ["RUT", "76.543.210-9"],
                ["Nombre", "LinkServ SpA"],
                ["Monto", formatPrice(DEPOSIT)],
                ["Asunto", `Reserva ${service.name}`],
              ].map(([k, v]) => (
                <>
                  <span key={k} style={{ color: "#999", fontSize: 12 }}>{k}</span>
                  <span key={v} style={{ fontWeight: 600, color: "#1A1035", fontSize: 12 }}>{v}</span>
                </>
              ))}
            </div>
          </div>
        )}

        {/* How the money flows */}
        <div style={{
          background: "#F8F4FF", border: "1px solid #e8e0f5",
          borderRadius: 12, padding: "12px 14px", margin: "14px 0",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
            💸 ¿Cómo se distribuye el pago total?
          </div>
          {[
            { label: "Comisión Mercado Pago", val: formatPrice(split.mpFee), pct: `${MP_FEE_PCT}%`, color: "#888", bg: "#f0f0f0" },
            { label: "Comisión LinkServ", val: formatPrice(split.fiestaFee), pct: `${FIESTA_FEE_PCT}%`, color: "#FF4D8D", bg: "#FF4D8D15" },
            { label: `Pago neto a ${service.owner}`, val: formatPrice(split.providerNet), pct: `${100 - MP_FEE_PCT - FIESTA_FEE_PCT}%`, color: "#059669", bg: "#06D6A015" },
          ].map(r => (
            <div key={r.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              background: r.bg, borderRadius: 8, padding: "7px 10px", marginBottom: 5,
            }}>
              <div>
                <span style={{ fontSize: 12, color: "#555" }}>{r.label}</span>
                <span style={{
                  marginLeft: 6, fontSize: 10, fontWeight: 700, color: r.color,
                  background: r.color + "20", borderRadius: 10, padding: "1px 6px",
                }}>{r.pct}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: r.color }}>{r.val}</span>
            </div>
          ))}
          <div style={{ fontSize: 10, color: "#bbb", marginTop: 6, lineHeight: 1.4 }}>
            * Distribución sobre el total del servicio ({formatPrice(totalAmount)}). El depósito de hoy ({formatPrice(DEPOSIT)}) se descuenta al momento del pago final.
          </div>
        </div>

        <div style={{
          background: "#F0FFF4", border: "1px solid #06D6A044",
          borderRadius: 12, padding: "10px 14px", marginBottom: 18,
          fontSize: 12, color: "#059669", lineHeight: 1.5,
          display: "flex", gap: 8, alignItems: "center",
        }}>
          <span style={{ fontSize: 18 }}>🔒</span>
          <span>Pago 100% seguro a través de Mercado Pago. Si el proveedor cancela, te devolvemos el depósito automáticamente.</span>
        </div>

        <button onClick={() => setStep(4)} style={{ ...btnStyle("#7B61FF"), width: "100%", marginBottom: 10 }}>
          {payMethod === "transfer"
            ? "Ya transferí — Confirmar reserva ✓"
            : `Pagar ${formatPrice(DEPOSIT)} →`}
        </button>
        <button onClick={onClose} style={{
          width: "100%", background: "none", border: "none",
          color: "#aaa", cursor: "pointer", fontSize: 13, padding: "8px 0",
        }}>Cancelar</button>
      </div>
    </Overlay>
  );
  // ── Step 2: Summary ──
  if (step === 2) return (
    <Overlay onClose={onClose}>
      <div style={{ padding: "28px 28px 24px" }}>
        <button onClick={() => setStep(1)} style={{
          background: "none", border: "none", color: "#999",
          cursor: "pointer", fontSize: 13, marginBottom: 16, padding: 0,
        }}>← Volver</button>

        <h2 style={{ margin: "0 0 4px", color: "#1A1035", fontSize: 20 }}>Confirma tu reserva</h2>
        <p style={{ color: "#888", fontSize: 13, margin: "0 0 18px" }}>Revisa el detalle antes de pagar el depósito</p>

        {/* Service header */}
        <div style={{
          display: "flex", gap: 12, alignItems: "center",
          background: service.color + "12", borderRadius: 14,
          padding: "14px 16px", marginBottom: 18,
        }}>
          <span style={{ fontSize: 36 }}>{service.emoji}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1035" }}>{service.name}</div>
            <div style={{ fontSize: 12, color: "#888" }}>por {service.owner} · {service.phone}</div>
          </div>
        </div>

        {/* Cost breakdown */}
        <div style={{
          border: "1.5px solid #e8e0f5", borderRadius: 14, overflow: "hidden", marginBottom: 18,
        }}>
          <div style={{
            background: "#F8F4FF", padding: "10px 16px",
            fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1,
          }}>Desglose de costos</div>
          {[
            { label: "Precio del servicio", val: service.priceLabel, color: "#1A1035" },
            { label: `Despacho a ${form.commune}`, val: shippingCost === 0 ? "Gratis ✓" : formatPrice(shippingCost), color: shippingCost === 0 ? "#059669" : "#7B61FF" },
          ].map(r => (
            <div key={r.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "11px 16px", borderBottom: "1px solid #f0ecff",
              fontSize: 13,
            }}>
              <span style={{ color: "#666" }}>{r.label}</span>
              <span style={{ fontWeight: 700, color: r.color }}>{r.val}</span>
            </div>
          ))}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "11px 16px", borderBottom: "1px solid #f0ecff", fontSize: 13,
          }}>
            <span style={{ color: "#666" }}>Depósito de reserva (hoy)</span>
            <span style={{ fontWeight: 700, color: "#7B61FF" }}>{formatPrice(DEPOSIT)}</span>
          </div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 16px", fontSize: 14,
            background: "#F8F4FF",
          }}>
            <span style={{ fontWeight: 700, color: "#1A1035" }}>Saldo restante el día del evento</span>
            <span style={{ fontWeight: 800, color: "#1A1035" }}>
              {service.price ? formatPrice(service.price + (shippingCost || 0) - DEPOSIT) : "A confirmar"}
            </span>
          </div>
        </div>

        {/* Personal details */}
        <div style={{ background: "#F8F4FF", borderRadius: 12, padding: "12px 14px", marginBottom: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Tus datos</div>
          {[
            { label: "Nombre", val: form.name },
            { label: "Contacto", val: form.phone },
            { label: "Fecha", val: form.date || "Por confirmar" },
            { label: "Invitados", val: form.guests || "Por confirmar" },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", gap: 8, fontSize: 13, marginBottom: 4 }}>
              <span style={{ color: "#999", minWidth: 70 }}>{r.label}:</span>
              <span style={{ fontWeight: 600, color: "#1A1035" }}>{r.val}</span>
            </div>
          ))}
        </div>

        <div style={{
          background: "#FFFBEB", border: "1px solid #FFD16655",
          borderRadius: 12, padding: "10px 14px", marginBottom: 20,
          fontSize: 12, color: "#9A6700", lineHeight: 1.5,
        }}>
          ⚡ El depósito de <strong>{formatPrice(DEPOSIT)}</strong> confirma tu fecha. Si todo sale bien, se descuenta del total el día del evento.
          Si el proveedor cancela, te lo devolvemos en 24 horas.
        </div>

        <button onClick={() => setStep(3)} style={{ ...btnStyle("#7B61FF"), width: "100%" }}>
          Ir a pagar depósito →
        </button>
      </div>
    </Overlay>
  );

  // ── Step 1: Form ──
  return (
    <Overlay onClose={onClose}>
      <div style={{ padding: "28px 28px 8px" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: service.color + "22",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
          }}>{service.emoji}</div>
          <div>
            <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Reservar servicio</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1A1035" }}>{service.name}</div>
          </div>
        </div>

        <CancellationWarning service={service} />
        {service.cancellations > 0 && <div style={{ height: 14 }} />}

        {/* Deposit info banner */}
        <div style={{
          background: "linear-gradient(135deg, #7B61FF15, #FF4D8D10)",
          border: "1.5px solid #7B61FF33", borderRadius: 12,
          padding: "12px 14px", marginBottom: 18,
          display: "flex", gap: 10, alignItems: "center",
        }}>
          <span style={{ fontSize: 20 }}>🔒</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#7B61FF" }}>Depósito de reserva: {formatPrice(DEPOSIT)}</div>
            <div style={{ fontSize: 12, color: "#888" }}>Se descuenta del total el día del evento. Si el proveedor cancela, te lo devolvemos.</div>
          </div>
        </div>

        {[
          { k: "name",   label: "Tu nombre",           placeholder: "¿Cómo te llamas?",  type: "text" },
          { k: "phone",  label: "WhatsApp / Teléfono", placeholder: "+56 9 XXXX XXXX",   type: "tel" },
          { k: "email",  label: "Correo (opcional)",   placeholder: "tu@email.com",       type: "email" },
          { k: "date",   label: "Fecha del evento",    placeholder: "",                   type: "date" },
          { k: "guests", label: "N° de invitados",     placeholder: "Ej: 50 personas",   type: "text" },
        ].map(({ k, label, placeholder, type }) => (
          <div key={k} style={{ marginBottom: 13 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 5 }}>{label}</label>
            <input type={type} value={form[k]} onChange={e => set(k, e.target.value)}
              placeholder={placeholder} style={inputStyle()} />
          </div>
        ))}

        <div style={{ marginBottom: 13 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 5 }}>Tu comuna</label>
          <select value={form.commune} onChange={e => set("commune", e.target.value)} style={inputStyle()}>
            <option value="">Selecciona tu comuna</option>
            {availableComunas.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {form.commune && shippingCost !== null && (
            <div style={{
              marginTop: 8,
              background: shippingCost === 0 ? "#06D6A012" : "#F0EBFF",
              border: `1px solid ${shippingCost === 0 ? "#06D6A044" : "#7B61FF33"}`,
              borderRadius: 10, padding: "8px 12px",
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 13, fontWeight: 600,
              color: shippingCost === 0 ? "#059669" : "#7B61FF",
            }}>
              <span>🚚</span>
              {shippingCost === 0 ? `Despacho gratis a ${form.commune} ✓` : `Despacho a ${form.commune}: ${formatPrice(shippingCost)} adicionales`}
            </div>
          )}
          {form.commune && shippingCost === null && (
            <div style={{
              marginTop: 8, background: "#FEF2F2", border: "1px solid #EF476F44",
              borderRadius: 10, padding: "8px 12px",
              fontSize: 13, fontWeight: 600, color: "#EF476F",
            }}>
              ❌ Este proveedor no llega a {form.commune}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 5 }}>Mensaje (opcional)</label>
          <textarea value={form.message} onChange={e => set("message", e.target.value)}
            placeholder="Cuéntale lo que necesitas..." rows={3}
            style={{ ...inputStyle(), resize: "vertical" }} />
        </div>

        <button
          onClick={() => { if (canContinue) setStep(2); }}
          disabled={!canContinue}
          style={{ ...btnStyle(service.color), width: "100%", marginBottom: 10, opacity: canContinue ? 1 : 0.4 }}
        >
          Ver resumen y reservar →
        </button>
        <button onClick={onClose} style={{
          width: "100%", marginBottom: 20, background: "none", border: "none",
          color: "#aaa", cursor: "pointer", fontSize: 13,
        }}>Cancelar</button>
      </div>
    </Overlay>
  );
}

// ─── REVIEWS MODAL ────────────────────────────────────────────────────────────

function ReviewsModal({ service, onClose }) {
  const [filterStars, setFilterStars] = useState(0); // 0 = todas
  const allReviews = SERVICE_REVIEWS[service.id] || [];

  const filtered = filterStars === 0
    ? allReviews
    : allReviews.filter(r => r.stars === filterStars);

  // Count per star for the bar chart
  const countByStar = [5,4,3,2,1].map(s => ({
    star: s,
    count: allReviews.filter(r => r.stars === s).length,
    pct: allReviews.length ? Math.round(allReviews.filter(r => r.stars === s).length / allReviews.length * 100) : 0,
  }));

  const starColor = (s) => s >= 4 ? "#FFD166" : s === 3 ? "#FF9F1C" : "#EF476F";

  return (
    <Overlay onClose={onClose}>
      <div>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${service.color}18, ${service.color}33)`,
          padding: "22px 24px 18px",
          position: "relative",
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(255,255,255,0.85)", border: "none",
            borderRadius: "50%", width: 30, height: 30,
            cursor: "pointer", fontSize: 14,
          }}>✕</button>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 36 }}>{service.emoji}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1A1035" }}>{service.name}</div>
              <div style={{ fontSize: 12, color: "#888" }}>Reseñas de clientes</div>
            </div>
          </div>
        </div>

        <div style={{ padding: "20px 24px 24px" }}>
          {/* Summary */}
          <div style={{
            display: "flex", gap: 20, alignItems: "center",
            background: "#F8F4FF", borderRadius: 16, padding: "16px 18px",
            marginBottom: 20,
          }}>
            {/* Big rating */}
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#1A1035", lineHeight: 1 }}>
                {service.rating.toFixed(1)}
              </div>
              <div style={{ display: "flex", gap: 2, justifyContent: "center", margin: "4px 0" }}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} style={{
                    fontSize: 16,
                    color: s <= Math.round(service.rating) ? "#FFD166" : "#ddd",
                  }}>★</span>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#999" }}>{allReviews.length} reseñas</div>
            </div>

            {/* Bar breakdown */}
            <div style={{ flex: 1 }}>
              {countByStar.map(({ star, count, pct }) => (
                <div
                  key={star}
                  onClick={() => setFilterStars(filterStars === star ? 0 : star)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    marginBottom: 5, cursor: "pointer",
                    opacity: filterStars !== 0 && filterStars !== star ? 0.4 : 1,
                    transition: "opacity 0.15s",
                  }}
                >
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: starColor(star),
                    minWidth: 18, textAlign: "right",
                  }}>{star}★</span>
                  <div style={{
                    flex: 1, height: 8, background: "#e8e0f5", borderRadius: 4, overflow: "hidden",
                    border: filterStars === star ? `1.5px solid ${starColor(star)}` : "none",
                  }}>
                    <div style={{
                      height: "100%", width: `${pct}%`,
                      background: starColor(star),
                      borderRadius: 4, transition: "width 0.4s",
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: "#888", minWidth: 28 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Star filter pills */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => setFilterStars(0)}
              style={{
                padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: "pointer", border: "none",
                background: filterStars === 0 ? "#7B61FF" : "#F0EBFF",
                color: filterStars === 0 ? "#fff" : "#7B61FF",
                transition: "all 0.15s",
              }}
            >Todas ({allReviews.length})</button>
            {countByStar.filter(x => x.count > 0).map(({ star, count }) => (
              <button
                key={star}
                onClick={() => setFilterStars(filterStars === star ? 0 : star)}
                style={{
                  padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  cursor: "pointer", border: "none",
                  background: filterStars === star ? starColor(star) : "#F8F4FF",
                  color: filterStars === star ? "#fff" : starColor(star),
                  transition: "all 0.15s",
                }}
              >{star}★ ({count})</button>
            ))}
          </div>

          {/* Reviews list */}
          <div style={{ maxHeight: 380, overflowY: "auto", paddingRight: 4 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#bbb", fontSize: 14 }}>
                No hay reseñas de {filterStars} estrella{filterStars !== 1 ? "s" : ""} aún
              </div>
            ) : filtered.map(r => (
              <div key={r.id} style={{
                background: "#fff", border: "1.5px solid #f0ecff",
                borderRadius: 14, padding: "14px 16px", marginBottom: 10,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1035" }}>{r.author}</div>
                    <div style={{ display: "flex", gap: 2, marginTop: 2 }}>
                      {[1,2,3,4,5].map(s => (
                        <span key={s} style={{
                          fontSize: 13,
                          color: s <= r.stars ? starColor(r.stars) : "#e0d8f8",
                        }}>★</span>
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: "#bbb", flexShrink: 0, marginLeft: 8 }}>{r.date}</span>
                </div>
                {r.title && (
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 4 }}>{r.title}</div>
                )}
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.55 }}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Overlay>
  );
}

// ─── DETAIL MODAL ─────────────────────────────────────────────────────────────

function ServiceDetailModal({ service, selectedCommune, onClose, onQuote, onReportCancel, onShowReviews }) {
  const shippingForSelected = selectedCommune && selectedCommune !== "Todas las comunas"
    ? service.comunasDespacho?.[selectedCommune]
    : null;

  return (
    <Overlay onClose={onClose}>
      <div>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${service.color}22, ${service.color}44)`,
          padding: "28px 28px 20px", position: "relative",
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,0.85)", border: "none",
            borderRadius: "50%", width: 32, height: 32,
            cursor: "pointer", fontSize: 16,
          }}>✕</button>
          <div style={{ fontSize: 52, marginBottom: 10 }}>{service.emoji}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <h2 style={{ margin: 0, color: "#1A1035", fontSize: 22 }}>{service.name}</h2>
            {service.verified && <span title="Verificado">✅</span>}
            {service.isNew && <Badge color="#06D6A0">NUEVO</Badge>}
          </div>
          <div style={{ fontSize: 13, color: "#666" }}>por {service.owner}</div>
        </div>

        <div style={{ padding: "20px 28px 28px" }}>
          {/* Cancellation warning */}
          <CancellationWarning service={service} />
          {service.cancellations > 0 && <div style={{ height: 16 }} />}

          {service.reviews > 0 && (
            <div
              onClick={() => onShowReviews(service)}
              style={{
                marginBottom: 14, display: "inline-flex", alignItems: "center", gap: 10,
                background: "#F8F4FF", borderRadius: 20, padding: "7px 14px",
                cursor: "pointer", border: "1.5px solid #e8e0f5",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#7B61FF88"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e8e0f5"}
            >
              <Stars rating={service.rating} size={15} />
              <span style={{ fontSize: 13, color: "#7B61FF", fontWeight: 600 }}>
                {service.reviews} reseñas
              </span>
              <span style={{ fontSize: 12, color: "#aaa" }}>→ ver todas</span>
            </div>
          )}

          <p style={{ color: "#444", fontSize: 14, lineHeight: 1.6, margin: "0 0 16px" }}>{service.desc}</p>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
            {service.tags.map(t => <Badge key={t} color={service.color}>{t}</Badge>)}
          </div>

          {/* Shipping by commune */}
          <div style={{ background: "#F8F4FF", borderRadius: 14, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              🚚 Cobertura y costo de despacho
            </div>

            {shippingForSelected !== undefined && shippingForSelected !== null && (
              <div style={{
                background: shippingForSelected === 0 ? "#06D6A015" : "#7B61FF12",
                border: `1.5px solid ${shippingForSelected === 0 ? "#06D6A055" : "#7B61FF44"}`,
                borderRadius: 10, padding: "10px 14px", marginBottom: 12,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1035" }}>
                  📍 {selectedCommune}
                  <span style={{ fontSize: 11, color: "#888", fontWeight: 400, marginLeft: 4 }}>(tu filtro)</span>
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 800,
                  color: shippingForSelected === 0 ? "#059669" : "#7B61FF",
                }}>
                  {shippingForSelected === 0 ? "Gratis ✓" : formatPrice(shippingForSelected)}
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {Object.entries(service.comunasDespacho || {}).map(([comuna, cost]) => (
                <div key={comuna} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "#fff", borderRadius: 8, padding: "7px 10px",
                  border: "1px solid #eee",
                }}>
                  <span style={{ fontSize: 12, color: "#444" }}>{comuna}</span>
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: cost === 0 ? "#059669" : "#7B61FF",
                  }}>{cost === 0 ? "Gratis" : formatPrice(cost)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation reviews */}
          {service.cancellationReviews && service.cancellationReviews.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: "#EF476F",
                textTransform: "uppercase", letterSpacing: 1, marginBottom: 10,
              }}>
                🚨 Reseñas de cancelaciones tardías
              </div>
              {service.cancellationReviews.map((r, i) => (
                <div key={i} style={{
                  background: "#FEF2F2", border: "1px solid #EF476F33",
                  borderRadius: 12, padding: "12px 14px", marginBottom: 8,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{
                      background: r.type === "same_day" ? "#EF476F" : "#FF6B35",
                      color: "#fff", borderRadius: 20, padding: "2px 10px",
                      fontSize: 10, fontWeight: 700,
                    }}>
                      {r.type === "same_day" ? "⚡ Mismo día" : "📅 Día anterior"}
                    </span>
                    <span style={{ fontSize: 11, color: "#999" }}>{r.date}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
                    <span style={{ fontSize: 11, color: "#EF476F", fontWeight: 700 }}>LinkServ: </span>
                    {r.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Price & capacity */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "#fff", border: "1.5px solid #e8e0f5",
            borderRadius: 14, padding: "14px 16px", marginBottom: 18,
          }}>
            <div>
              <div style={{ fontSize: 11, color: "#999" }}>Precio del servicio</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1A1035" }}>{service.priceLabel}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#999" }}>Capacidad</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>{service.capacity}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { onClose(); onQuote(service); }}
              style={{ ...btnStyle(service.color), flex: 2 }}
            >
              💬 Solicitar cotización
            </button>
            <button
              onClick={() => { onClose(); onReportCancel(service); }}
              style={{
                flex: 1, background: "#FEF2F2", border: "1.5px solid #EF476F44",
                color: "#EF476F", borderRadius: 12, padding: "11px 10px",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
              }}
            >
              🚨 Reportar cancelación
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

// ─── REGISTER MODAL ───────────────────────────────────────────────────────────

function RegisterModal({ onClose, onAdd }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", ownerName: "", phone: "", email: "",
    category: "food", desc: "", price: "", emoji: "🍔",
    comunasDespacho: {}, // { comuna: cost }
    tags: "",
  });
  const [done, setDone] = useState(false);
  const [shippingInput, setShippingInput] = useState(""); // temp input for shipping cost
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleComuna = (c) => {
    setForm(p => {
      const next = { ...p.comunasDespacho };
      if (next[c] !== undefined) {
        delete next[c];
      } else {
        next[c] = 0;
      }
      return { ...p, comunasDespacho: next };
    });
  };

  const setShipping = (c, val) => {
    const num = parseInt(val.replace(/\D/g, "")) || 0;
    setForm(p => ({ ...p, comunasDespacho: { ...p.comunasDespacho, [c]: num } }));
  };

  const submit = () => {
    const newService = {
      id: Date.now(), category: form.category,
      name: form.name, owner: form.ownerName, verified: false,
      desc: form.desc,
      price: parseInt(form.price.replace(/\D/g, "")) || 0,
      priceLabel: form.price ? `$${form.price} / evento` : "Precio a convenir",
      rating: 0, reviews: 0, cancellations: 0,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      emoji: form.emoji, color: "#7B61FF",
      comunasDespacho: form.comunasDespacho,
      capacity: "a confirmar", phone: form.phone,
      isNew: true, cancellationReviews: [],
    };
    onAdd(newService);
    setDone(true);
  };

  const emojiOptions = ["🌮","🍕","🍔","🌭","🍣","🍩","🏰","⚽","🎯","🎧","📸","🎨","🎩","🎈","💡","🎪"];
  const selectedComunas = Object.keys(form.comunasDespacho);

  if (done) return (
    <Overlay onClose={onClose}>
      <div style={{ padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
        <h2 style={{ margin: "0 0 8px", color: "#1A1035" }}>¡Publicación creada!</h2>
        <p style={{ color: "#666", fontSize: 14, margin: "0 0 8px" }}>Tu servicio ya aparece en el directorio.</p>
        <p style={{ color: "#999", fontSize: 13, margin: "0 0 24px" }}>Será verificado en las próximas 24 horas para obtener el sello ✅</p>
        <button onClick={onClose} style={btnStyle("#7B61FF")}>Ver mi publicación</button>
      </div>
    </Overlay>
  );

  return (
    <Overlay onClose={onClose}>
      <div style={{ padding: "28px 28px 4px" }}>
        {/* Progress */}
        <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
          {[1,2,3].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 4,
              background: s <= step ? "#7B61FF" : "#e8e0f5",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {step === 1 && (
          <>
            <h2 style={{ margin: "0 0 4px", color: "#1A1035", fontSize: 20 }}>Publica tu servicio</h2>
            <p style={{ color: "#888", fontSize: 13, margin: "0 0 18px" }}>Paso 1 de 3 — Información básica</p>

            {[
              { k: "name",      label: "Nombre del servicio", placeholder: "Ej: Taco Truck Don Memo" },
              { k: "ownerName", label: "Tu nombre",           placeholder: "Nombre del emprendedor" },
              { k: "phone",     label: "WhatsApp de contacto",placeholder: "+56 9 XXXX XXXX" },
              { k: "email",     label: "Correo electrónico",  placeholder: "tu@email.com" },
            ].map(({ k, label, placeholder }) => (
              <div key={k} style={{ marginBottom: 13 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 5 }}>{label}</label>
                <input value={form[k]} onChange={e => set(k, e.target.value)}
                  placeholder={placeholder} style={inputStyle()} />
              </div>
            ))}

            <div style={{ marginBottom: 13 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 5 }}>Categoría</label>
              <select value={form.category} onChange={e => set("category", e.target.value)} style={inputStyle()}>
                {CATEGORIES.filter(c => c.id !== "all").map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 8 }}>Ícono del servicio</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {emojiOptions.map(e => (
                  <button key={e} onClick={() => set("emoji", e)} style={{
                    width: 40, height: 40, borderRadius: 10,
                    border: `2px solid ${form.emoji === e ? "#7B61FF" : "#e8e0f5"}`,
                    background: form.emoji === e ? "#F0EBFF" : "#fff",
                    fontSize: 20, cursor: "pointer", transition: "all 0.15s",
                  }}>{e}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ margin: "0 0 4px", color: "#1A1035", fontSize: 20 }}>Detalle del servicio</h2>
            <p style={{ color: "#888", fontSize: 13, margin: "0 0 18px" }}>Paso 2 de 3 — Descripción y precio</p>

            <div style={{ marginBottom: 13 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 5 }}>Descripción</label>
              <textarea value={form.desc} onChange={e => set("desc", e.target.value)}
                placeholder="Describe tu servicio: qué incluye, para qué tipo de evento, capacidad..."
                rows={4} style={{ ...inputStyle(), resize: "vertical" }} />
            </div>

            <div style={{ marginBottom: 13 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 5 }}>Precio referencial</label>
              <input value={form.price} onChange={e => set("price", e.target.value)}
                placeholder="Ej: 150.000" style={inputStyle()} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 5 }}>
                Etiquetas (separadas por coma)
              </label>
              <input value={form.tags} onChange={e => set("tags", e.target.value)}
                placeholder="Ej: Familiar, Niños, Sin gluten" style={inputStyle()} />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ margin: "0 0 4px", color: "#1A1035", fontSize: 20 }}>Cobertura y despacho</h2>
            <p style={{ color: "#888", fontSize: 13, margin: "0 0 6px" }}>Paso 3 de 3 — Selecciona comunas y define el costo de traslado a cada una</p>

            <div style={{
              background: "#F0EBFF", borderRadius: 10, padding: "10px 14px",
              fontSize: 12, color: "#7B61FF", fontWeight: 600, marginBottom: 16,
              display: "flex", gap: 8, alignItems: "center",
            }}>
              <span>💡</span>
              <span>Pon $0 si el despacho es gratis en esa comuna</span>
            </div>

            <div style={{
              border: "1.5px solid #e8e0f5", borderRadius: 14,
              maxHeight: 380, overflowY: "auto", marginBottom: 16,
            }}>
              {COMUNAS.slice(1).map((c, i) => {
                const selected = form.comunasDespacho[c] !== undefined;
                return (
                  <div key={c} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 14px",
                    borderBottom: i < COMUNAS.length - 2 ? "1px solid #f0ecff" : "none",
                    background: selected ? "#F8F4FF" : "#fff",
                    transition: "background 0.15s",
                  }}>
                    <input type="checkbox" checked={selected}
                      onChange={() => toggleComuna(c)}
                      style={{ accentColor: "#7B61FF", width: 16, height: 16, cursor: "pointer", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: "#333", flex: 1, fontWeight: selected ? 600 : 400 }}>{c}</span>
                    {selected && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 12, color: "#999" }}>$</span>
                        <input
                          type="number"
                          min={0}
                          value={form.comunasDespacho[c] === 0 ? "" : form.comunasDespacho[c]}
                          onChange={e => setShipping(c, e.target.value)}
                          placeholder="0"
                          style={{
                            width: 80, border: "1.5px solid #7B61FF44", borderRadius: 8,
                            padding: "5px 8px", fontSize: 13, outline: "none",
                            color: "#7B61FF", fontWeight: 700, textAlign: "right",
                            fontFamily: "inherit",
                          }}
                        />
                        {form.comunasDespacho[c] === 0 && (
                          <span style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>Gratis</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedComunas.length > 0 && (
              <div style={{
                background: "#F8F4FF", borderRadius: 12, padding: "10px 14px", marginBottom: 16,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#7B61FF", marginBottom: 6 }}>
                  📍 {selectedComunas.length} comunas seleccionadas
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {selectedComunas.map(c => (
                    <span key={c} style={{
                      background: "#fff", border: "1px solid #7B61FF33",
                      borderRadius: 20, padding: "2px 10px",
                      fontSize: 11, color: "#555",
                    }}>
                      {c} — <strong style={{ color: form.comunasDespacho[c] === 0 ? "#059669" : "#7B61FF" }}>
                        {form.comunasDespacho[c] === 0 ? "Gratis" : formatPrice(form.comunasDespacho[c])}
                      </strong>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {step > 1 && (
            <button onClick={() => setStep(s => s - 1)} style={{
              flex: 1, padding: "12px", borderRadius: 12,
              border: "1.5px solid #e8e0f5", background: "#fff",
              color: "#555", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>← Atrás</button>
          )}
          <button
            onClick={() => step < 3 ? setStep(s => s + 1) : submit()}
            style={{ ...btnStyle("#7B61FF"), flex: 2 }}
            disabled={step === 3 && selectedComunas.length === 0}
          >
            {step < 3 ? "Continuar →" : "Publicar servicio 🎉"}
          </button>
        </div>
        <button onClick={onClose} style={{
          width: "100%", marginBottom: 16, background: "none", border: "none",
          color: "#aaa", cursor: "pointer", fontSize: 13,
        }}>Cancelar</button>
      </div>
    </Overlay>
  );
}

// ─── SERVICE CARD ─────────────────────────────────────────────────────────────

function ServiceCard({ service, selectedCommune, onQuote, onDetail, onFav, isFav, onReviews }) {
  const [hover, setHover] = useState(false);

  const shippingCost = selectedCommune && selectedCommune !== "Todas las comunas"
    ? service.comunasDespacho?.[selectedCommune]
    : null;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff", borderRadius: 20, overflow: "hidden",
        boxShadow: hover
          ? `0 16px 40px ${service.color}28, 0 4px 16px rgba(0,0,0,0.10)`
          : "0 2px 12px rgba(0,0,0,0.07)",
        transform: hover ? "translateY(-4px)" : "none",
        transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
        border: `1.5px solid ${hover ? service.color + "44" : "transparent"}`,
        cursor: "pointer", display: "flex", flexDirection: "column",
      }}
    >
      {/* Band */}
      <div onClick={() => onDetail(service)} style={{
        background: `linear-gradient(135deg, ${service.color}18, ${service.color}38)`,
        padding: "18px 18px 14px", position: "relative",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontSize: 44 }}>{service.emoji}</span>
          <button onClick={e => { e.stopPropagation(); onFav(service.id); }} style={{
            background: isFav ? "#FF4D8D" : "rgba(255,255,255,0.85)",
            border: "none", borderRadius: "50%", width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", flexShrink: 0,
          }}>{isFav ? "❤️" : "🤍"}</button>
        </div>
        <div style={{ display: "flex", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
          <Badge color={service.color}>
            {CATEGORIES.find(c => c.id === service.category)?.emoji} {CATEGORIES.find(c => c.id === service.category)?.label}
          </Badge>
          {service.verified && <Badge color="#06D6A0">✅ Verificado</Badge>}
          {service.isNew && <Badge color="#FFD166">✨ Nuevo</Badge>}
        </div>
      </div>

      {/* Body */}
      <div onClick={() => onDetail(service)} style={{ padding: "13px 18px 0", flex: 1 }}>
        <h3 style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 800, color: "#1A1035" }}>{service.name}</h3>
        <div style={{ fontSize: 12, color: "#aaa", marginBottom: 7 }}>por {service.owner}</div>

        {/* Cancellation badge on card */}
        {service.cancellations > 0 && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "#FEF2F2", border: "1px solid #EF476F33",
            borderRadius: 20, padding: "3px 10px", marginBottom: 8,
            fontSize: 11, fontWeight: 700, color: "#EF476F",
          }}>
            {service.cancellations >= 3 ? "🚨" : "⚠️"}
            {service.cancellations} cancelación{service.cancellations > 1 ? "es" : ""} tardía{service.cancellations > 1 ? "s" : ""}
          </div>
        )}

        <p style={{
          margin: "0 0 10px", fontSize: 13, color: "#666", lineHeight: 1.5,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{service.desc}</p>

        {service.reviews > 0 ? (
          <div
            onClick={e => { e.stopPropagation(); onReviews(service); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 10,
              background: "#FFFBEA", borderRadius: 20, padding: "4px 10px 4px 8px",
              cursor: "pointer", border: "1px solid #FFD16644",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#FFD166"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#FFD16644"}
          >
            <Stars rating={service.rating} size={12} />
            <span style={{ fontSize: 11, color: "#999" }}>({service.reviews})</span>
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "#bbb", marginBottom: 10 }}>Sin reseñas aún</div>
        )}

        {/* Shipping for selected commune */}
        {shippingCost !== null && shippingCost !== undefined ? (
          <div style={{
            background: shippingCost === 0 ? "#06D6A012" : "#F0EBFF",
            border: `1px solid ${shippingCost === 0 ? "#06D6A044" : "#7B61FF33"}`,
            borderRadius: 10, padding: "7px 10px", marginBottom: 12,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 12, color: "#555" }}>🚚 Despacho a {selectedCommune}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: shippingCost === 0 ? "#059669" : "#7B61FF" }}>
              {shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}
            </span>
          </div>
        ) : (
          <div style={{
            background: "#F8F4FF", borderRadius: 10, padding: "7px 10px", marginBottom: 12,
            fontSize: 12, color: "#7B61FF", fontWeight: 600,
          }}>
            📍 {Object.keys(service.comunasDespacho || {}).length} comunas con cobertura
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "0 18px 18px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderTop: "1px solid #f0ecff", paddingTop: 12, marginBottom: 12,
        }}>
          <div>
            <div style={{ fontSize: 10, color: "#bbb", textTransform: "uppercase", letterSpacing: 0.5 }}>Precio desde</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#1A1035" }}>{service.priceLabel}</div>
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onQuote(service); }}
          style={{ ...btnStyle(service.color), width: "100%" }}
        >💬 Cotizar</button>
      </div>
    </div>
  );
}

// ─── USER MENU ────────────────────────────────────────────────────────────────

function UserMenu() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginStep, setLoginStep] = useState("login");
  const [userName, setUserName] = useState("");

  const menuItems = loggedIn
    ? [
        { icon: "👤", label: "Mi perfil" },
        { icon: "📋", label: "Mis reservas" },
        { icon: "🏪", label: "Mis servicios publicados" },
        { icon: "❤️", label: "Guardados" },
        { icon: "⚙️", label: "Configuración" },
        { divider: true },
        { icon: "🚪", label: "Cerrar sesión", action: () => { setLoggedIn(false); setOpen(false); } },
      ]
    : [
        { icon: "🔑", label: "Iniciar sesión", action: () => { setShowLogin(true); setLoginStep("login"); setOpen(false); } },
        { icon: "✨", label: "Crear cuenta", action: () => { setShowLogin(true); setLoginStep("register"); setOpen(false); } },
        { divider: true },
        { icon: "🏪", label: "Publicar mi servicio", action: () => { setShowLogin(true); setOpen(false); } },
      ];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: open ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 10, padding: "0 12px 0 6px", height: 36,
          cursor: "pointer", transition: "all 0.15s",
        }}
      >
        <div style={{
          width: 26, height: 26, borderRadius: "50%",
          background: loggedIn ? "linear-gradient(135deg, #7B61FF, #FF4D8D)" : "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: loggedIn ? 12 : 14, fontWeight: 700, color: "#fff",
        }}>
          {loggedIn ? (userName ? userName[0].toUpperCase() : "U") : "👤"}
        </div>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
          {loggedIn ? (userName || "Mi cuenta") : "Cuenta"}
        </span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", display: "inline-block", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 199 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            background: "#fff", borderRadius: 14, zIndex: 200,
            boxShadow: "0 16px 48px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1)",
            minWidth: 220, border: "1px solid #f0ecff", overflow: "hidden",
          }}>
            <div style={{
              padding: "14px 16px 12px",
              background: "linear-gradient(135deg, #F8F4FF, #fff)",
              borderBottom: "1px solid #f0ecff",
            }}>
              {loggedIn ? (
                <>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, #7B61FF, #FF4D8D)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 8,
                  }}>{userName ? userName[0].toUpperCase() : "U"}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1035" }}>{userName}</div>
                  <div style={{ fontSize: 12, color: "#999" }}>{loginForm.email}</div>
                </>
              ) : (
                <div style={{ fontSize: 13, color: "#888" }}>Hola 👋 ¿ya tienes cuenta?</div>
              )}
            </div>
            <div style={{ padding: "6px 0" }}>
              {menuItems.map((item, i) =>
                item.divider ? (
                  <div key={i} style={{ height: 1, background: "#f0ecff", margin: "4px 0" }} />
                ) : (
                  <button
                    key={i}
                    onClick={() => { item.action && item.action(); setOpen(false); }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10,
                      padding: "9px 16px", background: "none", border: "none",
                      cursor: "pointer", fontSize: 13, color: "#333", fontWeight: 500,
                      textAlign: "left",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#F8F4FF"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{item.icon}</span>
                    {item.label}
                  </button>
                )
              )}
            </div>
          </div>
        </>
      )}

      {showLogin && (
        <Overlay onClose={() => setShowLogin(false)}>
          <div style={{ padding: "32px 28px 28px" }}>
            <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "#F8F4FF", borderRadius: 10, padding: 4 }}>
              {[{ id: "login", label: "Iniciar sesión" }, { id: "register", label: "Crear cuenta" }].map(t => (
                <button
                  key={t.id}
                  onClick={() => setLoginStep(t.id)}
                  style={{
                    flex: 1, padding: "8px", borderRadius: 8, border: "none",
                    background: loginStep === t.id ? "#fff" : "transparent",
                    color: loginStep === t.id ? "#1A1035" : "#888",
                    fontWeight: loginStep === t.id ? 700 : 500,
                    fontSize: 14, cursor: "pointer",
                    boxShadow: loginStep === t.id ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                  }}
                >{t.label}</button>
              ))}
            </div>

            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{loginStep === "login" ? "👋" : "✨"}</div>
              <h2 style={{ margin: "0 0 4px", fontSize: 20, color: "#1A1035" }}>
                {loginStep === "login" ? "¡Bienvenido de vuelta!" : "Únete a LinkServ"}
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: "#888" }}>
                {loginStep === "login" ? "Ingresa tus datos para continuar" : "Crea tu cuenta gratis en segundos"}
              </p>
            </div>

            {loginStep === "register" && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 5 }}>Tu nombre</label>
                <input
                  placeholder="¿Cómo te llamamos?"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e8e0f5", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", fontFamily: "inherit" }}
                />
              </div>
            )}

            {[
              { k: "email",    label: "Correo electrónico", placeholder: "tu@email.com",          type: "email"    },
              { k: "password", label: "Contraseña",         placeholder: "Mínimo 8 caracteres",   type: "password" },
            ].map(({ k, label, placeholder, type }) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 5 }}>{label}</label>
                <input
                  type={type} value={loginForm[k]}
                  onChange={e => setLoginForm(p => ({ ...p, [k]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e8e0f5", borderRadius: 10, padding: "10px 12px", fontSize: 14, outline: "none", fontFamily: "inherit" }}
                />
              </div>
            ))}

            {loginStep === "login" && (
              <div style={{ textAlign: "right", marginBottom: 18 }}>
                <span style={{ fontSize: 12, color: "#7B61FF", cursor: "pointer", fontWeight: 600 }}>¿Olvidaste tu contraseña?</span>
              </div>
            )}

            <button
              onClick={() => {
                if (loginForm.email && loginForm.password) {
                  setLoggedIn(true);
                  if (!userName && loginStep === "login") setUserName(loginForm.email.split("@")[0]);
                  setShowLogin(false);
                }
              }}
              style={{
                width: "100%", background: "linear-gradient(135deg, #7B61FF, #FF4D8D)",
                color: "#fff", border: "none", borderRadius: 12,
                padding: "12px", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 14,
              }}
            >
              {loginStep === "login" ? "Ingresar →" : "Crear cuenta →"}
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: "#e8e0f5" }} />
              <span style={{ fontSize: 12, color: "#bbb" }}>o continúa con</span>
              <div style={{ flex: 1, height: 1, background: "#e8e0f5" }} />
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[{ icon: "🔵", label: "Google" }, { icon: "⬛", label: "Apple" }].map(s => (
                <button key={s.label} style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  border: "1.5px solid #e8e0f5", borderRadius: 10, padding: "10px",
                  fontSize: 13, fontWeight: 600, color: "#333", background: "#fff", cursor: "pointer",
                }}>
                  <span>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>

            <div style={{ textAlign: "center", fontSize: 12, color: "#999" }}>
              {loginStep === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
              <span
                onClick={() => setLoginStep(loginStep === "login" ? "register" : "login")}
                style={{ color: "#7B61FF", fontWeight: 700, cursor: "pointer" }}
              >
                {loginStep === "login" ? "Regístrate gratis" : "Inicia sesión"}
              </span>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [category, setCategory] = useState("all");
  const [commune, setCommune] = useState("Todas las comunas");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating");
  const [favs, setFavs] = useState(new Set());
  const [favOnly, setFavOnly] = useState(false);
  const [quoteService, setQuoteService] = useState(null);
  const [detailService, setDetailService] = useState(null);
  const [cancelService, setCancelService] = useState(null);
  const [reviewsService, setReviewsService] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const toggleFav = id => setFavs(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handleCancelReport = (serviceId, cancelType) => {
    const penalty = cancelType === "same_day" ? 1.5 : 0.8;
    const autoReview = {
      date: new Date().toISOString().split("T")[0],
      type: cancelType,
      text: cancelType === "same_day"
        ? "Reseña automática de LinkServ: este proveedor canceló el mismo día del evento. Su calificación fue penalizada."
        : "Reseña automática de LinkServ: este proveedor canceló con menos de 24 horas de anticipación. Su calificación fue penalizada.",
    };
    setServices(prev => prev.map(s => {
      if (s.id !== serviceId) return s;
      return {
        ...s,
        rating: Math.max(1, parseFloat((s.rating - penalty).toFixed(1))),
        cancellations: (s.cancellations || 0) + 1,
        cancellationReviews: [autoReview, ...(s.cancellationReviews || [])],
      };
    }));
    setCancelService(null);
  };

  const filtered = useMemo(() => {
    return services
      .filter(s => category === "all" || s.category === category)
      .filter(s => commune === "Todas las comunas" || s.comunasDespacho?.[commune] !== undefined)
      .filter(s => !favOnly || favs.has(s.id))
      .filter(s => {
        if (!search) return true;
        const q = search.toLowerCase();
        return s.name.toLowerCase().includes(q) ||
          s.desc.toLowerCase().includes(q) ||
          s.tags.some(t => t.toLowerCase().includes(q)) ||
          Object.keys(s.comunasDespacho || {}).some(c => c.toLowerCase().includes(q));
      })
      .sort((a, b) => {
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "reviews") return b.reviews - a.reviews;
        if (sort === "price_asc") return a.price - b.price;
        if (sort === "price_desc") return b.price - a.price;
        return 0;
      });
  }, [services, category, commune, search, sort, favOnly, favs]);

  return (
    <div style={{ minHeight: "100vh", background: "#F8F4FF", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* ── TOPNAV ── */}
      <nav style={{ background: "#1A1035", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>🎉</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
              Link<span style={{ background: "linear-gradient(90deg, #FF4D8D, #FFD166)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Serv</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={() => setFavOnly(!favOnly)}
              style={{
                background: favOnly ? "rgba(255,77,141,0.2)" : "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8, color: favOnly ? "#FF4D8D" : "rgba(255,255,255,0.6)",
                fontSize: 13, fontWeight: 600, padding: "6px 14px", cursor: "pointer", height: 36,
              }}
            >
              ❤️ Guardados{favs.size > 0 ? ` (${favs.size})` : ""}
            </button>
            <button
              onClick={() => setShowRegister(true)}
              style={{
                background: "linear-gradient(135deg, #FF4D8D, #FF6B35)",
                border: "none", borderRadius: 8, color: "#fff",
                fontSize: 13, fontWeight: 700, padding: "0 18px", height: 36,
                cursor: "pointer", boxShadow: "0 4px 14px rgba(255,77,141,0.3)",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Publicar servicio
            </button>
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(135deg, #1A1035 0%, #2D1B69 55%, #3a1f7a 100%)", padding: "72px 32px 64px", position: "relative", overflow: "hidden" }}>
        {[
          { s: 400, top: -100, left: -100, c: "#FF4D8D" },
          { s: 280, top: 40, right: -80, c: "#7B61FF" },
          { s: 180, bottom: -60, left: "45%", c: "#FFD166" },
        ].map((d, i) => (
          <div key={i} style={{ position: "absolute", width: d.s, height: d.s, borderRadius: "50%", background: d.c + "14", top: d.top, left: d.left, right: d.right, bottom: d.bottom, pointerEvents: "none" }} />
        ))}

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 720, marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,77,141,0.15)", border: "1px solid rgba(255,77,141,0.3)", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: "#FF4D8D", marginBottom: 20 }}>
              🇨🇱 El primer marketplace chileno de servicios para eventos
            </div>
            <h1 style={{ margin: "0 0 16px", color: "#fff", fontSize: "clamp(36px, 5vw, 62px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-1.5px" }}>
              Encuentra el servicio<br />
              <span style={{ background: "linear-gradient(90deg, #FF4D8D 0%, #FFD166 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                perfecto para tu fiesta ✨
              </span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 17, margin: 0, lineHeight: 1.6 }}>
              Carritos de comida, inflables, DJs, fotógrafos y mucho más.<br />
              Filtra por tu comuna y ve exactamente cuánto cuesta el despacho.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "8px 8px 8px 20px", backdropFilter: "blur(12px)", maxWidth: 860 }}>
            <span style={{ fontSize: 18, alignSelf: "center", opacity: 0.5 }}>🔍</span>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Busca: taco truck, inflable, DJ, fotógrafo..."
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 15, padding: "8px 0" }}
            />
            <select value={commune} onChange={e => setCommune(e.target.value)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: commune === "Todas las comunas" ? "rgba(255,255,255,0.45)" : "#fff", padding: "8px 14px", fontSize: 13, cursor: "pointer", outline: "none", minWidth: 175 }}>
              {COMUNAS.map(c => (
                <option key={c} value={c} style={{ color: "#1A1035", background: "#fff" }}>{c === "Todas las comunas" ? "📍 " + c : c}</option>
              ))}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", padding: "8px 14px", fontSize: 13, cursor: "pointer", outline: "none" }}>
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ color: "#1A1035", background: "#fff" }}>{o.label}</option>
              ))}
            </select>
            <button style={{ background: "linear-gradient(135deg, #7B61FF, #FF4D8D)", border: "none", borderRadius: 10, color: "#fff", padding: "10px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
              Buscar
            </button>
          </div>

          {commune !== "Todas las comunas" && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 14, background: "rgba(123,97,255,0.2)", border: "1px solid rgba(123,97,255,0.35)", borderRadius: 20, padding: "5px 14px" }}>
              <span style={{ fontSize: 12, color: "#c4b5fd", fontWeight: 600 }}>
                📍 Mostrando servicios que llegan a <strong>{commune}</strong>
              </span>
              <button onClick={() => setCommune("Todas las comunas")} style={{ background: "none", border: "none", color: "#c4b5fd", cursor: "pointer", fontSize: 14, padding: 0 }}>✕</button>
            </div>
          )}

          <div style={{ display: "flex", gap: 40, marginTop: 44 }}>
            {[
              { n: services.length + "+", label: "servicios publicados" },
              { n: "34", label: "comunas con cobertura" },
              { n: "4.7★", label: "calificación promedio" },
              { n: "100%", label: "pagos seguros vía MP" },
            ].map(s => (
              <div key={s.n}>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#FFD166" }}>{s.n}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CATEGORY BAR ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f0ecff", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", gap: 4, overflowX: "auto", scrollbarWidth: "none", alignItems: "center", height: 52 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)} style={{
              whiteSpace: "nowrap", padding: "6px 16px", borderRadius: 20, border: "none",
              background: category === c.id ? "linear-gradient(135deg, #7B61FF, #FF4D8D)" : "transparent",
              color: category === c.id ? "#fff" : "#666",
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.18s",
              boxShadow: category === c.id ? "0 4px 14px rgba(123,97,255,0.28)" : "none",
            }}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── RESULTS ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 32px 72px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1A1035" }}>
              {commune !== "Todas las comunas" ? `Servicios en ${commune}` : category !== "all" ? CATEGORIES.find(c => c.id === category)?.label : "Todos los servicios"}
              <span style={{ marginLeft: 10, background: "#F0EBFF", color: "#7B61FF", borderRadius: 20, padding: "2px 12px", fontSize: 14, fontWeight: 700 }}>{filtered.length}</span>
            </h2>
            {search && <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Resultados para <strong>"{search}"</strong></div>}
          </div>
          <button onClick={() => setShowRegister(true)} style={{ background: "#F0EBFF", border: "1.5px solid #7B61FF33", borderRadius: 10, color: "#7B61FF", fontSize: 13, fontWeight: 700, padding: "9px 18px", cursor: "pointer" }}>
            + Publicar mi servicio
          </button>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>😕</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#444", marginBottom: 10 }}>
              {commune !== "Todas las comunas" ? `Nadie llega a ${commune} aún` : "No encontramos servicios"}
            </div>
            <p style={{ color: "#888", fontSize: 15, marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
              {commune !== "Todas las comunas" ? "Puedes publicar tu servicio y ser el primero en cubrir esta zona." : "Prueba con otra categoría o cambia los filtros."}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => { setSearch(""); setCategory("all"); setCommune("Todas las comunas"); setFavOnly(false); }} style={btnStyle("#7B61FF")}>Ver todos</button>
              <button onClick={() => setShowRegister(true)} style={btnStyle("#FF4D8D")}>Publicar en esta zona</button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
            {filtered.map(s => (
              <ServiceCard
                key={s.id} service={s}
                selectedCommune={commune}
                onQuote={setQuoteService}
                onDetail={setDetailService}
                onFav={toggleFav}
                isFav={favs.has(s.id)}
                onReviews={setReviewsService}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#1A1035", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "52px 32px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 24 }}>🎉</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>
                  Link<span style={{ background: "linear-gradient(90deg, #FF4D8D, #FFD166)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Serv</span>
                </span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.7, margin: "0 0 20px", maxWidth: 280 }}>
                El marketplace chileno que conecta a quienes organizan eventos con los mejores emprendedores de servicios.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {["Pagos seguros", "Mercado Pago"].map(t => (
                  <span key={t} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>{t}</span>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>Servicios</div>
              {CATEGORIES.filter(c => c.id !== "all").map(c => (
                <div key={c.id} onClick={() => setCategory(c.id)} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 10, cursor: "pointer" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
                >
                  {c.emoji} {c.label}
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>Emprendedores</div>
              {["Publicar mi servicio", "Cómo funciona", "Tarifas y comisiones", "Verificación de cuenta", "Política de cancelaciones"].map(l => (
                <div key={l} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 10, cursor: "pointer" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
                >{l}</div>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>Ayuda</div>
              {["Centro de ayuda", "Términos de uso", "Política de privacidad", "Contacto", "Reportar un problema"].map(l => (
                <div key={l} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 10, cursor: "pointer" }}
                  onMouseEnter={e => e.target.style.color = "#fff"}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.5)"}
                >{l}</div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", maxWidth: 1280, margin: "0 auto", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>© 2025 LinkServ SpA — Santiago, Chile</span>
          <div style={{ display: "flex", gap: 16 }}>
            {["Región Metropolitana", "Pagos vía Mercado Pago", "8% comisión de plataforma"].map(t => (
              <span key={t} style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{t}</span>
            ))}
          </div>
        </div>
      </footer>

      {/* ── MODALS ── */}
      {quoteService && <QuoteModal service={quoteService} selectedCommune={commune} onClose={() => setQuoteService(null)} />}
      {detailService && (
        <ServiceDetailModal
          service={detailService}
          selectedCommune={commune}
          onClose={() => setDetailService(null)}
          onQuote={setQuoteService}
          onReportCancel={setCancelService}
          onShowReviews={s => { setDetailService(null); setReviewsService(s); }}
        />
      )}
      {cancelService && <CancelModal service={cancelService} onClose={() => setCancelService(null)} onConfirm={handleCancelReport} />}
      {reviewsService && <ReviewsModal service={reviewsService} onClose={() => setReviewsService(null)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} onAdd={s => { setServices(p => [s, ...p]); setShowRegister(false); }} />}
    </div>
  );
}
