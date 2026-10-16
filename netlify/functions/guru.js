// Proxy server-side Netlify. Website is served from Netlify; data stays on the SAME Google Sheet.
const SCRIPT_URL = process.env.KELAS_VB_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbx7AtQm2kTVFqqrCVRqY7bPs5RftnvGjggI19abAmZmvi_ClWzRBbeKo0iNfXYPE3T2/exec';
const allowed = new Set(['simpanAbsensi','simpanNilaiKuisPantun','kirimJawabanTugas']);

function reply(statusCode, data) {
  return {statusCode,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'},body:JSON.stringify(data)};
}

exports.handler = async function(event) {
  try {
    if(!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec(?:\?.*)?$/.test(SCRIPT_URL)){
      return reply(503,{ok:false,pesan:'URL Google Apps Script belum diatur.'});
    }
    if(event.httpMethod==='GET') {
      const u=new URL(SCRIPT_URL);
      u.searchParams.set('api','public');
      const remote=await fetch(u.toString(),{signal:AbortSignal.timeout(20000),redirect:'follow',headers:{'Accept':'application/json'}});
      if(!remote.ok) return reply(502,{ok:false,pesan:'Google Apps Script tidak dapat diakses. Periksa izin Anyone dan deployment.'});
      const data=await remote.json();
      if(!data || !Array.isArray(data.pelajaran) || !Array.isArray(data.tugas)) return reply(502,{ok:false,pesan:'Respons Apps Script tidak sesuai. Ganti Code.gs dan terbitkan versi baru.'});
      return reply(200,data);
    }
    if(event.httpMethod!=='POST') return reply(405,{ok:false,pesan:'Metode tidak diizinkan.'});
    if(!event.body || event.body.length>16000) return reply(413,{ok:false,pesan:'Ukuran data tidak valid.'});
    let data;try{data=JSON.parse(event.body);}catch(_){return reply(400,{ok:false,pesan:'Format data salah.'});}
    if(!allowed.has(data.action))return reply(400,{ok:false,pesan:'Perintah tidak diizinkan.'});
    if(!data.payload || typeof data.payload!=='object' || Array.isArray(data.payload)) return reply(400,{ok:false,pesan:'Data wajib diisi.'});
    const remote=await fetch(SCRIPT_URL,{
      method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({action:data.action,payload:data.payload}),
      signal:AbortSignal.timeout(25000),redirect:'follow'
    });
    if(!remote.ok)return reply(502,{ok:false,pesan:'Server Google Apps Script gagal menerima pengiriman.'});
    let result;try{result=await remote.json();}catch(_){return reply(502,{ok:false,pesan:'Hasil Apps Script bukan JSON. Perbarui Code.gs dan deployment.'});}
    if(!result || typeof result.ok!=='boolean')return reply(502,{ok:false,pesan:'Konfirmasi Google Sheets tidak valid.'});
    return reply(200,result);
  }catch(err){
    return reply(502,{ok:false,pesan:err.name==='TimeoutError'?'Sambungan terlalu lama. Periksa Google Sheets sebelum mencoba lagi.':'Gagal terhubung ke Apps Script. Periksa pengaturan dan coba kembali.'});
  }
};
