/* Yurdunu Bil 30 — normalize v30 question topics to the eight curriculum buckets. */
(()=>{
const map={yersekilleri:'yerseki',ovalard:'yerseki',daglar:'yerseki','toprak-bitki':'iklim',maden:'sanayi',turizm:'bolgeler',iller:'bolgeler',karma:'yerseki'};
(window.QUESTION_BANK||[]).forEach(q=>{if(map[q.topic])q.topic=map[q.topic]});
})();
