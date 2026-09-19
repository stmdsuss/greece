const modal = document.querySelector('#ritualModal');
const content = document.querySelector('#ritualContent');
const progress = [...document.querySelectorAll('.ritual-progress span')];
let ritual = { step: 0, category: '선택 · 전환', question: '', plate: '청동 접시' };

function setStep(step) {
  ritual.step = step;
  progress.forEach((dot, index) => dot.classList.toggle('active', index <= Math.min(step, 3)));
  const screens = [questionScreen, offeringScreen, plateScreen, oracleScreen];
  content.innerHTML = screens[step]();
  bindRitualEvents();
}

function questionScreen() {
  return `<div class="ritual"><div class="ritual-icon">?</div><span class="eyebrow gold">ASK THE DIVINE</span><h2 id="ritualTitle">어떤 길을 묻고 싶으신가요?</h2><p>마음속 질문을 한 문장으로 남겨주세요.<br>구체적인 질문일수록 의식이 더욱 선명해집니다.</p><div class="category-row">${['사랑 · 관계','일 · 학업','선택 · 전환'].map(x=>`<button class="${ritual.category===x?'active':''}" data-category="${x}">${x}</button>`).join('')}</div><textarea class="question-input" maxlength="120" placeholder="예: 지금의 선택을 계속 믿고 나아가도 될까요?">${ritual.question}</textarea><button class="primary-btn next">질문을 새기다 →</button></div>`;
}
function offeringScreen() {
  return `<div class="ritual"><div class="ritual-icon">✦</div><span class="eyebrow gold">SYMBOLIC OFFERING</span><h2>무엇을 제물로 바치시겠습니까?</h2><p>당신에게 의미가 있는 것을 선택하십시오.<br>소유권이 아닌, 그 물건에 담긴 마음을 바치는 의식입니다.</p><label class="upload-zone"><img class="upload-preview" alt="선택한 제물 미리보기"><strong>사진을 촬영하거나 불러오기</strong><small>얼굴과 개인정보는 분석하지 않으며 언제든 삭제할 수 있습니다.</small><input type="file" accept="image/*"></label><button class="primary-btn next">이 제물을 바치다 →</button></div>`;
}
function plateScreen() {
  const plates=[['◉','청동 접시','무료'],['◌','은제 접시','900원'],['✦','별빛 제단','1,900원']];
  return `<div class="ritual"><div class="ritual-icon">⌄</div><span class="eyebrow gold">CHOOSE THE ALTAR</span><h2>제물을 올릴 자리를 고르세요</h2><p>접시는 결과가 아닌, 의식에 들이는 정성을 표현합니다.</p><div class="plates">${plates.map(([i,n,p])=>`<button class="plate-option ${ritual.plate===n?'active':''}" data-plate="${n}"><span>${i}</span><strong>${n}</strong><small>${p}</small></button>`).join('')}</div><button class="primary-btn next">의식을 시작하다 →</button></div>`;
}
function oracleScreen() {
  return `<div class="ritual"><div class="ritual-icon">☼</div><span class="eyebrow gold">THE ORACLE OF APOLLO</span><h2>아폴론의 신탁</h2><div class="oracle-result"><p>“열린 문이 모두 길은 아니다.<br>바람이 멎은 뒤에도 흔들리는<br>한 가지를 바라보라.”</p></div><p>신의 말에는 여러 길이 있습니다.<br>지금 당신에게 필요한 관점을 하나 선택하세요.</p><div class="sealed-options"><button data-interpret>🔒 &nbsp; 첫 번째 해석 · 지금 마주한 선택에 관하여</button><button data-interpret>🔒 &nbsp; 두 번째 해석 · 아직 보지 못한 위험에 관하여</button><button data-interpret>🔒 &nbsp; 세 번째 해석 · 마음속 진짜 욕망에 관하여</button></div></div>`;
}
function bindRitualEvents(){
  content.querySelectorAll('[data-category]').forEach(btn=>btn.onclick=()=>{ritual.category=btn.dataset.category; setStep(0)});
  const textarea=content.querySelector('textarea'); if(textarea) textarea.oninput=e=>ritual.question=e.target.value;
  const file=content.querySelector('input[type=file]'); if(file) file.onchange=e=>{const f=e.target.files[0]; if(!f)return; const img=content.querySelector('.upload-preview'); img.src=URL.createObjectURL(f); img.style.display='block'; content.querySelector('.upload-zone strong').textContent='의미가 담긴 제물을 선택했습니다';};
  content.querySelectorAll('[data-plate]').forEach(btn=>btn.onclick=()=>{ritual.plate=btn.dataset.plate; setStep(2)});
  const next=content.querySelector('.next'); if(next) next.onclick=()=>{if(ritual.step===0&&!ritual.question.trim()){showToast('신에게 전할 질문을 먼저 적어주세요.');return} setStep(ritual.step+1)};
  content.querySelectorAll('[data-interpret]').forEach(btn=>btn.onclick=()=>{btn.innerHTML='✦ &nbsp; 서두르지 말라는 뜻은 멈추라는 명령이 아닙니다. 주변의 기대가 아닌, 시간이 지나도 남아 있는 당신의 의지를 기준으로 선택하십시오.';btn.style.lineHeight='1.8'; showToast('해석의 봉인이 풀렸습니다. 신탁록에 저장되었습니다.')});
}
function openRitual(){modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';setStep(0)}
function closeRitual(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.querySelector('#startOracle').onclick=openRitual;
document.querySelector('#mobileOracle').onclick=openRitual;
document.querySelector('#closeModal').onclick=closeRitual;
modal.onclick=e=>{if(e.target===modal)closeRitual()};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeRitual()});

const titles={calendar:'운명의 달력',records:'신탁록',altar:'나의 제단'};
document.querySelectorAll('[data-page]').forEach(btn=>btn.onclick=()=>{
  document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===btn.dataset.page));
  const temple=btn.dataset.page==='temple'; document.querySelector('#temple').classList.toggle('active',temple);document.querySelector('#placeholder').classList.toggle('active',!temple);
  if(!temple)document.querySelector('#placeholderTitle').textContent=titles[btn.dataset.page]; window.scrollTo(0,0);
});
function showToast(message){const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove('show'),2800)}
