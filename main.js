// =============================================================
// SIMULASI KENAIKAN MUKA AIR LAUT & PENURUNAN TANAH
// Area Kajian: Kota Semarang, Indonesia
// Platform   : Google Earth Engine (GEE)
// Demo       : https://code.earthengine.google.com/87ca49c9208ed13d499d3347521b7e36
// =============================================================


// ─────────────────────────────────────────────
// 1. TENTUKAN AREA KAJIAN
// ─────────────────────────────────────────────
var semarang = ee.Geometry.Polygon(
  [[[110.32, -7.07],
    [110.51, -7.07],
    [110.51, -6.89],
    [110.32, -6.89],
    [110.32, -7.07]]]);

Map.centerObject(semarang, 11);


// ─────────────────────────────────────────────
// 2. DATA DASAR: ELEVASI (NASA NASADEM)
// ─────────────────────────────────────────────
var elevation    = ee.Image('NASA/NASADEM_HGT/001').select('elevation');
var land         = elevation.gt(0).clip(semarang);
var landElevation = elevation.updateMask(land);


// ─────────────────────────────────────────────
// 3. VISUALISASI ELEVASI (HILLSHADE + DEM)
// ─────────────────────────────────────────────
var hillshade = ee.Terrain.hillshade(landElevation.multiply(10)).visualize();

var elevationVisualized = landElevation.visualize({
  min: 0,
  max: 500,
  palette: ['#006400', '#FFD700', '#A0522D', '#FFFFFF'],
  opacity: 0.6
});

var combined = hillshade.blend(elevationVisualized);
Map.addLayer(combined, {}, 'Elevasi');


// ─────────────────────────────────────────────
// 4. PENGATURAN AWAL SIMULASI
// ─────────────────────────────────────────────
var baseYear       = 2025;
var baseRise       = 13;  // Kenaikan muka air laut awal (mm/tahun)
var baseSubsidence = 5;   // Penurunan tanah awal (cm/tahun)

// Render layer simulasi dengan nilai default
seaRise(baseRise, baseSubsidence, baseYear);


// ─────────────────────────────────────────────
// 5. USER INTERFACE (UI)
// ─────────────────────────────────────────────
var panel = ui.Panel([], ui.Panel.Layout.flow('vertical'), {
  width: '350px',
  padding: '1%'
});
ui.root.add(panel);

// --- Judul ---
var title = ui.Label(
  'Simulasi Kenaikan Muka Air Laut & Penurunan Tanah Semarang', {
  color      : 'blue',
  fontSize   : '20px',
  fontWeight : 'bold',
  textAlign  : 'center',
  stretch    : 'horizontal'
});
panel.add(title);

// --- Slider: Kenaikan Muka Air Laut (mm/tahun) ---
panel.add(ui.Label('Kenaikan Muka Air Laut (mm/tahun)', { stretch: 'horizontal' }));

var seaRiseSlider = ui.Slider(0, 2000, baseRise, 1,
  function(mm) {
    seaRise(mm, subsidenceSlider.getValue(), yearSlider.getValue());
  },
  'horizontal', false, { stretch: 'horizontal' }
);
panel.add(seaRiseSlider);

// --- Slider: Penurunan Tanah (cm/tahun) ---
panel.add(ui.Label('Penurunan Tanah (cm/tahun)', { stretch: 'horizontal' }));

var subsidenceSlider = ui.Slider(0, 2000, baseSubsidence, 1,
  function(cm) {
    seaRise(seaRiseSlider.getValue(), cm, yearSlider.getValue());
  },
  'horizontal', false, { stretch: 'horizontal' }
);
panel.add(subsidenceSlider);

// --- Slider: Tahun ---
panel.add(ui.Label('Tahun', { stretch: 'horizontal' }));

var yearSlider = ui.Slider(2025, 2125, baseYear, 1,
  function(year) {
    seaRise(seaRiseSlider.getValue(), subsidenceSlider.getValue(), year);
  },
  'horizontal', false, { stretch: 'horizontal' }
);
panel.add(yearSlider);


// ─────────────────────────────────────────────
// 6. FUNGSI UTAMA: SIMULASI GENANGAN
// ─────────────────────────────────────────────
/**
 * Memvisualisasikan area yang berpotensi tergenang berdasarkan
 * kenaikan muka air laut (mm/tahun), penurunan tanah (cm/tahun),
 * dan tahun proyeksi.
 *
 * @param {number} mm   - Laju kenaikan muka air laut dalam mm/tahun
 * @param {number} cm   - Laju penurunan tanah dalam cm/tahun
 * @param {number} year - Tahun proyeksi (2025–2125)
 */
function seaRise(mm, cm, year) {
  var timeSpan        = year - 2025;
  var totalRise       = (mm / 1000) * timeSpan;  // konversi mm → m
  var totalSubsidence = (cm / 100)  * timeSpan;  // konversi cm → m
  var totalEffect     = totalRise + totalSubsidence;

  var drown = landElevation.lte(totalEffect).selfMask();

  var layer = ui.Map.Layer(drown, {
    palette : 'blue',
    opacity : 0.6
  }, 'Area Tergenang ' + totalEffect.toFixed(2) + ' m pada ' + year);

  Map.layers().set(1, layer);
}


// ─────────────────────────────────────────────
// 7. LEGENDA
// ─────────────────────────────────────────────

// Legenda Elevasi
var legendElevation = ui.Panel([], ui.Panel.Layout.flow('vertical'), {
  position: 'bottom-left'
});
Map.add(legendElevation);
legendPanel('Elevasi (m)', {
  min     : 0,
  max     : 2000,
  palette : ['#006400', '#FFD700', '#A0522D', '#FFFFFF'],
  opacity : 0.8
}, legendElevation);

// Legenda Area Tergenang
var drownLegend = ui.Panel([
    ui.Label('', {
      height          : '20px',
      width           : '30px',
      backgroundColor : 'blue'
    }),
    ui.Label('Area Tergenang', { height: '20px' })
  ],
  ui.Panel.Layout.flow('horizontal'), {
    position: 'bottom-left'
  }
);
Map.add(drownLegend);

/**
 * Membuat panel legenda bergradasi untuk layer raster.
 *
 * @param {string} title  - Judul legenda
 * @param {Object} visual - Parameter visualisasi (min, max, palette, opacity)
 * @param {ui.Panel} legend - Panel target untuk diisi legenda
 * @returns {ui.Panel}
 */
function legendPanel(title, visual, legend) {
  legend.add(ui.Label({
    value: title,
    style: {
      fontWeight : 'bold',
      fontSize   : '15px',
      textAlign  : 'center',
      stretch    : 'horizontal'
    }
  }));

  var lon      = ee.Image.pixelLonLat().select('latitude');
  var gradient = lon.multiply((visual.max - visual.min) / 100.0).add(visual.min);
  var legendImage = gradient.visualize(visual);

  legend.add(ui.Label({
    value: visual.max,
    style: { textAlign: 'center', stretch: 'horizontal' }
  }));

  legend.add(ui.Thumbnail({
    image  : legendImage,
    params : { bbox: '0,0,10,100', dimensions: '10x50' },
    style  : { textAlign: 'center', stretch: 'horizontal', height: '150px' }
  }));

  legend.add(ui.Label({
    value: visual.min,
    style: { textAlign: 'center', stretch: 'horizontal' }
  }));

  return legend;
}
