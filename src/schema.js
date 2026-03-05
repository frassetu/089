
// Dessin du schéma: astreinte (barre), interventions (hachures), fenêtre 11 h (flèche)
export function drawSchema(canvas, D, ints, best){
  if (!canvas) return; const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height; ctx.clearRect(0,0,W,H);
  const pad = 40; const Y = H/2; const BAR_H = 16; const scale = (W - 2*pad) / Math.max(0.1, D||1);

  // Barre d'astreinte
  ctx.strokeStyle = '#64748b'; ctx.lineWidth = 1; ctx.fillStyle = '#0b1220';
  ctx.strokeRect(pad, Y - BAR_H/2, Math.max(1, D*scale), BAR_H);

  // Interventions (hachures)
  for(const it of ints){
    const x = pad + it.s * scale; const w = Math.max(1, (it.e - it.s) * scale);
    ctx.save();
    ctx.beginPath(); ctx.rect(x, Y - BAR_H/2, w, BAR_H); ctx.clip();
    ctx.fillStyle = '#94a3b8';
    for(let dx = -w; dx < w; dx += 6){
      ctx.beginPath();
      ctx.moveTo(x + dx, Y - BAR_H/2);
      ctx.lineTo(x + dx + 8, Y + BAR_H/2);
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = '#94a3b8'; ctx.strokeRect(x, Y - BAR_H/2, w, BAR_H);
  }

  // Flèche de la fenêtre 11 h
  if (best && isFinite(best.t)){
    const x1 = pad + best.t * scale; const x2 = pad + (best.t + 11) * scale;
    const y = Y + BAR_H + 14;
    ctx.strokeStyle = '#22c55e'; ctx.fillStyle = '#22c55e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
    // Pointe
    ctx.beginPath(); ctx.moveTo(x2, y); ctx.lineTo(x2-8, y-4); ctx.lineTo(x2-8, y+4); ctx.closePath(); ctx.fill();
  }

  // Graduations 0 et fin
  ctx.fillStyle = '#e5e7eb'; ctx.font = '12px system-ui';
  ctx.fillText('0', pad-10, Y - BAR_H/2 - 6);
  ctx.fillText(D.toFixed(2).replace('.',','), pad + D*scale - 10, Y - BAR_H/2 - 6);
}
