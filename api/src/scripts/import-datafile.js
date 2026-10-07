import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import mongoose from 'mongoose';

const { Workbook } = ExcelJS;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '../../..');

// Helpers for date/time conversion
function formatMatchDate(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new Error(`Fecha de partido invalida: ${value}`);
  }

  const day = String(value.getUTCDate()).padStart(2, '0');
  const month = String(value.getUTCMonth() + 1).padStart(2, '0');
  const year = String(value.getUTCFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
}

function formatMatchTime(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new Error(`Hora de partido invalida: ${value}`);
  }

  const hours24 = value.getUTCHours();
  const minutes = value.getUTCMinutes();
  const seconds = value.getUTCSeconds();

  const period = hours24 >= 12 ? 'p. m.' : 'a. m.';
  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`;
}

// Validate date format DD.MM.YYYY
function isValidFechaNacimiento(fecha) {
  if (typeof fecha !== 'string') return false;
  return /^\d{2}\.\d{2}\.\d{4}$/.test(fecha);
}

// Team name aliases for Matchs sheet
const MATCH_TEAM_ALIASES = {
  'Iran': 'IR Iran'
};

function normalizeMatchTeam(value) {
  const team = String(value).trim();
  return MATCH_TEAM_ALIASES[team] ?? team;
}

// Main import function
async function importDatafile(mode) {
  console.log('\n' + '='.repeat(70));
  console.log('DATAFILE IMPORT - ' + mode.toUpperCase());
  console.log('='.repeat(70));

  const excelPath = resolve(PROJECT_ROOT, 'data/source/Datafile.xlsx');
  const workbook = new Workbook();
  await workbook.xlsx.readFile(excelPath);

  console.log(`\nSource: ${excelPath}\n`);

  // Read Teams
  const teamsSheet = workbook.getWorksheet('Teams');
  const teams = [];
  teamsSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header
    const id = row.getCell(1).value;
    const abbreviation = row.getCell(2).value;
    const country = row.getCell(3).value;
    const confederation = row.getCell(4).value;

    if (id && abbreviation && country && confederation) {
      teams.push({
        id: Number(id),
        abbreviation: String(abbreviation).trim().toLowerCase(),
        country: String(country).trim(),
        confederation: String(confederation).trim().toUpperCase()
      });
    }
  });

  console.log(`Teams: ${teams.length} OK`);

  // Read Players
  const playersSheet = workbook.getWorksheet('Players');
  const players = [];
  playersSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header
    const team = row.getCell(1).value;
    const numero = row.getCell(2).value;
    const posicion = row.getCell(3).value;
    const nombre = row.getCell(4).value;
    const fechaNacimiento = row.getCell(5).value;
    const nombreCamiseta = row.getCell(6).value;
    const club = row.getCell(7).value;
    const estatura = row.getCell(8).value;
    const peso = row.getCell(9).value;

    if (team && numero && posicion && nombre && fechaNacimiento && nombreCamiseta && club && estatura && peso) {
      players.push({
        team: String(team).trim(),
        numero: Number(numero),
        posicion: String(posicion).trim().toUpperCase(),
        nombre: String(nombre).trim(),
        fechaNacimiento: String(fechaNacimiento).trim(),
        nombreCamiseta: String(nombreCamiseta).trim(),
        club: String(club).trim(),
        estatura: Number(estatura),
        peso: Number(peso)
      });
    }
  });

  console.log(`Players: ${players.length} OK`);

  // Read Matchs (use columns 2-5 for Team 1, Team 2, Date, Time)
  const matchsSheet = workbook.getWorksheet('Matchs');
  const matchs = [];
  matchsSheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header
    const equipo1 = row.getCell(2).value;
    const equipo2 = row.getCell(3).value;
    const fecha = row.getCell(4).value;
    const hora = row.getCell(5).value;

    if (equipo1 && equipo2 && fecha && hora) {
      matchs.push({
        equipo1: normalizeMatchTeam(equipo1),
        equipo2: normalizeMatchTeam(equipo2),
        fecha: formatMatchDate(fecha),
        hora: formatMatchTime(hora)
      });
    }
  });

  console.log(`Matchs: ${matchs.length} OK\n`);

  // Validation: players per team
  const playerCountByTeam = {};
  players.forEach(p => {
    playerCountByTeam[p.team] = (playerCountByTeam[p.team] || 0) + 1;
  });

  const expectedPerTeam = 23;
  const validPlayerCounts = Object.values(playerCountByTeam).every(count => count === expectedPerTeam);
  console.log(`Players per team: ${validPlayerCounts ? expectedPerTeam + ' each OK' : 'INVALID'}`);

  // Cross-reference validations
  const teamCountries = new Set(teams.map(t => t.country));
  const playersTeams = new Set(players.map(p => p.team));
  const matchsTeams = new Set();
  matchs.forEach(m => {
    matchsTeams.add(m.equipo1);
    matchsTeams.add(m.equipo2);
  });

  const playersValid = Array.from(playersTeams).every(t => teamCountries.has(t));
  const matchsValid = Array.from(matchsTeams).every(t => teamCountries.has(t));

  if (!matchsValid) {
    const missingTeams = Array.from(matchsTeams).filter(t => !teamCountries.has(t));
    console.log('\nMissing match teams:');
    missingTeams.forEach(t => console.log(`  "${t}"`));
  }

  console.log(`\nReferences:`);
  console.log(`  Players → Teams: ${playersValid ? 'OK' : 'INVALID'}`);
  console.log(`  Matchs → Teams: ${matchsValid ? 'OK' : 'INVALID'}`);

  // Uniqueness validations
  const teamIds = teams.map(t => t.id);
  const teamAbbrs = teams.map(t => t.abbreviation);
  const teamCountries2 = teams.map(t => t.country);
  const playerTeamNum = players.map(p => `${p.team}#${p.numero}`);
  const matchsSemantic = matchs.map(m => {
    const pair = [m.equipo1, m.equipo2].sort();
    return `${pair[0]}|${pair[1]}|${m.fecha}|${m.hora}`;
  });

  const teamIdsDup = new Set(teamIds).size !== teamIds.length;
  const teamAbbrsDup = new Set(teamAbbrs).size !== teamAbbrs.length;
  const teamCountriesDup = new Set(teamCountries2).size !== teamCountries2.length;
  const playerTeamNumDup = new Set(playerTeamNum).size !== playerTeamNum.length;
  const matchsSemanticDup = new Set(matchsSemantic).size !== matchsSemantic.length;

  console.log(`\nDuplicates:`);
  console.log(`  Teams IDs: ${teamIdsDup ? 'DUPLICATES FOUND' : '0'}`);
  console.log(`  Teams abbreviations: ${teamAbbrsDup ? 'DUPLICATES FOUND' : '0'}`);
  console.log(`  Teams countries: ${teamCountriesDup ? 'DUPLICATES FOUND' : '0'}`);
  console.log(`  Players team+numero: ${playerTeamNumDup ? 'DUPLICATES FOUND' : '0'}`);
  console.log(`  Matchs semantic: ${matchsSemanticDup ? 'DUPLICATES FOUND' : '0'}`);

  // Player statistics
  const heights = players.map(p => p.estatura).sort((a, b) => a - b);
  const weights = players.map(p => p.peso).sort((a, b) => a - b);
  const posiciones = new Set(players.map(p => p.posicion));

  console.log(`\nPlayer Height:`);
  console.log(`  ${heights[0]} - ${heights[heights.length - 1]}`);

  console.log(`\nPlayer Weight:`);
  console.log(`  ${weights[0]} - ${weights[weights.length - 1]}`);

  console.log(`\nPositions:`);
  console.log(`  ${Array.from(posiciones).sort().join(', ')}`);

  // Transform samples
  console.log(`\nTransform samples:\n`);

  const sampleTeam = teams.find(t => t.country === 'Colombia');
  console.log(`Equipo Colombia:`);
  console.log(`  ${JSON.stringify(sampleTeam, null, 2).split('\n').join('\n  ')}`);

  const samplePlayer = players.find(p => p.nombre && p.nombre.includes('OSPINA'));
  if (samplePlayer) {
    console.log(`\nJugador OSPINA:`);
    console.log(`  team: ${samplePlayer.team}`);
    console.log(`  numero: ${samplePlayer.numero}`);
    console.log(`  nombre: ${samplePlayer.nombre}`);
    console.log(`  fechaNacimiento: ${samplePlayer.fechaNacimiento}`);
    console.log(`  posicion: ${samplePlayer.posicion}`);
  }

  const sampleMatchCJ = matchs.find(m => (m.equipo1 === 'Colombia' && m.equipo2 === 'Japan') || (m.equipo1 === 'Japan' && m.equipo2 === 'Colombia'));
  if (sampleMatchCJ) {
    console.log(`\nPartido Colombia vs Japan:`);
    console.log(`  equipo1: ${sampleMatchCJ.equipo1}`);
    console.log(`  equipo2: ${sampleMatchCJ.equipo2}`);
    console.log(`  fecha: ${sampleMatchCJ.fecha}`);
    console.log(`  hora: ${sampleMatchCJ.hora}`);
  }

  const sampleMatchPC = matchs.find(m => (m.equipo1 === 'Poland' && m.equipo2 === 'Colombia') || (m.equipo1 === 'Colombia' && m.equipo2 === 'Poland'));
  if (sampleMatchPC) {
    console.log(`\nPartido Poland vs Colombia:`);
    console.log(`  equipo1: ${sampleMatchPC.equipo1}`);
    console.log(`  equipo2: ${sampleMatchPC.equipo2}`);
    console.log(`  fecha: ${sampleMatchPC.fecha}`);
    console.log(`  hora: ${sampleMatchPC.hora}`);
  }

  // Validation summary
  const allValid = playersValid && matchsValid && validPlayerCounts && !teamIdsDup && !playerTeamNumDup && !matchsSemanticDup;
  const dateFormatValid = players.every(p => isValidFechaNacimiento(p.fechaNacimiento));
  const matchDateFormatValid = matchs.every(m => /^\d{2}\/\d{2}\/\d{2}$/.test(m.fecha));
  const matchTimeFormatValid = matchs.every(m => /^(\d{1,2}):(\d{2}):(\d{2}) (a|p)\. m\.$/.test(m.hora));

  if (!allValid || !dateFormatValid || !matchDateFormatValid || !matchTimeFormatValid) {
    console.log(`\n${'='.repeat(70)}`);
    console.log('DRY RUN FAILED - VALIDATION ERRORS');
    console.log('='.repeat(70));
    console.log(`Date format valid: ${dateFormatValid}`);
    console.log(`Match date format valid: ${matchDateFormatValid}`);
    console.log(`Match time format valid: ${matchTimeFormatValid}`);
    process.exit(1);
  }

  console.log(`\n${'='.repeat(70)}`);
  console.log('DRY RUN SUCCESS');
  console.log('NO DATABASE CHANGES');
  console.log('='.repeat(70) + '\n');

  return { teams, players, matchs };
}

// Write mode (do NOT execute in this phase)
async function writeDatafile(teams, players, matchs) {
  const mongoFullUri = process.env.MONGODB_FULL_URI;

  if (!mongoFullUri) {
    console.error('\nERROR: MONGODB_FULL_URI environment variable is required for import mode.');
    process.exit(1);
  }

  // Parse database name from URI
  const dbNameMatch = mongoFullUri.match(/\/([^?/]+)(\?|$)/);
  const dbName = dbNameMatch ? dbNameMatch[1] : null;

  if (dbName !== 'mundial2018_full') {
    console.error(`\nERROR: Target database must be EXACTLY 'mundial2018_full', not '${dbName}'.`);
    process.exit(1);
  }

  console.log(`\nTARGET DATABASE: ${dbName}`);
  console.log(`\nConnecting to ${mongoFullUri}...`);

  const connection = await mongoose.createConnection(mongoFullUri).asPromise();

  try {
    const equiposCol = connection.collection('equipos');
    const jugadoresCol = connection.collection('jugadores');
    const partidosCol = connection.collection('partidos');

    console.log('Clearing collections...');
    await equiposCol.deleteMany({});
    await jugadoresCol.deleteMany({});
    await partidosCol.deleteMany({});

    console.log('Inserting data...');
    await equiposCol.insertMany(teams);
    await jugadoresCol.insertMany(players);
    await partidosCol.insertMany(matchs);

    const equiposCount = await equiposCol.countDocuments();
    const jugadoresCount = await jugadoresCol.countDocuments();
    const partidosCount = await partidosCol.countDocuments();

    console.log(`\nFinal counts:`);
    console.log(`  equipos: ${equiposCount}`);
    console.log(`  jugadores: ${jugadoresCount}`);
    console.log(`  partidos: ${partidosCount}`);

    if (equiposCount !== 32 || jugadoresCount !== 736 || partidosCount !== 60) {
      throw new Error('Final counts do not match expected values');
    }

    console.log('\nImport completed successfully!');
  } finally {
    await connection.close();
  }
}

// Main entry point
const mode = process.argv[2];

if (!mode || (mode !== '--dry-run' && mode !== '--write')) {
  console.log('\nUsage:');
  console.log('  node src/scripts/import-datafile.js --dry-run   (validate without writing)');
  console.log('  node src/scripts/import-datafile.js --write     (validate and import to mundial2018_full)');
  process.exit(0);
}

try {
  const result = await importDatafile(mode === '--dry-run' ? 'dry-run' : 'write mode');

  if (mode === '--write') {
    await writeDatafile(result.teams, result.players, result.matchs);
  }
} catch (error) {
  console.error('\nERROR:', error.message);
  process.exit(1);
}
