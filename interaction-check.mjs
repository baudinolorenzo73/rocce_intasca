// Verifica logica con DOM minimo simulato; non sostituisce una prova visiva in browser.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
class Element{
 constructor(){this.innerHTML='';this.textContent='';this.dataset={};this.disabled=false;this.open=false;this.value='';this.classes=new Set();this.classList={add:c=>this.classes.add(c),remove:c=>this.classes.delete(c),contains:c=>this.classes.has(c),toggle:(c,force)=>{const on=force??!this.classes.has(c);on?this.classes.add(c):this.classes.delete(c);return on;}};}
 focus(){} showModal(){this.open=true;} close(){this.open=false;}
}
const elements=new Map();const el=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
const handlers={};const store=new Map();const rows=new Map();
const database={transaction(){const tx={objectStore(){return{getAll(){const req={};setTimeout(()=>{req.result=[...rows.values()];req.onsuccess?.();},0);return req;},put(record){rows.set(record.id,structuredClone(record));setTimeout(()=>tx.oncomplete?.(),0);},delete(id){rows.delete(id);setTimeout(()=>tx.oncomplete?.(),0);}};}};return tx;}};
const ctx={console,setTimeout,clearTimeout,URL,Blob,Date,Math,Map,Set,Image:class{},crypto:{randomUUID:()=>`test-${rows.size}`},navigator:{onLine:true},location:{protocol:'file:',hash:''},indexedDB:{open(){const req={};setTimeout(()=>{req.result=database;req.onsuccess?.();},0);return req;}},localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},FormData:class{constructor(form){this.data=form.values;}get(k){return this.data[k];}},document:{body:new Element(),activeElement:null,querySelector:el,querySelectorAll:()=>[],addEventListener:(event,cb)=>handlers[event]=cb},window:{addEventListener(){},scrollTo(){}}};
vm.createContext(ctx);
const script=fs.readFileSync('dist/index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
vm.runInContext(script,ctx);await new Promise(r=>setTimeout(r,10));
const run=s=>vm.runInContext(s,ctx);
async function click(action,data={}){await handlers.click({target:{closest:()=>({dataset:{action,...data},disabled:false})}});}
assert(el('#main').innerHTML.includes('Quale struttura riesci'));
await click('answer',{choice:'1'});await click('answer',{choice:'1'});await click('answer',{choice:'0'});
assert.equal(run('pathValid(path)'),'breccia');assert(el('#main').innerHTML.includes('Breccia'));
assert.equal(JSON.parse(store.get('rit-session')).path.length,3);
await click('back');assert.equal(run('pathValid(path)'),'clasts');
await click('uncertain');assert.equal(run('uncertain'),true);assert(el('#main').innerHTML.includes('Puddinga / conglomerato'));
await click('save-uncertain');assert(el('#modal-content').innerHTML.includes('Campione indeterminato'));
const form={dataset:{path:run('JSON.stringify(path)')},values:{title:'Campione Trino',rockId:'',date:'2026-10-13',place:'Trino',notes:'Clasti angolosi?'}};
await run('saveNote')(form);assert.equal(rows.size,1);assert.equal([...rows.values()][0].path.length,2);assert.equal([...rows.values()][0].rockId,'');
await click('edit-note',{id:'test-0'});assert(el('#modal-content').innerHTML.includes('Campione Trino'));
run("view='atlante';render();search='quarzo';filterAtlas()");assert(el('#rock-count').textContent.match(/voci su 31/));assert(!el('#rock-grid').innerHTML.includes('Marmo saccaroide'));
run("search='inesistente12345';filterAtlas()");assert(el('#rock-grid').innerHTML.includes('Nessuna scheda'));
run('toggleTheme()');assert(ctx.document.body.classList.contains('dark'));assert.equal(store.get('rit-theme'),'dark');
const valid=[...rows.values()][0];assert.equal(run('validRecord')(valid),true);
assert.equal(run('validRecord')({...valid,rockId:'toString'}),false);
assert.equal(run('validRecord')({...valid,photo:'javascript:alert(1)'}),false);
await click('delete-note',{id:'test-0'});assert.equal(rows.size,1);await click('delete-confirm',{id:'test-0'});assert.equal(rows.size,0);
console.log('PASS: interazioni logiche simulate — riconoscimento/breccia, indietro, alternative, salvataggio indeterminato e percorso, modifica, ricerca, tema, validazione backup, eliminazione con conferma.');
