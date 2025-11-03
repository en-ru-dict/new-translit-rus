//====другой кодер/декодер utf-8 (Xingsoft*2025)

function makeMap(str){
  const map = {};
  const pairs = str.trim().split(/\s+/);
  for(let p of pairs){const [ru,lat] = p.split(':');  if(ru && lat) map[ru] = lat; }
  return map
}

// ---------- 2. Таблицы ----------
let oldT='А:A Б:B В:V Г:G Д:D Е:E З:Z И:I Й:J К:K Л:L М:M Н:N О:O П:P Р:R С:S Т:T У:U Ф:F Х:H Ц:C Ы:Y Ж:X Ш:W Ю:Q';//3 другие
let newT='ё:1e Ё:1E щ:1w Щ:1W ь:6 Ь:16 ъ:5 Ъ:15 ч:4 Ч:14 э:3 Э:13 я:9 Я:19';
let allT=oldT+' '+newT+' '+oldT.toLowerCase();
let mEncode= makeMap(allT);//однозначный: старый транслит + 10 новых букв через QXW 0-9
let mEncode2= makeMap(allT);//краткий 1 символ это 1 буква
mEncode2['ё']='e'; //было 1+e ё=е читаемо, редкая
mEncode2['Ё']='E'; //было 1+E Ё=Е читаемо, редкая
mEncode2['щ']='7'; //было 1w или щ=ш=w читаемо Щтирлиц агент 007 из 17 мгн весны
mEncode2['Щ']='7'; //было 1W/17 Щ=щ, после точка+пробел заглавная автоматически
mEncode2['Ъ']='5'; //Ъ=ъ заглавных не бывает
mEncode2['Ь']='6'; //Ь=ь заглавных не бывает
mEncode2['Ч']='8'; //было 14, после точка+пробел заглавная автоматически
mEncode2['Э']='0'; //было 13, после точка+пробел заглавная автоматически
mEncode2['Я']='2'; //было 19, после точка+пробел заглавная автоматически
let mDecode={};
for(let k in mEncode)if(mEncode.hasOwnProperty(k)) mDecode[mEncode[k]]=k;
//алиасы синонимы, пишите как удобней, заглавные писать не обязательно
mDecode['7']='щ'; //1w
mDecode['17']='Щ';//1W
mDecode['8']='Ч'; //14
mDecode['2']='Я'; //19
mDecode['0']='Э'; //13
let latS='QWERTYUIOPASDFGHJKLZXCVBNM';//26
let rusS='ЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮЁ'; //33
latS=latS+latS.toLowerCase()+'0123456789';
rusS=rusS+rusS.toLowerCase();

// ---------- 4. Кодирование ----------
function encode_word(text,m){return text.split('').map(ch => m[ch] ?? ch).join('');}

function decoder(text){//универсальный. оба варианта
  let out = '',translit = false, le=text.length,c1,c2,i;
  for(i=0;i<le;i++){
   c1 = text.charAt(i); c2 = text.substring(i,i+2);
   if(c2 === '~~'){out+='~';i++;continue;}
   if(c1 === '~'){translit = !translit;continue;}
   if(!translit){out += c1;continue;}
   // ---- внутри транслита ----
   if(c1 === '1'){out += mDecode[c2] || '1?'; i++; continue;}
   out += mDecode[c1] || c1;
  }
  out=out.split('. ').map(s=>s.substring(0,1).toUpperCase()+s.substring(1));
  return out.join('. ');//после точка+пробел заглавная автоматически
}

function encoder(text,m){
  let out='',s='',f=0,i=0,t=0,le=text.length;
  m=m? mEncode2:mEncode;
  for(i=0;i<le;i++){
   s=text.charAt(i);
   if(s=='~'){out+='~~';continue;}
   t=0;if(latS.indexOf(s)>=0)t=1;else if(rusS.indexOf(s)>=0)t=3;
   if(t===3){//rus
    if(f==0){f=1;out+='~';}
    s = m[s] || '?';
   }
   if(t===1)if(f==1){f=0;out+='~';}
   out+=s;
  }
  return out;
}
