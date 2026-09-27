/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 7. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Bu oyun adil mi?', en: 'Is this game fair?',
      note: 'Bir zar atılıyor. 3’ten büyük gelirse Ali, 3’ten küçük gelirse Ayşe kazanıyor. İkisinin kazanma şansı eşit mi?' },
    { scene: 2, start: 10.8, end: 18.8, tr: 'Ölçüt', en: 'The criterion',
      note: 'Önce bir ölçüt belirleyelim: iki olayın olasılıkları eşitse bu olaylar eşit olasılıklıdır. Zarın çıktıları eşit olasılıklı olduğu için çıktı sayılarını karşılaştırabiliriz.' },
    { scene: 2, start: 19.0, end: 27.8, tr: 'Tek ve çift: 3/6 = 3/6', en: 'Odd and even: 3/6 = 3/6',
      note: 'Zarda tek sayı gelmesi 3 bölü 6, çift sayı gelmesi 3 bölü 6. Bu iki olay eşit olasılıklı.' },
    { scene: 3, start: 28.8, end: 38.6, tr: '3/6 ≠ 2/6', en: '3/6 ≠ 2/6',
      note: 'Oyundaki olaylar: 3’ten büyük gelmesi 4, 5, 6: 3 bölü 6. 3’ten küçük gelmesi 1, 2: 2 bölü 6. 3 gelirse kimse kazanmıyor.' },
    { scene: 3, start: 38.8, end: 45.8, tr: 'Adil değil', en: 'Not fair',
      note: '3 bölü 6, 2 bölü 6’ya eşit değil. Bu iki olay eşit olasılıklı değil; oyun Ali’nin lehine.' },
    { scene: 4, start: 46.8, end: 56.8, tr: 'Bölmeleri eşit olmayan çark', en: 'A spinner with unequal parts',
      note: 'Bu çarkın bölmeleri eşit değil; olasılık açıyla orantılı. Kırmızı 180 derece: 1 bölü 2. Mavi ve sarı 90’ar derece: 1 bölü 4.' },
    { scene: 4, start: 57.0, end: 63.8, tr: 'Mavi = sarı, kırmızı ≠ mavi', en: 'Blue = yellow, red ≠ blue',
      note: 'Mavi ile sarı eşit olasılıklı, kırmızı ile mavi değil. Bölme sayısına değil, bölmenin büyüklüğüne bakmalıyız.' },
    { scene: 5, start: 64.8, end: 73.8, tr: 'Oyunu düzeltelim', en: 'Fix the game',
      note: 'Oyunu adil yapalım: 3 gelirse de Ayşe kazansın. Ali 4, 5, 6; Ayşe 1, 2, 3.' },
    { scene: 5, start: 74.0, end: 79.8, tr: 'Adil oyun', en: 'A fair game',
      note: '3 bölü 6 eşittir 3 bölü 6. Kazanma olayları eşit olasılıklı: oyun artık adil.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Olasılıklar eşit mi?', en: 'Are the probabilities equal?',
      note: 'Aklında kalsın: iki olay eşit olasılıklı mı diye bakmak için olasılıklarını hesapla ve karşılaştır.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Hesapla, karşılaştır, karar ver!', en: 'Calculate, compare, decide!',
      note: 'Hesapla, karşılaştır, karar ver!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
