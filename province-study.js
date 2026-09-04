/* Yurdunu Bil — province-study.js v2
 * Province çalışma widget'ı app.js'deki dashboardProvinceHtml() ile
 * entegre edildiğinden bu dosya artık yalnızca localStorage temizleme
 * ve global yardımcı işlevi sağlar.
 */
(() => {
  'use strict';
  // Eski versiyonun localStorage verisini temizle
  try {
    const OLD_KEY = 'yb_selected_province_v1';
    if(localStorage.getItem(OLD_KEY)){
      // Mevcut province adını yeni state formatına taşı (varsa)
      const oldName = localStorage.getItem(OLD_KEY);
      const stateRaw = localStorage.getItem('yb_state_21');
      if(stateRaw && oldName){
        const st = JSON.parse(stateRaw);
        if(!st.lastProvince) st.lastProvince = oldName;
        localStorage.setItem('yb_state_21', JSON.stringify(st));
      }
      localStorage.removeItem(OLD_KEY);
    }
  } catch(_){}
})();
