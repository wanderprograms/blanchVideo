// app.js
document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash');

  setTimeout(() => {
    if (splash) splash.remove(); // splash imachotsedwa kwathunthu
  }, 8000); // masekondi 10
  // Replace with your Firebase config
  firebase.initializeApp({
    apiKey: "AIzaSyBBZxCwywnv_ZVXYezOV8IKG6iKWK5sL10",
    authDomain: "studio-ywlo1.firebaseapp.com",
    projectId: "studio-ywlo1",
    storageBucket: "studio-ywlo1.appspot.com",
    messagingSenderId: "791958850921",
    appId: "1:791958850921:web:149be668e7f132e59f41f8"
  });

  const auth = firebase.auth();
  const db = firebase.database();

  // Top nav + sections
  const appNav = document.getElementById('appNav');
  const navHome = document.getElementById('navHome');
  const navVideos = document.getElementById('navVideos');

  const authSection = document.getElementById('authSection');
  const homeSection = document.getElementById('homeSection');
  const videoSection = document.getElementById('videoSection');

  // Auth forms
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const toRegister = document.getElementById('toRegister');
  const toLogin = document.getElementById('toLogin');

  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginError = document.getElementById('loginError');

  const fullName = document.getElementById('fullName');
  const registerEmail = document.getElementById('registerEmail');
  const dob = document.getElementById('dob');
  const registerPassword = document.getElementById('registerPassword');
  const confirmSite = document.getElementById('confirmSite');
  const registerError = document.getElementById('registerError');

  // Home
  const logoutBtn = document.getElementById('logoutBtn');

  // Player + actions
  const mainPlayer = document.getElementById('mainPlayer');
  const fullscreenBtn = document.getElementById('fullscreenBtn');

  const likeBtn = document.getElementById('likeBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const shareBtn = document.getElementById('shareBtn');

  const likeCount = document.getElementById('likeCount');
  const downloadCount = document.getElementById('downloadCount');
  const shareCount = document.getElementById('shareCount');

  const shareSection = document.getElementById('shareSection');
  const shareWhatsappBtn = document.getElementById('shareWhatsapp');
  const shareFacebookBtn = document.getElementById('shareFacebook');
  const copyLinkBtn = document.getElementById('copyLink');
  const copyEmbedBtn = document.getElementById('copyEmbed');

  const videoGrid = document.getElementById('videoGrid');

  // Videos list (place video files in /Video/ and thumbnails in /thumbs/)
  const videos = [
    { id: "commedy", title: "A CHAKWELA ASANALOWE M'BOMA", file: "Videos/video1.mp4", thumb: "thumbs/thumb1.jpeg" },
    { id: "Black Nina", title: "Molalo", file: "Videos/video2.mp4", thumb: "thumbs/molalo.jpg" },
    { id: "commedy", title: "2063", file: "Videos/video4.mp4", thumb: "thumbs/thumb2.jpeg" },
    { id: "1", title: "Caxy_Ai_Mayo", file: "Videos/Caxy_Ai_Mayo.mp4", thumb: "thumbs/images.jpg" }, 
    { id: "2", title: "Waxy_Kay__Nsembe_ft_Kebeh", file: "Videos/Waxy_Kay__Nsembe_ft_Kebeh.mp4", thumb: "thumbs/waxt2.jpg" },
    { id: "3", title: "Waxy_Kay_-_Takumbuka", file: "Videos/Waxy_Kay_-_Takumbuka.mp4", thumb: "thumbs/waxy1.jpg" },
    { id: "4", title: "Busy", file: "Videos/video5.mp4", thumb: "thumbs/aika.jpg" },
    { id: "5", title: "Busy", file: "Videos/video5.mp4", thumb: "thumbs/aika.jpg" },
    { id: "6", title: "Busy", file: "Videos/video5.mp4", thumb: "thumbs/aika.jpg" },
    { id: "7", title: "Busy", file: "Videos/video5.mp4", thumb: "thumbs/aika.jpg" },
    { id: "8", title: "Busy", file: "Videos/video5.mp4", thumb: "thumbs/aika.jpg" },
    { id: "9", title: "Busy", file: "Videos/video5.mp4", thumb: "thumbs/aika.jpg" },
    { id: "10", title: "Busy", file: "Videos/video5.mp4", thumb: "thumbs/aika.jpg" },
    { id: "11", title: "Busy", file: "Videos/video5.mp4", thumb: "thumbs/aika.jpg" },
    { id: "12", title: "Busy", file: "Videos/video5.mp4", thumb: "thumbs/aika.jpg" },
    { id: "13", title: "Busy", file: "Videos/video5.mp4", thumb: "thumbs/aika.jpg" },
    { id: "14", title: "Busy", file: "Videos/video5.mp4", thumb: "thumbs/aika.jpg" }
  ];

  // Helpers
  function showLogin() {
    loginForm.classList.add('visible');
    registerForm.classList.remove('visible');
  }
  function showRegister() {
    registerForm.classList.add('visible');
    loginForm.classList.remove('visible');
  }
  function isAge19Plus(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    const d = new Date(dateStr);
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
    return age >= 19;
  }
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, s => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[s]);
  }

  // RTDB paths
  const videoStatsPath = (videoId) => `videos/${videoId}/stats`;
  const userProfilePath = (uid) => `users/${uid}/profile`;

  // Initial UI
  if (shareSection) shareSection.classList.add('hidden');
  showLogin();

  // Auth screen switches
  toRegister.addEventListener('click', (e) => { e.preventDefault(); showRegister(); });
  toLogin.addEventListener('click', (e) => { e.preventDefault(); showLogin(); });

  // Register
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    registerError.textContent = "";

    if (!fullName.value.trim()) { registerError.textContent = "Lowani dzina lonse."; return; }
    if (!registerEmail.validity.valid) { registerError.textContent = "Imelo si yolondola."; return; }
    if (!dob.value) { registerError.textContent = "Lowani tsiku lobadwa."; return; }
    if (!isAge19Plus(dob.value)) { registerError.textContent = "Website iyi ndi ya 19+ okha."; return; }
    if (!registerPassword.value || registerPassword.value.length < 6) { registerError.textContent = "Mawu achinsinsi osachepera 6."; return; }
    if (!confirmSite.checked) { registerError.textContent = "Tsimikizani kuti mukulowa pa website ino."; return; }

    try {
      const cred = await auth.createUserWithEmailAndPassword(registerEmail.value.trim(), registerPassword.value);
      const uid = cred.user.uid;
      await db.ref(userProfilePath(uid)).set({
        fullName: fullName.value.trim(),
        email: registerEmail.value.trim(),
        dob: dob.value,
        createdAt: Date.now()
      });
    } catch (err) {
      registerError.textContent = (err?.message || "Vutoli lachitika");
    }
  });

  // Login
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = "";
    if (!loginEmail.validity.valid) { loginError.textContent = "Imelo si yolondola."; return; }
    if (!loginPassword.value) { loginError.textContent = "Lowani mawu achinsinsi."; return; }
    try {
      await auth.signInWithEmailAndPassword(loginEmail.value.trim(), loginPassword.value);
    } catch (err) {
      loginError.textContent = (err?.message || "Kulowa kwalephera");
    }
  });

  // Section switching (only one visible)
  function showSection(section) {
    homeSection.classList.add('hidden');
    videoSection.classList.add('hidden');
    navHome.classList.remove('active');
    navVideos.classList.remove('active');

    if (section === 'home') {
      homeSection.classList.remove('hidden');
      navHome.classList.add('active');
    } else if (section === 'video') {
      videoSection.classList.remove('hidden');
      navVideos.classList.add('active');
    }
  }
  navHome.addEventListener('click', () => showSection('home'));
  navVideos.addEventListener('click', () => showSection('video'));

  // Auth state
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      authSection.classList.add('hidden');
      appNav.classList.remove('hidden');
      showSection('home');

      buildGrid();
      if (videos.length) loadVideoToPlayer(videos[0]);
    } else {
      appNav.classList.add('hidden');
      homeSection.classList.add('hidden');
      videoSection.classList.add('hidden');
      authSection.classList.remove('hidden');
      clearPlayer();
    }
  });

  // Logout
  logoutBtn.addEventListener('click', () => auth.signOut());

  // Build grid with IMAGE thumbnails (stable and fast)
  function buildGrid() {
    videoGrid.innerHTML = "";
    videos.forEach(v => {
      const card = document.createElement('div');
      card.className = 'thumb-card';
      card.innerHTML = `
        <img class="thumb-video" src="${escapeHTML(v.thumb)}" alt="${escapeHTML(v.title)}">
        <div class="thumb-body">
          <div class="thumb-title">${escapeHTML(v.title)}</div>
          <div class="thumb-meta">MP4 • ${escapeHTML(v.id)}</div>
        </div>
      `;
      card.addEventListener('click', () => loadVideoToPlayer(v));
      videoGrid.appendChild(card);
    });
  }

  // Live counters listener
  let currentStatsRef = null;
  function attachStatsListener(videoId) {
    if (currentStatsRef) currentStatsRef.off();
    if (!videoId) return;
    currentStatsRef = db.ref(videoStatsPath(videoId));
    currentStatsRef.on('value', (snap) => {
      const stats = snap.val() || { likes: 0, downloads: 0, shares: 0 };
      likeCount.textContent = stats.likes || 0;
      downloadCount.textContent = stats.downloads || 0;
      shareCount.textContent = stats.shares || 0;
    });
  }

  // Load video into main player, set poster, and play when ready
  async function loadVideoToPlayer(video) {
    mainPlayer.src = video.file;
    mainPlayer.dataset.videoId = video.id;
    mainPlayer.poster = video.thumb || ""; // show image before playback

    // Ensure stats path exists
    try {
      const ref = db.ref(videoStatsPath(video.id));
      const snap = await ref.get();
      if (!snap.exists()) {
        await ref.set({ likes: 0, downloads: 0, shares: 0 });
      }
    } catch {}

    attachStatsListener(video.id);

    // Load then play on canplay (user clicked thumbnail = gesture)
    mainPlayer.load();
    mainPlayer.addEventListener('canplay', () => {
      mainPlayer.play().catch(() => {
        // If blocked, user can press native play button
      });
    }, { once: true });
  }

  // Clear player
  function clearPlayer() {
    try {
      mainPlayer.pause();
      mainPlayer.removeAttribute('src');
      mainPlayer.removeAttribute('poster');
      mainPlayer.removeAttribute('data-video-id');
      mainPlayer.load();
    } catch {}
    likeCount.textContent = "0";
    downloadCount.textContent = "0";
    shareCount.textContent = "0";
    if (currentStatsRef) currentStatsRef.off();
  }

  // Fullscreen (target the video element)
  fullscreenBtn.addEventListener('click', () => {
    const el = mainPlayer;
    const doc = document;
    if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    } else {
      if (doc.exitFullscreen) doc.exitFullscreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      else if (doc.msExitFullscreen) doc.msExitFullscreen();
    }
  });

  // Like
  likeBtn.addEventListener('click', async () => {
    const videoId = mainPlayer.dataset.videoId;
    if (!videoId) return;
    await db.ref(videoStatsPath(videoId)).transaction(current => {
      if (!current) current = { likes: 0, downloads: 0, shares: 0 };
      current.likes = (current.likes || 0) + 1;
      return current;
    });
  });

  // Download: increment and start immediately
  downloadBtn.addEventListener('click', async () => {
    const videoId = mainPlayer.dataset.videoId;
    const href = mainPlayer.src;
    if (!videoId || !href) return;

    await db.ref(videoStatsPath(videoId)).transaction(current => {
      if (!current) current = { likes: 0, downloads: 0, shares: 0 };
      current.downloads = (current.downloads || 0) + 1;
      return current;
    });

    try {
      const a = document.createElement('a');
      a.href = href;
      a.download = href.split('/').pop() || 'video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      try {
        const res = await fetch(href, { mode: 'cors' });
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = href.split('/').pop() || 'video.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch {
        window.open(href, '_blank');
      }
    }
  });

  // Share toggle + actions
  shareBtn.addEventListener('click', () => {
    shareSection.classList.toggle('hidden');
  });

  async function incrementShare() {
    const videoId = mainPlayer.dataset.videoId;
    if (!videoId) return;
    await db.ref(videoStatsPath(videoId)).transaction(current => {
      if (!current) current = { likes: 0, downloads: 0, shares: 0 };
      current.shares = (current.shares || 0) + 1;
      return current;
    });
  }

  shareWhatsappBtn.addEventListener('click', async () => {
    const url = encodeURIComponent(mainPlayer.src || window.location.href);
    window.open(`https://wa.me/?text=${url}`, '_blank');
    await incrementShare();
  });

  shareFacebookBtn.addEventListener('click', async () => {
    const url = encodeURIComponent(mainPlayer.src || window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    await incrementShare();
  });

  copyLinkBtn.addEventListener('click', async () => {
    const shareUrl = mainPlayer.src || window.location.href;
    try { await navigator.clipboard.writeText(shareUrl); } catch {}
    await incrementShare();
  });

  copyEmbedBtn.addEventListener('click', async () => {
    const shareUrl = mainPlayer.src || window.location.href;
    const embed = `<iframe src="${shareUrl}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;
    try { await navigator.clipboard.writeText(embed); } catch {}
    await incrementShare();
  });
});
