/* Yurdunu Bil — unified question pool normalizer */
(()=>{'use strict';
const aliases={
 'harita-bilgisi':'konum','harita':'konum','toprak':'tarim','dogal-afetler':'yerseki',
 'afet':'yerseki','akarsular':'su','goller':'su','enerji':'sanayi','maden':'sanayi',
 'ekonomik':'sanayi','ulasim':'bolgeler','turizm':'bolgeler','bolge-karsilastirma':'bolgeler',
 'bolge':'bolgeler','nufus-yerlesme':'nufus'
};
const topics=new Set(['konum','iklim','yerseki','su','nufus','tarim','sanayi','bolgeler']);

function build(){
 const source=Array.isArray(window.QUESTION_BANK)?window.QUESTION_BANK:[];
 const clean=[];const seen=new Set();
 for(const raw of source){
  if(!raw||typeof raw!=='object'||!raw.id||!raw.q||!Array.isArray(raw.options)||raw.options.length<2)continue;
  const id=String(raw.id);if(seen.has(id))continue;
  const originalTopic=String(raw.topic||'').toLocaleLowerCase('tr-TR');
  const topic=topics.has(originalTopic)?originalTopic:(aliases[originalTopic]||'konum');
  let answer=Number(raw.answer);if(!Number.isInteger(answer)||answer<0||answer>=raw.options.length)continue;
  clean.push({...raw,id,topic,originalTopic,subtopic:String(raw.subtopic||raw.type||'genel'),difficulty:['kolay','orta','zor'].includes(raw.difficulty)?raw.difficulty:'orta',answer});
  seen.add(id);
 }
 window.QUESTION_BANK=clean;
 const byTopic=Object.fromEntries([...topics].map(t=>[t,clean.filter(q=>q.topic===t).length]));
 const byDifficulty={kolay:clean.filter(q=>q.difficulty==='kolay').length,orta:clean.filter(q=>q.difficulty==='orta').length,zor:clean.filter(q=>q.difficulty==='zor').length};
 window.YBQuestionPool={version:'1.1',questions:clean,total:clean.length,byTopic,byDifficulty,sourceCount:source.length,dropped:source.length-clean.length,get(topic){return topic&&topic!=='all'?clean.filter(q=>q.topic===topic):clean.slice()},refresh:build};
}
build();
})();