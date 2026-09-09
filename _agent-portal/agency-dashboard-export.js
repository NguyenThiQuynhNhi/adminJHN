/* Small, dependency-free exports. Real XLSX (OOXML ZIP), not renamed HTML/CSV. */
(function(root){
  'use strict';
  const utf8=s=>new TextEncoder().encode(s);
  const xml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c])).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'');
  const safe=v=>typeof v==='string'&&/^[\s]*[=+@-]/.test(v)?"'"+v:v;
  const csv=rows=>'\ufeff'+rows.map(row=>row.map(v=>'"'+String(safe(v)??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');
  function crc(bytes){let value=0xffffffff;for(const b of bytes){value^=b;for(let i=0;i<8;i++)value=(value>>>1)^((value&1)?0xedb88320:0);}return (value^0xffffffff)>>>0;}
  function zip(files){
    const chunks=[],central=[];let offset=0;
    const header=(length,entries)=>{const a=new Uint8Array(length),d=new DataView(a.buffer);for(const [at,v,size] of entries)size===2?d.setUint16(at,v,true):d.setUint32(at,v,true);return a;};
    for(const [name,text] of Object.entries(files)){
      const n=utf8(name),b=utf8(text),c=crc(b),local=header(30,[[0,0x04034b50],[4,20,2],[14,c],[18,b.length],[22,b.length],[26,n.length,2]]);
      chunks.push(local,n,b);central.push(header(46,[[0,0x02014b50],[4,20,2],[6,20,2],[16,c],[20,b.length],[24,b.length],[28,n.length,2],[42,offset]]),n);offset+=30+n.length+b.length;
    }
    const size=central.reduce((n,a)=>n+a.length,0);return new Blob([...chunks,...central,header(22,[[0,0x06054b50],[8,Object.keys(files).length,2],[10,Object.keys(files).length,2],[12,size],[16,offset]])],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  }
  function xlsx(rows){
    const ns='http://schemas.openxmlformats.org/spreadsheetml/2006/main';
    const col=n=>{let s='';for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s;};
    const sheet=`<worksheet xmlns="${ns}"><sheetData>${rows.map((row,i)=>`<row r="${i+1}">${row.map((v,j)=>typeof v==='number'&&Number.isFinite(v)?`<c r="${col(j)}${i+1}"><v>${v}</v></c>`:`<c r="${col(j)}${i+1}" t="inlineStr"><is><t xml:space="preserve">${xml(v)}</t></is></c>`).join('')}</row>`).join('')}</sheetData></worksheet>`;
    return zip({'[Content_Types].xml':'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
      '_rels/.rels':'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
      'xl/workbook.xml':`<workbook xmlns="${ns}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Dashboard" sheetId="1" r:id="rId1"/></sheets></workbook>`,
      'xl/_rels/workbook.xml.rels':'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
      'xl/worksheets/sheet1.xml':sheet});
  }
  function download(rows,name,format){const blob=format==='xlsx'?xlsx(rows):new Blob([csv(rows)],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${name.replace(/[^\p{L}\p{N}_ -]/gu,'').trim()||'Widget'}_${root.AgencyDashboardModel.tokyoDay(new Date())}.${format}`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  root.AgencyDashboardExport={csv,xlsx,download};
})(window);
