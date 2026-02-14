(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))p(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const k of n.addedNodes)k.tagName==="LINK"&&k.rel==="modulepreload"&&p(k)}).observe(document,{childList:!0,subtree:!0});function i(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function p(s){if(s.ep)return;s.ep=!0;const n=i(s);fetch(s.href,n)}})();const B="/photos/back-cover.svg",o=["/photos/cover.svg",...Array.from({length:15},(t,a)=>`/photos/photo-${String(a+1).padStart(2,"0")}.png`)],q=document.querySelector("#app");function x(){const t=new URLSearchParams(window.location.search),a=t.get("name")||"Mi Álbum",p=t.get("date")||new Intl.DateTimeFormat("es-ES",{day:"2-digit",month:"long",year:"numeric"}).format(new Date);return{name:a,dateText:p}}const L=x();function g(){return`
    <div class="coverOverlay" aria-hidden="true">
      <div class="coverOverlayInner">
        <div class="coverName"></div>
        <div class="coverDate"></div>
      </div>
    </div>
  `}q.innerHTML=`
  <div class="appRoot">
    <main class="stage" id="stage">
      <button class="navBtn navPrev" id="prevBtn" aria-label="Página anterior" title="Anterior (←)">‹</button>

      <div class="bookWrap" id="bookWrap">
        <div class="book" id="book" role="application" aria-label="Visor de álbum">
          <div class="page backCoverFace isBackCover" id="backCoverFace" aria-hidden="true">
            <img class="backCoverImg" src="${B}" alt="" aria-hidden="true" />
          </div>

          <div class="page backOverlayFace isBackCover" id="backOverlayFace" aria-hidden="true">
            <img class="backCoverImg" src="${B}" alt="" aria-hidden="true" />
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
`;const e={staticPage:document.querySelector("#staticPage"),underlayPage:document.querySelector("#underlayPage"),sheet:document.querySelector("#sheet"),sheetFront:document.querySelector("#sheet .face.front"),sheetBack:document.querySelector("#sheet .face.back"),prevBtn:document.querySelector("#prevBtn"),nextBtn:document.querySelector("#nextBtn"),bookWrap:document.querySelector("#bookWrap"),book:document.querySelector("#book"),backCoverFace:document.querySelector("#backCoverFace"),backOverlayFace:document.querySelector("#backOverlayFace")};let r=0,v=!1,c=!1,f=!1,m=null,h=[];function F(){for(const t of h)window.clearTimeout(t);h=[]}function b(){e.backOverlayFace&&e.backOverlayFace.classList.add("show")}function P(){e.backOverlayFace&&e.backOverlayFace.classList.remove("show")}function u(t,a){if(!a){t.classList.add("empty"),t.style.backgroundImage="";return}t.classList.remove("empty"),t.style.backgroundImage=`url(${a})`}function d(t,a){t.classList.toggle("isCover",a===0),t.classList.toggle("isBackCover",!1)}function l(t,a){const i=t.querySelector(".coverOverlay");if(!i)return;const p=a===0;if(i.hidden=!p,!p)return;const s=i.querySelector(".coverName"),n=i.querySelector(".coverDate");s&&(s.textContent=L.name),n&&(n.textContent=L.dateText)}function y(){const t=m??r;u(e.staticPage,o[t]),e.underlayPage.style.display="none",e.underlayPage.style.opacity="",e.underlayPage.classList.remove("isCover","isBackCover"),d(e.staticPage,t),l(e.staticPage,t),l(e.underlayPage,t),r>=o.length-1;const a=c?!0:r>0,i=!c;e.prevBtn.disabled=!a,e.nextBtn.disabled=!i}function C(){if(v||f||c||r<o.length-1)return;f=!0,F(),m=r,e.staticPage.style.opacity="1",P(),y(),requestAnimationFrame(()=>{c=!0,e.book.classList.add("backView"),e.bookWrap.classList.add("backView")}),h.push(window.setTimeout(()=>{c&&(b(),e.staticPage.style.opacity="0")},460));const t=a=>{a.propertyName==="transform"&&(e.book.removeEventListener("transitionend",t),b(),e.staticPage.style.opacity="0",f=!1,y())};e.book.addEventListener("transitionend",t)}function w(){if(v||f||!c)return;f=!0,c=!1,F(),m=r,e.staticPage.style.opacity="0",b(),y(),h.push(window.setTimeout(()=>{c||(P(),e.staticPage.style.opacity="1")},360)),requestAnimationFrame(()=>{e.book.classList.remove("backView"),e.bookWrap.classList.remove("backView")});const t=a=>{a.propertyName==="transform"&&(e.book.removeEventListener("transitionend",t),m=null,e.staticPage.style.opacity="",P(),f=!1,y())};e.book.addEventListener("transitionend",t),y()}function S(){if(v||c||f||r>=o.length-1)return;v=!0;const t=r+1,a=r===0;e.sheet.classList.toggle("noBend",a),e.sheet.classList.toggle("fullBleed",a),u(e.sheetFront,o[r]),u(e.sheetBack,o[t]),d(e.sheetFront,r),d(e.sheetBack,t),l(e.sheetFront,r),l(e.sheetBack,t),e.sheet.classList.remove("flipBack","flipForward","flipped"),e.sheet.style.display="block",e.sheet.style.transform="rotateY(0deg)",requestAnimationFrame(()=>{u(e.staticPage,o[t]),d(e.staticPage,t),l(e.staticPage,t),requestAnimationFrame(()=>{e.sheet.style.transform="",e.sheet.classList.add("flipForward")})});const i=()=>{r=t,e.staticPage.style.opacity="",e.underlayPage.style.display="none",e.sheet.style.display="none",e.sheet.classList.remove("flipForward","noBend","fullBleed"),v=!1,y()};e.sheet.addEventListener("animationend",i,{once:!0})}function O(){if(v||f)return;if(c){w();return}if(r<=0)return;v=!0;const t=r-1,a=t===0;e.sheet.classList.toggle("noBend",a),e.sheet.classList.toggle("fullBleed",a),u(e.sheetFront,o[t]),u(e.sheetBack,o[r]),d(e.sheetFront,t),d(e.sheetBack,r),l(e.sheetFront,t),l(e.sheetBack,r),e.sheet.classList.remove("flipForward","flipBack"),e.sheet.classList.add("flipped"),e.sheet.style.display="block",u(e.underlayPage,o[r]),d(e.underlayPage,r),l(e.underlayPage,r),e.underlayPage.style.display="block",e.staticPage.style.opacity="0",e.sheet.offsetWidth,requestAnimationFrame(()=>{e.sheet.classList.add("flipBack"),requestAnimationFrame(()=>{u(e.staticPage,o[t]),d(e.staticPage,t),l(e.staticPage,t)})});const i=()=>{r=t,e.sheet.style.display="none",e.sheet.classList.remove("flipBack","flipped","noBend","fullBleed"),e.staticPage.style.opacity="",e.underlayPage.style.display="none",e.underlayPage.classList.remove("isCover","isBackCover"),v=!1,y()};e.sheet.addEventListener("animationend",i,{once:!0})}function A(t){t.key==="ArrowRight"&&(t.preventDefault(),!c&&r>=o.length-1?C():S()),t.key==="ArrowLeft"&&(t.preventDefault(),O())}e.prevBtn.addEventListener("click",O);e.nextBtn.addEventListener("click",()=>{!c&&r>=o.length-1?C():S()});e.backCoverFace.addEventListener("click",w);window.addEventListener("keydown",A);d(e.backCoverFace,-1);e.backCoverFace.classList.add("isBackCover");l(e.backCoverFace,-1);y();
