function hideAll(){
  document.querySelectorAll("main, section").forEach(e=>{
    if(e.id) e.classList.add("hidden");
  });

  const result=document.getElementById("result");
  if(result) result.classList.add("hidden");
}

function scrollTop(){
  window.scrollTo({top:0,behavior:"smooth"});
}

function showHome(){
  hideAll();
  document.getElementById("home").classList.remove("hidden");
  scrollTop();
}

function showMIL(){
  hideAll();
  document.getElementById("mil").classList.remove("hidden");
  scrollTop();
}

function showCases(){
  hideAll();
  document.getElementById("cases").classList.remove("hidden");
  updateUnlocks();
  scrollTop();
}

function startInvestigation(){
  hideAll();
  document.getElementById("investigation").classList.remove("hidden");
  updateEvidence();
  scrollTop();
}

function updateEvidence(){
  let answered=0;

  ["q1","q2","q3","q4","q5"].forEach(id=>{
    const e=document.getElementById(id);
    if(e && e.value!=="") answered++;
  });

  const counter=document.getElementById("evidenceCount");
  if(counter) counter.textContent=answered+"/5";
}


/* =========================================================
   CASE RESULT POPUP
========================================================= */

function showCaseModal(score, caseNumber, solved, nextAction){

  const old=document.getElementById("detectiveResultPopup");
  if(old) old.remove();

  const overlay=document.createElement("div");

  overlay.id="detectiveResultPopup";

  Object.assign(overlay.style,{
    position:"fixed",
    top:"0",
    left:"0",
    right:"0",
    bottom:"0",
    width:"100%",
    height:"100%",
    zIndex:"2147483647",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    padding:"20px",
    boxSizing:"border-box",
    background:"rgba(3,5,7,.90)",
    backdropFilter:"blur(12px)"
  });

  const box=document.createElement("div");

  Object.assign(box.style,{
    width:"min(480px,100%)",
    maxHeight:"90vh",
    overflowY:"auto",
    boxSizing:"border-box",
    background:"#0b0f14",
    border:"1px solid #3b4652",
    borderTop:"3px solid #d8a84e",
    boxShadow:"0 30px 100px rgba(0,0,0,.85)",
    padding:"28px",
    fontFamily:"Inter,Arial,sans-serif",
    color:"#f1f3f5",
    textAlign:"center",
    position:"relative"
  });

  const icon=document.createElement("div");

  Object.assign(icon.style,{
    width:"68px",
    height:"68px",
    margin:"0 auto 20px",
    borderRadius:"50%",
    border:`1px solid ${solved ? "#63c78a" : "#d8a84e"}`,
    color:solved ? "#63c78a" : "#d8a84e",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    fontSize:"30px",
    fontFamily:"monospace",
    boxShadow:solved
      ? "0 0 25px rgba(99,199,138,.12)"
      : "0 0 25px rgba(216,168,78,.12)"
  });

  icon.textContent=solved ? "✓" : "!";

  const label=document.createElement("div");
  label.textContent="MEDIA DETECTIVE / INVESTIGATION REPORT";

  Object.assign(label.style,{
    color:"#697480",
    fontFamily:"monospace",
    fontSize:"9px",
    letterSpacing:"2px",
    marginBottom:"9px"
  });

  const title=document.createElement("h2");
  title.textContent=`CASE #${String(caseNumber).padStart(3,"0")} ANALYSIS COMPLETE`;

  Object.assign(title.style,{
    margin:"0 0 15px",
    fontFamily:"monospace",
    fontSize:"19px",
    letterSpacing:"1px",
    lineHeight:"1.4"
  });

  const status=document.createElement("div");
  status.textContent=solved ? "● CASE SOLVED" : "● NEEDS REVIEW";

  Object.assign(status.style,{
    display:"inline-block",
    padding:"7px 14px",
    border:`1px solid ${solved ? "#63c78a" : "#d8a84e"}`,
    color:solved ? "#63c78a" : "#d8a84e",
    fontFamily:"monospace",
    fontSize:"10px",
    letterSpacing:"1px",
    marginBottom:"22px"
  });

  const scoreBox=document.createElement("div");

  Object.assign(scoreBox.style,{
    border:"1px solid #28313b",
    background:"rgba(255,255,255,.02)",
    padding:"18px",
    textAlign:"left"
  });

  scoreBox.innerHTML=`
    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      font-family:monospace;
    ">
      <span style="
        color:#68727e;
        font-size:9px;
        letter-spacing:1.3px;
      ">EVIDENCE ACCURACY</span>

      <strong style="
        color:#f1f3f5;
        font-size:23px;
      ">${score}%</strong>
    </div>

    <div style="
      height:5px;
      margin-top:13px;
      background:#252d36;
      overflow:hidden;
    ">
      <div style="
        width:${score}%;
        height:100%;
        background:${solved ? "#63c78a" : "#d8a84e"};
      "></div>
    </div>
  `;

  const message=document.createElement("p");

  message.textContent=solved
    ? "Your evidence analysis meets the required threshold. The case file can now be advanced."
    : "Your evidence analysis needs another review. Examine the evidence and try the case again.";

  Object.assign(message.style,{
    color:"#9ba5b0",
    fontSize:"13px",
    lineHeight:"1.7",
    margin:"20px 5px"
  });

  const details=document.createElement("div");

  Object.assign(details.style,{
    borderTop:"1px solid #252d36",
    borderBottom:"1px solid #252d36",
    padding:"14px 0",
    marginTop:"5px",
    color:"#626d79",
    fontFamily:"monospace",
    fontSize:"9px",
    letterSpacing:"1px"
  });

  details.innerHTML=`
    <div>CASE FILE: #${String(caseNumber).padStart(3,"0")}</div>
    <div style="margin-top:7px">
      STATUS: ${solved ? "CLOSED / NEXT FILE UNLOCKED" : "OPEN / REVIEW REQUIRED"}
    </div>
  `;

  const button=document.createElement("button");

  button.textContent=solved
    ? "CONTINUE INVESTIGATION  →"
    : "REVIEW CASE  →";

  Object.assign(button.style,{
    width:"100%",
    marginTop:"20px",
    padding:"14px",
    border:"1px solid #d8a84e",
    background:"#d8a84e",
    color:"#080a0d",
    fontFamily:"monospace",
    fontSize:"10px",
    fontWeight:"700",
    letterSpacing:"1px",
    cursor:"pointer"
  });

  button.onclick=()=>{
    overlay.remove();

    if(typeof nextAction==="function"){
      nextAction();
    }
  };

  box.appendChild(icon);
  box.appendChild(label);
  box.appendChild(title);
  box.appendChild(status);
  box.appendChild(scoreBox);
  box.appendChild(message);
  box.appendChild(details);
  box.appendChild(button);

  overlay.appendChild(box);
  document.body.appendChild(overlay);
}


/* =========================================================
   CASE 1
========================================================= */

function solveCase(){

  let correct=0;
  let unanswered=0;

  ["q1","q2","q3","q4","q5"].forEach(id=>{
    const e=document.getElementById(id);

    if(!e || e.value===""){
      unanswered++;
    }else if(e.value==="correct"){
      correct++;
    }
  });

  if(unanswered>0){

    showCaseModal(
      Math.round((correct/5)*100),
      1,
      false,
      ()=>{}
    );

    return;
  }

  const score=Math.round((correct/5)*100);
  const solved=score>=75;

  if(solved){
    localStorage.setItem("case2Unlocked","true");
  }

  showCaseModal(
    score,
    1,
    solved,
    ()=>{
      showCases();
    }
  );
}


/* =========================================================
   CASE 2
========================================================= */

function solveCase2(){

  let correct=0;
  let unanswered=0;

  ["c2q1","c2q2","c2q3","c2q4","c2q5"].forEach(id=>{
    const e=document.getElementById(id);

    if(!e || e.value===""){
      unanswered++;
    }else if(e.value==="correct"){
      correct++;
    }
  });

  if(unanswered>0){

    showCaseModal(
      Math.round((correct/5)*100),
      2,
      false,
      ()=>{}
    );

    return;
  }

  const score=Math.round((correct/5)*100);
  const solved=score>=75;

  if(solved){
    localStorage.setItem("case3Unlocked","true");
  }

  showCaseModal(
    score,
    2,
    solved,
    ()=>{
      showCases();
    }
  );
}


/* =========================================================
   CASE 3
========================================================= */

function solveCase3(){

  let correct=0;
  let unanswered=0;

  ["c3q1","c3q2","c3q3","c3q4","c3q5"].forEach(id=>{
    const e=document.getElementById(id);

    if(!e || e.value===""){
      unanswered++;
    }else if(e.value==="correct"){
      correct++;
    }
  });

  if(unanswered>0){

    showCaseModal(
      Math.round((correct/5)*100),
      3,
      false,
      ()=>{}
    );

    return;
  }

  const score=Math.round((correct/5)*100);
  const solved=score>=75;

  if(solved){
    localStorage.setItem("case3Completed","true");
  }

  showCaseModal(
    score,
    3,
    solved,
    ()=>{
      showCases();
    }
  );
}


/* =========================================================
   CASE UNLOCK SYSTEM
========================================================= */

function updateUnlocks(){

  const case2=document.getElementById("case2Card");
  const case3=document.getElementById("case3Card");

  if(case2 && localStorage.getItem("case2Unlocked")==="true"){

    case2.classList.remove("locked-case");
    case2.classList.add("case-clickable");

    case2.onclick=function(){
      hideAll();

      const page=document.getElementById("case2");

      if(page){
        page.classList.remove("hidden");
      }

      scrollTop();
    };

    const icon=case2.querySelector(".evidence-icon");
    const text=case2.querySelector("p");
    const tag=case2.querySelector(".evidence-tag");

    if(icon) icon.textContent="📰";
    if(text) text.textContent="Investigate a misleading headline and learn why context matters.";
    if(tag) tag.textContent="OPEN CASE";
  }

  if(case3 && localStorage.getItem("case3Unlocked")==="true"){

    case3.classList.remove("locked-case");
    case3.classList.add("case-clickable");
    case3.classList.add("unlocked");

    case3.onclick=function(){
      hideAll();

      const page=document.getElementById("case3");

      if(page){
        page.classList.remove("hidden");
      }

      scrollTop();
    };

    const icon=case3.querySelector(".evidence-icon");
    const text=case3.querySelector("p");
    const tag=case3.querySelector(".evidence-tag");

    if(icon) icon.textContent="🎥";
    if(text) text.textContent="Investigate a viral video and verify its original context.";
    if(tag) tag.textContent="OPEN CASE";
  }
}

document.addEventListener("DOMContentLoaded",()=>{
  updateUnlocks();
});

/* =========================================================
   FINAL ANSWER UI
   Select elements are converted to hidden inputs.
   The existing solveCase functions still use the same IDs.
========================================================= */

function buildAnswerCards() {

  document.querySelectorAll(".questions select").forEach(select => {

    if (select.dataset.answerConverted === "true") return;

    let options = Array.from(select.options)
      .filter(option => option.value !== "");

    if (!options.length) return;

    /* Fisher-Yates shuffle.
       The option value stays attached to its answer,
       so the scoring system still knows which answer is correct. */
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    const container = document.createElement("div");
    container.className = "answer-options";
    container.dataset.for = select.id;

    const letters = ["A", "B", "C", "D"];

    options.slice(0, 4).forEach((option, index) => {

      const card = document.createElement("button");

      card.type = "button";
      card.className = "answer-choice";

      card.innerHTML =
        '<span class="answer-letter">' + letters[index] + '</span>' +
        '<span class="answer-text">' + option.textContent + '</span>';

      card.addEventListener("click", function() {

        container
          .querySelectorAll(".answer-choice")
          .forEach(item => item.classList.remove("selected"));

        card.classList.add("selected");

        hiddenInput.value = option.value;

        if (typeof updateEvidence === "function") {
          updateEvidence();
        }
      });

      container.appendChild(card);
    });

    /* Keep the same ID/value interface used by solveCase(). */
    const hiddenInput = document.createElement("input");

    hiddenInput.type = "hidden";
    hiddenInput.id = select.id;
    hiddenInput.name = select.name || select.id;
    hiddenInput.value = "";

    select.parentNode.insertBefore(container, select);
    select.parentNode.insertBefore(hiddenInput, select);

    /* Completely eliminate the original dropdown. */
    select.remove();
  });
}


document.addEventListener("DOMContentLoaded", function() {
  buildAnswerCards();
});
