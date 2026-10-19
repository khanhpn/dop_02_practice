import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer } from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try {
  const {lessons}=await server.ssrLoadModule('/src/content/index.ts');
  const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
  const records=lessons.map(l=>({id:l.id,
    structure:digest({id:l.id,number:l.number,domainId:l.domainId,chapterId:l.chapterId,sections:l.sections.map(s=>s.id),sources:l.sources.map(s=>s.url),reviewedAt:l.reviewedAt}),
    code:digest({cloudformation:l.code.cloudformation,terraform:l.code.terraform,deployable:l.code.deployable,commands:l.lab.steps.map(s=>s.command??null)}),
    questions:digest(l.questions.map(q=>({id:q.id,lessonId:q.lessonId,domainId:q.domainId,taskId:q.taskId,type:q.type,en:q.prompt.en,options:q.options.map(o=>({id:o.id,en:o.en})),correct:q.correct,reviewSection:q.reviewSection,difficulty:q.difficulty,tags:q.tags})))
  }));
  const baselineArg=process.argv.indexOf('--baseline');
  if(baselineArg>=0){
    const baseline=JSON.parse(readFileSync(process.argv[baselineArg+1],'utf8'));
    const current=new Map(records.map(r=>[r.id,r]));
    const changes=[];
    for(const original of baseline){const next=current.get(original.id);if(!next){changes.push({id:original.id,category:'missing lesson'});continue;}for(const category of ['structure','code','questions'])if(original[category]!==next[category])changes.push({id:original.id,category});}
    console.log(JSON.stringify({reviewedLessons:baseline.length,currentLessons:records.length,technicalChanges:changes},null,2));
    if(changes.length)process.exitCode=1;
  }else console.log(JSON.stringify(records));
}finally{await server.close();}
