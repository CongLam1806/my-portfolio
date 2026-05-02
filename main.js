/* ============================================================
   main.js — Tran Cong Lam Portfolio
   Sections:
     1. Custom Cursor
     2. Background Canvas (Animated Grid + Particles)
     3. Typed Text — Hero role cycling
     4. Scroll Observer — Animate on scroll
     5. Project Card Stagger
     6. Nav Highlight active section
     7. Smooth Scroll
     8. Project Tab Switcher
============================================================ */
  const profileData = [
    '{',
    '  "name": "Tran Cong Lam",',
    '  "englishName": "Lucas",',
    '  "role": "Software Engineer",',
    '  "specialization": "Backend Systems | Event-Driven Architecture | Cloud",',
    '  "focus": ["Scalability", "Performance Optimization", "Distributed Systems"],',
    '  "location": "Ho Chi Minh City, Vietnam",',
    '  "status": "Open to opportunities"',
    '}'
  ];

  /* ============================================================
     TERMINAL JSON TYPEWRITER
     Renders profileData with VS Code-style syntax highlighting
  ============================================================ */
  (function renderTerminalJSON() {
    const container = document.getElementById('terminal-json');
    if (!container) return;

    // Token types: brace | key | colon | string | number | bool | null | arr | comma | indent
    function tokenizeLine(raw) {
      // raw is a string like '  "name": "Tran Cong Lam",'
      const tokens = [];

      // Just a brace line: { or }
      if (/^\s*[\{\}]\s*,?\s*$/.test(raw)) {
        const indent = raw.match(/^(\s*)/)[1];
        const brace  = raw.trim().replace(',', '');
        const comma  = raw.trim().endsWith(',') ? ',' : '';
        if (indent) tokens.push({ type: 'plain', text: indent });
        tokens.push({ type: 'brace', text: brace });
        if (comma) tokens.push({ type: 'comma', text: comma });
        return tokens;
      }

      // Array line:  "key": [...]
      const arrMatch = raw.match(/^(\s*)("[\w\s]+")(\s*:\s*)(\[.*\])(,?)$/);
      if (arrMatch) {
        tokens.push({ type: 'plain',  text: arrMatch[1] });
        tokens.push({ type: 'key',    text: arrMatch[2] });
        tokens.push({ type: 'colon',  text: arrMatch[3] });
        // parse the array items
        tokens.push({ type: 'arr-brace', text: '[' });
        const inner = arrMatch[4].slice(1, -1); // strip [ ]
        inner.split(',').forEach((item, i, arr) => {
          tokens.push({ type: 'string', text: item.trim() });
          if (i < arr.length - 1) tokens.push({ type: 'comma', text: ', ' });
        });
        tokens.push({ type: 'arr-brace', text: ']' });
        if (arrMatch[5]) tokens.push({ type: 'comma', text: arrMatch[5] });
        return tokens;
      }

      // Key: value  (string value)
      const kvStr = raw.match(/^(\s*)("[\w\s]+")(\s*:\s*)(".*?")(,?)$/);
      if (kvStr) {
        tokens.push({ type: 'plain',  text: kvStr[1] });
        tokens.push({ type: 'key',    text: kvStr[2] });
        tokens.push({ type: 'colon',  text: kvStr[3] });
        tokens.push({ type: 'string', text: kvStr[4] });
        if (kvStr[5]) tokens.push({ type: 'comma', text: kvStr[5] });
        return tokens;
      }

      // Key: value  (number / bool / null)
      const kvOther = raw.match(/^(\s*)("[\w\s]+")(\s*:\s*)([\w\d\.\-]+)(,?)$/);
      if (kvOther) {
        tokens.push({ type: 'plain',  text: kvOther[1] });
        tokens.push({ type: 'key',    text: kvOther[2] });
        tokens.push({ type: 'colon',  text: kvOther[3] });
        const val = kvOther[4];
        const vType = (val === 'true' || val === 'false') ? 'bool'
                    : (val === 'null') ? 'null'
                    : (!isNaN(val)) ? 'number' : 'string';
        tokens.push({ type: vType, text: val });
        if (kvOther[5]) tokens.push({ type: 'comma', text: kvOther[5] });
        return tokens;
      }

      // Fallback: plain text
      tokens.push({ type: 'plain', text: raw });
      return tokens;
    }

    // Color map mimicking VS Code Dark+
    const colorMap = {
      brace: '#FF007F',   // Hồng Neon - làm khung sườn nổi bật hẳn
      'arr-brace': '#FF007F',
      key: '#00E5FF',   // Cyan sáng - giúp tên thuộc tính cực dễ đọc
      colon: '#FFFFFF',   // Trắng tinh - phân tách rõ ràng
      string: '#FFB74D',   // Xanh lá neon dịu - làm giá trị chữ rực rỡ
      number: '#FFD700',   // Vàng Gold - tạo điểm nhấn cho số liệu
      bool: '#BD93F9',   // Tím Pastel sáng - cho boolean/null
      null: '#BD93F9',
      arr: '#FFFFFF',
      comma: '#FFFFFF',
      plain: 'transparent',
    };

    function buildSpan(token) {
      const span = document.createElement('span');
      span.textContent = token.text;
      if (token.type !== 'plain') {
        span.style.color = colorMap[token.type] || '#c8d4f0';
      }
      return span;
    }

    // Type out one line at a time with a small stagger
    let lineDelay = 300; // ms before first line
    const LINE_GAP = 80; // ms between lines

    profileData.forEach((raw, idx) => {
      setTimeout(() => {
        const lineDiv = document.createElement('div');
        lineDiv.classList.add('tj-line');
        lineDiv.style.animationDelay = '0ms';

        const tokens = tokenizeLine(raw);
        tokens.forEach(tok => lineDiv.appendChild(buildSpan(tok)));

        container.appendChild(lineDiv);
      }, lineDelay + idx * LINE_GAP);
    });
  })();
    /* ============================================================
       1. CUSTOM CURSOR
    ============================================================ */
    const ring = document.getElementById('cursor-ring');
    const dot  = document.getElementById('cursor-dot');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    // Smooth ring follow
    (function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    })();

    // Hover state
    document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    });


    /* ============================================================
       2. BACKGROUND CANVAS — Animated Grid + Particles
    ============================================================ */
    (function setupCanvas() {
      const canvas = document.getElementById('bg-canvas');
      const ctx = canvas.getContext('2d');

      let W, H, particles = [];

      function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
      }

      // Create particles
      function initParticles() {
        particles = [];
        const N = Math.floor((W * H) / 18000);
        for (let i = 0; i < N; i++) {
          particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.2 + 0.3,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            a: Math.random() * 0.5 + 0.15
          });
        }
      }

      const GRID = 60; // grid cell size

      function draw(t) {
        ctx.clearRect(0, 0, W, H);

        /* --- Grid lines --- */
        ctx.strokeStyle = 'rgba(30,39,64,0.7)';
        ctx.lineWidth = 0.6;

        // Vertical
        for (let x = 0; x < W; x += GRID) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
        // Horizontal
        for (let y = 0; y < H; y += GRID) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }

        /* --- Particles --- */
        particles.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,255,231,${p.a})`;
          ctx.fill();
        });

        /* --- Pulse dot at intersection nearest mouse --- */
        const gx = Math.round(mx / GRID) * GRID;
        const gy = Math.round(my / GRID) * GRID;
        const pulse = 0.4 + 0.3 * Math.sin(t * 0.003);
        ctx.beginPath();
        ctx.arc(gx, gy, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,231,${pulse})`;
        ctx.fill();

        /* Ripple */
        const rippleR = 20 + 10 * Math.sin(t * 0.002);
        ctx.beginPath();
        ctx.arc(gx, gy, rippleR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,255,231,${0.08 + 0.04 * Math.sin(t * 0.002)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        requestAnimationFrame(draw);
      }

      resize();
      initParticles();
      requestAnimationFrame(draw);
      window.addEventListener('resize', () => { resize(); initParticles(); });
    })();


    /* ============================================================
       3. TYPED TEXT — Hero role cycling
    ============================================================ */
    (function typewriter() {
      const phrases = [
        'Software Engineer',
        'Full-Stack Builder',
        '.NET & Java Specialist',
        'Cloud Enthusiast'
      ];
      const el = document.getElementById('typed-text');
      let pIdx = 0, cIdx = 0, deleting = false;

      function tick() {
        const phrase = phrases[pIdx];
        if (!deleting) {
          el.textContent = phrase.slice(0, cIdx + 1);
          cIdx++;
          if (cIdx === phrase.length) {
            deleting = true;
            setTimeout(tick, 2200); // pause at end
            return;
          }
        } else {
          el.textContent = phrase.slice(0, cIdx - 1);
          cIdx--;
          if (cIdx === 0) {
            deleting = false;
            pIdx = (pIdx + 1) % phrases.length;
          }
        }
        setTimeout(tick, deleting ? 45 : 80);
      }
      tick();
    })();


    /* ============================================================
       4. SCROLL OBSERVER — Animate elements on scroll
    ============================================================ */
    (function scrollObserver() {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
          }
        });
      }, { threshold: 0.12 });

      document.querySelectorAll(
        '.fade-up, .stagger, .timeline-item, .project-card, .aboutme-card'
      ).forEach(el => observer.observe(el));
    })();


    /* ============================================================
       5. PROJECT CARD STAGGER — Delay each card
    ============================================================ */
    document.querySelectorAll('.project-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.1}s`;
    });

    /* About Me card stagger */
    document.querySelectorAll('.aboutme-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.12}s`;
    });


    /* ============================================================
       6. NAV — Highlight active section
    ============================================================ */
    (function navHighlight() {
      const sections = document.querySelectorAll('section[id]');
      const links    = document.querySelectorAll('.nav-links a');

      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            links.forEach(a => {
              a.style.color = a.getAttribute('href') === '#' + e.target.id
                ? 'var(--accent)' : '';
            });
          }
        });
      }, { threshold: 0.4 });

      sections.forEach(s => obs.observe(s));
    })();


    /* ============================================================
       7. SMOOTH SCROLL for nav links
    ============================================================ */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

/* ============================================================
   8. PROJECT TAB SWITCHER
============================================================ */
    function switchTab(id, btn) {
      document.querySelectorAll('.project-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.project-tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('panel-' + id).classList.add('active');
      btn.classList.add('active');
      // Re-trigger scroll observer for cards in new panel
      document.querySelectorAll('#panel-' + id + ' .project-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.1}s`;
        setTimeout(() => card.classList.add('visible'), 50);
      });
    }
    // Make sure academic cards are visible on load
    document.querySelectorAll('#panel-academic .project-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.1}s`;
    });


