/* Doodles: Schindeldach, Zeichen-Animationen, Kopier-Knöpfe */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Schindeldach erzeugen ---------- */
  document.querySelectorAll('.roof-svg').forEach(function (svg) {
    var shingles = svg.querySelector('.shingles');
    var ridge = svg.querySelector('.ridge');
    if (!shingles) return;

    var W = 1480;
    var skyH = parseInt(svg.dataset.sky || '104', 10);
    var rows = parseInt(svg.dataset.rows || '4', 10);
    var SW = 64;      // Schindelbreite
    var STEP = 30;    // vertikaler Versatz der Reihen
    var clays = ['#C65E31', '#BD5229', '#CE6B3C', '#B04A24', '#C25532'];

    // dunkle Fläche hinter den Schindeln, damit keine Lücken durchscheinen
    var back = document.createElementNS(NS, 'rect');
    back.setAttribute('x', -4);
    back.setAttribute('y', skyH + 2);
    back.setAttribute('width', W + 8);
    back.setAttribute('height', (rows - 1) * STEP + 22);
    back.setAttribute('fill', '#8A3A1E');
    shingles.appendChild(back);

    // untere Reihen zuerst zeichnen, obere überlappen sie
    for (var r = rows - 1; r >= 0; r--) {
      var y = skyH + r * STEP;
      var off = (r % 2) ? -SW / 2 : 0;
      for (var x = off - SW; x < W + SW; x += SW) {
        var jx = (Math.random() * 2 - 1) * 1.6;
        var jr = (Math.random() * 2 - 1) * 2;
        var g = document.createElementNS(NS, 'g');
        g.setAttribute('transform',
          'translate(' + (x + jx) + ' ' + y + ') rotate(' + jr.toFixed(2) + ' 32 24)');
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('d', 'M1 2 h62 v20 a31 24 0 0 1 -62 0 z');
        p.setAttribute('fill', clays[Math.floor(Math.random() * clays.length)]);
        p.setAttribute('class', 'shingle');
        p.style.setProperty('--d', Math.round((x / W) * 650 + r * 70) + 'ms');
        g.appendChild(p);
        shingles.appendChild(g);
      }
    }

    // Firstkappen obendrauf
    if (ridge) {
      for (var rx = -12; rx < W + 40; rx += 46) {
        var rj = (Math.random() * 2 - 1) * 1.5;
        var rg = document.createElementNS(NS, 'g');
        rg.setAttribute('transform', 'translate(' + rx + ' ' + (skyH + 2) + ') rotate(' + rj.toFixed(2) + ')');
        var rp = document.createElementNS(NS, 'path');
        rp.setAttribute('d', 'M0 0 a23 20 0 0 1 46 0 z');
        rp.setAttribute('class', 'ridgecap');
        rp.style.setProperty('--d', Math.round((rx / W) * 650) + 'ms');
        rg.appendChild(rp);
        ridge.appendChild(rg);
      }
    }
  });

  /* ---------- Linien zeichnen sich beim Scrollen ---------- */
  var drawEls = Array.prototype.slice.call(document.querySelectorAll('.draw'));
  drawEls.forEach(function (el) {
    var len = el.getTotalLength ? el.getTotalLength() : 0;
    if (!len) return;
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = reduceMotion ? 0 : len;
  });
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('drawn');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    drawEls.forEach(function (el) { io.observe(el); });
  } else {
    drawEls.forEach(function (el) { el.classList.add('drawn'); });
  }

  /* ---------- Kopier-Knöpfe ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        var old = btn.textContent;
        btn.textContent = 'Kopiert ✓';
        btn.classList.add('ok');
        setTimeout(function () {
          btn.textContent = old;
          btn.classList.remove('ok');
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) { /* egal */ }
        document.body.removeChild(ta);
        done();
      }
    });
  });

  /* ---------- Jahr im Footer ---------- */
  document.querySelectorAll('.year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
