/* ============================================
   CYBER//RADIO v2 — Functions
   ============================================
   
   Solo audio streams. Sin YouTube. Funciona
   abriendo index.html directo con doble-click.
   
   ▸ Para agregar canales, añadí un objeto al
     array STATIONS más abajo dentro del grupo
     correspondiente, o creá un grupo nuevo.
   ============================================ */

// ─────────────────────────────────────────────
// CONFIGURACIÓN DE CANALES
// Organizados por género/categoría.
// Cada estación necesita: url, name, tag
// ─────────────────────────────────────────────

const STATION_GROUPS = [
    {
        label: 'SYNTHWAVE / RETROWAVE',
        stations: [
            {
                url: 'https://stream.nightride.fm/nightride.mp3',
                name: 'Nightride FM',
                tag: 'synthwave & retrowave · 320kbps',
            },
            {
                url: 'https://stream.nightride.fm/spacesynth.mp3',
                name: 'Nightride FM — Spacesynth',
                tag: 'spacesynth & italo disco · 320kbps',
            },
            {
                url: 'http://stream.laut.fm/synthwave',
                name: 'Synthwave FM',
                tag: 'synthwave & outrun',
            },
            {
                url: 'http://85.234.59.191:8000/stream',
                name: 'Retrowave One',
                tag: 'retrowave & sovietwave · 190kbps',
            },
        ],
    },
    {
        label: 'CHILLSYNTH / CHILLWAVE',
        stations: [
            {
                url: 'https://stream.nightride.fm/chillsynth.mp3',
                name: 'Nightride FM — Chillsynth',
                tag: 'chillsynth & chillwave · 320kbps',
            },
            {
                url: 'https://streams.ilovemusic.de/iloveradio17.mp3',
                name: 'I Love Chill',
                tag: 'chillout & downtempo',
            },
            {
                url: 'http://stream.laut.fm/loungeradio',
                name: 'Lounge Radio',
                tag: 'lounge · ambient · deep house',
            },
        ],
    },
    {
        label: 'DARKSYNTH / CYBERPUNK',
        stations: [
            {
                url: 'https://stream.nightride.fm/darksynth.mp3',
                name: 'Nightride FM — Darksynth',
                tag: 'darksynth & cyberpunk · 320kbps',
            },
            {
                url: 'https://stream.nightride.fm/horrorsynth.mp3',
                name: 'Nightride FM — Horrorsynth',
                tag: 'horrorsynth & dark electronic · 320kbps',
            },
            {
                url: 'https://stream.nightride.fm/ebsm.mp3',
                name: 'Nightride FM — EBSM',
                tag: 'EBM & industrial · 320kbps',
            },
        ],
    },
    {
        label: 'VAPORWAVE / FUTUREWAVE',
        stations: [
            {
                url: 'https://plaza.one/mp3',
                name: 'Nightwave Plaza',
                tag: 'vaporwave & future funk · 128kbps',
            },
            {
                url: 'https://stream.nightride.fm/datawave.mp3',
                name: 'Nightride FM — Datawave',
                tag: 'experimental & ambient · 320kbps',
            },
        ],
    },
    {
        label: 'LOFI / CHILLHOP',
        stations: [
            {
                url: 'http://stream.laut.fm/lofi',
                name: 'Lofi Radio (laut.fm)',
                tag: 'lofi hip hop & chill beats',
            },
            {
                url: 'http://198.245.60.88:8080/stream',
                name: 'Planet LoFi',
                tag: 'lofi beats · 256kbps',
            },
            {
                url: 'http://stream.radioparadise.com/mellow-192',
                name: 'Radio Paradise — Mellow',
                tag: 'mellow mix · eclectic chill · 192kbps',
            },
        ],
    },
    {
        label: 'HOUSE / DEEP HOUSE',
        stations: [
            {
                url: 'http://stream.laut.fm/deep-house-sounds',
                name: 'Deep House Sounds',
                tag: 'deep house · tech house · beach house',
            },
            {
                url: 'https://streams.ilovemusic.de/iloveradio2.mp3',
                name: 'I Love Dance',
                tag: 'dance & electronic',
            },
            {
                url: 'http://stream.laut.fm/house',
                name: 'House Radio (laut.fm)',
                tag: 'house music',
            },
            {
                url: 'http://listen.housetime.fm/tunein-aac-hd',
                name: 'HouseTime FM',
                tag: 'house · deep house · tech house',
            },
        ],
    },
    {
        label: 'ELECTRONIC / BASS',
        stations: [
            {
                url: 'https://stream.nightride.fm/rekt.mp3',
                name: 'Nightride FM — Rekt',
                tag: 'bass · DnB · electronic · 320kbps',
            },
            {
                url: 'http://stream.dancewave.online:8080/dance.mp3',
                name: 'Dancewave Retro',
                tag: 'retro dance & electronic',
            },
            {
                url: 'http://listen.radiogora.ru:8000/electro320',
                name: 'Gora Electro',
                tag: 'electro · techno · 320kbps',
            },
        ],
    },
    // ──── AGREGÁ MÁS GRUPOS O ESTACIONES ACÁ ────
    // {
    //     label: 'MI GRUPO',
    //     stations: [
    //         {
    //             url: 'https://stream.example.com/radio.mp3',
    //             name: 'Mi Radio',
    //             tag: 'descripción breve',
    //         },
    //     ],
    // },
];


// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
let flatStations = [];   // Flattened list of all stations
let currentIndex = -1;
let isPlaying = false;
let isMuted = false;

// DOM refs
const audioPlayer    = document.getElementById('audioPlayer');
const channelName    = document.getElementById('channelName');
const stationDisplay = document.getElementById('stationDisplay');
const genreDisplay   = document.getElementById('genreDisplay');
const playerScreen   = document.getElementById('playerScreen');
const channelGroups  = document.getElementById('channelGroups');
const channelCount   = document.getElementById('channelCount');
const btnPrev        = document.getElementById('btnPrev');
const btnNext        = document.getElementById('btnNext');
const btnPlay        = document.getElementById('btnPlay');
const btnMute        = document.getElementById('btnMute');
const volumeSlider   = document.getElementById('volumeSlider');
const menuToggle     = document.getElementById('menuToggle');
const sidebar        = document.getElementById('channelsSidebar');
const liveDot        = document.getElementById('liveDot');
const liveText       = document.getElementById('liveText');
const vizCanvas      = document.getElementById('vizCanvas');

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    buildFlatList();
    renderChannels();
    setupControls();
    setupVisualizer();
    setFooterYear();
    audioPlayer.volume = volumeSlider.value / 100;
});

function setFooterYear() {
    const el = document.querySelector('.footer__year');
    if (el) el.textContent = new Date().getFullYear();
}

// ─────────────────────────────────────────────
// BUILD FLAT LIST (for prev/next navigation)
// ─────────────────────────────────────────────
function buildFlatList() {
    flatStations = [];
    STATION_GROUPS.forEach((group, gi) => {
        group.stations.forEach((st, si) => {
            flatStations.push({ ...st, groupIndex: gi, stationIndex: si, groupLabel: group.label });
        });
    });
}

// ─────────────────────────────────────────────
// RENDER CHANNELS SIDEBAR
// ─────────────────────────────────────────────
function renderChannels() {
    channelGroups.innerHTML = '';
    let total = 0;

    STATION_GROUPS.forEach((group, gi) => {
        const div = document.createElement('div');
        div.className = 'channels__group';

        const label = document.createElement('h3');
        label.className = 'channels__group-label';
        label.textContent = group.label;
        div.appendChild(label);

        const ul = document.createElement('ul');
        ul.className = 'channels__list';

        group.stations.forEach((st, si) => {
            const flatIdx = flatStations.findIndex(
                f => f.groupIndex === gi && f.stationIndex === si
            );
            const li = document.createElement('li');
            li.className = 'channel-item';
            li.dataset.flatIndex = flatIdx;
            li.innerHTML = `
                <span class="channel-item__indicator"></span>
                <div class="channel-item__info">
                    <div class="channel-item__name">${esc(st.name)}</div>
                    <div class="channel-item__tag">${esc(st.tag)}</div>
                </div>
            `;
            li.addEventListener('click', () => selectStation(flatIdx));
            ul.appendChild(li);
            total++;
        });

        div.appendChild(ul);
        channelGroups.appendChild(div);
    });

    channelCount.textContent = total;
}

// ─────────────────────────────────────────────
// STATION SELECTION & PLAYBACK
// ─────────────────────────────────────────────
function selectStation(flatIdx) {
    const station = flatStations[flatIdx];
    if (!station) return;

    // Deselect previous
    document.querySelectorAll('.channel-item.active').forEach(el => {
        el.classList.remove('active');
        const eq = el.querySelector('.equalizer');
        if (eq) eq.remove();
    });

    currentIndex = flatIdx;

    // Mark active
    const activeEl = document.querySelector(`.channel-item[data-flat-index="${flatIdx}"]`);
    if (activeEl) {
        activeEl.classList.add('active');
        addEqualizer(activeEl);
    }

    // Update display
    channelName.textContent = station.name;
    stationDisplay.textContent = station.name;
    genreDisplay.textContent = station.groupLabel;
    playerScreen.classList.add('active');

    // Play audio
    audioPlayer.src = station.url;
    audioPlayer.play().then(() => {
        setPlayingState(true);
    }).catch(err => {
        console.warn('Playback failed:', err);
        setPlayingState(false);
    });

    // Close mobile menu
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        menuToggle.classList.remove('active');
    }
}

function addEqualizer(el) {
    // Remove any existing eq first
    const old = el.querySelector('.equalizer');
    if (old) old.remove();

    const eq = document.createElement('div');
    eq.className = 'equalizer';
    eq.innerHTML = `<div class="equalizer__bar"></div><div class="equalizer__bar"></div><div class="equalizer__bar"></div><div class="equalizer__bar"></div>`;
    el.appendChild(eq);
}

function setPlayingState(playing) {
    isPlaying = playing;
    btnPlay.textContent = playing ? '❚❚' : '▶';
    btnPlay.classList.toggle('playing', playing);
    liveDot.classList.toggle('active', playing);
    liveText.classList.toggle('active', playing);
    liveText.textContent = playing ? 'LIVE SIGNAL' : 'OFFLINE';
}

// ─────────────────────────────────────────────
// CONTROLS
// ─────────────────────────────────────────────
function setupControls() {
    btnPrev.addEventListener('click', () => navigate(-1));
    btnNext.addEventListener('click', () => navigate(1));
    btnPlay.addEventListener('click', togglePlayPause);
    btnMute.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', (e) => {
        audioPlayer.volume = e.target.value / 100;
        if (isMuted && e.target.value > 0) {
            isMuted = false;
            audioPlayer.muted = false;
            btnMute.classList.remove('muted');
            btnMute.textContent = '◉';
        }
    });
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    // Audio events
    audioPlayer.addEventListener('playing', () => setPlayingState(true));
    audioPlayer.addEventListener('pause', () => setPlayingState(false));
    audioPlayer.addEventListener('error', () => setPlayingState(false));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        switch (e.key) {
            case 'ArrowLeft':  navigate(-1); break;
            case 'ArrowRight': navigate(1); break;
            case ' ':          e.preventDefault(); togglePlayPause(); break;
            case 'm':          toggleMute(); break;
        }
    });
}

function navigate(dir) {
    if (flatStations.length === 0) return;
    let idx = currentIndex;
    if (idx === -1) {
        idx = dir === 1 ? 0 : flatStations.length - 1;
    } else {
        idx = (idx + dir + flatStations.length) % flatStations.length;
    }
    selectStation(idx);
}

function togglePlayPause() {
    if (currentIndex === -1) { navigate(1); return; }
    if (isPlaying) {
        audioPlayer.pause();
    } else {
        audioPlayer.play().catch(() => {});
    }
}

function toggleMute() {
    isMuted = !isMuted;
    audioPlayer.muted = isMuted;
    btnMute.classList.toggle('muted', isMuted);
    btnMute.textContent = isMuted ? '○' : '◉';
}

// ─────────────────────────────────────────────
// CANVAS VISUALIZER (no AudioContext needed)
// Simple animated bars / wave that reacts to
// the playing state.
// ─────────────────────────────────────────────
let vizRAF = null;

function setupVisualizer() {
    const ctx = vizCanvas.getContext('2d');
    const bars = 64;
    const barData = new Array(bars).fill(0);

    function resize() {
        vizCanvas.width = vizCanvas.offsetWidth * (window.devicePixelRatio || 1);
        vizCanvas.height = vizCanvas.offsetHeight * (window.devicePixelRatio || 1);
    }
    resize();
    window.addEventListener('resize', resize);

    function draw() {
        vizRAF = requestAnimationFrame(draw);

        const W = vizCanvas.width;
        const H = vizCanvas.height;
        ctx.clearRect(0, 0, W, H);

        // Dark gradient background
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#0a0a12');
        bg.addColorStop(1, '#05050a');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        const barW = W / bars;
        const time = Date.now() / 1000;

        for (let i = 0; i < bars; i++) {
            // Target height: animated sine wave when playing, flat when not
            let target;
            if (isPlaying) {
                target = 0.15 + 0.35 * Math.sin(time * 2 + i * 0.3)
                       + 0.2 * Math.sin(time * 3.7 + i * 0.5)
                       + 0.1 * Math.cos(time * 1.3 + i * 0.8);
                target = Math.abs(target);
            } else {
                target = 0.02 + 0.01 * Math.sin(time * 0.5 + i * 0.2);
            }

            // Smooth interpolation
            barData[i] += (target - barData[i]) * 0.08;

            const h = barData[i] * H;
            const x = i * barW;
            const y = H - h;

            // Color gradient per bar
            const hue = 180 + (i / bars) * 120; // cyan to magenta
            const alpha = 0.5 + barData[i] * 0.5;
            ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${alpha})`;
            ctx.fillRect(x + 1, y, barW - 2, h);

            // Glow on top
            if (isPlaying && barData[i] > 0.2) {
                ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${barData[i] * 0.3})`;
                ctx.fillRect(x, y - 2, barW, 4);
            }
        }

        // Horizontal grid lines
        ctx.strokeStyle = 'rgba(0, 255, 247, 0.04)';
        ctx.lineWidth = 1;
        for (let y = 0; y < H; y += H / 8) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }
    }

    draw();
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}
