/**
 * Raw palette swatches — the named colors behind the preset themes, as plain hex
 * strings grouped by palette. Use these when you need an individual color in JS/TS;
 * for whole-UI theming use `themePresets` + `data-palette` (see ./presets).
 *
 *     import { palettes } from 'liquidkit'
 *     palettes.amber.flameAmber // '#F78358'
 *
 * The matching CSS custom properties ship in the opt-in `liquidkit/palettes.css`
 * as `--lk-<palette>-<swatch>` (e.g. `--lk-amber-flame-amber`). Keys never repeat
 * the palette name: `amber-taupe` is `palettes.amber.taupe`.
 *
 * Aurora merges three source groups (Ice · Forest · Borealis) into one palette.
 */
export const palettes = {
  aurora: {
    teal: '#397979',
    polarMint: '#8CC1B7',
    iceBlue: '#3D6678',
    arcticBlueWhite: '#97B3C1',
    arcticWhite: '#EDECE8',
    softVioletNavy: '#1E2639',
    forest: '#053931',
    aquamarineIce: '#CBEFEB',
    tealMint: '#48A89A',
    deepAuroraTeal: '#00524D',
    midnightGreen: '#072928',
    polarNight1: '#182830',
    polarNight2: '#204050',
    polarNight3: '#285868',
    blueTeal: '#308890',
    glacierBlue: '#5888A0',
    frostCyan: '#70B8C8',
  },
  indigo: {
    voidIndigo: '#00002A',
    polarNight: '#000F22',
    deepMidnight: '#0A1931',
    navyIndigo: '#1B3554',
    deepArcticBlue: '#1A3D63',
    classicIndigoBlue: '#1A3F75',
    stormIndigo: '#2E3E6D',
    mutedRoyalIndigo: '#495589',
    glacierDenim: '#3F6593',
    slateAuroraBlue: '#4E6A9C',
    auroraSteelBlue: '#4A7FA7',
    iceFjordBlue: '#5B86B6',
    auroraCyanBlue: '#4EA4CC',
    softPeriwinkleIndigo: '#7087BB',
    arcticBlue: '#80AAD3',
    mistIndigo: '#A2B7E4',
    palePolarBlue: '#B3CFE5',
    powderIndigo: '#BBD0ED',
    iceGlow: '#C0E6FD',
    frostedCloud: '#E5EDFA',
    snowWhiteBlue: '#F6FAFD',
  },
  orchid: {
    deepNightOrchid: '#1C0C38',
    shadowPlum: '#312A44',
    wine: '#87003E',
    royalOrchid: '#4D3A6B',
    deepVioletOrchid: '#4B3F6E',
    mutedLavenderIndigo: '#6C5F8D',
    dustyOrchid: '#745F8D',
    softMauveOrchid: '#A08AB7',
    lavenderBloom: '#9C8CB9',
    mist: '#BAB0C8',
    paleLilacOrchid: '#CDC2E5',
    blushOrchid: '#D7C5D2',
    frostedLavender: '#DAD4DF',
    warmOrchidGray: '#DCD7D5',
  },
  amber: {
    carbonEmber: '#0C1519',
    midnightCharcoal: '#131D26',
    deepBlueCharcoal: '#162127',
    darkSlateNavy: '#1B2632',
    burntEmberBrown: '#482420',
    smokedUmber: '#3A3534',
    ironBlueGray: '#2C3B4D',
    ashGray: '#414143',
    roastedCopper: '#724B39',
    burntSienna: '#A35139',
    emberClay: '#B24D37',
    taupe: '#9B7252',
    flameAmber: '#F78358',
    softCopperTan: '#CF9D7B',
    goldenCopper: '#ED9E51',
    apricotAmber: '#F59C6A',
    warmHoney: '#FFB162',
    sandstoneGray: '#C9C1B1',
    paleAmber: '#FEBF7C',
    butterscotch: '#FEC579',
    warmIvory: '#EEE9DF',
    cream: '#FFEEB0',
  },
  glacier: {
    deepGlacierTeal: '#014F61',
    polarDepth: '#0D5C75',
    arcticFjord: '#2C6A74',
    auroraVioletAccent: '#B908E1',
    slateBlue: '#447F98',
    icyTeal: '#0592A2',
    frozenAqua: '#199FB1',
    blueIce: '#629BB5',
    frostedTeal: '#5DA9B0',
    brightGlacierCyan: '#7BD6E8',
    mistBlue: '#A5D1E1',
    electricIce: '#06EBF3',
    paleGlacier: '#BADEE1',
    seaIceMist: '#ABE3E0',
    frozenSky: '#B6EBF7',
    iceFog: '#D0EFEF',
    snowcapWhite: '#F2F7FB',
  },
  rose: {
    darkCherryRose: '#3A071F',
    noirRose: '#161722',
    wineRose: '#6F1F3B',
    smokyMauve: '#604D53',
    deepRaspberryRose: '#9D3C51',
    dustyRose: '#B66A7C',
    petal: '#DF7C8C',
    mauvePink: '#DB7F8E',
    coolRoseGray: '#9DA3A4',
    antiqueRose: '#D0A6B3',
    softOrchidRose: '#E2A6BA',
    vintageBlush: '#DDBBC5',
    mutedRoseMist: '#D5C5C8',
    blushPink: '#FFDBDA',
    lavenderRoseWhite: '#FFF0F5',
  },
} as const

/** Built-in palette names (`'aurora' | 'indigo' | …`). */
export type PaletteName = keyof typeof palettes

/** A map of swatch name → hex for one palette. */
export type Palette = (typeof palettes)[PaletteName]
