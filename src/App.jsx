import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Heart, Star, Lock, Home, Camera, ArrowRight, Play, Info, ShoppingBag, LogOut } from 'lucide-react';
import './App.css';

// Import gambar dari assets/background/
import bgLayerMenu from './assets/background/bg-layer-menu.png';
import bgLayerLevel from './assets/background/bg-layer-menu.png';
import bgLayerPermainanBiasa from './assets/background/bg-layer-menu.png';
import bgLayerPermainanHellmode from './assets/background/bg-layer-menu.png';
// Import gambar dari assets/kompenen
import logo from './assets/kompenen/logo-pria-solo.png';
import mobilSmk from './assets/kompenen/enemy/mobil-smk.png';
import sapiPutih from './assets/kompenen/enemy/sapi-putih.png';
import levelTerbuka from './assets/kompenen/level/level-terbuka.png';
import levelTerkunci from './assets/kompenen/level/level-terkunci.png';
import level10 from './assets/kompenen/level/level-10.png';
import level20 from './assets/kompenen/level/level-20.png';
import level30 from './assets/kompenen/level/level-30.png';
import level40 from './assets/kompenen/level/level-40.png';
import level50 from './assets/kompenen/level/level-50.png';
import badge from './assets/kompenen/level/badge.png';
import pilihLevel from './assets/kompenen/level/level.png';
// Import gambar dari assets/kompenen/ensiklopedia
import ensiklopediaBg from './assets/kompenen/ensiklopedia/bg.png';
import ensiklopediaBatik from './assets/kompenen/ensiklopedia/batik.png';
import ensiklopediaPapan from './assets/kompenen/ensiklopedia/kertas.png';
import ensiklopediaTitle from './assets/kompenen/ensiklopedia/title.png';


// --- 1. DATA & KONFIGURASI (GLOBAL) ---

const GAME_CONFIG = {
  GRAVITY: 0.6,
  JUMP_FORCE: -13, // Sedikit lebih tinggi untuk mengakomodasi gap yang lebih lebar
  SPEED: 5,
  TOTAL_LEVELS: 50,
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 450,
  START_X: 50,
  START_Y: 300,
};

const ASSETS = {
  // Menu & UI
  menuBg: bgLayerMenu, 
  logo: logo,
  
  // Backgrounds
  levelBg: bgLayerLevel, 
  gameBg: bgLayerPermainanBiasa,

  // UI Icons
  badgePriaSolo: badge,
  titlePilihLevel: pilihLevel,
  
  // Level Icons
  iconLevelOpen: levelTerbuka, 
  iconLevelLocked: levelTerkunci,
  iconLevelHell: level10,
  iconLevelHell10: level10,
  iconLevelHell20: level20,
  iconLevelHell30: level30,
  iconLevelHell40: level40,
  iconLevelHell50: level50,

  // Ensiklopedia Assets
  encyclopediaBg: ensiklopediaBg, 
  encyclopediaTitle: ensiklopediaTitle, 
  encyclopediaBoard: ensiklopediaPapan, 
  encyclopediaFrame: ensiklopediaBatik, 

  // SPRITES PERMAINAN
  charSprite: "https://framerusercontent.com/images/k209YF0p0fBwM4VqE2m8Mh6vO8.png?scale-down-to=512", 
  enemyCow: sapiPutih,
  enemyCar: mobilSmk,
};

const CULTURAL_DATA = [
  { title: "Blangkon Solo", desc: "Blangkon gaya Surakarta memiliki ciri khas bagian belakang yang datar (trepes), melambangkan menyembunyikan rahasia atau emosi.", imgUrl: "https://via.placeholder.com/200?text=FOTO+BLANGKON", imgColor: "#8B4513" },
  { title: "Keraton Surakarta", desc: "Istana resmi Kasunanan Surakarta Hadiningrat yang didirikan oleh Susuhunan Pakubuwana II pada tahun 1744. Pusat kebudayaan Jawa di Solo.", imgUrl: "https://via.placeholder.com/200?text=FOTO+KERATON", imgColor: "#DAA520" },
  { title: "Batik Parang", desc: "Salah satu motif batik tertua yang hanya boleh dipakai oleh raja dan ksatria pada zaman dahulu. Memiliki makna petuah untuk tidak pernah menyerah.", imgUrl: "https://via.placeholder.com/200?text=FOTO+BATIK", imgColor: "#A0522D" },
  { title: "Serabi Notosuman", desc: "Kuliner khas Solo yang legendaris, terbuat dari tepung beras dan santan. Rasanya gurih dan manis, sering dijadikan oleh-oleh khas.", imgUrl: "https://via.placeholder.com/200?text=FOTO+SERABI", imgColor: "#F5DEB3" },
  { title: "Pasar Klewer", desc: "Pusat tekstil dan batik terbesar di Solo, terletak bersebelahan dengan Keraton Surakarta. Tempat utama berburu batik murah berkualitas.", imgUrl: "https://via.placeholder.com/200?text=FOTO+PASAR", imgColor: "#CD853F" },
];

// --- 2. KOMPONEN UI UTILITAS ---

const WoodButton = ({ children, onClick, color = "orange", className = "", size = "md" }) => {
  const colors = {
    orange: "bg-[#E67E22] border-[#D35400] text-white shadow-[0_6px_0_#A04000] hover:bg-[#D35400] active:shadow-none active:translate-y-[6px]",
    yellow: "bg-amber-400 border-amber-700 text-white shadow-[0_6px_0_#b45309] hover:bg-amber-300 active:shadow-none active:translate-y-[6px]",
    red: "bg-red-500 border-red-800 text-white shadow-[0_6px_0_#991b1b] hover:bg-red-400 active:shadow-none active:translate-y-[6px]",
    brown: "bg-[#8B4513] border-[#3E2723] text-white shadow-[0_6px_0_#2d1b15] hover:bg-[#A0522D] active:shadow-none active:translate-y-[6px]",
    blue: "bg-blue-400 border-blue-700 text-white shadow-[0_6px_0_#1d4ed8] hover:bg-blue-300 active:shadow-none active:translate-y-[6px]",
    green: "bg-green-600 border-green-800 text-white shadow-[0_6px_0_#14532d] hover:bg-green-500 active:shadow-none active:translate-y-[6px]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm h-10",
    md: "px-8 py-3 text-xl h-14",
    lg: "px-10 py-4 text-2xl h-16 min-w-[200px]",
  };

  return (
    <button
      onClick={onClick}
      className={`${colors[color] || colors.orange} ${sizes[size] || sizes.md} ${className} 
      relative font-black rounded-2xl border-4 transition-all font-display tracking-widest flex items-center justify-center gap-2 uppercase`}
      style={{ 
        fontFamily: '"Fredoka", sans-serif',
        textShadow: '2px 2px 0px rgba(0,0,0,0.3)'
      }}
    >
      {children}
    </button>
  );
};

// Komponen Tombol Suara Kayu
const WoodSoundButton = ({ enabled, onClick }) => (
  <button 
    onClick={onClick} 
    className="relative group bg-[#8B4513] p-3 rounded-full border-4 border-[#DEB887] shadow-[0_4px_0_#5D4037] hover:scale-110 active:scale-95 active:shadow-none active:translate-y-1 transition-all duration-200"
  >
    {/* Highlight efek kayu */}
    <div className="absolute top-1 left-2 w-3 h-2 bg-white/20 rounded-full blur-[1px]"></div>
    <div className="relative text-[#DEB887] drop-shadow-md">
      {enabled ? <Volume2 size={28} strokeWidth={3} /> : <VolumeX size={28} strokeWidth={3} />}
    </div>
  </button>
);

const WoodPanel = ({ children, title, className = "" }) => (
  <div className={`relative bg-[#DEB887] rounded-2xl shadow-2xl p-6 ${className}`}>
    <div className="absolute inset-0 opacity-10 pointer-events-none" 
         style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #8B4513 10px, #8B4513 12px)'}}></div>
    {title && (
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#8B4513] text-white px-8 py-2 rounded-lg shadow-md z-10">
        <h2 className="text-xl font-bold uppercase tracking-widest">{title}</h2>
      </div>
    )}
    <div className="relative z-0 h-full flex flex-col">
      {children}
    </div>
    <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#654321] shadow-inner"></div>
    <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#654321] shadow-inner"></div>
    <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-[#654321] shadow-inner"></div>
    <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[#654321] shadow-inner"></div>
  </div>
);

// --- 3. GAME LOGIC UTAMA (CANVAS) ---

const GameCanvas = ({ level, onGameOver, onLevelComplete, onAddCoin }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const [hearts, setHearts] = useState(5);
  const [levelCoins, setLevelCoins] = useState(0);

  // Image Refs
  const charImgRef = useRef(null);
  const cowImgRef = useRef(null);
  const carImgRef = useRef(null);

  const gameState = useRef({
    player: { x: GAME_CONFIG.START_X, y: GAME_CONFIG.START_Y, width: 40, height: 60, dx: 0, dy: 0, grounded: false, facingRight: true, frame: 0 },
    camera: { x: 0 },
    platforms: [],
    coins: [],
    enemies: [], 
    flag: { x: 0, y: 0 },
    isHellMode: level % 10 === 0,
    width: 2000,
  });

  // Preload Images
  useEffect(() => {
    const charImg = new Image(); 
    charImg.src = ASSETS.charSprite; 
    charImgRef.current = charImg;

    const cowImg = new Image(); 
    cowImg.src = ASSETS.enemyCow; 
    cowImgRef.current = cowImg;

    const carImg = new Image(); 
    carImg.src = ASSETS.enemyCar; 
    carImgRef.current = carImg;
  }, []);

  // Level Generator
  useEffect(() => {
    const state = gameState.current;
    state.isHellMode = level % 10 === 0;
    
    // Level makin panjang = makin menantang stamina
    state.width = 2000 + (level * 200); 
    
    // Reset Player
    state.player = { x: GAME_CONFIG.START_X, y: GAME_CONFIG.START_Y, width: 40, height: 60, dx: 0, dy: 0, grounded: false, facingRight: true, frame: 0 };
    state.camera.x = 0;
    
    const platforms = [];
    const groundY = 380; // Posisi tanah dasar
    
    // Base platform awal (aman)
    platforms.push({ x: 0, y: groundY, width: 400, height: 100, type: 'ground' });
    let currentX = 400;

    // --- GENERASI PLATFORM (DIFFICULTY TUNING) ---
    while (currentX < state.width) {
      // 1. GAP (LUBANG)
      // Level 1: Gap 60-100
      // Level 50: Gap 120-220 (Maksimal 250 agar bisa dilompati)
      let minGap = 60 + (level * 2);
      let maxGap = 120 + (level * 3);
      if (maxGap > 240) maxGap = 240; 

      const gap = Math.random() * (maxGap - minGap) + minGap;
      currentX += gap;

      // 2. LEBAR PLATFORM
      // Level 1: Lebar 200-400
      // Level 50: Lebar 80-150 (Pijakan makin sempit)
      let minWidth = 200 - (level * 3);
      if (minWidth < 80) minWidth = 80;
      let maxWidth = 400 - (level * 3);
      if (maxWidth < 150) maxWidth = 150;
      
      const width = Math.random() * (maxWidth - minWidth) + minWidth;

      // 3. VARIASI KETINGGIAN (NAIK TURUN)
      let yOffset = 0;
      // Mulai level 5, tanah bisa naik turun
      if (level >= 5 && Math.random() > 0.5) {
          // Variasi +/- 80px dari groundY
          yOffset = (Math.random() * 160) - 80; 
      }

      platforms.push({ x: currentX, y: groundY + yOffset, width: width, height: 100, type: 'ground' });
      currentX += width;
    }

    // Pastikan Platform TERAKHIR ada di TANAH (Ground Level) untuk Bendera
    // Agar bendera tidak melayang tinggi atau tenggelam
    const finalPlatWidth = 300;
    // Tambahkan gap sebelum finish
    currentX += 100;
    platforms.push({ x: currentX, y: groundY, width: finalPlatWidth, height: 100, type: 'ground' });

    // Platform Melayang (Bantuan Loncatan)
    const numFloating = 10 + (level * 2); 
    for (let i = 0; i < numFloating; i++) {
        platforms.push({
            x: 400 + Math.random() * (state.width - 600),
            y: groundY - 100 - (Math.random() * 120), 
            width: 80 + Math.random() * 80,
            height: 20,
            type: 'floating'
        });
    }
    state.platforms = platforms;

    // Coins
    const coins = [];
    platforms.forEach(p => {
      if (Math.random() > 0.4) {
        coins.push({ x: p.x + p.width / 2 - 20, y: p.y - 60, collected: false, width: 40, height: 40 });
      }
    });
    state.coins = coins;

    // --- LOGIKA SPAWN MUSUH ---
    const enemies = [];
    const availableEnemies = ['rock']; 
    if (level > 5) availableEnemies.push('cow'); 
    if (level > 10) availableEnemies.push('car'); 

    const enemyDensity = Math.min(0.8, 0.2 + (level * 0.015)); 
    
    platforms.forEach((p, index) => {
        // Jangan ada musuh di awal & akhir
        if (index === 0 || index === platforms.length - 1) return;
        
        if (p.width > 150 && Math.random() < enemyDensity) {
            const type = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
            let speed = 1.5 + (level * 0.05);
            if (state.isHellMode) speed += 2; 

            let w = 40, h = 40;
            if (type === 'cow') { w = 60; h = 40; } 
            if (type === 'car') { w = 80; h = 40; } 

            enemies.push({
                x: p.x + Math.random() * (p.width - w),
                y: p.y - h,
                width: w,
                height: h,
                dx: speed,
                patrolStart: p.x,
                patrolEnd: p.x + p.width,
                type: type,
                angle: 0 
            });
        }
    });
    state.enemies = enemies;

    // Flag Goal - DI TANAH (Platform Terakhir)
    const lastPlat = platforms[platforms.length - 1];
    state.flag = { 
        x: lastPlat.x + (lastPlat.width / 2) - 25, 
        y: lastPlat.y - 100 // Menancap pas di atas platform tanah
    };

  }, [level]);

  // Input Handling
  const keys = useRef({});
  useEffect(() => {
    const handleDown = (e) => keys.current[e.code] = true;
    const handleUp = (e) => keys.current[e.code] = false;
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  const resetToStart = () => {
      const state = gameState.current;
      state.player.x = GAME_CONFIG.START_X;
      state.player.y = GAME_CONFIG.START_Y;
      state.player.dx = 0;
      state.player.dy = 0;
      state.camera.x = 0;
  };

  // --- KARAKTER PRIA SOLO (SUPER CUTE, BATIK, & MENAPAK TANAH) ---
  const drawProceduralCharacter = (ctx, x, y, w, h, swing) => {
    const scale = w / 40; 
    const centerX = x + w / 2;
    
    // Proporsi Chibi
    const headR = 16 * scale; 
    
    // Agar karakter menapak tanah (tidak melayang), kita hitung dari bawah (y+h) ke atas// Perkiraan tinggi visual
    // Offset Y agar kaki pas di garis y+h
    const bottomY = y + h;
    
    // Dimensi Kaki
    const legW = 9 * scale;
    const legH = 12 * scale;
    const legPivotY = bottomY - legH; // Titik putar kaki

    // Dimensi Badan
    const bodyW = 24 * scale;
    const bodyH = 20 * scale;
    const bodyY = legPivotY - bodyH + 3 * scale; // Overlap dikit

    // Dimensi Kepala
    const headY = bodyY - 10 * scale;

    // Warna
    const skinColor = '#F5D0A9'; 
    const blangkonColor = '#4E342E';
    const batikPatternColor = '#D7CCC8'; 
    const jarikColor = '#3E2723'; 
    const surjanColor = '#3E2723'; 
    const goldColor = '#FFD700';

    // --- KAKI (JARIK) ---
    // Kaki Kiri
    ctx.save(); 
    ctx.translate(centerX - 6 * scale, legPivotY); 
    ctx.rotate(-swing * 0.15);
    ctx.fillStyle = jarikColor; 
    ctx.beginPath(); ctx.roundRect(-legW/2, 0, legW, legH, 4); ctx.fill();
    // Motif Batik
    ctx.strokeStyle = batikPatternColor; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-legW/2, 2); ctx.lineTo(legW/2, 8); ctx.stroke();
    ctx.restore();

    // Kaki Kanan
    ctx.save(); 
    ctx.translate(centerX + 6 * scale, legPivotY); 
    ctx.rotate(swing * 0.15);
    ctx.fillStyle = jarikColor; 
    ctx.beginPath(); ctx.roundRect(-legW/2, 0, legW, legH, 4); ctx.fill();
    // Motif Batik
    ctx.strokeStyle = batikPatternColor; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-legW/2, 2); ctx.lineTo(legW/2, 8); ctx.stroke();
    ctx.restore();

    // --- BADAN (SURJAN) ---
    ctx.fillStyle = surjanColor;
    ctx.beginPath(); ctx.roundRect(centerX - bodyW/2, bodyY, bodyW, bodyH, 6); ctx.fill();

    // Kancing Emas
    ctx.fillStyle = goldColor;
    ctx.beginPath(); ctx.arc(centerX, bodyY + 6 * scale, 2 * scale, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(centerX, bodyY + 12 * scale, 2 * scale, 0, Math.PI*2); ctx.fill();

    // --- TANGAN (Bulat Lucu) ---
    ctx.fillStyle = skinColor;
    // Kiri
    ctx.beginPath(); ctx.arc(centerX - bodyW/2 - 2, bodyY + 8 + swing, 4 * scale, 0, Math.PI*2); ctx.fill();
    // Kanan
    ctx.beginPath(); ctx.arc(centerX + bodyW/2 + 2, bodyY + 8 - swing, 4 * scale, 0, Math.PI*2); ctx.fill();

    // --- KEPALA ---
    ctx.fillStyle = skinColor;
    ctx.beginPath(); ctx.arc(centerX, headY, headR, 0, Math.PI*2); ctx.fill();

    // --- BLANGKON (Mondolan Lucu) ---
    ctx.fillStyle = blangkonColor;
    ctx.beginPath();
    // Topi
    ctx.ellipse(centerX, headY - 6 * scale, headR + 1 * scale, headR * 0.55, 0, Math.PI, 0); ctx.fill();
    // Mondolan (Benjolan)
    ctx.beginPath(); ctx.arc(centerX - headR + 2, headY + 2, 6 * scale, 0, Math.PI*2); ctx.fill();
    
    // --- WAJAH (Cute Anime Style) ---
    const eyeY = headY + 2 * scale;
    ctx.fillStyle = '#212121';
    ctx.beginPath(); ctx.arc(centerX - 5 * scale, eyeY, 3 * scale, 0, Math.PI*2); ctx.fill(); // Kiri
    ctx.beginPath(); ctx.arc(centerX + 5 * scale, eyeY, 3 * scale, 0, Math.PI*2); ctx.fill(); // Kanan
    
    // Kilauan Mata
    ctx.fillStyle = 'white';
    ctx.beginPath(); ctx.arc(centerX - 6 * scale, eyeY - 1 * scale, 1.2 * scale, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(centerX + 4 * scale, eyeY - 1 * scale, 1.2 * scale, 0, Math.PI*2); ctx.fill();

    // Pipi Merona (Blush)
    ctx.fillStyle = '#FFAB91';
    ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.ellipse(centerX - 8 * scale, eyeY + 4 * scale, 2.5 * scale, 1.5 * scale, 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(centerX + 8 * scale, eyeY + 4 * scale, 2.5 * scale, 1.5 * scale, 0, 0, Math.PI*2); ctx.fill();
    ctx.globalAlpha = 1.0;

    // Mulut Kecil
    ctx.strokeStyle = '#3E2723';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(centerX, headY + 5 * scale, 2 * scale, 0.2, Math.PI - 0.2); ctx.stroke();
  };

  // MAIN GAME LOOP
  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = gameState.current;
    const p = state.player;

    // --- PHYSICS ---
    if (keys.current['ArrowRight']) {
        p.dx = GAME_CONFIG.SPEED;
        p.facingRight = true;
        p.frame += 0.2; 
    } else if (keys.current['ArrowLeft']) {
        p.dx = -GAME_CONFIG.SPEED;
        p.facingRight = false;
        p.frame += 0.2;
    } else {
        p.dx *= 0.8;
        if(p.frame > 0) p.frame = 0;
    }

    if ((keys.current['ArrowUp'] || keys.current['Space']) && p.grounded) {
        p.dy = GAME_CONFIG.JUMP_FORCE;
        p.grounded = false;
    }

    p.dy += GAME_CONFIG.GRAVITY;
    p.x += p.dx;
    p.y += p.dy;

    p.grounded = false;
    state.platforms.forEach(plat => {
        if (p.x + 10 < plat.x + plat.width && 
            p.x + p.width - 10 > plat.x &&
            p.y + p.height < plat.y + plat.height &&
            p.y + p.height > plat.y) {
                if (p.dy > 0 && p.y + p.height - p.dy <= plat.y + 15) {
                    p.grounded = true; p.dy = 0; p.y = plat.y - p.height;
                }
            }
    });

    if (p.y > GAME_CONFIG.CANVAS_HEIGHT) { handleDamage(1); resetToStart(); }

    state.camera.x = p.x - 200;
    if (state.camera.x < 0) state.camera.x = 0;
    if (state.camera.x > state.width - GAME_CONFIG.CANVAS_WIDTH) state.camera.x = state.width - GAME_CONFIG.CANVAS_WIDTH;

    state.coins.forEach(coin => {
        if (!coin.collected && p.x < coin.x + coin.width && p.x + p.width > coin.x && p.y < coin.y + coin.height && p.y + p.height > coin.y) {
            coin.collected = true; setLevelCoins(prev => prev + 1); onAddCoin();
        }
    });

    state.enemies.forEach(enemy => {
        enemy.x += enemy.dx;
        if (enemy.type === 'rock') enemy.angle += enemy.dx * 0.1;
        if (enemy.x <= enemy.patrolStart || enemy.x + enemy.width >= enemy.patrolEnd) enemy.dx *= -1;

        if (p.x < enemy.x + enemy.width - 5 && p.x + p.width > enemy.x + 5 && p.y < enemy.y + enemy.height && p.y + p.height > enemy.y) {
                if (enemy.type === 'rock' && p.dy > 0 && p.y + p.height - p.dy <= enemy.y + 20) {
                    p.dy = -8; enemy.y = 1000; 
                } else {
                    handleDamage(1); p.dy = -5; p.dx = p.x < enemy.x ? -10 : 10; 
                }
        }
    });

    if (p.x >= state.flag.x) { onLevelComplete(hearts, levelCoins); return; }

    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.save(); ctx.translate(-state.camera.x, 0);

    ctx.fillStyle = '#8B4513'; 
    state.platforms.forEach(plat => {
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
        ctx.fillStyle = '#654321'; ctx.fillRect(plat.x + 5, plat.y + 5, plat.width - 10, 5); ctx.fillStyle = '#8B4513';
        if (plat.type === 'ground') { ctx.fillStyle = '#228B22'; ctx.fillRect(plat.x, plat.y, plat.width, 10); ctx.fillStyle = '#8B4513'; }
    });

    ctx.fillStyle = '#D3D3D3'; ctx.fillRect(state.flag.x, state.flag.y, 5, 100);
    ctx.fillStyle = '#FF0000'; ctx.fillRect(state.flag.x + 5, state.flag.y, 50, 20);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(state.flag.x + 5, state.flag.y + 20, 50, 20);
    ctx.strokeStyle = '#000'; ctx.strokeRect(state.flag.x + 5, state.flag.y + 20, 50, 20);

    state.enemies.forEach(en => {
        if (en.type === 'rock') {
            ctx.save(); ctx.translate(en.x + en.width/2, en.y + en.height/2); ctx.rotate(en.angle);
            ctx.fillStyle = '#808080'; ctx.beginPath(); ctx.arc(0, 0, en.width/2, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#505050'; ctx.beginPath(); ctx.arc(-5, -5, 3, 0, Math.PI*2); ctx.fill(); ctx.restore();
        } else if (en.type === 'cow' && cowImgRef.current && cowImgRef.current.complete && cowImgRef.current.naturalWidth !== 0) {
             ctx.save(); if (en.dx > 0) { ctx.translate(en.x + en.width, en.y); ctx.scale(-1, 1); ctx.drawImage(cowImgRef.current, 0, 0, en.width, en.height); } else { ctx.drawImage(cowImgRef.current, en.x, en.y, en.width, en.height); } ctx.restore();
        } else if (en.type === 'car' && carImgRef.current && carImgRef.current.complete && carImgRef.current.naturalWidth !== 0) {
             ctx.save(); if (en.dx > 0) { ctx.translate(en.x + en.width, en.y); ctx.scale(-1, 1); ctx.drawImage(carImgRef.current, 0, 0, en.width, en.height); } else { ctx.drawImage(carImgRef.current, en.x, en.y, en.width, en.height); } ctx.restore();
        } else {
            ctx.fillStyle = en.type === 'cow' ? 'white' : 'red'; ctx.fillRect(en.x, en.y, en.width, en.height);
        }
    });

    state.coins.forEach(c => {
        if (!c.collected) {
            ctx.fillStyle = '#FFD700'; ctx.beginPath(); ctx.arc(c.x + c.width/2, c.y + c.height/2, c.width/2, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#DAA520'; ctx.lineWidth = 3; ctx.stroke();
            ctx.fillStyle = '#DAA520'; ctx.font = 'bold 20px Arial'; ctx.fillText('Rp', c.x + 8, c.y + 28);
        }
    });

    const swing = Math.sin(p.frame) * 5; 
    ctx.save();
    if (!p.facingRight) {
        ctx.translate(p.x + p.width, p.y); ctx.scale(-1, 1);
        if (charImgRef.current && charImgRef.current.complete && charImgRef.current.naturalWidth !== 0) { ctx.drawImage(charImgRef.current, 0, 0, p.width, p.height); } 
        else { drawProceduralCharacter(ctx, 0, 0, p.width, p.height, swing); }
    } else {
        if (charImgRef.current && charImgRef.current.complete && charImgRef.current.naturalWidth !== 0) { ctx.drawImage(charImgRef.current, p.x, p.y, p.width, p.height); } 
        else { drawProceduralCharacter(ctx, p.x, p.y, p.width, p.height, swing); }
    }
    ctx.restore();
    ctx.restore();
    requestRef.current = requestAnimationFrame(loop);
  }, [hearts, onGameOver, onLevelComplete, level, levelCoins, onAddCoin]);

  const isInvulnerable = useRef(false);
  const handleDamage = (amount) => {
      if (isInvulnerable.current) return;
      const newHearts = hearts - amount; setHearts(newHearts);
      if (newHearts <= 0) { onGameOver(); } else { isInvulnerable.current = true; setTimeout(() => isInvulnerable.current = false, 1000); }
  };

  useEffect(() => { requestRef.current = requestAnimationFrame(loop); return () => cancelAnimationFrame(requestRef.current); }, [loop]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-xl">
      <div className="absolute inset-0 z-0 bg-cover bg-center" style={{ backgroundImage: `url(${ASSETS.gameBg})` }}></div>
      <canvas ref={canvasRef} width={GAME_CONFIG.CANVAS_WIDTH} height={GAME_CONFIG.CANVAS_HEIGHT} className="relative z-10 w-full h-full object-contain"/>
      <div className="absolute top-4 right-4 flex gap-4 pointer-events-none z-20">
        <div className="flex items-center gap-1">{[...Array(5)].map((_, i) => ( <Heart key={i} size={24} className={i < hearts ? "fill-red-500 text-red-600" : "fill-gray-800 text-gray-800"} /> ))}</div>
        <div className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full text-yellow-400 font-bold font-mono"><span>🪙</span><span>{levelCoins}</span></div>
      </div>
      <div className="absolute bottom-4 left-4 flex gap-2 pointer-events-none opacity-30 z-20"><div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-black">⬅️</div><div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-black">➡️</div></div>
      <div className="absolute bottom-4 right-4 pointer-events-none opacity-30 z-20"><div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-black text-xs font-bold">LOMPAT</div></div>
    </div>
  );
};

// --- 4. APP UTAMA ---

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedLevels, setCompletedLevels] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalCoins, setTotalCoins] = useState(0);
  const [lastLevelStats, setLastLevelStats] = useState({ hearts: 0, coins: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('priaSoloSave');
    if (saved) { const data = JSON.parse(saved); setCompletedLevels(data.completedLevels || 1); setTotalCoins(data.totalCoins || 0); }
  }, []);

  useEffect(() => { localStorage.setItem('priaSoloSave', JSON.stringify({ completedLevels, totalCoins })); }, [completedLevels, totalCoins]);

  const handleLevelSelect = (lvl) => { if (lvl <= completedLevels) { setCurrentLevel(lvl); setScreen('game'); } };
  const handleGameOver = () => { alert("Yah! Kamu kalah. Coba lagi ya!"); setScreen('level'); };
  const handleLevelComplete = (hearts, coins) => { setLastLevelStats({ hearts, coins }); setTotalCoins(prev => prev + coins); if (currentLevel >= completedLevels) { setCompletedLevels(prev => Math.min(prev + 1, GAME_CONFIG.TOTAL_LEVELS + 1)); } setScreen('encyclopedia'); };
  const handleFinalScreenshot = () => { alert("Tangkapan layar berhasil disimpan ke galeri! (Simulasi)"); };

  // SCREEN RENDERING
  if (screen === 'menu') {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center p-4 font-sans select-none">
        <style>{`@keyframes zoomOut { 0% { transform: scale(3); opacity: 0; } 100% { transform: scale(1); opacity: 1; } } .animate-zoom-out { animation: zoomOut 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }`}</style>
        <div className="container_custom">
          <div className="absolute inset-0">
             <img src={ASSETS.menuBg} alt="Background Desa" className="w-full h-full object-cover bg-transparent" onError={(e) => { e.target.src = "https://via.placeholder.com/1280x720/87CEEB/333?text=Background+Desa+(Gagal+Muat)"; }} />
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
          <div className="absolute top-6 right-6 z-20">
             <WoodSoundButton enabled={soundEnabled} onClick={() => setSoundEnabled(!soundEnabled)} />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-8 pt-6">
            <div className="relative w-3/5 max-w-lg animate-zoom-out">
            <img src={ASSETS.logo} alt="Logo Pria Solo" className="w-full h-auto drop-shadow-2xl filter hover:scale-105 transition duration-300"/>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mt-8">
                 <WoodButton onClick={() => setScreen('level')} color="yellow" size="md">MULAI</WoodButton>
                 <WoodButton onClick={() => alert("Fitur Shop akan segera hadir!")} color="red" size="md">SHOP</WoodButton>
                 <WoodButton onClick={() => alert("Game Pria Solo v1.0")} color="brown" size="md">TENTANG</WoodButton>
                 <WoodButton onClick={() => window.close()} color="yellow" size="md">KELUAR</WoodButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'level') {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center p-4">
        <div className="container_custom">
          <div className="absolute inset-0 z-0"><img src={ASSETS.levelBg} alt="Level Map" className="w-full h-full object-cover" onError={(e) => { e.target.src = "https://via.placeholder.com/1280x720/556B2F/000?text=MAP+PLACEHOLDER"; }} /></div>
          <div className="z-10 flex justify-between mx-4 px-4 py-2">
              <div className="-ml-6 mt-2 px-4"><img src={ASSETS.badgePriaSolo} alt="Badge Pria Solo" className="h-18 w-auto object-contain drop-shadow-md filter hover:brightness-110"/></div>
             <img src={ASSETS.titlePilihLevel} alt="PILIH LEVEL" className="h-18 md:h-20 object-contain drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]" />
             <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 bg-[#DEB887] px-4 py-2 rounded-full border-4 border-[#8B4513] shadow-lg"><span className="text-2xl drop-shadow-sm">🪙</span><span className="text-[#5D4037] font-black text-xl font-mono">{totalCoins}</span></div>
                 <WoodSoundButton enabled={soundEnabled} onClick={() => setSoundEnabled(!soundEnabled)} />
             </div>
          </div>
          <button onClick={() => setScreen('menu')} className="absolute top-24 left-6 z-20 bg-[#8B4513] p-3 rounded-full border-4 border-[#DEB887] shadow-xl hover:scale-110 transition flex items-center justify-center"><Home className="text-[#DEB887]" size={28} strokeWidth={3} /></button>
          <div className="relative z-10 flex-1 overflow-y-auto px-12 py-8 custom-scrollbar mt-4">
            <div className="grid grid-cols-5 md:grid-cols-8 gap-x-6 gap-y-8 pb-20">
              {[...Array(GAME_CONFIG.TOTAL_LEVELS)].map((_, i) => {
                const lvlNum = i + 1; 
                const isLocked = lvlNum > completedLevels; 
                const isHell = lvlNum % 10 === 0;
                let iconUrl;
    
    if (isHell) {
        // UNTUK HELL MODE: Pakai iconLevelHell untuk SEMUA (baik terkunci maupun terbuka)
        switch(lvlNum) {
            case 10:
                iconUrl = ASSETS.iconLevelHell10 || ASSETS.iconLevelHell;  // Tetap pakai ikon Hell
                break;
            case 20:
                iconUrl = ASSETS.iconLevelHell20 || ASSETS.iconLevelHell;  // Tetap pakai ikon Hell
                break;
            case 30:
                iconUrl = ASSETS.iconLevelHell30 || ASSETS.iconLevelHell;  // Tetap pakai ikon Hell
                break;
            case 40:
                iconUrl = ASSETS.iconLevelHell40 || ASSETS.iconLevelHell;  // Tetap pakai ikon Hell
                break;
            case 50:
                iconUrl = ASSETS.iconLevelHell50 || ASSETS.iconLevelHell;  // Tetap pakai ikon Hell
                break;
            default:
                iconUrl = ASSETS.iconLevelHell;  // Tetap pakai ikon Hell
        }
    } else {
        // Level normal: Logika biasa
        iconUrl = isLocked 
            ? ASSETS.iconLevelLocked 
            : ASSETS.iconLevelOpen;
    }
                return (
                  <button key={lvlNum} disabled={isLocked} onClick={() => handleLevelSelect(lvlNum)} className="group relative flex flex-col items-center justify-center transition-transform hover:-translate-y-2 active:scale-95 focus:outline-none">
                    <div className={`w-20 h-20 relative drop-shadow-2xl ${isLocked ? 'white' : ''}`}>
                       <img src={iconUrl} alt={`Level ${lvlNum}`} className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.backgroundColor = isHell ? '#8B0000' : (isLocked ? '#555' : '#DAA520'); e.target.parentNode.style.borderRadius = '50%'; e.target.parentNode.style.border = '4px solid white'; }} />
                       {!isLocked && (<div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 rounded-full border-2 border-black min-w-6 text-center"><span className="text-xs font-black text-black">{lvlNum}</span></div>)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'game') {
    return (
      <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="container_game">
          <GameCanvas level={currentLevel} onGameOver={handleGameOver} onLevelComplete={handleLevelComplete} onAddCoin={() => setTotalCoins(c => c+1)} />
          <button onClick={() => setScreen('level')} className="absolute top-4 left-4 bg-white/20 p-2 rounded hover:bg-white/40 text-white z-20"><Home size={20}/></button>
        </div>
      </div>
    );
  }

  if (screen === 'encyclopedia') {
    const culture = CULTURAL_DATA[(currentLevel - 1) % CULTURAL_DATA.length];
    return (
      <div className="w-full min-h-screen flex items-center py-4 px-0 md:px-4 justify-center font-sans select-none relative overflow-hidden bg-black">
        <div className="absolute inset-0 z-0"><img src={ASSETS.encyclopediaBg} className="w-full h-full object-cover opacity-80" alt="Background" /></div>
        <div className="relative z-10 w-full max-w-5xl flex flex-col gap-0 md:gap-4 items-center">
            <div className="w-full flex justify-center mb-2"><img src={ASSETS.encyclopediaTitle} alt="Ensiklopedia Budaya" className="h-26 md:h-24 object-contain drop-shadow-xl" /></div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full h-full">
                <div className="relative group w-full md:translate-0 translate-y-6 md:w-auto flex justify-center">
                        <div className="relative w-64 md:w-80 h-64 md:h-80 flex items-center justify-center">
                            <img src={ASSETS.encyclopediaFrame} className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl z-20 pointer-events-none" alt="Frame" />
                        </div>
                </div>
                <div className="relative w-full md:w-2/3 md:translate-0 -translate-y-4 max-w-xl flex justify-center">
                    <div className="relative w-full">
                        <img src={ASSETS.encyclopediaBoard} alt="Description Board" className="w-full h-auto object-contain drop-shadow-2xl" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 md:p-16 text-center">
                            <h3 className="text-[#5D4037] font-black text-xl md:text-3xl mb-2 md:mb-4 drop-shadow-sm">{culture.title}</h3>
                            <div className="overflow-y-auto max-h-[60%] w-full pr-2 custom-scrollbar"><p className="text-[#5D4037] font-serif font-bold text-md md:text-lg leading-relaxed">{culture.desc}</p></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 md:translate-0 -translate-y-2"><WoodButton onClick={() => setScreen('reward')} color="orange" size="lg">LANJUT</WoodButton></div>
        </div>
      </div>
    );
  }

  if (screen === 'reward') {
    const stars = lastLevelStats.hearts >= 4 ? 3 : lastLevelStats.hearts >= 2 ? 2 : 1;
    return (
        
      <div className="w-full min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"><img src={ASSETS.encyclopediaBg} className="w-full h-full object-cover opacity-80" alt="Background" />{[...Array(20)].map((_,i) => ( <div key={i} className="absolute w-4 h-4 bg-yellow-400 rounded-full animate-ping" style={{top: Math.random()*100+'%', left: Math.random()*100+'%', animationDuration: Math.random()*2+1+'s'}}></div> ))}</div>
        <WoodPanel className="max-w-md w-full text-center py-10 bg-gradient-to-b from-[#DEB887] to-[#8B4513]">
          <h1 className="text-4xl font-black text-yellow-300 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] mb-8 stroke-black">SELAMAT!</h1>
          <div className="flex justify-center gap-2 mb-8">{[1, 2, 3].map((s) => ( <Star key={s} size={64} className={`${s <= stars ? 'fill-yellow-400 text-yellow-600' : 'fill-gray-600 text-gray-800'} transform transition duration-500 hover:scale-110 drop-shadow-xl`} /> ))}</div>
          <div className="bg-black/30 rounded-xl p-4 mb-8 inline-block px-12"><p className="text-white font-bold text-xl">Koin Diperoleh</p><div className="flex items-center justify-center gap-2 text-3xl text-yellow-400 font-mono mt-2"><span>🪙</span> +{lastLevelStats.coins}</div></div>
          <div className="flex flex-col gap-4 w-full px-8">
            {currentLevel === GAME_CONFIG.TOTAL_LEVELS ? (<WoodButton onClick={() => setScreen('final_award')} color="blue" size="lg">LIHAT PENGHARGAAN</WoodButton>) : (<WoodButton onClick={() => { setCurrentLevel(c => c+1); setScreen('game'); }} color="green" size="lg">NEXT</WoodButton>)}
            <WoodButton onClick={() => setScreen('menu')} color="red" size="md">KELUAR</WoodButton>
          </div>
        </WoodPanel>
      </div>
    );
  }

  if (screen === 'final_award') {
    return (
      <div className="w-full min-h-screen bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 text-center">
        <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="relative z-10 bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-[0_0_50px_rgba(255,215,0,0.5)] max-w-3xl">
          <div className="mb-8">
             <div className="inline-block p-6 bg-yellow-500 rounded-full shadow-lg mb-6"><span className="text-6xl">👑</span></div>
             <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-yellow-600 mb-4 drop-shadow-sm">SELAMAT!</h1>
             <p className="text-2xl md:text-3xl text-white font-bold tracking-wider">KAMU ADALAH <br/><span className="text-yellow-400 text-4xl mt-2 block filter drop-shadow-[0_2px_0_black]">PRIA SOLO SEJATI</span></p>
          </div>
          <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
             <WoodButton onClick={() => setScreen('menu')} color="green" size="lg">OK</WoodButton>
             <WoodButton onClick={handleFinalScreenshot} color="blue" size="lg"><Camera className="mr-2"/> TANGKAP LAYAR</WoodButton>
          </div>
        </div>
      </div>
    );
  }

  return null;
}