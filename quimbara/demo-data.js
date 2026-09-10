'use strict';
// Shared, tab-local menu overrides. This is deliberately not a production datastore.
window.QuimbaraDemo = (() => {
  const key = 'quimbara-menu-demo-v1';
  const defaults = [
    {id:'ropa',name:'Ropa vieja',category:'Platos',price:8900,available:true},
    {id:'cerdo',name:'Cerdo al mojo',category:'Platos',price:8500,available:true},
    {id:'congri',name:'Arroz congrí',category:'Platos',price:3900,available:true},
    {id:'tostones',name:'Tostones',category:'Para picar',price:3500,available:true},
    {id:'flan',name:'Flan de la casa',category:'Dulces y café',price:2900,available:true},
    {id:'cafe',name:'Cafecito cubano',category:'Dulces y café',price:1900,available:true}
  ];
  function read() {
    let saved = [];
    try { saved = JSON.parse(sessionStorage.getItem(key) || '[]'); } catch (_) {}
    if (!Array.isArray(saved)) saved = [];
    return defaults.map(p => {
      const item = saved.find(x => x && x.id === p.id);
      return {...p, ...(item && Number.isInteger(item.price) && item.price > 0 && item.price <= 999999 && typeof item.available === 'boolean' ? {price:item.price,available:item.available} : {})};
    });
  }
  function save(menu) { try { sessionStorage.setItem(key,JSON.stringify(menu.map(({id,price,available}) => ({id,price,available}))));return true; } catch (_) { return false; } }
  function reset() { try { sessionStorage.removeItem(key); } catch (_) {} }
  return {read,save,reset};
})();
