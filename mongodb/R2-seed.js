// R2: Registrar datos de prueba (Colombia, Japan)
// Especificación: docs/knowledge/01-requerimientos.md > R2

db = db.getSiblingDB("mundial2018");

console.log("=== R2: Seed de Datos Académicos ===");
console.log("Fuente: Datos suministrados por SENA");
console.log("");

// ============================================================================
// EQUIPOS
// ============================================================================

const equipos = [
  {
    id: 5,
    abbreviation: "col",
    country: "Colombia",
    confederation: "CONMEBOL"
  },
  {
    id: 15,
    abbreviation: "jpn",
    country: "Japan",
    confederation: "AFC"
  }
];

console.log("--- Insertando Equipos ---");
let equiposInsertados = 0;
let equiposOmitidos = 0;

equipos.forEach(function(equipo) {
  const existe = db.equipos.findOne({ id: equipo.id });
  if (existe) {
    console.log("⊘ Equipo id=" + equipo.id + " (" + equipo.country + ") ya existe, omitido");
    equiposOmitidos++;
  } else {
    db.equipos.insertOne(equipo);
    console.log("✓ Equipo insertado: " + equipo.country + " (id=" + equipo.id + ")");
    equiposInsertados++;
  }
});

console.log("  Insertados: " + equiposInsertados + ", Omitidos: " + equiposOmitidos);
console.log("");

// ============================================================================
// JUGADORES COLOMBIA
// ============================================================================

const jugadoresColombia = [
  {
    team: "Colombia",
    numero: 1,
    posicion: "GK",
    nombre: "OSPINA David",
    fechaNacimiento: "31.08.1988",
    nombreCamiseta: "OSPINA",
    club: "Arsenal FC (ENG)",
    estatura: 183,
    peso: 80
  },
  {
    team: "Colombia",
    numero: 2,
    posicion: "CB",
    nombre: "ZAPATA Cristian",
    fechaNacimiento: "30.09.1986",
    nombreCamiseta: "C. ZAPATA",
    club: "AC Milan (ITA)",
    estatura: 187,
    peso: 82
  },
  {
    team: "Colombia",
    numero: 3,
    posicion: "CB",
    nombre: "MURILLO Oscar",
    fechaNacimiento: "18.04.1988",
    nombreCamiseta: "O. MURILLO",
    club: "CF Pachuca (MEX)",
    estatura: 184,
    peso: 80
  },
  {
    team: "Colombia",
    numero: 4,
    posicion: "CB",
    nombre: "ARIAS Santiago",
    fechaNacimiento: "13.01.1992",
    nombreCamiseta: "ARIAS",
    club: "PSV Eindhoven (NED)",
    estatura: 177,
    peso: 71
  },
  {
    team: "Colombia",
    numero: 5,
    posicion: "CM",
    nombre: "BARRIOS Wilmar",
    fechaNacimiento: "16.10.1993",
    nombreCamiseta: "BARRIOS",
    club: "CA Boca Juniors (ARG)",
    estatura: 178,
    peso: 74
  },
  {
    team: "Colombia",
    numero: 6,
    posicion: "CM",
    nombre: "SANCHEZ Carlos",
    fechaNacimiento: "06.02.1986",
    nombreCamiseta: "C. SANCHEZ",
    club: "RCD Espanyol (ESP)",
    estatura: 182,
    peso: 82
  },
  {
    team: "Colombia",
    numero: 7,
    posicion: "CF",
    nombre: "BACCA Carlos",
    fechaNacimiento: "08.09.1986",
    nombreCamiseta: "BACCA",
    club: "Villarreal CF (ESP)",
    estatura: 181,
    peso: 77
  },
  {
    team: "Colombia",
    numero: 8,
    posicion: "CM",
    nombre: "AGUILAR Abel",
    fechaNacimiento: "06.01.1985",
    nombreCamiseta: "AGUILAR T.",
    club: "AC Deportivo Cali (COL)",
    estatura: 185,
    peso: 82
  },
  {
    team: "Colombia",
    numero: 9,
    posicion: "CF",
    nombre: "FALCAO Radamel",
    fechaNacimiento: "10.02.1986",
    nombreCamiseta: "FALCAO",
    club: "AS Monaco (FRA)",
    estatura: 177,
    peso: 72
  },
  {
    team: "Colombia",
    numero: 10,
    posicion: "CM",
    nombre: "RODRIGUEZ James",
    fechaNacimiento: "12.07.1991",
    nombreCamiseta: "JAMES",
    club: "FC Bayern München (GER)",
    estatura: 180,
    peso: 75
  },
  {
    team: "Colombia",
    numero: 11,
    posicion: "CM",
    nombre: "CUADRADO Juan",
    fechaNacimiento: "26.05.1988",
    nombreCamiseta: "CUADRADO",
    club: "Juventus FC (ITA)",
    estatura: 179,
    peso: 72
  },
  {
    team: "Colombia",
    numero: 12,
    posicion: "GK",
    nombre: "VARGAS Camilo",
    fechaNacimiento: "09.03.1989",
    nombreCamiseta: "C. VARGAS",
    club: "AC Deportivo Cali (COL)",
    estatura: 185,
    peso: 80
  },
  {
    team: "Colombia",
    numero: 13,
    posicion: "CB",
    nombre: "MINA Yerry",
    fechaNacimiento: "23.09.1994",
    nombreCamiseta: "Y. MINA",
    club: "FC Barcelona (ESP)",
    estatura: 194,
    peso: 95
  },
  {
    team: "Colombia",
    numero: 14,
    posicion: "CF",
    nombre: "MURIEL Luis",
    fechaNacimiento: "16.04.1991",
    nombreCamiseta: "L. MURIEL",
    club: "Sevilla FC (ESP)",
    estatura: 178,
    peso: 79
  },
  {
    team: "Colombia",
    numero: 15,
    posicion: "CM",
    nombre: "URIBE Mateus",
    fechaNacimiento: "21.03.1991",
    nombreCamiseta: "M. URIBE",
    club: "Club América (MEX)",
    estatura: 182,
    peso: 71
  },
  {
    team: "Colombia",
    numero: 16,
    posicion: "CM",
    nombre: "LERMA Jefferson",
    fechaNacimiento: "25.10.1994",
    nombreCamiseta: "J. LERMA",
    club: "Levante UD (ESP)",
    estatura: 179,
    peso: 70
  },
  {
    team: "Colombia",
    numero: 17,
    posicion: "CB",
    nombre: "MOJICA Johan",
    fechaNacimiento: "21.08.1992",
    nombreCamiseta: "J. MOJICA",
    club: "Girona FC (ESP)",
    estatura: 185,
    peso: 66
  },
  {
    team: "Colombia",
    numero: 18,
    posicion: "CB",
    nombre: "FABRA Frank",
    fechaNacimiento: "22.02.1991",
    nombreCamiseta: "FABRA",
    club: "CA Boca Juniors (ARG)",
    estatura: 172,
    peso: 72
  },
  {
    team: "Colombia",
    numero: 19,
    posicion: "CF",
    nombre: "BORJA Miguel",
    fechaNacimiento: "26.01.1993",
    nombreCamiseta: "M. BORJA",
    club: "SE Palmeiras (BRA)",
    estatura: 183,
    peso: 74
  },
  {
    team: "Colombia",
    numero: 20,
    posicion: "CM",
    nombre: "QUINTERO Juan",
    fechaNacimiento: "18.01.1993",
    nombreCamiseta: "J. QUINTERO",
    club: "CA River Plate (ARG)",
    estatura: 169,
    peso: 64
  },
  {
    team: "Colombia",
    numero: 21,
    posicion: "CF",
    nombre: "IZQUIERDO Jose",
    fechaNacimiento: "07.07.1992",
    nombreCamiseta: "IZQUIERDO",
    club: "Brighton & Hove Albion FC (ENG)",
    estatura: 171,
    peso: 73
  },
  {
    team: "Colombia",
    numero: 22,
    posicion: "GK",
    nombre: "CUADRADO Jose",
    fechaNacimiento: "01.06.1985",
    nombreCamiseta: "J.F. CUADRADO",
    club: "CD Once Caldas (COL)",
    estatura: 180,
    peso: 80
  },
  {
    team: "Colombia",
    numero: 23,
    posicion: "CB",
    nombre: "SANCHEZ Davinson",
    fechaNacimiento: "12.06.1996",
    nombreCamiseta: "D. SANCHEZ",
    club: "Tottenham Hotspur FC (ENG)",
    estatura: 187,
    peso: 81
  }
];

console.log("--- Insertando Jugadores Colombia ---");
let jugadoresColombiaInsertados = 0;
let jugadoresColombiaOmitidos = 0;

jugadoresColombia.forEach(function(jugador) {
  const existe = db.jugadores.findOne({ team: jugador.team, numero: jugador.numero });
  if (existe) {
    console.log("⊘ Jugador Colombia #" + jugador.numero + " ya existe, omitido");
    jugadoresColombiaOmitidos++;
  } else {
    db.jugadores.insertOne(jugador);
    console.log("✓ Jugador Colombia #" + jugador.numero + ": " + jugador.nombre);
    jugadoresColombiaInsertados++;
  }
});

console.log("  Insertados: " + jugadoresColombiaInsertados + ", Omitidos: " + jugadoresColombiaOmitidos);
console.log("");

// ============================================================================
// JUGADORES JAPAN
// ============================================================================

const jugadoresJapan = [
  {
    team: "Japan",
    numero: 1,
    posicion: "GK",
    nombre: "KAWASHIMA Eiji",
    fechaNacimiento: "20.03.1983",
    nombreCamiseta: "KAWASHIMA",
    club: "FC Metz (FRA)",
    estatura: 185,
    peso: 74
  },
  {
    team: "Japan",
    numero: 2,
    posicion: "CB",
    nombre: "UEDA Naomichi",
    fechaNacimiento: "24.10.1994",
    nombreCamiseta: "UEDA",
    club: "Kashima Antlers (JPN)",
    estatura: 186,
    peso: 79
  },
  {
    team: "Japan",
    numero: 3,
    posicion: "CB",
    nombre: "SHOJI Gen",
    fechaNacimiento: "11.12.1992",
    nombreCamiseta: "SHOJI",
    club: "Kashima Antlers (JPN)",
    estatura: 182,
    peso: 74
  },
  {
    team: "Japan",
    numero: 4,
    posicion: "CM",
    nombre: "HONDA Keisuke",
    fechaNacimiento: "13.06.1986",
    nombreCamiseta: "HONDA",
    club: "CF Pachuca (MEX)",
    estatura: 182,
    peso: 74
  },
  {
    team: "Japan",
    numero: 5,
    posicion: "CB",
    nombre: "NAGATOMO Yuto",
    fechaNacimiento: "12.09.1986",
    nombreCamiseta: "NAGATOMO",
    club: "Galatasaray SK (TUR)",
    estatura: 170,
    peso: 68
  },
  {
    team: "Japan",
    numero: 6,
    posicion: "CB",
    nombre: "ENDO Wataru",
    fechaNacimiento: "09.02.1993",
    nombreCamiseta: "ENDO",
    club: "Urawa Reds (JPN)",
    estatura: 178,
    peso: 75
  },
  {
    team: "Japan",
    numero: 7,
    posicion: "CM",
    nombre: "SHIBASAKI Gaku",
    fechaNacimiento: "28.05.1992",
    nombreCamiseta: "SHIBASAKI",
    club: "Getafe CF (ESP)",
    estatura: 175,
    peso: 64
  },
  {
    team: "Japan",
    numero: 8,
    posicion: "CM",
    nombre: "HARAGUCHI Genki",
    fechaNacimiento: "09.05.1991",
    nombreCamiseta: "HARAGUCHI",
    club: "Fortuna Düsseldorf (GER)",
    estatura: 178,
    peso: 68
  },
  {
    team: "Japan",
    numero: 9,
    posicion: "CF",
    nombre: "OKAZAKI Shinji",
    fechaNacimiento: "16.04.1986",
    nombreCamiseta: "OKAZAKI",
    club: "Leicester City FC (ENG)",
    estatura: 174,
    peso: 70
  },
  {
    team: "Japan",
    numero: 10,
    posicion: "CM",
    nombre: "KAGAWA Shinji",
    fechaNacimiento: "17.03.1989",
    nombreCamiseta: "KAGAWA",
    club: "Borussia Dortmund (GER)",
    estatura: 175,
    peso: 68
  },
  {
    team: "Japan",
    numero: 11,
    posicion: "CM",
    nombre: "USAMI Takashi",
    fechaNacimiento: "06.05.1992",
    nombreCamiseta: "USAMI",
    club: "Fortuna Düsseldorf (GER)",
    estatura: 178,
    peso: 72
  },
  {
    team: "Japan",
    numero: 12,
    posicion: "GK",
    nombre: "HIGASHIGUCHI Masaaki",
    fechaNacimiento: "12.05.1986",
    nombreCamiseta: "HIGASHIGUCHI",
    club: "Gamba Osaka (JPN)",
    estatura: 184,
    peso: 78
  },
  {
    team: "Japan",
    numero: 13,
    posicion: "CF",
    nombre: "MUTO Yoshinori",
    fechaNacimiento: "15.07.1992",
    nombreCamiseta: "MUTO",
    club: "FSV Mainz 05 (GER)",
    estatura: 179,
    peso: 72
  },
  {
    team: "Japan",
    numero: 14,
    posicion: "CM",
    nombre: "INUI Takashi",
    fechaNacimiento: "02.06.1988",
    nombreCamiseta: "INUI",
    club: "SD Eibar (ESP)",
    estatura: 169,
    peso: 59
  },
  {
    team: "Japan",
    numero: 15,
    posicion: "CF",
    nombre: "OSAKO Yuya",
    fechaNacimiento: "18.05.1990",
    nombreCamiseta: "OSAKO",
    club: "1. FC Köln (GER)",
    estatura: 182,
    peso: 71
  },
  {
    team: "Japan",
    numero: 16,
    posicion: "CM",
    nombre: "YAMAGUCHI Hotaru",
    fechaNacimiento: "06.10.1990",
    nombreCamiseta: "YAMAGUCHI",
    club: "Cerezo Osaka (JPN)",
    estatura: 173,
    peso: 72
  },
  {
    team: "Japan",
    numero: 17,
    posicion: "CM",
    nombre: "HASEBE Makoto",
    fechaNacimiento: "18.01.1984",
    nombreCamiseta: "HASEBE",
    club: "Eintracht Frankfurt (GER)",
    estatura: 180,
    peso: 72
  },
  {
    team: "Japan",
    numero: 18,
    posicion: "CM",
    nombre: "OSHIMA Ryota",
    fechaNacimiento: "23.01.1993",
    nombreCamiseta: "OHSHIMA",
    club: "Kawasaki Frontale (JPN)",
    estatura: 168,
    peso: 64
  },
  {
    team: "Japan",
    numero: 19,
    posicion: "CB",
    nombre: "SAKAI Hiroki",
    fechaNacimiento: "12.04.1990",
    nombreCamiseta: "H. SAKAI",
    club: "Olympique Marseille (FRA)",
    estatura: 183,
    peso: 70
  },
  {
    team: "Japan",
    numero: 20,
    posicion: "CB",
    nombre: "MAKINO Tomoaki",
    fechaNacimiento: "11.05.1987",
    nombreCamiseta: "MAKINO",
    club: "Urawa Reds (JPN)",
    estatura: 182,
    peso: 77
  },
  {
    team: "Japan",
    numero: 21,
    posicion: "CB",
    nombre: "SAKAI Gotoku",
    fechaNacimiento: "14.03.1991",
    nombreCamiseta: "G. SAKAI",
    club: "Hamburger SV (GER)",
    estatura: 176,
    peso: 74
  },
  {
    team: "Japan",
    numero: 22,
    posicion: "CB",
    nombre: "YOSHIDA Maya",
    fechaNacimiento: "24.08.1988",
    nombreCamiseta: "YOSHIDA",
    club: "Southampton FC (ENG)",
    estatura: 189,
    peso: 78
  },
  {
    team: "Japan",
    numero: 23,
    posicion: "GK",
    nombre: "NAKAMURA Kosuke",
    fechaNacimiento: "27.02.1995",
    nombreCamiseta: "NAKAMURA",
    club: "Kashiwa Reysol (JPN)",
    estatura: 184,
    peso: 72
  }
];

console.log("--- Insertando Jugadores Japan ---");
let jugadoresJapanInsertados = 0;
let jugadoresJapanOmitidos = 0;

jugadoresJapan.forEach(function(jugador) {
  const existe = db.jugadores.findOne({ team: jugador.team, numero: jugador.numero });
  if (existe) {
    console.log("⊘ Jugador Japan #" + jugador.numero + " ya existe, omitido");
    jugadoresJapanOmitidos++;
  } else {
    db.jugadores.insertOne(jugador);
    console.log("✓ Jugador Japan #" + jugador.numero + ": " + jugador.nombre);
    jugadoresJapanInsertados++;
  }
});

console.log("  Insertados: " + jugadoresJapanInsertados + ", Omitidos: " + jugadoresJapanOmitidos);
console.log("");

// ============================================================================
// PARTIDOS
// ============================================================================

const partidos = [
  {
    equipo1: "Colombia",
    equipo2: "Japan",
    fecha: "11/07/18",
    hora: "12:00:00 p. m."
  },
  {
    equipo1: "Poland",
    equipo2: "Colombia",
    fecha: "26/07/18",
    hora: "6:00:00 p. m."
  }
];

console.log("--- Insertando Partidos ---");
let partidosInsertados = 0;
let partidosOmitidos = 0;

partidos.forEach(function(partido) {
  const existe = db.partidos.findOne({
    equipo1: partido.equipo1,
    equipo2: partido.equipo2,
    fecha: partido.fecha
  });
  if (existe) {
    console.log("⊘ Partido " + partido.equipo1 + " vs " + partido.equipo2 + " (" + partido.fecha + ") ya existe, omitido");
    partidosOmitidos++;
  } else {
    db.partidos.insertOne(partido);
    console.log("✓ Partido insertado: " + partido.equipo1 + " vs " + partido.equipo2 + " (" + partido.fecha + ", " + partido.hora + ")");
    partidosInsertados++;
  }
});

console.log("  Insertados: " + partidosInsertados + ", Omitidos: " + partidosOmitidos);
console.log("");

// ============================================================================
// VALIDACIÓN FINAL
// ============================================================================

console.log("=== Validación Final ===");
const conteoEquipos = db.equipos.countDocuments();
const conteoJugadores = db.jugadores.countDocuments();
const conteoColombia = db.jugadores.countDocuments({ team: "Colombia" });
const conteoJapan = db.jugadores.countDocuments({ team: "Japan" });
const conteoPartidos = db.partidos.countDocuments();

console.log("Equipos totales: " + conteoEquipos + " (esperado: 2)");
console.log("Jugadores totales: " + conteoJugadores + " (esperado: 46)");
console.log("  - Colombia: " + conteoColombia + " (esperado: 23)");
console.log("  - Japan: " + conteoJapan + " (esperado: 23)");
console.log("Partidos totales: " + conteoPartidos + " (esperado: 2)");
console.log("");

// Validaciones específicas
const colombia = db.equipos.findOne({ id: 5 });
const japan = db.equipos.findOne({ id: 15 });
const james = db.jugadores.findOne({ team: "Colombia", numero: 10 });
const honda = db.jugadores.findOne({ team: "Japan", numero: 4 });
const partidoCJ = db.partidos.findOne({ equipo1: "Colombia", equipo2: "Japan" });
const partidoPC = db.partidos.findOne({ equipo1: "Poland", equipo2: "Colombia", fecha: "26/07/18" });

console.log("--- Validaciones Específicas ---");
console.log("Colombia id=5: " + (colombia ? "✓" : "✗"));
console.log("Japan id=15: " + (japan ? "✓" : "✗"));
console.log("James (Colombia #10): " + (james && james.nombreCamiseta === "JAMES" ? "✓" : "✗"));
console.log("Honda (Japan #4): " + (honda && honda.club === "CF Pachuca (MEX)" ? "✓" : "✗"));
console.log("Partido Colombia vs Japan (11/07/18): " + (partidoCJ ? "✓" : "✗"));
console.log("Partido Poland vs Colombia (26/07/18, hora inicial 6:00:00 p. m.): " + (partidoPC && partidoPC.hora === "6:00:00 p. m." ? "✓" : "✗"));
console.log("");

// Validación de estado
const todoOK = conteoEquipos === 2 && conteoJugadores === 46 && conteoColombia === 23 && conteoJapan === 23 && conteoPartidos === 2;

if (todoOK) {
  console.log("✓ R2 COMPLETADO: Datos insertados correctamente");
} else {
  console.log("✗ ERROR: Validación fallida");
  if (conteoEquipos !== 2) console.log("  - Equipos: esperado 2, obtenido " + conteoEquipos);
  if (conteoColombia !== 23) console.log("  - Colombia: esperado 23, obtenido " + conteoColombia);
  if (conteoJapan !== 23) console.log("  - Japan: esperado 23, obtenido " + conteoJapan);
  if (conteoPartidos !== 2) console.log("  - Partidos: esperado 2, obtenido " + conteoPartidos);
}
