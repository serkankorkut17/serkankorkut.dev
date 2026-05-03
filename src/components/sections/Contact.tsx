"use client";
import React, { useState } from 'react';

export default function Contact({ lang = 'en' }: { lang?: 'en' | 'tr' }) {
  const isEn = lang === 'en';
  const [openFaq, setOpenFaq] = useState(0);

  const content = {
    en: { tag: '// contact.sh', title: 'Get in touch', sub: 'Backend engineer @ MapaGlobal. Reach out for partnership questions, integration support, or just to say hi.', fields: { name: 'name', email: 'email', message: 'message' }, send: './send_message.sh', cards: [ { k: 'email', label: 'email', val: 'serkan@serkankorkut.dev' }, { k: 'location', label: 'location', val: 'İstanbul, Türkiye' }, { k: 'github', label: 'github', val: '@serkankorkut' }, { k: 'linkedin', label: 'linkedin', val: 'in/serkankorkut' }, { k: 'instagram', label: 'instagram', val: '@serkankorkut' }, { k: 'facebook', label: 'facebook', val: '/serkankorkut' } ], lookingHead: '// looking_for', lookingTitle: "What I'm up for", yes: 'Yes please', no: 'Not right now', yesItems: [ 'Banks or e-money / payment institutions exploring our services', 'Integration questions on FAST, BKM, EFT or SWIFT', 'Open-source collabs & code reviews', 'Coffee chats with other backend / payments folks' ], noItems: [ 'Crypto / web3 token launches', 'Cold recruiter spam without context', 'Vendor pitches — please go through MapaGlobal' ], faqHead: '// faq.md', faqTitle: 'Often asked', faq: [ { q: 'Where do you work?', a: 'Backend Engineer at MapaGlobal. Our team maintains and evolves the payment-integration services that connect to Turkey\'s rails (FAST, BKM, EFT) and SWIFT, and we provide technical support to the banks and licensed e-money / payment institutions that consume them.' }, { q: 'What does your day look like?', a: 'Mostly extending and patching existing services as new requirements come in, debugging integration issues, and supporting the institutions that use us — message-level investigations, schema tweaks, performance fixes.' }, { q: 'What\'s your stack sweet spot?', a: 'Java / Spring Boot, MSSQL and Oracle on the day job. Node.js, .NET and Python on the side. SQL, integrations and message contracts are where I spend most of my time.' }, { q: 'How fast do you reply?', a: 'Within 24 hours on weekdays, usually faster. If it\'s urgent, mention it in the subject and I\'ll prioritize.' } ] },
    tr: { tag: '// iletisim.sh', title: 'İletişime geç', sub: 'MapaGlobal\'da backend engineer. İşbirliği soruları, entegrasyon desteği veya sadece selam için yaz.', fields: { name: 'isim', email: 'email', message: 'mesaj' }, send: './mesaj_gonder.sh', cards: [ { k: 'email', label: 'email', val: 'serkan@serkankorkut.dev' }, { k: 'location', label: 'konum', val: 'İstanbul, Türkiye' }, { k: 'github', label: 'github', val: '@serkankorkut' }, { k: 'linkedin', label: 'linkedin', val: 'in/serkankorkut' }, { k: 'instagram', label: 'instagram', val: '@serkankorkut' }, { k: 'facebook', label: 'facebook', val: '/serkankorkut' } ], lookingHead: '// aradığım', lookingTitle: 'Ne arıyorum', yes: 'Evet, lütfen', no: 'Şu an değil', yesItems: [ 'Servislerimizi değerlendiren banka / EPÖ kuruluşları', 'FAST, BKM, EFT veya SWIFT entegrasyon soruları', 'Açık kaynak işbirlikleri & code review', 'Backend / ödeme sistemleri üzerine sohbet' ], noItems: [ 'Crypto / web3 token launchleri', 'Bağlamsız soğuk recruiter mesajları', 'Satıcı teklifleri — lütfen MapaGlobal\'dan geçirin' ], faqHead: '// sss.md', faqTitle: 'Sıkça sorulanlar', faq: [ { q: 'Nerede çalışıyorsun?', a: 'MapaGlobal\'da Backend Engineer. Ekibimiz Turkiye\'nin ödeme altyapılarına (FAST, BKM, EFT) ve sınır ötesi için SWIFT\'e bağlanan ödeme entegrasyonu servislerinin bakımını yapıyor; hizmet sunduğumuz banka ve lisanslı elektronik para / ödeme kuruluşlarına teknik destek sağlıyoruz.' }, { q: 'Günün nasıl geçiyor?', a: 'Genelde yeni gereksinimler geldiğinde mevcut servisleri geliştirmek/yamamak, entegrasyon sorunlarını debug etmek ve hizmet sunduğumuz kuruluşlara destek vermek — mesaj seviyesinde incelemeler, şema düzenlemeleri, performans çözümleri.' }, { q: 'Hangi stack\'te en iyisin?', a: 'İş yerinde Java / Spring Boot, MSSQL ve Oracle. Yan tarafta Node.js, .NET ve Python. SQL, entegrasyonlar ve mesaj kontratları en çok vakit geçirdiğim alanlar.' }, { q: 'Ne kadar hızlı dönüyorsun?', a: 'Hafta içi 24 saat içinde, genelde daha hızlı. Aciliyet varsa konuda belirt, öne alırım.' } ] }
  }[lang];

  return (
    <section className="bg-term-bg-inset text-term-fg font-mono py-24 px-8 border-b border-term-border w-full">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 md:gap-16 mb-14 items-end">
          <div>
            <div className="text-[11px] text-term-accent tracking-[0.18em] mb-4 uppercase">{content.tag}</div>
            <h2 className="font-display text-[40px] md:text-[56px] leading-none font-[800] tracking-[-0.03em] m-0 text-term-fg">{content.title}</h2>
          </div>
          <p className="text-base text-term-fg-muted m-0 max-w-[480px] md:justify-self-end">{content.sub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-term-bg-elevated border border-term-border rounded-md overflow-hidden">
            <div className="h-8 bg-term-bg-inset border-b border-term-border flex items-center px-3 gap-2">
              <div className="flex gap-[6px]">
                <div className="w-[11px] h-[11px] rounded-full bg-[#ff5f57]" />
                <div className="w-[11px] h-[11px] rounded-full bg-[#febc2e]" />
                <div className="w-[11px] h-[11px] rounded-full bg-[#28c840]" />
              </div>
              <div className="ml-auto text-[11px] text-term-fg-faint">~/message.txt</div>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-term-fg-faint tracking-[0.1em]"><span className="text-term-accent">$</span> {content.fields.name}</span>
                <input className="w-full bg-term-bg-inset border border-term-border rounded-[4px] p-3 font-mono text-sm text-term-fg outline-none focus:border-term-accent transition-colors" placeholder="Ada Lovelace" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-term-fg-faint tracking-[0.1em]"><span className="text-term-accent">$</span> {content.fields.email}</span>
                <input className="w-full bg-term-bg-inset border border-term-border rounded-[4px] p-3 font-mono text-sm text-term-fg outline-none focus:border-term-accent transition-colors" placeholder="ada@example.com" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-term-fg-faint tracking-[0.1em]"><span className="text-term-accent">$</span> {content.fields.message}</span>
                <textarea rows={5} className="w-full bg-term-bg-inset border border-term-border rounded-[4px] p-3 font-mono text-sm text-term-fg outline-none focus:border-term-accent transition-colors resize-y min-h-[100px]" placeholder={isEn ? 'Tell me about your project…' : 'Projenden bahset…'} />
              </label>
              <button className="mt-2 bg-term-accent text-black border-none py-[14px] px-5 font-mono text-[13px] font-[700] cursor-pointer rounded-[3px] flex items-center justify-between hover:opacity-90 transition-opacity">
                <span>{content.send}</span><span>↵</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
            {content.cards.map((c) => (
              <div key={c.k} className="bg-term-bg-elevated border border-term-border rounded-md p-6 cursor-pointer flex flex-col gap-2.5 min-h-[140px] hover:border-term-accent transition-colors group">
                <div className="text-[11px] text-term-fg-faint tracking-[0.15em]">./{c.label}</div>
                <div className="text-base text-term-fg font-[600] mt-auto">{c.val}</div>
                <div className="text-xs text-term-accent group-hover:translate-x-1 transition-transform w-fit">open →</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3">{content.lookingHead}</div>
          <h3 className="font-display text-[32px] font-[700] tracking-[-0.02em] m-0 mb-6 text-term-fg">{content.lookingTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-term-bg-elevated border border-term-border rounded-md p-6 border-l-[3px] border-l-term-accent">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-dashed border-term-border">
                <span className="w-[18px] h-[18px] rounded-[3px] bg-term-accent flex items-center justify-center text-xs font-[700] text-black">✓</span>
                <span className="text-term-fg font-[600] text-sm">{content.yes}</span>
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-3">
                {content.yesItems.map((it, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] text-term-fg-muted leading-[1.5]">
                    <span className="text-term-accent">›</span><span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-term-bg-elevated border border-term-border rounded-md p-6 border-l-[3px] border-l-term-fg-muted">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-dashed border-term-border">
                <span className="w-[18px] h-[18px] rounded-[3px] bg-term-bg-inset border border-term-border flex items-center justify-center text-xs font-[700] text-term-fg-muted">✗</span>
                <span className="text-term-fg font-[600] text-sm">{content.no}</span>
              </div>
              <ul className="list-none m-0 p-0 flex flex-col gap-3">
                {content.noItems.map((it, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] text-term-fg-faint leading-[1.5] line-through decoration-term-fg-muted">
                    <span className="text-term-fg-faint no-underline">›</span><span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="text-[11px] text-term-accent tracking-[0.18em] mb-3">{content.faqHead}</div>
          <h3 className="font-display text-[32px] font-[700] tracking-[-0.02em] m-0 mb-6 text-term-fg">{content.faqTitle}</h3>
          <div className="bg-term-bg-elevated border border-term-border rounded-md overflow-hidden">
            {content.faq.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className={`border-b border-term-border last:border-b-0`}>
                  <button onClick={() => setOpenFaq(open ? -1 : i)} className="w-full flex items-center gap-4 p-5 md:px-6 bg-transparent data-[state=open]:bg-term-bg-inset border-none cursor-pointer text-left font-mono text-term-fg transition-colors hover:bg-term-bg-inset" data-state={open ? 'open' : 'closed'}>
                    <span className="text-term-accent text-[13px] font-[700] min-w-[28px]">Q{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 text-sm font-[500]">{f.q}</span>
                    <span className="text-term-fg-muted text-base">{open ? '–' : '+'}</span>
                  </button>
                  {open && (
                    <div className="px-6 pb-6 pt-0 md:pl-[68px] text-[13px] leading-[1.7] text-term-fg-muted bg-term-bg-inset">
                      <span className="text-term-accent">›</span> {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
