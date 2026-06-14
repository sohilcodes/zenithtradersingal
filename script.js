// ── DATA ──
const PAIRS = {
    currencies: [
        { name:'EUR/CAD OTC', emoji:'🇪🇺🇨🇦', profit:'93% • 93%' },
        { name:'NZD/CAD OTC', emoji:'🇳🇿🇨🇦', profit:'93% • 93%' },
        { name:'AUD/CAD OTC', emoji:'🇦🇺🇨🇦', profit:'92% • 91%' },
        { name:'AUD/JPY OTC', emoji:'🇦🇺🇯🇵', profit:'92% • 94%' },
        { name:'EUR/CHF OTC', emoji:'🇪🇺🇨🇭', profit:'92% • 93%' },
        { name:'GBP/CAD OTC', emoji:'🇬🇧🇨🇦', profit:'92% • 93%' },
        { name:'USD/BDT OTC', emoji:'🇺🇸🇧🇩', profit:'92% • 92%' },
        { name:'USD/EGP OTC', emoji:'🇺🇸🇪🇬', profit:'92% • 89%' },
        { name:'USD/JPY OTC', emoji:'🇺🇸🇯🇵', profit:'92% • 93%' },
        { name:'EUR/USD OTC', emoji:'🇪🇺🇺🇸', profit:'91% • 90%' },
        { name:'GBP/USD OTC', emoji:'🇬🇧🇺🇸', profit:'90% • 91%' },
        { name:'CHF/JPY OTC', emoji:'🇨🇭🇯🇵', profit:'90% • 92%' },
    ],
    commodities: [
        { name:'USCrude OTC', emoji:'🛢️', profit:'92% • 92%' },
        { name:'Silver OTC',  emoji:'🥈', profit:'85% • 81%' },
        { name:'Gold OTC',    emoji:'🥇', profit:'83% • 82%' },
        { name:'UKBrent OTC', emoji:'⛽', profit:'77% • 77%' },
    ]
};

const TIMES = ['5 sec','30 sec','1 min','5 min','15 min','30 min','1 hour','4 hours'];

let selectedPair = 'EUR/USD OTC';
let selectedTime = '1 min';
let currentCat   = 'currencies';

// ── LOGIN ──
(function(){
    const PASS = '#BenZ@Xyz';
    const KEY  = 'zenith_auth';
    const loginEl = document.getElementById('login-screen');
    const app     = document.getElementById('app');
    const topbar  = document.getElementById('topbar');
    const input   = document.getElementById('password-input');
    const btn     = document.getElementById('login-btn');
    const errEl   = document.getElementById('login-error');
    const eye     = document.getElementById('toggle-pw');

    function showApp(){
        loginEl.style.display = 'none';
        app.style.visibility  = 'visible';
        app.style.pointerEvents = 'auto';
        topbar.style.display  = 'flex';
        initApp();
    }

    if(sessionStorage.getItem(KEY)==='1'){ showApp(); return; }
    topbar.style.display = 'none';

    function tryLogin(){
        if(input.value === PASS){
            sessionStorage.setItem(KEY,'1');
            loginEl.style.opacity    = '0';
            loginEl.style.transition = 'opacity 0.4s';
            setTimeout(showApp, 420);
        } else {
            errEl.style.display   = 'block';
            errEl.style.animation = 'none';
            void errEl.offsetWidth;
            errEl.style.animation = 'shake 0.35s ease';
            input.value = '';
            input.focus();
        }
    }

    btn.addEventListener('click', tryLogin);
    input.addEventListener('keydown', e=>{ if(e.key==='Enter') tryLogin(); });
    eye.addEventListener('click', ()=>{
        input.type = input.type==='password' ? 'text' : 'password';
        eye.textContent = input.type==='password' ? '👁️' : '🙈';
    });
})();

// ── MAIN APP ──
function initApp(){
    try{ window.Telegram.WebApp.ready(); window.Telegram.WebApp.expand(); }catch(e){}

    // Winrate animation
    const fill  = document.getElementById('wr-fill');
    const numEl = document.getElementById('wr-num');
    const TARGET = 90;
    setTimeout(()=>{
        if(fill) fill.style.strokeDashoffset = 314 - (TARGET/100)*314;
        if(numEl){
            let c=0; const t=setInterval(()=>{
                c+=TARGET/60;
                if(c>=TARGET){c=TARGET;clearInterval(t);}
                numEl.textContent=Math.round(c)+'%';
            },33);
        }
    },400);

    updatePills();
    renderPairModal(currentCat);
    renderTimeModal();
}

// ── PILLS ──
function updatePills(){
    document.getElementById('pill-pair-text').textContent = selectedPair.replace(' OTC','');
    document.getElementById('pill-time-text').textContent = selectedTime;
}

// ── MODALS ──
function openModal(type){
    document.getElementById(type+'-modal').classList.add('open');
}
function closeModal(type){
    document.getElementById(type+'-modal').classList.remove('open');
}

function switchCat(el, cat){
    currentCat = cat;
    document.querySelectorAll('.modal-tab').forEach(t=>t.classList.remove('active'));
    el.classList.add('active');
    renderPairModal(cat);
}

function renderPairModal(cat){
    const list = document.getElementById('modal-pair-list');
    list.innerHTML = '';
    PAIRS[cat].forEach(p=>{
        const div = document.createElement('div');
        div.className = 'modal-item' + (selectedPair===p.name?' selected':'');
        div.innerHTML = `
            <div class="modal-item-left">
                <span class="modal-item-emoji">${p.emoji}</span>
                <div>
                    <div class="modal-item-name">${p.name}</div>
                    <div class="modal-item-profit">Profit 1min/5min • ${p.profit}</div>
                </div>
            </div>
            <div class="modal-item-check">✓</div>`;
        div.addEventListener('click',()=>{
            selectedPair = p.name;
            updatePills();
            renderPairModal(cat);
            setTimeout(()=>closeModal('pair'),180);
        });
        list.appendChild(div);
    });
}

function renderTimeModal(){
    const list = document.getElementById('modal-time-list');
    list.innerHTML = '';
    TIMES.forEach(t=>{
        const div = document.createElement('div');
        div.className = 'modal-item'+(selectedTime===t?' selected':'');
        div.innerHTML = `
            <div class="modal-item-left">
                <span class="modal-item-emoji">⏱</span>
                <div class="modal-item-name">${t}</div>
            </div>
            <div class="modal-item-check">✓</div>`;
        div.addEventListener('click',()=>{
            selectedTime = t;
            updatePills();
            renderTimeModal();
            setTimeout(()=>closeModal('time'),180);
        });
        list.appendChild(div);
    });
}

// ── GET SIGNAL ──
document.getElementById('get-signal-btn').addEventListener('click', ()=>{
    const s1 = document.getElementById('screen1');
    const s2 = document.getElementById('screen2');

    document.getElementById('ana-pair').textContent = selectedPair.replace(' OTC','');
    document.getElementById('ana-time').textContent = selectedTime;

    s1.classList.remove('active');
    s2.classList.add('active');

    // Progress bar
    const bar = document.getElementById('ana-bar');
    bar.style.width = '0%';
    setTimeout(()=>{ bar.style.width = '100%'; },50);

    // Analyzing texts
    const texts = ['Analyzing market...','Scanning patterns...','Calculating probability...','Validating signal...'];
    let i=0;
    const anaText = document.getElementById('ana-text');
    const txtInterval = setInterval(()=>{
        i++; if(i<texts.length) anaText.textContent = texts[i];
    },900);

    // Show result
    setTimeout(()=>{
        clearInterval(txtInterval);
        showResult();
    },4000);
});

function showResult(){
    const s2 = document.getElementById('screen2');
    const s3 = document.getElementById('screen3');
    s2.classList.remove('active');
    s3.classList.add('active');

    const isCall = Math.random()>0.5;
    const dirEl  = document.getElementById('res-direction');
    dirEl.textContent = isCall ? '⬆ CALL' : '⬇ PUT';
    dirEl.className   = 'result-direction ' + (isCall?'call-color':'put-color');

    document.getElementById('res-pair').textContent = selectedPair.replace(' OTC','');
    document.getElementById('res-time').textContent = selectedTime;
}

// ── GET NEW SIGNAL ──
document.getElementById('again-btn').addEventListener('click',()=>{
    const s3 = document.getElementById('screen3');
    const s1 = document.getElementById('screen1');
    s3.classList.remove('active');
    s1.classList.add('active');
});
              
