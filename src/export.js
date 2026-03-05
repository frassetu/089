
export function exportPDF(state, calc){
  const hasJsPDF = window.jspdf && window.jspdf.jsPDF;
  if (!hasJsPDF){
    alert('jsPDF non chargé. (Optionnel)');
    return;
  }
  const doc = new window.jspdf.jsPDF();
  doc.text('Rapport interventions', 14, 16);
  doc.text('Jour: ' + state.day + '  Date: ' + (state.date||'—'), 14, 24);
  doc.text(`Astreinte: ${state.startH}h${state.startM} → ${state.endH}h${state.endM}`, 14, 32);
  doc.text('Interventions (hh:mm):', 14, 40);
  let y = 48; let i=1;
  for(const r of state.rows){
    doc.text(`${i++}. ${r.dh}h${r.dm} → ${r.fh}h${r.fm}`, 18, y); y += 6;
  }
  y += 6;
  doc.text(`Total interventions: ${calc.totalText}`, 14, y); y+=6;
  doc.text(`Fenêtre 11 h min inter: ${calc.bestText}`, 14, y); y+=6;
  doc.text(`Récup 089: ${calc.recupText}`, 14, y);
  doc.save('rapport-astreinte.pdf');
}

export function exportXLSX(state, calc){
  if (!window.XLSX){
    // Fallback CSV minimal
    const rows = [['Jour','Date','Début','Fin','TotalInterv(h)','Recup(h)','Fenetre11h(deb)']];
    rows.push([
      state.day,
      state.date||'',
      `${state.startH}:${String(state.startM).padStart(2,'0')}`,
      `${state.endH}:${String(state.endM).padStart(2,'0')}`,
      calc.total.toFixed(2).replace('.',','),
      calc.recup.toFixed(2).replace('.',','),
      calc.bestStart.toFixed(2).replace('.',',')
    ]);
    let csv = rows.map(r => r.map(x => '"'+String(x).replace('"','""')+'"').join(';')).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'astreinte.csv'; a.click();
    return;
  }
  // Implémentation XLSX si lib présente
  const wb = window.XLSX.utils.book_new();
  const data = [{
    Jour: state.day,
    Date: state.date||'',
    Debut: `${state.startH}:${String(state.startM).padStart(2,'0')}`,
    Fin: `${state.endH}:${String(state.endM).padStart(2,'0')}`,
    TotalInterventions_h: calc.total,
    Recup089_h: calc.recup,
    Fenetre11h_deb: calc.bestStart
  }];
  const ws = window.XLSX.utils.json_to_sheet(data);
  window.XLSX.utils.book_append_sheet(wb, ws, 'Résumé');
  const ws2 = window.XLSX.utils.aoa_to_sheet([
    ['#','Heure début','Minute','Heure fin','Minute']
  ].concat(state.rows.map((r,i)=>[i+1,r.dh,r.dm,r.fh,r.fm])));
  window.XLSX.utils.book_append_sheet(wb, ws2, 'Interventions');
  window.XLSX.writeFile(wb, 'astreinte.xlsx');
}
