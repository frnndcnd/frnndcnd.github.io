(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))p(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const k of n.addedNodes)k.tagName==="LINK"&&k.rel==="modulepreload"&&p(k)}).observe(document,{childList:!0,subtree:!0});function i(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function p(r){if(r.ep)return;r.ep=!0;const n=i(r);fetch(r.href,n)}})();const b="./",L=`${b}photos/back-cover.svg`,o=[`${b}photos/cover.svg`,...Array.from({length:15},(t,a)=>`${b}photos/photo-${String(a+1).padStart(2,"0")}.png`)],x=document.querySelector("#app");function A(){const t=new URLSearchParams(window.location.search),a=t.get("name")||"Mi Álbum",p=t.get("date")||new Intl.DateTimeFormat("es-ES",{day:"2-digit",month:"long",year:"numeric"}).format(new Date);return{name:a,dateText:p}}const F=A();function g(){return`
    <div class="coverOverlay" aria-hidden="true">
      <div class="coverOverlayInner">
        <div class="coverName"></div>
        <div class="coverDate"></div>
      </div>
    </div>
  `}x.innerHTML=`
  <div class="appRoot">
    <main class="stage" id="stage">
      <button class="navBtn navPrev" id="prevBtn" aria-label="Página anterior" title="Anterior (←)">‹</button>

      <div class="bookWrap" id="bookWrap">
        <div class="book" id="book" role="application" aria-label="Visor de álbum">
          <div class="page backCoverFace isBackCover" id="backCoverFace" aria-hidden="true">
            <img class="backCoverImg" src="${L}" alt="" aria-hidden="true" />
          </div>

          <div class="page backOverlayFace isBackCover" id="backOverlayFace" aria-hidden="true">
            <img class="backCoverImg" src="${L}" alt="" aria-hidden="true" />
          </div>

          <div class="rings" aria-hidden="true">
            <span class="ring"></span>
            <span class="ring"></span>
            <span class="ring"></span>
          </div>

          <div class="page static single" id="staticPage">
            ${g()}
          </div>

          <div class="page underlay single" id="underlayPage" aria-hidden="true">
            ${g()}
          </div>

          <div class="sheet" id="sheet" aria-hidden="true">
            <div class="page face front">${g()}</div>
            <div class="page face back">${g()}</div>
          </div>
        </div>
      </div>

      <button class="navBtn navNext" id="nextBtn" aria-label="Página siguiente" title="Siguiente (→)">›</button>

      <div class="rotateHint" id="rotateHint" aria-hidden="true">
        <div class="rotateHintCard">
          <div class="rotateHintTitle">Gira el teléfono</div>
          <div class="rotateHintSub">Ponlo en horizontal para ver el álbum.</div>
        </div>
      </div>
    </main>
  </div>
`;const e={staticPage:document.querySelector("#staticPage"),underlayPage:document.querySelector("#underlayPage"),sheet:document.querySelector("#sheet"),sheetFront:document.querySelector("#sheet .face.front"),sheetBack:document.querySelector("#sheet .face.back"),prevBtn:document.querySelector("#prevBtn"),nextBtn:document.querySelector("#nextBtn"),bookWrap:document.querySelector("#bookWrap"),book:document.querySelector("#book"),backCoverFace:document.querySelector("#backCoverFace"),backOverlayFace:document.querySelector("#backOverlayFace")};let s=0,v=!1,c=!1,f=!1,m=null,h=[];function C(){for(const t of h)window.clearTimeout(t);h=[]}function P(){e.backOverlayFace&&e.backOverlayFace.classList.add("show")}function B(){e.backOverlayFace&&e.backOverlayFace.classList.remove("show")}function u(t,a){if(!a){t.classList.add("empty"),t.style.backgroundImage="";return}t.classList.remove("empty"),t.style.backgroundImage=`url(${a})`}function d(t,a){t.classList.toggle("isCover",a===0),t.classList.toggle("isBackCover",!1)}function l(t,a){const i=t.querySelector(".coverOverlay");if(!i)return;const p=a===0;if(i.hidden=!p,!p)return;const r=i.querySelector(".coverName"),n=i.querySelector(".coverDate");r&&(r.textContent=F.name),n&&(n.textContent=F.dateText)}function y(){const t=m??s;u(e.staticPage,o[t]),e.underlayPage.style.display="none",e.underlayPage.style.opacity="",e.underlayPage.classList.remove("isCover","isBackCover"),d(e.staticPage,t),l(e.staticPage,t),l(e.underlayPage,t),s>=o.length-1;const a=c?!0:s>0,i=!c;e.prevBtn.disabled=!a,e.nextBtn.disabled=!i}function w(){if(v||f||c||s<o.length-1)return;f=!0,C(),m=s,e.staticPage.style.opacity="1",B(),y(),requestAnimationFrame(()=>{c=!0,e.book.classList.add("backView"),e.bookWrap.classList.add("backView")}),h.push(window.setTimeout(()=>{c&&(P(),e.staticPage.style.opacity="0")},460));const t=a=>{a.propertyName==="transform"&&(e.book.removeEventListener("transitionend",t),P(),e.staticPage.style.opacity="0",f=!1,y())};e.book.addEventListener("transitionend",t)}function S(){if(v||f||!c)return;f=!0,c=!1,C(),m=s,e.staticPage.style.opacity="0",P(),y(),h.push(window.setTimeout(()=>{c||(B(),e.staticPage.style.opacity="1")},360)),requestAnimationFrame(()=>{e.book.classList.remove("backView"),e.bookWrap.classList.remove("backView")});const t=a=>{a.propertyName==="transform"&&(e.book.removeEventListener("transitionend",t),m=null,e.staticPage.style.opacity="",B(),f=!1,y())};e.book.addEventListener("transitionend",t),y()}function O(){if(v||c||f||s>=o.length-1)return;v=!0;const t=s+1,a=s===0;e.sheet.classList.toggle("noBend",a),e.sheet.classList.toggle("fullBleed",a),u(e.sheetFront,o[s]),u(e.sheetBack,o[t]),d(e.sheetFront,s),d(e.sheetBack,t),l(e.sheetFront,s),l(e.sheetBack,t),e.sheet.classList.remove("flipBack","flipForward","flipped"),e.sheet.style.display="block",e.sheet.style.transform="rotateY(0deg)",requestAnimationFrame(()=>{u(e.staticPage,o[t]),d(e.staticPage,t),l(e.staticPage,t),requestAnimationFrame(()=>{e.sheet.style.transform="",e.sheet.classList.add("flipForward")})});const i=()=>{s=t,e.staticPage.style.opacity="",e.underlayPage.style.display="none",e.sheet.style.display="none",e.sheet.classList.remove("flipForward","noBend","fullBleed"),v=!1,y()};e.sheet.addEventListener("animationend",i,{once:!0})}function q(){if(v||f)return;if(c){S();return}if(s<=0)return;v=!0;const t=s-1,a=t===0;e.sheet.classList.toggle("noBend",a),e.sheet.classList.toggle("fullBleed",a),u(e.sheetFront,o[t]),u(e.sheetBack,o[s]),d(e.sheetFront,t),d(e.sheetBack,s),l(e.sheetFront,t),l(e.sheetBack,s),e.sheet.classList.remove("flipForward","flipBack"),e.sheet.classList.add("flipped"),e.sheet.style.display="block",u(e.underlayPage,o[s]),d(e.underlayPage,s),l(e.underlayPage,s),e.underlayPage.style.display="block",e.staticPage.style.opacity="0",e.sheet.offsetWidth,requestAnimationFrame(()=>{e.sheet.classList.add("flipBack"),requestAnimationFrame(()=>{u(e.staticPage,o[t]),d(e.staticPage,t),l(e.staticPage,t)})});const i=()=>{s=t,e.sheet.style.display="none",e.sheet.classList.remove("flipBack","flipped","noBend","fullBleed"),e.staticPage.style.opacity="",e.underlayPage.style.display="none",e.underlayPage.classList.remove("isCover","isBackCover"),v=!1,y()};e.sheet.addEventListener("animationend",i,{once:!0})}function E(t){t.key==="ArrowRight"&&(t.preventDefault(),!c&&s>=o.length-1?w():O()),t.key==="ArrowLeft"&&(t.preventDefault(),q())}e.prevBtn.addEventListener("click",q);e.nextBtn.addEventListener("click",()=>{!c&&s>=o.length-1?w():O()});e.backCoverFace.addEventListener("click",S);window.addEventListener("keydown",E);d(e.backCoverFace,-1);e.backCoverFace.classList.add("isBackCover");l(e.backCoverFace,-1);y();
