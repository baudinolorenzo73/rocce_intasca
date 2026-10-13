import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {rocks,byId,nodes,descendants,pathValid} from './dist/data.mjs';
assert.equal(rocks.length,31);
assert.equal(new Set(rocks.map(r=>r.id)).size,31);
const reached=new Set();let routes=0;
function walk(id,path=[],ancestors=[]){
 assert(!ancestors.includes(id),'Ciclo nella chiave');
 assert.equal(pathValid(path),id,'Percorso non validato');
 if(byId[id]){reached.add(id);routes++;return;}
 assert(nodes[id],`Destinazione mancante: ${id}`);
 assert(nodes[id].options.length>=2);
 nodes[id].options.forEach((option,choice)=>walk(option.to,[...path,{node:id,choice}],[...ancestors,id]));
}
walk('start');assert.equal(reached.size,31);
assert.equal(descendants('start').length,31);
assert.equal(pathValid([{node:'start',choice:99}]),false);
assert.equal(pathValid([{node:'fine',choice:0}]),false);
assert.equal(pathValid([{node:'start',choice:0},{node:'start',choice:0}]),false);
for(const id of Object.keys(nodes))assert(descendants(id).every(r=>byId[r]));
const html=fs.readFileSync('dist/index.html','utf8');
assert(!html.includes('/*APP*/')&&!html.includes('/*STYLE*/'));
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script);
fs.writeFileSync('/workspace/scratch/093030e06190/rocce-script-check.js',script);
const manifest=JSON.parse(fs.readFileSync('dist/manifest.webmanifest','utf8'));
for(const icon of manifest.icons)assert(fs.existsSync('dist/'+icon.src.slice(2)));
for(const r of rocks)assert(r.description&&r.observe&&r.caution);
console.log(`PASS: 31 schede, ${Object.keys(nodes).length} nodi, ${routes} percorsi completi; tutte le voci raggiungibili; script autonomo e risorse PWA validi.`);
