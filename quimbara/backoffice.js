'use strict';
const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat('es-CL', {style:'currency',currency:'CLP',maximumFractionDigits:0}).format(n);
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key = 'quimbara-office-demo-v1';
const stages = {new:'Nuevo',cooking:'En cocina',ready:'Listo',delivered:'Entregado',cancelled:'Cancelado'};
const next = {new:'cooking',cooking:'ready',ready:'delivered'};
const nextLabels = {new:'Pasar a cocina',cooking:'Marcar listo',ready:'Marcar entregado'};
const pageNames = {overview:'Resumen',orders:'Pedidos',menu:'Carta',inbox:'Consultas',channels:'Canales'};
const seed = {
 orders:[
  {id:'1048',name:'Camila R.',channel:'PedidosYa',time:'13:42',status:'new',items:[['ropa',2,8900],['tostones',1,3500]],note:'Cubiertos para dos personas.'},
  {id:'1047',name:'Diego M.',channel:'Uber Eats',time:'13:38',status:'cooking',items:[['cerdo',1,8500],['flan',2,2900]],note:'Sin observaciones.'},
  {id:'1046',name:'Mesa 3',channel:'Local',time:'13:31',status:'ready',items:[['ropa',1,8900],['congri',1,3900],['cafe',2,1900]],note:'Servicio en el local.'},
  {id:'1045',name:'Valentina P.',channel:'PedidosYa',time:'13:25',status:'cooking',items:[['cerdo',2,8500],['tostones',2,3500]],note:'Cubiertos para dos personas.'},
  {id:'1044',name:'Javier S.',channel:'Uber Eats',time:'13:08',status:'delivered',items:[['ropa',2,8900],['flan',1,2900]],note:'Sin observaciones.'},
  {id:'1043',name:'Mesa 1',channel:'Local',time:'12:57',status:'delivered',items:[['cerdo',1,8500],['congri',1,3900],['cafe',1,1900]],note:'Servicio en el local.'},
  {id:'1042',name:'Francisca L.',channel:'PedidosYa',time:'12:40',status:'cancelled',items:[['ropa',1,8900]],note:'Cancelación de ejemplo solicitada por el cliente.'},
  {id:'1041',name:'Andrés C.',channel:'Uber Eats',time:'12:22',status:'delivered',items:[['ropa',1,8900],['tostones',1,3500],['flan',1,2900]],note:'Sin observaciones.'}
 ],
 threads:[
  {id:'event',name:'María G.',subject:'Almuerzo para 12 personas',time:'13:35',resolved:false,messages:[{sender:'client',body:'¡Hola! ¿Podrían preparar un almuerzo cubano para 12 personas el próximo sábado? Me gustaría conocer las opciones y cómo encargarlo.'}]},
  {id:'hours',name:'Tomás V.',subject:'Consulta de horario',time:'13:10',resolved:false,messages:[{sender:'client',body:'¡Hola! Quiero ir al local este fin de semana. ¿Qué horario tendrán el sábado?'}]},
  {id:'menu',name:'Paula A.',subject:'Ingredientes de la carta',time:'12:48',resolved:false,messages:[{sender:'client',body:'Hola, ¿me pueden orientar sobre los ingredientes del arroz congrí? Quisiera confirmarlos antes de pedir.'}]},
  {id:'visit',name:'Nicolás F.',subject:'Cómo llegar al local',time:'12:15',resolved:true,messages:[{sender:'client',body:'¿En qué local están?'},{sender:'team',body:'La dirección que figura en esta demo es Manuel Montt 1041, local 43, Providencia. ¡Gracias por escribir!'}]}
 ]
};
let state = structuredClone(seed);
try {
 const saved = JSON.parse(sessionStorage.getItem(key) || 'null');
 // Merge only recognized records and editable fields; never trust persisted HTML.
 if(saved && Array.isArray(saved.orders) && Array.isArray(saved.threads)) {
  state.orders.forEach(o => {const found=saved.orders.find(x=>x && x.id===o.id);if(found && Object.hasOwn(stages,found.status))o.status=found.status;});
  state.threads.forEach(t => {const found=saved.threads.find(x=>x && x.id===t.id);if(!found)return;t.resolved=found.resolved===true;if(Array.isArray(found.messages))t.messages=found.messages.filter(m=>m && ['client','team'].includes(m.sender) && typeof m.body==='string' && m.body.length<=1200).slice(-80);});
 }
} catch (_) {}
let products = QuimbaraDemo.read();
let statusFilter='active', channelFilter='all', search='', inboxFilter='all', selectedThread='event', selectedOrder=null, currentPage='overview', toastTimer;
const active = o => ['new','cooking','ready'].includes(o.status);
const orderTotal = o => o.items.reduce((sum,[,qty,price])=>sum+qty*price,0);
const productName = id => products.find(p=>p.id===id)?.name || id;
const channelClass = channel => channel==='PedidosYa'?'py':channel==='Uber Eats'?'ue':'web';
const pill = status => `<span class="pill ${status}">${stages[status]}</span>`;
function notify(message) { $('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,4300); }
function persist() { try {sessionStorage.setItem(key,JSON.stringify(state));return true;}catch(_){notify('El navegador no permite guardar. Los cambios durarán hasta recargar.');return false;} }
function renderOverview() {
 const valid=state.orders.filter(o=>o.status!=='cancelled');
 const revenue=valid.reduce((s,o)=>s+orderTotal(o),0);
 const pending=state.orders.filter(active);
 const queries=state.threads.filter(t=>!t.resolved).length;
 const metrics=[['Importe de pedidos',money(revenue),'Bruto · Sin pedidos cancelados','$'],['Pedidos en curso',pending.length,`${state.orders.filter(o=>o.status==='new').length} nuevos por revisar`,'☷'],['Ticket promedio',money(valid.length?Math.round(revenue/valid.length):0),'De pedidos no cancelados','↗'],['Consultas pendientes',queries,'Bandeja de ejemplo','?']];
 $('metrics').innerHTML=metrics.map(([label,value,note,symbol])=>`<article class="metric"><div class="metric-label">${label}<span class="metric-symbol" aria-hidden="true">${symbol}</span></div><strong class="metric-value">${value}</strong><small>${note}</small></article>`).join('');
 $('active-orders').innerHTML=pending.length?pending.slice(0,4).map(o=>`<div class="preview-row"><span class="channel-icon ${channelClass(o.channel)}" aria-hidden="true">${o.channel==='Local'?'Q':o.channel[0]}</span><div><strong>#${o.id} · ${o.name}</strong><small>${o.channel} · ${o.items.reduce((s,[,n])=>s+n,0)} productos · ${o.time}</small></div><div class="row-end">${pill(o.status)}<br><button class="text-button" data-order="${o.id}" aria-label="Ver pedido ${o.id}">Ver detalle ↗</button></div></div>`).join(''):'<p class="empty">Todo al día. No quedan pedidos en curso.</p>';
 const available=products.filter(p=>p.available).length;
 $('tasks').innerHTML=`<button class="task" data-page="orders">${pending.length} pedidos en curso <span>→</span></button><button class="task" data-page="inbox">${queries} consultas por responder <span>→</span></button><button class="task" data-page="menu">${available} de ${products.length} platos disponibles <span>→</span></button>`;
 const channels=['PedidosYa','Uber Eats','Local'].map(name=>({name,total:valid.filter(o=>o.channel===name).reduce((s,o)=>s+orderTotal(o),0)}));
 $('channel-chart').innerHTML=channels.map(c=>`<div class="chart-row"><div class="chart-label"><span>${c.name}</span><b>${money(c.total)} · ${revenue?Math.round(c.total/revenue*100):0}%</b></div><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width:${revenue?c.total/revenue*100:0}%"></div></div></div>`).join('');
 const ranked=products.map(p=>({name:p.name,qty:valid.reduce((s,o)=>s+o.items.filter(([id])=>id===p.id).reduce((q,[,n])=>q+n,0),0)})).sort((a,b)=>b.qty-a.qty).slice(0,4);
 $('best-sellers').innerHTML=ranked.map((p,i)=>`<div class="rank-row"><span class="rank">0${i+1}</span><strong>${p.name}</strong><b>${p.qty} unidades</b></div>`).join('');
 $('order-badge').textContent=pending.length;$('inbox-badge').textContent=queries;
}
function renderOrders() {
 const rows=state.orders.filter(o=>(statusFilter==='all'||(statusFilter==='active'?active(o):o.status===statusFilter))&&(channelFilter==='all'||o.channel===channelFilter)&&`${o.id} ${o.name}`.toLocaleLowerCase('es').includes(search));
 $('order-table').innerHTML=rows.length?rows.map(o=>`<tr><td><strong>#${o.id}</strong><small>${o.name}</small></td><td>${o.channel}</td><td>${o.time}</td><td>${money(orderTotal(o))}</td><td>${pill(o.status)}</td><td><button class="text-button" data-order="${o.id}" aria-label="Ver pedido ${o.id}">Ver detalle ↗</button></td></tr>`).join(''):'<tr><td colspan="6" class="empty">No hay pedidos con estos filtros.</td></tr>';
}
function renderMenu() {
 $('menu-grid').innerHTML=products.map((p,i)=>`<article class="panel menu-card"><div class="menu-card-top"><span class="plate-symbol" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span class="pill ${p.available?'ready':'neutral'}">${p.available?'Disponible':'Agotado'}</span></div><p class="eyebrow">${p.category}</p><h2>${p.name}</h2><p class="menu-price">${money(p.price)}</p><div class="menu-card-actions"><button class="toggle" role="switch" aria-checked="${p.available}" aria-label="Disponibilidad de ${p.name}" data-toggle="${p.id}"><span class="switch" aria-hidden="true"></span>${p.available?'En la carta':'Pausado'}</button><button class="text-button" data-edit="${p.id}">Editar precio ↗</button></div></article>`).join('');
}
function renderInbox() {
 const threads=state.threads.filter(t=>inboxFilter==='all'||(inboxFilter==='resolved'?t.resolved:!t.resolved));
 if(!threads.some(t=>t.id===selectedThread))selectedThread=threads[0]?.id || null;
 $('thread-list').innerHTML=threads.length?threads.map(t=>`<button class="thread ${t.id===selectedThread?'active':''}" data-thread="${t.id}" aria-pressed="${t.id===selectedThread}"><div class="thread-top"><strong>${t.name}</strong><span class="pill ${t.resolved?'delivered':'new'}">${t.resolved?'Resuelta':'Pendiente'}</span></div><p>${t.subject}</p><small>Consulta web de ejemplo · ${t.time}</small></button>`).join(''):'<p class="empty">No hay consultas con este filtro.</p>';
 const t=state.threads.find(t=>t.id===selectedThread);
 if(!t){$('conversation').innerHTML='<p class="empty">La bandeja está al día.</p>';return;}
 $('conversation').innerHTML=`<div class="conversation-head"><div><h2>${t.subject}</h2><p>${t.name} · Conversación ficticia</p></div><button class="button secondary" data-resolve="${t.id}">${t.resolved?'Reabrir':'Marcar resuelta'}</button></div><div class="message-log" role="log" aria-label="Mensajes de la consulta">${t.messages.map(m=>`<div class="message ${m.sender==='team'?'reply':''}"><small>${m.sender==='team'?'Químbara · respuesta simulada':t.name}</small>${esc(m.body)}</div>`).join('')}</div><form class="reply-form" id="reply-form"><label for="reply-body">Tu respuesta de prueba</label><textarea id="reply-body" maxlength="1200" required placeholder="Escribe una respuesta para este ejemplo…"></textarea><div class="reply-bottom"><small>Solo se guarda en esta pestaña.<br>No se envía al cliente.</small><button type="submit" class="button">Guardar respuesta de prueba</button></div></form>`;
 $('reply-form').addEventListener('submit',e=>{e.preventDefault();const body=$('reply-body').value.trim();if(!body){$('reply-body').setCustomValidity('Escribe una respuesta.');$('reply-body').reportValidity();return;}t.messages.push({sender:'team',body});t.messages=t.messages.slice(-80);const saved=persist();renderInbox();const log=$('conversation').querySelector('.message-log');log.scrollTop=log.scrollHeight;$('reply-body').focus();if(saved)notify('Respuesta guardada en la demo. No se envió ningún mensaje.');});
 $('reply-body').addEventListener('input',()=>$('reply-body').setCustomValidity(''));
}
function renderAll(){renderOverview();renderOrders();renderMenu();renderInbox();}
function showPage(page,focus=true) {
 if(!Object.hasOwn(pageNames,page))return;currentPage=page;
 document.querySelectorAll('.page').forEach(p=>p.hidden=p.id!==`page-${page}`);
 document.querySelectorAll('.nav').forEach(b=>{const selected=b.dataset.page===page;b.classList.toggle('active',selected);if(selected)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 $('crumb').textContent=pageNames[page];history.replaceState(null,'',`#${page}`);
 if(page==='menu'){products=QuimbaraDemo.read();renderMenu();}
 if(focus){$('main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
}
function showOrder(id,open=true) {
 const o=state.orders.find(o=>o.id===id);if(!o)return;selectedOrder=id;
 $('detail-content').innerHTML=`<div class="dialog-top"><div><p class="eyebrow">${o.channel.toUpperCase()} · ${o.time}</p><h2 id="detail-title">Pedido #${o.id}</h2></div><button class="icon-button" data-close="detail-dialog" aria-label="Cerrar detalle">×</button></div><div class="detail-meta"><strong>${o.name}</strong>${pill(o.status)}</div>${o.items.map(([id,qty,price])=>`<div class="detail-item"><span>${qty} × ${productName(id)}</span><strong>${money(qty*price)}</strong></div>`).join('')}<div class="detail-item detail-total"><span>Total de ejemplo</span><strong>${money(orderTotal(o))}</strong></div><p class="detail-note">${o.note}</p><p class="footnote">Los importes corresponden al momento del pedido. Esta simulación no modifica ninguna plataforma.</p><div class="dialog-actions">${active(o)?`<button class="button danger" data-cancel="${id}">Cancelar pedido…</button><button class="button" data-advance="${id}">${nextLabels[o.status]}</button>`:'<button class="button secondary" data-close="detail-dialog">Cerrar detalle</button>'}</div>`;
 if(open)$('detail-dialog').showModal();
}
function updateOrder(id,status) {const o=state.orders.find(o=>o.id===id);if(!o||!active(o))return;o.status=status;const saved=persist();renderOverview();renderOrders();showOrder(id,false);$('detail-content').querySelector('.dialog-actions .button:last-child')?.focus();if(saved)notify(`Pedido #${id}: ${stages[status].toLowerCase()} en la demo.`);}
function saveMenu(){const saved=QuimbaraDemo.save(products);renderMenu();renderOverview();notify(saved?'Carta guardada. Abre la web en esta pestaña para ver el cambio.':'Cambio temporal: el navegador no permite guardarlo al navegar.');}
document.addEventListener('click',e=>{
 const target=e.target.closest('button');if(!target)return;
 if(target.dataset.reset)$('reset-dialog').showModal();
 if(target.dataset.page)showPage(target.dataset.page);
 if(target.dataset.close)$(target.dataset.close).close();
 if(target.dataset.order)showOrder(target.dataset.order);
 if(target.dataset.advance){const o=state.orders.find(o=>o.id===target.dataset.advance);if(o&&next[o.status])updateOrder(o.id,next[o.status]);}
 if(target.dataset.cancel){const actions=target.closest('.dialog-actions');actions.innerHTML=`<p class="detail-note">¿Cancelar este pedido de ejemplo?</p><button class="button secondary" data-keep="${target.dataset.cancel}">Conservar pedido</button><button class="button danger" data-confirm-cancel="${target.dataset.cancel}">Sí, cancelar</button>`;actions.querySelector('[data-keep]').focus();}
 if(target.dataset.keep)showOrder(target.dataset.keep,false);
 if(target.dataset.confirmCancel)updateOrder(target.dataset.confirmCancel,'cancelled');
 if(target.dataset.status){statusFilter=target.dataset.status;document.querySelectorAll('[data-status]').forEach(b=>{b.classList.toggle('selected',b===target);b.setAttribute('aria-pressed',String(b===target));});renderOrders();}
 if(target.dataset.toggle){const p=products.find(p=>p.id===target.dataset.toggle);if(p){p.available=!p.available;saveMenu();document.querySelector(`[data-toggle="${p.id}"]`).focus();}}
 if(target.dataset.edit){const p=products.find(p=>p.id===target.dataset.edit);if(!p)return;$('edit-id').value=p.id;$('edit-title').textContent=p.name;$('edit-price').value=p.price;$('edit-available').checked=p.available;$('edit-dialog').showModal();}
 if(target.dataset.thread){selectedThread=target.dataset.thread;renderInbox();document.querySelector(`[data-thread="${selectedThread}"]`).focus();}
 if(target.dataset.resolve){const t=state.threads.find(t=>t.id===target.dataset.resolve);if(t){t.resolved=!t.resolved;const saved=persist();renderInbox();renderOverview();if(saved)notify(t.resolved?'Consulta marcada como resuelta.':'Consulta reabierta.');}}
});
$('order-search').addEventListener('input',e=>{search=e.target.value.trim().toLocaleLowerCase('es').replace(/^#/,'');renderOrders();});
$('channel-filter').addEventListener('change',e=>{channelFilter=e.target.value;renderOrders();});
$('inbox-filter').addEventListener('change',e=>{inboxFilter=e.target.value;renderInbox();});
$('menu-form').addEventListener('submit',e=>{e.preventDefault();const price=Number($('edit-price').value);if(!Number.isInteger(price)||price<1||price>999999)return;const p=products.find(p=>p.id===$('edit-id').value);if(!p)return;p.price=price;p.available=$('edit-available').checked;saveMenu();$('edit-dialog').close();});
$('reset').addEventListener('click',()=>$('reset-dialog').showModal());
$('confirm-reset').addEventListener('click',()=>{state=structuredClone(seed);QuimbaraDemo.reset();products=QuimbaraDemo.read();const saved=persist();renderAll();$('reset-dialog').close();if(saved)notify('La demo vuelve a tener los datos iniciales.');});
window.addEventListener('pageshow',e=>{if(e.persisted){products=QuimbaraDemo.read();renderAll();}});
renderAll();showPage(location.hash.slice(1)||'overview',false);
