import test from 'node:test';
import assert from 'node:assert/strict';
import {newProject,demoProject,readiness,issues,approve,touch,generatePrompt,nextQuestion,extractTables,validateImport,fullyQualified,validName} from '../dist/model.js';

test('empty project only produces discovery instructions and approval is blocked',()=>{
 const p=newProject();assert.equal(readiness(p).ready,false);assert.match(generatePrompt(p),/DISCOVERY/);assert.match(generatePrompt(p),/do not execute creation or replacement DDL/);assert.throws(()=>approve(p,'SME'),/Resolve/);
});
test('complete specification needs explicit approval; edits revoke creation mode',()=>{
 const p=demoProject();assert.deepEqual(issues(p).map(i=>i.category),['Review']);approve(p,'Test reviewer');assert.equal(readiness(p).ready,true);assert.match(generatePrompt(p),/CREATION/);p.metrics[0].expression='SUM(OTHER_AMOUNT)';touch(p);assert.equal(p.approval,null);assert.match(generatePrompt(p),/DISCOVERY/);
});
test('interview skips resolved fields and defers uncertainty without counting it complete',()=>{
 const p=newProject();assert.equal(nextQuestion(p).key,'purpose');p.purpose='Revenue decisions';assert.equal(nextQuestion(p).key,'questions');p.questions='I don’t know';p.deferred.push('questions');assert.equal(nextQuestion(p).key,'exclusions');assert.ok(issues(p).some(i=>i.title==='Representative questions is missing'));
});
test('quoted Snowflake source identifiers and decimals survive schema extraction',()=>{
 const [e]=extractTables('CREATE OR REPLACE TABLE "My DB"."My.Schema"."Order Lines" ("Order ID" NUMBER(18,0), LINE_ID NUMBER, AMOUNT NUMBER(18,2), PRIMARY KEY ("Order ID", LINE_ID));','Warehouse DDL');
 assert.equal(e.source,'"My DB"."My.Schema"."Order Lines"');assert.equal(e.keys,'"Order ID", LINE_ID');assert.match(e.columns,/AMOUNT NUMBER\(18,2\)/);assert.equal(e.grain,'');assert.equal(e.status,'proposed');assert.equal(e.evidence,'Warehouse DDL');
});
test('multiple tables and inline keys are extracted without guessing relationships',()=>{
 const result=extractTables('CREATE TABLE DB.S.A (ID NUMBER PRIMARY KEY, LABEL VARCHAR); CREATE TABLE DB.S.B (ID NUMBER, A_ID NUMBER, CONSTRAINT fk FOREIGN KEY(A_ID) REFERENCES DB.S.A(ID));');assert.equal(result.length,2);assert.equal(result[0].keys,'ID');assert.equal(result[1].keys,'');assert.equal(extractTables('Revenue should exclude refunds').length,0);assert.equal(extractTables('CREATE TABLE X (ID NUMBER').length,0);
});
test('physical names require exactly three valid identifier parts',()=>{
 assert.equal(fullyQualified('DB.S.T'),true);assert.equal(fullyQualified('"My.DB"."My S"."t"'),true);assert.equal(fullyQualified('DB.S'),false);assert.equal(fullyQualified('DB.S.T; DROP TABLE X'),false);
});
test('naming validates casing and reserved words',()=>{
 assert.equal(validName('net_revenue_usd'),true);assert.equal(validName('order'),false);assert.equal(validName('total Revenue'),false);assert.equal(validName('NET_REVENUE','UPPER_SNAKE_CASE'),true);
});
test('duplicate metrics and ambiguous synonyms block handoff',()=>{
 const p=demoProject();p.metrics.push({...p.metrics[0],id:'second'});assert.ok(issues(p).some(i=>/duplicate name/.test(i.title)));p.metrics.at(-1).name='another_metric';assert.ok(issues(p).some(i=>/ambiguous/.test(i.title)));
});
test('deleting an entity leaves explicit broken reference checks',()=>{
 const p=demoProject();p.entities=[];assert.ok(issues(p).some(i=>/unknown entity/.test(i.title)));
});
test('disconnected entities and many-to-many joins cannot pass readiness',()=>{
 const p=demoProject();p.entities.push({...p.entities[0],id:'customers',name:'customers'});assert.ok(issues(p).some(i=>/no relationship path/.test(i.title)));p.relationships.push({id:'r',name:'orders_to_customers',from:'orders',to:'customers',fromColumns:'ID',toColumns:'ID',cardinality:'many-to-many',description:'A bridge is required',evidence:'SME'});assert.ok(issues(p).some(i=>/fanout requires resolution/.test(i.title)));
});
test('unresolved decisions and missing evaluation expectations block approval',()=>{
 const p=demoProject();p.decisions.push({name:'Refund timing',description:'Posting date or original order date?',resolution:''});p.evaluations[0].expected='';assert.ok(issues(p).some(i=>i.category==='Decisions'));assert.ok(issues(p).some(i=>/expected is missing/.test(i.title)));
});
test('project imports round trip content but never trust imported approval',()=>{
 const p=demoProject();approve(p,'SME');const imported=validateImport(JSON.parse(JSON.stringify(p)));assert.equal(imported.name,p.name);assert.deepEqual(imported.metrics,p.metrics);assert.equal(imported.approval,null);
});
test('malformed and duplicate imported records are rejected before mutation',()=>{
 const p=demoProject();p.metrics[0].name={malicious:true};assert.throws(()=>validateImport(p),/Invalid metrics.name/);assert.throws(()=>validateImport({version:99}),/supported/);const q=demoProject();q.metrics.push({...q.metrics[0]});assert.throws(()=>validateImport(q),/duplicate/);
});
test('prompt is self-contained and includes evidence, policy, and unverified SQL caveats',()=>{
 const p=demoProject();const prompt=generatePrompt(p);for(const expected of [p.entities[0].source,p.metrics[0].expression,'BEGIN_REFERENCE_SPECIFICATION_JSON','untrusted reference data','not a verified query','Create new only','Business approval is not metadata or data validation'])assert.ok(prompt.includes(expected),expected);
});
