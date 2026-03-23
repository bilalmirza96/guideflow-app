/* GuideFlow Shared Scripts — extracted from guideflow-app.html */
const ALLOWED_DOMAINS=['stmichaels.org','stmichaels.com','stmichaels.ca'];
let chartsNeedRefresh=false;
let totalCases=127,roleCounts={SC:0,SJ:98,TA:4,FA:25},submittedEmail='',resendTimerInterval=null,resendSeconds=30,isLoggedIn=true;
let chartDonut,chartTrend,chartRoles;
const acgmeData=[{name:'Abdominal',min:250,logged:34},{name:'Alimentary Tract',min:180,logged:28},{name:'Laparoscopic',min:175,logged:30},{name:'Endoscopy',min:85,logged:22},{name:'Vascular',min:50,logged:8},{name:'Trauma',min:50,logged:9},{name:'Surgical Crit Care',min:40,logged:12},{name:'Breast',min:40,logged:6},{name:'Skin / Soft Tissue',min:25,logged:11},{name:'Head & Neck',min:25,logged:5},{name:'Thoracic',min:20,logged:2},{name:'Pediatric',min:20,logged:4},{name:'Endocrine',min:15,logged:4},{name:'Plastic',min:10,logged:2}];
function buildACGMEBars(){const c=document.getElementById('acgme-bars');c.innerHTML='';
const benchmarks={Abdominal:42,Alimentary:35,Laparoscopic:38,Endoscopy:20,Vascular:12,Trauma:15,'Surgical Crit Care':14,Breast:8,'Skin / Soft Tissue':10,'Head & Neck':6,Thoracic:5,Pediatric:5,Endocrine:4,Plastic:3};
acgmeData.forEach(d=>{const pct=Math.min(d.logged/d.min*100,100),met=d.logged>=d.min;let cls=met?'met':pct>=50?'high':pct>=25?'mid':'low';
const bKey=Object.keys(benchmarks).find(k=>d.name.startsWith(k));const bench=bKey?benchmarks[bKey]:Math.round(d.min*0.15);
const diff=d.logged-bench;const deltaClass=diff>=0?'ahead':'behind';const deltaText=diff>=0?'+'+diff+' ahead':Math.abs(diff)+' behind';
c.innerHTML+=`<div class="cl-acgme-row"><span class="cl-acgme-name">${d.name}</span><div class="cl-acgme-bar-wrap"><div class="cl-acgme-bar-fill ${cls}" style="width:${pct}%"></div></div><span class="cl-acgme-count${met?' met':''}">${d.logged} / ${d.min}</span><span class="cl-acgme-pct">${Math.round(pct)}%</span><span class="cl-acgme-delta ${deltaClass}">${deltaText}</span></div>`})}
function getCSS(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()}
function initCharts(){
if(chartDonut)chartDonut.destroy();if(chartTrend)chartTrend.destroy();if(chartRoles)chartRoles.destroy();
const fill=getCSS('--chart-donut-fill'),bg=getCSS('--chart-donut-bg'),barC=getCSS('--chart-bar'),barH=getCSS('--chart-bar-hi'),txt3=getCSS('--text-3'),border=getCSS('--border');
const rSC=getCSS('--chart-role-sc'),rSJ=getCSS('--chart-role-sj'),rTA=getCSS('--chart-role-ta'),rFA=getCSS('--chart-role-fa');
chartDonut=new Chart(document.getElementById('chart-donut'),{type:'doughnut',data:{datasets:[{data:[totalCases,850-totalCases],backgroundColor:[fill,bg],borderWidth:0,borderRadius:4}]},options:{cutout:'78%',responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false},tooltip:{enabled:false}},animation:{animateRotate:true,duration:900}}});
const months=['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],vals=[6,8,10,9,12,11,14,10,8,12,13,14];
chartTrend=new Chart(document.getElementById('chart-trend'),{type:'bar',data:{labels:months,datasets:[{data:vals,backgroundColor:barC,hoverBackgroundColor:barH,borderRadius:4,borderSkipped:false}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:getCSS('--bg-raised'),titleColor:getCSS('--text-1'),bodyColor:getCSS('--text-2'),borderColor:border,borderWidth:1,padding:10,cornerRadius:8,displayColors:false,callbacks:{label:ctx=>ctx.raw+' cases'}}},scales:{x:{grid:{display:false},ticks:{color:txt3,font:{family:'DM Sans',size:11}},border:{display:false}},y:{grid:{color:border,lineWidth:0.5},ticks:{color:txt3,font:{family:'DM Sans',size:11},stepSize:5},border:{display:false},beginAtZero:true}}}});
chartRoles=new Chart(document.getElementById('chart-roles'),{type:'doughnut',data:{labels:['SJ','FA','TA','SC'],datasets:[{data:[roleCounts.SJ,roleCounts.FA,roleCounts.TA,roleCounts.SC],backgroundColor:[rSJ,rFA,rTA,rSC],borderWidth:0,borderRadius:3}]},options:{cutout:'65%',responsive:true,maintainAspectRatio:true,plugins:{legend:{display:false},tooltip:{backgroundColor:getCSS('--bg-raised'),titleColor:getCSS('--text-1'),bodyColor:getCSS('--text-2'),borderColor:border,borderWidth:1,padding:8,cornerRadius:8,displayColors:true,boxWidth:8,boxHeight:8}}}});
}
/* ========================================
   LOG TYPE TOGGLE FUNCTIONALITY
   ======================================== */
// SECTION:scripts:caselogs START
function switchLogType(type) {
  const operativeForm = document.getElementById('operative-form');
  const bedsideForm = document.getElementById('bedside-form');
  const toggleOperative = document.getElementById('toggle-operative');
  const toggleBedside = document.getElementById('toggle-bedside');
  if (type === 'operative') {
    operativeForm.style.display = 'block';
    bedsideForm.style.display = 'none';
    toggleOperative.classList.add('active');
    toggleBedside.classList.remove('active');
  } else if (type === 'bedside') {
    operativeForm.style.display = 'none';
    bedsideForm.style.display = 'block';
    toggleBedside.classList.add('active');
    toggleOperative.classList.remove('active');
  }
}

/* ========================================
   VOICE DICTATION MODAL
   ======================================== */
function openDictation() {
  const backdrop = document.getElementById('dictation-backdrop');
  const modal = document.getElementById('dictation-modal');
  backdrop.style.display = 'block';
  modal.style.display = 'block';
  backdrop.classList.add('visible');
  modal.classList.add('visible');
}

function closeDictation(applyMock) {
  const backdrop = document.getElementById('dictation-backdrop');
  const modal = document.getElementById('dictation-modal');
  backdrop.style.display = 'none';
  modal.style.display = 'none';
  backdrop.classList.remove('visible');
  modal.classList.remove('visible');
  if (applyMock) {
    document.getElementById('f-proc').value = 'Laparoscopic Cholecystectomy';
    document.getElementById('f-role').value = 'SJ';
    document.getElementById('f-cat').value = 'Biliary';
    document.getElementById('f-autonomy').value = 'passive-help';
    showToast('Voice transcription applied');
  }
}

/* ========================================
   EPA ASSESSMENT MODAL
   ======================================== */
function showEpaModal(procName, role, date) {
  const backdrop = document.getElementById('epa-backdrop');
  const modal = document.getElementById('epa-modal');
  document.getElementById('epa-procedure-name').textContent = procName;
  const roleBadge = document.getElementById('epa-role-badge');
  roleBadge.textContent = role;
  roleBadge.className = 'role-badge ' + role.toLowerCase();
  const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  document.getElementById('epa-case-date').textContent = formattedDate;
  backdrop.style.display = 'block';
  modal.style.display = 'block';
  backdrop.classList.add('visible');
  modal.classList.add('visible');
  window.currentEpaCase = { procedureName: procName, role: role, date: date };
}

function closeEpaModal(sendRequest) {
  const backdrop = document.getElementById('epa-backdrop');
  const modal = document.getElementById('epa-modal');
  backdrop.style.display = 'none';
  modal.style.display = 'none';
  backdrop.classList.remove('visible');
  modal.classList.remove('visible');
  if (sendRequest && window.currentEpaCase) {
    showToast('EPA request sent to attending');
    const caseRows = document.querySelectorAll('[data-case-row]');
    if (caseRows.length > 0) {
      const mostRecentRow = caseRows[caseRows.length - 1];
      if (!mostRecentRow.querySelector('.case-epa-badge')) {
        const badge = document.createElement('span');
        badge.className = 'case-epa-badge';
        badge.textContent = 'EPA SENT';
        const procCell = mostRecentRow.querySelector('[data-procedure-name]');
        if (procCell) procCell.appendChild(badge);
      }
    }
  }
  window.currentEpaCase = null;
}

/* ========================================
   OPERATIVE CASE SUBMISSION WITH EPA FLOW
   ======================================== */
function submitCaseWithEpa() {
  const procedure = document.getElementById('f-proc');
  const role = document.getElementById('f-role');
  const date = document.getElementById('f-date');

  if (!procedure || !procedure.value || !role || !role.value || !date || !date.value) {
    showToast('Please fill in required fields');
    return;
  }

  const procName = procedure.value;
  const roleValue = role.value;
  const dateValue = date.value;

  submitCase();
  showEpaModal(procName, roleValue, dateValue);
}

/* ========================================
   BEDSIDE PROCEDURE FORM SUBMISSION
   ======================================== */
function submitBedside() {
  const procedureType = document.getElementById('f-bp-type').value;
  const site = document.getElementById('f-bp-site').value;
  const ultrasound = document.getElementById('f-bp-us').checked;
  const supervised = document.getElementById('f-bp-super').value;
  const complications = document.getElementById('f-bp-comp').value;
  const date = document.getElementById('f-bp-date').value;
  const attending = document.getElementById('f-bp-attending').value;
  const comments = document.getElementById('f-bp-notes').value;
  if (!procedureType || !date) {
    showToast('Please fill in all required fields');
    return;
  }
  const submissionData = {
    type: 'bedside', procedureType, site, ultrasoundGuided: ultrasound,
    supervised, complications, date, attending, comments,
    timestamp: new Date().toISOString()
  };
  console.log('Bedside procedure submission:', submissionData);
  addBedsideCaseToTable(submissionData);
  resetBedsideForm();
  showToast('Bedside procedure logged successfully');
}

function resetBedsideForm() {
  document.getElementById('f-bp-type').value = '';
  document.getElementById('f-bp-site').value = '';
  document.getElementById('f-bp-us').checked = false;
  document.getElementById('f-bp-super').value = '';
  document.getElementById('f-bp-comp').value = '';
  document.getElementById('f-bp-date').value = '';
  document.getElementById('f-bp-attending').value = '';
  document.getElementById('f-bp-notes').value = '';
}

function addBedsideCaseToTable(caseData) {
  const tbody = document.getElementById('cases-tbody');
  if (!tbody) return;
  const row = document.createElement('tr');
  row.setAttribute('data-case-row', 'true');
  const procedureMap = {
    'Central Line (IJ)': 'Central Line (IJ)', 'Central Line (Subclavian)': 'Central Line (Subclavian)',
    'Central Line (Femoral)': 'Central Line (Femoral)', 'Arterial Line (Radial)': 'Arterial Line (Radial)',
    'Arterial Line (Femoral)': 'Arterial Line (Femoral)', 'Chest Tube': 'Chest Tube',
    'Thoracentesis': 'Thoracentesis', 'Paracentesis': 'Paracentesis',
    'Wound VAC': 'Wound VAC', 'Abscess I&D': 'Abscess I&D',
    'Tracheostomy Care': 'Tracheostomy Care', 'G/J-Tube Management': 'G/J-Tube Management',
    'Drain Management': 'Drain Management'
  };
  const procName = procedureMap[caseData.procedureType] || caseData.procedureType;
  const formattedDate = new Date(caseData.date + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  row.innerHTML = `<td data-procedure-name>${procName}</td><td>${caseData.site}</td><td>${caseData.ultrasoundGuided ? 'Yes' : 'No'}</td><td>${caseData.supervised}</td><td>${caseData.complications}</td><td>${caseData.attending}</td><td>${formattedDate}</td>`;
  tbody.appendChild(row);
}
// SECTION:scripts:caselogs END

function navigate(page) {
  var pageMap = { home:'guidelines.html', caselogs:'caselogs.html', admin:'admin.html', rotation:'rotation.html', fellowship:'fellowship.html', heatmap:'heatmap.html', login:'login.html' };
  if (pageMap[page]) window.location.href = pageMap[page];
}
function validateEmail(e){if(!e.trim())return'Please enter your email address.';if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))return'Please enter a valid email address.';const d=e.split('@')[1]?.toLowerCase();if(!ALLOWED_DOMAINS.includes(d))return"This email domain isn't associated with St. Michael's Hospital.";return null}
function handleLoginSubmit(){const i=document.getElementById('login-email'),er=document.getElementById('login-email-error'),b=document.getElementById('login-submit-btn'),e=i.value.trim();i.classList.remove('has-error');er.classList.remove('visible');const m=validateEmail(e);if(m){i.classList.add('has-error');er.textContent=m;er.classList.add('visible');return}b.classList.add('loading');b.disabled=true;setTimeout(()=>{b.classList.remove('loading');b.disabled=false;submittedEmail=e;document.getElementById('login-form').classList.add('hidden');document.getElementById('confirm-view').classList.add('active');document.getElementById('confirm-email').textContent=e;startResendTimer();showToast('Magic link sent')},1500)}
function startResendTimer(){resendSeconds=30;const t=document.getElementById('resend-timer'),b=document.getElementById('resend-btn');b.disabled=true;t.style.display='';if(resendTimerInterval)clearInterval(resendTimerInterval);resendTimerInterval=setInterval(()=>{resendSeconds--;if(resendSeconds<=0){clearInterval(resendTimerInterval);b.disabled=false;t.style.display='none'}else{t.textContent=`0:${resendSeconds.toString().padStart(2,'0')}`}},1000)}
function handleResend(){showToast('Magic link resent');startResendTimer()}
function backToLoginForm(){document.getElementById('login-form').classList.remove('hidden');document.getElementById('confirm-view').classList.remove('active');if(resendTimerInterval)clearInterval(resendTimerInterval)}
document.getElementById('login-email').addEventListener('keydown',e=>{if(e.key==='Enter')handleLoginSubmit()});
document.getElementById('login-email').addEventListener('input',()=>{document.getElementById('login-email').classList.remove('has-error');document.getElementById('login-email-error').classList.remove('visible')});
document.getElementById('nav-login-btn').addEventListener('click',()=>{if(isLoggedIn){isLoggedIn=false;navigate('login');showToast('Logged out')}else{navigate('login')}});
document.getElementById('confirm-view').addEventListener('dblclick',()=>{isLoggedIn=true;navigate('home');showToast('Signed in as '+submittedEmail)});
function submitCase(){const p=document.getElementById('f-proc').value.trim(),r=document.getElementById('f-role').value,c=document.getElementById('f-cat').value,d=document.getElementById('f-date').value;if(!p||!r){showToast('Please fill in required fields');return}totalCases++;if(roleCounts[r]!==undefined)roleCounts[r]++;
document.getElementById('donut-num').textContent=totalCases;document.getElementById('case-count-label').textContent=totalCases+' logged';document.getElementById('m-pgy3').textContent=Math.min(totalCases,250);document.getElementById('m-pgy3-bar').style.width=Math.min(totalCases/250*100,100).toFixed(1)+'%';document.getElementById('m-month').textContent=parseInt(document.getElementById('m-month').textContent)+1;
document.getElementById('rl-sc').textContent=roleCounts.SC;document.getElementById('rl-sj').textContent=roleCounts.SJ;document.getElementById('rl-ta').textContent=roleCounts.TA;document.getElementById('rl-fa').textContent=roleCounts.FA;
if(chartDonut){chartDonut.data.datasets[0].data=[totalCases,850-totalCases];chartDonut.update()}
if(chartRoles){chartRoles.data.datasets[0].data=[roleCounts.SJ,roleCounts.FA,roleCounts.TA,roleCounts.SC];chartRoles.update()}
const rc=r.toLowerCase(),dt=new Date(d+'T12:00:00'),ds=dt.toLocaleDateString('en-US',{month:'short',day:'numeric'}),tb=document.getElementById('cases-tbody'),tr=document.createElement('tr');tr.innerHTML=`<td class="case-name">${p||'Untitled'}</td><td>${ds}</td><td><span class="role-badge ${rc}">${r}</span></td><td>${c||'—'}</td>`;tb.insertBefore(tr,tb.firstChild);
document.getElementById('f-id').value='';document.getElementById('f-proc').value='';document.getElementById('f-role').value='';document.getElementById('f-cat').value='';document.getElementById('f-notes').value='';document.getElementById('f-trauma').checked=false;showToast('Case logged successfully')}
function showToast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800)}
document.querySelectorAll('.service-item').forEach(i=>{i.addEventListener('click',e=>{e.preventDefault();const n=i.dataset.service;document.getElementById('service-label').textContent=n;document.getElementById('home-title').textContent=n+' Dashboard';document.querySelectorAll('.service-item').forEach(x=>x.classList.remove('dd-active'));i.classList.add('dd-active');const dd=i.closest('.service-switcher').querySelector('.service-dropdown');dd.classList.add('closing');setTimeout(()=>dd.classList.remove('closing'),300)})});
function setView(t,b){document.querySelectorAll('.view-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById('list-view').style.display=t==='list'?'':'none';document.getElementById('grid-view').style.display=t==='grid'?'grid':'none'}
function toggleSB(id,btn){document.getElementById(id).classList.toggle('closed');btn.querySelector('.sb-chev').classList.toggle('open')}
function sbAct(el,id){document.getElementById(id).querySelectorAll('.sb-link').forEach(i=>i.classList.remove('active'));el.classList.add('active')}
function toggleTheme(){document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';if(document.getElementById('page-caselogs').classList.contains('active'))setTimeout(initCharts,80);else chartsNeedRefresh=true;buildACGMEBars()}
function switchAdminTab(tab){document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active'));document.getElementById('admin-'+tab).classList.add('active');document.querySelectorAll('.admin-tab').forEach(t=>{if(t.textContent.toLowerCase()===tab)t.classList.add('active')});const sbLinks=document.querySelectorAll('#sbl-admin-nav .sb-link');sbLinks.forEach(l=>{l.classList.remove('active');if(l.textContent.trim().toLowerCase()===tab.toLowerCase())l.classList.add('active')})}
function handleFileSelect(input){if(input.files.length){const f=input.files[0];if(f.size>25*1024*1024){showToast('File too large — 25 MB limit');input.value='';return}document.getElementById('admin-title').value=f.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');showToast('File selected: '+f.name)}}
function handleGuidelineUpload(){
  const title=document.getElementById('admin-title').value.trim();
  const specialty=document.getElementById('admin-specialty').value;
  const version=document.getElementById('admin-version').value.trim()||'1.0';
  const status=document.getElementById('admin-status').value;
  const fileInput=document.getElementById('file-input');
  const content=document.getElementById('admin-content').value.trim();
  const url=document.getElementById('admin-url').value.trim();
  if(!title||!specialty){showToast('Title and Specialty are required');return}
  if(!fileInput.files.length&&!content&&!url){showToast('Please upload a file, paste content, or enter a URL');return}
  const btn=document.querySelector('#admin-guidelines .btn-primary');
  btn.disabled=true;btn.textContent='Publishing...';
  setTimeout(()=>{
    let iconType='txt',fileName=title;
    if(fileInput.files.length){
      fileName=fileInput.files[0].name;
      const ext=fileName.split('.').pop().toLowerCase();
      if(ext==='pdf')iconType='pdf';
      else if(['doc','docx'].includes(ext))iconType='doc';
    }
    const list=document.getElementById('guidelines-list');
    const row=document.createElement('div');
    row.className='gl-row';
    const today=new Date();
    const dateStr=today.toLocaleDateString('en-US',{month:'short',day:'numeric'});
    const statusClass=status==='Published'?'live':'draft';
    const statusText=status==='Published'?'Live':'Draft';
    row.innerHTML='<div class="gl-icon '+iconType+'">'+iconType.toUpperCase()+'</div><div class="gl-body"><div class="gl-name">'+title+'</div><div class="gl-meta">'+specialty+' · v'+version+' · Updated '+dateStr+'</div></div><span class="gl-status '+statusClass+'">'+statusText+'</span><div class="gl-actions"><button class="gl-action-btn" title="Edit" aria-label="Edit guideline"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button><button class="gl-action-btn" title="Delete" aria-label="Delete guideline"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></div>';
    list.insertBefore(row,list.firstChild);
    const stats=document.querySelectorAll('#admin-guidelines .admin-stat-num');
    stats[0].textContent=parseInt(stats[0].textContent)+1;
    if(status==='Published')stats[1].textContent=parseInt(stats[1].textContent)+1;
    else stats[2].textContent=parseInt(stats[2].textContent)+1;
    fileInput.value='';
    document.getElementById('admin-title').value='';
    document.getElementById('admin-specialty').value='';
    document.getElementById('admin-version').value='';
    document.getElementById('admin-status').value='Draft';
    document.getElementById('admin-tags').value='';
    document.getElementById('admin-content').value='';
    document.getElementById('admin-url').value='';
    btn.disabled=false;btn.textContent='Publish Guideline';
    showToast('Guideline published: '+title);
  },800);
}
(function(){const dz=document.getElementById('drop-zone');if(!dz)return;dz.addEventListener('dragover',function(e){e.preventDefault();e.stopPropagation();dz.classList.add('dragover')});dz.addEventListener('dragleave',function(e){e.preventDefault();e.stopPropagation();dz.classList.remove('dragover')});dz.addEventListener('drop',function(e){e.preventDefault();e.stopPropagation();dz.classList.remove('dragover');if(e.dataTransfer.files.length){const f=e.dataTransfer.files[0];if(f.size>25*1024*1024){showToast('File too large — 25 MB limit');return}const fi=document.getElementById('file-input');const dt=new DataTransfer();dt.items.add(f);fi.files=dt.files;document.getElementById('admin-title').value=f.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ');showToast('File dropped: '+f.name)}})})();
// ===== Conference Database & Abstract Deadline Engine =====
const CONFERENCES=[
{id:"asc",name:"Academic Surgical Congress",abbr:"ASC",fellowships:["all"],deadlineMonth:8,confMonth:2,awards:true,url:"https://www.academicsurgicalcongress.org/abstracts/"},
{id:"acs",name:"ACS Clinical Congress",abbr:"ACS",fellowships:["all"],deadlineMonth:3,confMonth:10,awards:true,url:"https://www.facs.org/for-medical-professionals/conferences-and-meetings/clinical-congress/call-for-abstracts/"},
{id:"ssa",name:"Southern Surgical Association",abbr:"SSA",fellowships:["all"],deadlineMonth:6,confMonth:12,awards:false,url:"https://southernsurg.org/meeting/Abstract-Submission/"},
{id:"sesc",name:"Southeastern Surgical Congress",abbr:"SESC",fellowships:["all"],deadlineMonth:10,confMonth:2,awards:true,url:"https://www.sesurgical.org/annual-meeting/call-for-abstracts/"},
{id:"wsa",name:"Western Surgical Association",abbr:"WSA",fellowships:["all"],deadlineMonth:8,confMonth:11,awards:true,url:"https://www.westernsa.org/meetings/call-for-abstracts/"},
{id:"sages",name:"SAGES Annual Meeting",abbr:"SAGES",fellowships:["MIS","Bariatric","Colorectal","HPB"],deadlineMonth:10,confMonth:4,awards:true,url:"https://www.sages.org/meetings/abstracts/"},
{id:"ifso",name:"IFSO World Congress",abbr:"IFSO",fellowships:["MIS","Bariatric"],deadlineMonth:3,confMonth:8,awards:true,url:"https://www.ifso.com/annual-meeting/abstract-submission/"},
{id:"ascrs",name:"ASCRS Annual Scientific Meeting",abbr:"ASCRS",fellowships:["Colorectal"],deadlineMonth:10,confMonth:5,awards:true,url:"https://www.fascrs.org/annual-scientific-meeting/abstract-submission"},
{id:"acpgbi",name:"ACPGBI Annual Meeting",abbr:"ACPGBI",fellowships:["Colorectal"],deadlineMonth:12,confMonth:7,awards:true,url:"https://www.acpgbi.org.uk/events/annual-meeting/abstract-submission/"},
{id:"ahpba",name:"AHPBA Annual Meeting",abbr:"AHPBA",fellowships:["HPB","Transplant"],deadlineMonth:9,confMonth:3,awards:true,url:"https://www.ahpba.org/annual-meeting/abstract-submission/"},
{id:"ssat",name:"SSAT / Digestive Disease Week",abbr:"SSAT",fellowships:["HPB","Colorectal","MIS"],deadlineMonth:10,confMonth:5,awards:true,url:"https://www.ssat.com/meetings/abstract-submission/"},
{id:"asts",name:"ASTS Annual Meeting",abbr:"ASTS",fellowships:["Transplant","HPB"],deadlineMonth:10,confMonth:1,awards:true,url:"https://www.asts.org/meetings/annual-meeting/abstract-submission"},
{id:"ilts",name:"ILTS Annual Congress",abbr:"ILTS",fellowships:["Transplant","HPB"],deadlineMonth:11,confMonth:5,awards:true,url:"https://www.ilts.org/annual-congress/abstract-submission/"},
{id:"aast",name:"AAST Annual Meeting",abbr:"AAST",fellowships:["Trauma","SurgicalCriticalCare"],deadlineMonth:2,confMonth:9,awards:true,url:"https://www.aast.org/annual-meeting/Online-Abstract-Submission/"},
{id:"east",name:"EAST Scientific Assembly",abbr:"EAST",fellowships:["Trauma","SurgicalCriticalCare"],deadlineMonth:8,confMonth:1,awards:true,url:"https://www.east.org/meetings/annual-scientific-assembly/abstract-submission"},
{id:"sso",name:"SSO Annual Meeting",abbr:"SSO",fellowships:["SurgicalOncology","Breast"],deadlineMonth:11,confMonth:3,awards:true,url:"https://www.surgonc.org/annual-meeting/abstract-submission/"},
{id:"asbrs",name:"ASBrS Annual Meeting",abbr:"ASBrS",fellowships:["Breast","SurgicalOncology"],deadlineMonth:11,confMonth:5,awards:true,url:"https://www.breastsurgeons.org/meeting/abstracts/"},
{id:"svs",name:"SVS Vascular Annual Meeting",abbr:"SVS",fellowships:["Vascular"],deadlineMonth:12,confMonth:6,awards:true,url:"https://vascular.org/meetings-events/vascular-annual-meeting/abstract-submission"},
{id:"aaes",name:"AAES Annual Meeting",abbr:"AAES",fellowships:["Endocrine","SurgicalOncology"],deadlineMonth:11,confMonth:4,awards:true,url:"https://www.endocrinesurgery.org/annual-meeting/abstract-submission/"},
{id:"sts",name:"STS Annual Meeting",abbr:"STS",fellowships:["Thoracic"],deadlineMonth:7,confMonth:1,awards:true,url:"https://www.sts.org/meetings/annual-meeting/abstract-submission"}
];
const RESIDENT_FELLOWSHIP='HPB';
function getNextDeadline(month){
  const now=new Date();const y=now.getFullYear();
  // Assume deadline is the 15th of the month
  let d=new Date(y,month-1,15);
  if(d<now)d=new Date(y+1,month-1,15);
  return d;
}
function daysUntil(date){return Math.ceil((date-new Date())/(1000*60*60*24))}
function getConferencesForFellowship(goal){
  return CONFERENCES.filter(c=>c.fellowships.includes('all')||c.fellowships.includes(goal));
}
function buildDeadlines(){
  const body=document.getElementById('deadlines-body');if(!body)return;
  const confs=getConferencesForFellowship(RESIDENT_FELLOWSHIP);
  const withDays=confs.map(c=>{const dl=getNextDeadline(c.deadlineMonth);return{...c,deadline:dl,days:daysUntil(dl)}}).sort((a,b)=>a.days-b.days);
  // Show up to 6 nearest
  const show=withDays.slice(0,6);
  let html='';
  show.forEach(c=>{
    const urgent=c.days<=60;const soon=c.days<=120;
    const color=urgent?'var(--ac-orange)':soon?'var(--text-2)':'var(--text-3)';
    const monthNames=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dlStr=monthNames[c.deadline.getMonth()]+' '+c.deadline.getDate();
    html+=`<a href="${c.url}" target="_blank" rel="noopener" style="display:flex;align-items:center;padding:12px 20px;gap:12px;text-decoration:none;transition:background .12s;cursor:pointer;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background='none'">
      <div style="padding:3px 8px;border:1px solid var(--border);border-radius:4px;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--text-3);flex-shrink:0;">${c.abbr}</div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:14px;font-weight:500;color:var(--text-1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${c.name}</div>
        <div style="font-size:11px;color:var(--text-3);margin-top:2px;">Deadline ~${dlStr}${c.awards?' · ★ Resident awards':''}</div>
      </div>
      <div style="font-size:13px;font-weight:600;color:${color};flex-shrink:0;white-space:nowrap;">${c.days} days</div>
    </a>`;
  });
  html+=`<div style="padding:12px 20px;display:flex;justify-content:space-between;align-items:center;">
    <div style="font-size:11px;color:var(--text-3);">Filtered for your ${RESIDENT_FELLOWSHIP} fellowship goal · ${confs.length} conferences</div>
  </div>`;
  body.innerHTML=html;
}
// ── RSS PARSER — Behind the Knife podcast feed ─────────────────────────────
const BTK_RSS = 'https://feeds.megaphone.fm/behindtheknife';
const BTK_PROXY = 'https://api.allorigins.win/get?url=' + encodeURIComponent(BTK_RSS);

const rotationKeywords = {
  'General Surgery': ['surgery','surgical','cholecystectomy','appendectomy','hernia','biliary','bowel','colon','laparoscopic','lap','abdominal'],
  'Hepatobiliary': ['hepat','biliary','liver','pancrea','hpb','cholecystectomy','whipple','bile'],
  'Colorectal': ['colorectal','colon','rectal','anorectal','colectomy','bowel','ostomy','stoma'],
  'Trauma': ['trauma','injury','resuscitation','damage control','triage','emergency','acute care'],
  'Vascular': ['vascular','aorta','carotid','bypass','endovascular','aortic','aneurysm'],
  'Breast': ['breast','mastectomy','sentinel','axilla','oncoplastic'],
  'Endocrine': ['thyroid','parathyroid','adrenal','endocrine'],
  'Thoracic': ['thoracic','lung','esophag','mediastin','chest','thoracotomy'],
  'Transplant': ['transplant','liver transplant','kidney','procurement','rejection','immunosuppression'],
};

function scoreEpisode(title, desc, rotation) {
  const text = (title + ' ' + (desc||'')).toLowerCase();
  const keywords = rotationKeywords[rotation] || rotationKeywords['General Surgery'];
  return keywords.reduce((score, kw) => score + (text.includes(kw) ? 1 : 0), 0);
}

function formatDuration(seconds) {
  if (!seconds) return '';
  const s = parseInt(seconds);
  if (isNaN(s)) {
    return seconds.length > 5 ? seconds.slice(0,-3) + ' min' : seconds + ' min';
  }
  const m = Math.floor(s / 60);
  return m > 0 ? m + ' min' : s + ' sec';
}

function formatPubDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch(e) { return ''; }
}

async function loadBTKFeed() {
  const container = document.getElementById('podcast-feed-content');
  const status = document.getElementById('btk-status');
  if (!container) return;

  const currentService = document.getElementById('service-label')?.textContent || 'General Surgery';

  try {
    const res = await fetch(BTK_PROXY);
    const data = await res.json();
    const parser = new RSSParser({
      customFields: { item: [['itunes:duration','duration'],['itunes:summary','summary'],['itunes:image','image']] }
    });
    const feed = await parser.parseString(data.contents);

    const scored = feed.items.map(item => ({
      ...item,
      score: scoreEpisode(item.title, item.contentSnippet || item.summary, currentService)
    })).sort((a,b) => b.score - a.score || new Date(b.pubDate) - new Date(a.pubDate));

    const top = scored.slice(0, 5);
    if (status) status.textContent = 'Via Behind the Knife';

    container.innerHTML = top.map(ep => `
      <div class="podcast-episode" onclick="window.open('${ep.link||'https://behindtheknife.org'}','_blank')">
        <div class="podcast-play">
          <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0l10 6-10 6z"/></svg>
        </div>
        <div class="podcast-ep-body">
          <div class="podcast-ep-title">${ep.title || 'Untitled'}</div>
          <div class="podcast-ep-meta">Behind the Knife · ${formatPubDate(ep.pubDate)}</div>
        </div>
        <span class="podcast-ep-duration">${formatDuration(ep.duration || ep.itunes?.duration)}</span>
      </div>
    `).join('');

  } catch(err) {
    console.warn('BTK RSS fetch failed, showing fallback:', err);
    container.innerHTML = `
      <div class="podcast-episode" onclick="window.open('https://behindtheknife.org','_blank')">
        <div class="podcast-play"><svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0l10 6-10 6z"/></svg></div>
        <div class="podcast-ep-body"><div class="podcast-ep-title">Lap Chole: Navigating the Critical View of Safety</div><div class="podcast-ep-meta">Behind the Knife · Hepatobiliary</div></div>
        <span class="podcast-ep-duration">42 min</span>
      </div>
      <div class="podcast-episode" onclick="window.open('https://behindtheknife.org','_blank')">
        <div class="podcast-play"><svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0l10 6-10 6z"/></svg></div>
        <div class="podcast-ep-body"><div class="podcast-ep-title">Biliary Emergencies: Diagnosis and Management</div><div class="podcast-ep-meta">Behind the Knife · Hepatobiliary</div></div>
        <span class="podcast-ep-duration">38 min</span>
      </div>
      <div class="podcast-episode" onclick="window.open('https://behindtheknife.org','_blank')">
        <div class="podcast-play"><svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0l10 6-10 6z"/></svg></div>
        <div class="podcast-ep-body"><div class="podcast-ep-title">Inguinal Hernia Repair: Open vs. Laparoscopic</div><div class="podcast-ep-meta">Behind the Knife · General Surgery</div></div>
        <span class="podcast-ep-duration">51 min</span>
      </div>
      <div class="podcast-episode" onclick="window.open('https://behindtheknife.org','_blank')">
        <div class="podcast-play"><svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0l10 6-10 6z"/></svg></div>
        <div class="podcast-ep-body"><div class="podcast-ep-title">Managing the Difficult Cholecystectomy</div><div class="podcast-ep-meta">Behind the Knife · Hepatobiliary</div></div>
        <span class="podcast-ep-duration">44 min</span>
      </div>
      <div class="podcast-episode" onclick="window.open('https://behindtheknife.org','_blank')">
        <div class="podcast-play"><svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor"><path d="M0 0l10 6-10 6z"/></svg></div>
        <div class="podcast-ep-body"><div class="podcast-ep-title">ABSITE Prep: High-Yield Surgery Topics</div><div class="podcast-ep-meta">Behind the Knife · General Surgery</div></div>
        <span class="podcast-ep-duration">55 min</span>
      </div>
    `;
    if (status) status.textContent = 'Showing recent episodes';
  }
}

// ── PAPAPARSE — ACGME CSV Export ───────────────────────────────────────────
function exportCasesCSV() {
  const rows = [];
  const tableRows = document.querySelectorAll('#cases-tbody tr');

  tableRows.forEach((tr, i) => {
    const cells = tr.querySelectorAll('td');
    if (cells.length < 4) return;
    const procedure = cells[0]?.textContent?.trim() || '';
    const dateStr   = cells[1]?.textContent?.trim() || '';
    const role      = cells[2]?.querySelector('.role-badge')?.textContent?.trim() || '';
    const category  = cells[3]?.textContent?.trim() || '';

    rows.push({
      'Case ID':         `2026-${String(i+1).padStart(4,'0')}`,
      'Case Date':       dateStr,
      'PGY Year':        document.getElementById('f-pgy')?.value || '1',
      'Rotation':        document.getElementById('service-label')?.textContent || 'General Surgery',
      'Role':            role,
      'Site':            'St. Michael\'s Hospital',
      'Attending':       '',
      'Patient Type':    'Adult',
      'Defined Category': category !== '—' ? category : '',
      'Procedure / CPT': procedure,
      'Involved Trauma': 'No',
      'Comments':        '',
    });
  });

  if (rows.length === 0) {
    showToast('No cases to export');
    return;
  }

  const csv = Papa.unparse(rows, { quotes: true });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `guideflow-cases-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Exported ${rows.length} cases`);
}

// ── DATE-FNS — Deadline countdowns ─────────────────────────────────────────
function getDaysUntil(targetDateStr) {
  const df = window.dateFns;
  if (!df) return null;
  const today = df.startOfDay(new Date());
  const target = df.parseISO(targetDateStr);
  return df.differenceInDays(target, today);
}

function formatDeadlineCountdown(days) {
  if (days === null) return '';
  if (days < 0) return 'Closed';
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day left';
  return days + ' days';
}

const conferenceDeadlines = [
  { name:'SAGES Annual Meeting',   society:'SAGES', deadline:'2026-10-15', url:'https://www.sages.org/meetings/abstracts/' },
  { name:'AHPBA Annual Meeting',   society:'AHPBA', deadline:'2026-09-15', url:'https://www.ahpba.org/annual-meeting/abstract-submission/' },
  { name:'ASCRS Annual Meeting',   society:'ASCRS', deadline:'2026-10-20', url:'https://www.fascrs.org/annual-scientific-meeting/abstract-submission' },
  { name:'SSO Annual Meeting',     society:'SSO',   deadline:'2026-11-01', url:'https://www.surgonc.org/annual-meeting/abstract-submission/' },
  { name:'AAST Annual Meeting',    society:'AAST',  deadline:'2027-02-15', url:'https://www.aast.org/annual-meeting/Online-Abstract-Submission/' },
  { name:'Academic Surgical Congress', society:'ASC', deadline:'2026-08-08', url:'https://www.academicsurgicalcongress.org/abstracts/' },
  { name:'SVS Vascular Annual',    society:'SVS',   deadline:'2026-12-01', url:'https://vascular.org/meetings-events/vascular-annual-meeting/abstract-submission' },
  { name:'ASBrS Annual Meeting',   society:'ASBrS', deadline:'2026-11-07', url:'https://www.breastsurgeons.org/meeting/abstracts/' },
  { name:'STS Annual Meeting',     society:'STS',   deadline:'2026-07-15', url:'https://www.sts.org/meetings/annual-meeting/abstract-submission' },
  { name:'ASTS Annual Meeting',    society:'ASTS',  deadline:'2026-10-01', url:'https://www.asts.org/meetings/annual-meeting/abstract-submission' },
];

function buildDeadlineSection() {
  let container = document.getElementById('deadline-section');
  if (!container) return;

  const sorted = [...conferenceDeadlines]
    .map(c => ({ ...c, days: getDaysUntil(c.deadline) }))
    .filter(c => c.days !== null && c.days >= 0)
    .sort((a,b) => a.days - b.days)
    .slice(0, 4);

  container.innerHTML = sorted.map(c => {
    const urgent = c.days < 30;
    return `
      <div class="list-row" style="cursor:pointer" onclick="window.open('${c.url}','_blank')">
        <span class="tag" style="flex-shrink:0;min-width:52px;text-align:center">${c.society}</span>
        <div class="list-body">
          <span class="list-name">${c.name}</span>
          <span class="list-meta">Abstract deadline · ${new Date(c.deadline).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
        </div>
        <span class="deadline-date ${urgent?'urgent':''}">${formatDeadlineCountdown(c.days)}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-3);flex-shrink:0"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </div>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded',function(){buildACGMEBars();buildDeadlines();navigate('home');const lb=document.getElementById('nav-login-btn');lb.textContent=isLoggedIn?'Logout':'Login';document.getElementById('nav-avatar').style.display=isLoggedIn?'':'none';setTimeout(()=>{loadBTKFeed();buildDeadlineSection();},200)});
function handleAddContact(btn){btn.disabled=true;btn.textContent='Adding...';setTimeout(function(){btn.disabled=false;btn.textContent='Add Contact';showToast('Contact added')},800)}
(function(){var si=document.querySelector('.search-input');if(!si)return;si.addEventListener('input',function(){var q=si.value.trim().toLowerCase();var listRows=document.querySelectorAll('#list-view .list-row');var gridCards=document.querySelectorAll('#grid-view .guide-card');var matchCount=0;listRows.forEach(function(r){var name=r.querySelector('.list-name');var show=!q||name.textContent.toLowerCase().includes(q);r.style.display=show?'':'none';if(show)matchCount++});gridCards.forEach(function(c){var title=c.querySelector('.guide-title');var show=!q||title.textContent.toLowerCase().includes(q);c.style.display=show?'':'none'});var lv=document.getElementById('list-view');var gv=document.getElementById('grid-view');var existingEmpty=document.querySelectorAll('.empty-search');existingEmpty.forEach(function(e){e.remove()});if(q&&matchCount===0){var msg=document.createElement('div');msg.className='empty-search';msg.textContent='No guidelines found for "'+si.value.trim()+'"';lv.appendChild(msg.cloneNode(true));gv.appendChild(msg)}})})();
// Keyboard support for role="button" elements and sidebar toggles
document.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&(e.target.getAttribute('role')==='button'||e.target.classList.contains('sb-toggle'))){e.preventDefault();e.target.click()}});
// aria-expanded toggling for nav dropdowns
document.querySelectorAll('.nav-item').forEach(function(item){var btn=item.querySelector('.nav-btn');if(!btn)return;item.addEventListener('mouseenter',function(){btn.setAttribute('aria-expanded','true')});item.addEventListener('mouseleave',function(){btn.setAttribute('aria-expanded','false')})});
document.querySelectorAll('.service-switcher').forEach(function(sw){var btn=sw.querySelector('.service-btn');if(!btn)return;sw.addEventListener('mouseenter',function(){btn.setAttribute('aria-expanded','true')});sw.addEventListener('mouseleave',function(){btn.setAttribute('aria-expanded','false')})});

// ===== Command Palette (⌘K) =====
function openCmd(){document.getElementById('cmd-overlay').style.display='flex';setTimeout(function(){var ci=document.getElementById('cmd-input');if(ci)ci.focus()},50)}
function closeCmd(){document.getElementById('cmd-overlay').style.display='none'}
document.addEventListener('keydown',function(e){if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();openCmd()}if(e.key==='Escape')closeCmd()});
var navSearch=document.querySelector('.nav-search');if(navSearch)navSearch.addEventListener('click',function(){openCmd()});

// ===== Progress bar entrance animation =====
function animateBars(){document.querySelectorAll('.cl-metric-fill,.cl-acgme-bar-fill,.metric-fill').forEach(function(el){var target=el.style.width;el.style.width='0%';requestAnimationFrame(function(){setTimeout(function(){el.style.width=target},100)})})}

// ===== Form progressive disclosure =====
function toggleFormExpand(){
  var sec=document.getElementById('form-secondary');
  var btn=document.getElementById('form-expand-btn');
  if(!sec||!btn)return;
  if(sec.style.display==='none'){sec.style.display='';btn.classList.add('expanded');var txt=btn.querySelector('.expand-text');if(txt)txt.textContent='Fewer details'}
  else{sec.style.display='none';btn.classList.remove('expanded');var txt=btn.querySelector('.expand-text');if(txt)txt.textContent='More details'}
}
