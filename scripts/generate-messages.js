const fs = require('fs');

const en = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));
const tr = JSON.parse(fs.readFileSync('messages/tr.json', 'utf8'));

// Add Navigation
en.Navigation = {
  home: "home",
  projects: "projects",
  contact: "contact",
  prefs: "// prefs",
  navigation: "// navigation"
};
tr.Navigation = {
  home: "anasayfa",
  projects: "projeler",
  contact: "iletisim",
  prefs: "// tercihler",
  navigation: "// navigasyon"
};

// Add Hero
en.Hero = {
  tag: "AVAILABLE FOR WORK",
  title1: "Backend",
  title2: "engineer",
  title3: "since '24.",
  sub: "Backend Engineer at MapaGlobal. We maintain and evolve our payment-integration services on FAST, BKM, EFT and SWIFT — and provide technical support to the banks and e-money / payment institutions that use them.",
  cta1: "./view_work.sh",
  cta2: "./contact.sh",
  panel: "CURRENT FOCUS",
  panelText: "Backend engineer @ MapaGlobal — maintaining our FAST, BKM, EFT and SWIFT integration services and supporting the banks & e-money / payment institutions that use them."
};
tr.Hero = {
  tag: "İŞ İÇİN MÜSAİT",
  title1: "Backend",
  title2: "mühendisi",
  title3: "'24'ten beri.",
  sub: "MapaGlobal'da Backend Engineer. FAST, BKM, EFT ve SWIFT üzerine kurulu ödeme entegrasyonu servislerimizi geliştirip bakımını yapıyor, hizmet sunduğumuz banka ve elektronik para / ödeme kuruluşlarına teknik destek sağlıyoruz.",
  cta1: "./projeleri_gor.sh",
  cta2: "./iletisim.sh",
  panel: "ŞU ANDA ODAKTAYIM",
  panelText: "MapaGlobal'da backend engineer — FAST, BKM, EFT ve SWIFT entegrasyon servislerimizin bakımını yapıyor ve hizmet sunduğumuz banka & EPÖ kuruluşlarına teknik destek sağlıyorum."
};

// Add About
en.About = {
  tag: "// stack.config",
  title: "What I work with",
  sub: "Java / Spring Boot, MSSQL and Oracle on the day job — maintaining payment-integration services and supporting the institutions that use them. Categorized by where they sit in the stack.",
  collab: "interested in collaborating?",
  contact: "./contact.sh",
  cats: {
    backend: { label: "Backend & APIs", items: [
      { name: "Java & Spring Boot", note: "Enterprise services, REST APIs, JPA" },
      { name: "C# & .NET Core", note: "ASP.NET Core, business logic layers" },
      { name: "Node.js & Express", note: "RESTful APIs, services, server-side TS" },
      { name: "Python & FastAPI", note: "Async APIs, scripting, data tooling" }
    ]},
    data: { label: "Databases", items: [
      { name: "Microsoft SQL Server", note: "Day-to-day database" },
      { name: "Oracle Database", note: "Day-to-day database" },
      { name: "PostgreSQL & MySQL", note: "Relational modeling, migrations" },
      { name: "MongoDB", note: "Document schemas, aggregation" }
    ]},
    frontend: { label: "Frontend & Tooling", items: [
      { name: "React & Next.js", note: "Interactive, server-rendered apps" },
      { name: "TypeScript", note: "Type-safe interfaces, end to end" },
      { name: "GraphQL & REST", note: "API contracts, schema design" }
    ]}
  }
};
tr.About = {
  tag: "// stack.config",
  title: "Çalıştığım teknolojiler",
  sub: "İş yerinde Java / Spring Boot, MSSQL ve Oracle — ödeme entegrasyonu servislerimizin bakımını yapıp hizmet sunduğumuz kuruluşlara destek veriyoruz. Stack içindeki yerlerine göre kategorize edildi.",
  collab: "birlikte çalışmak ister misin?",
  contact: "./iletisim.sh",
  cats: {
    backend: { label: "Backend & API", items: [
      { name: "Java & Spring Boot", note: "Kurumsal servisler, REST API, JPA" },
      { name: "C# & .NET Core", note: "ASP.NET Core, iş mantığı katmanları" },
      { name: "Node.js & Express", note: "RESTful API'ler, servisler, sunucu tarafı TS" },
      { name: "Python & FastAPI", note: "Async API'ler, scripting, veri araçları" }
    ]},
    data: { label: "Veritabanları", items: [
      { name: "Microsoft SQL Server", note: "Günlük çalıştığım veritabanı" },
      { name: "Oracle Database", note: "Günlük çalıştığım veritabanı" },
      { name: "PostgreSQL & MySQL", note: "İlişkisel modelleme, migration" },
      { name: "MongoDB", note: "Doküman şemaları, aggregation" }
    ]},
    frontend: { label: "Frontend & Araçlar", items: [
      { name: "React & Next.js", note: "Etkileşimli, sunucu render uygulamalar" },
      { name: "TypeScript", note: "Uçtan uca tip güvenli arayüzler" },
      { name: "GraphQL & REST", note: "API kontratları, şema tasarımı" }
    ]}
  }
};

// Add FeaturedWork
en.FeaturedWork = {
  tag: "// featured_work",
  title: "A few things I built",
  viewAll: "view all"
};
tr.FeaturedWork = {
  tag: "// featured_work",
  title: "Yaptığım birkaç şey",
  viewAll: "tümünü gör"
};

// Add CurrentlyStrip
en.CurrentlyStrip = {
  tag: "// now.log",
  title: "Currently",
  updated: "updated may 2026",
  items: {
    working: { label: "working on", val: "FAST · BKM · EFT · SWIFT", sub: "maintaining + supporting integrations @ MapaGlobal" },
    learning: { label: "learning", val: "Spring Boot internals", sub: "JPA, transactions, query plans" },
    exploring: { label: "exploring", val: "FAST & SWIFT internals", sub: "message specs, ISO 20022, edge cases" },
    side: { label: "side projects", val: "Next.js · React · React Native", sub: "weekends, just for fun" }
  }
};
tr.CurrentlyStrip = {
  tag: "// now.log",
  title: "Şu an",
  updated: "mayıs 2026 güncel",
  items: {
    working: { label: "üzerinde çalışıyor", val: "FAST · BKM · EFT · SWIFT", sub: "entegrasyon bakımı + teknik destek @ MapaGlobal" },
    learning: { label: "öğreniyor", val: "Spring Boot internals", sub: "JPA, transactionlar, query planları" },
    exploring: { label: "keşfediyor", val: "FAST & SWIFT iç yapısı", sub: "mesaj şartnameleri, ISO 20022, uç durumlar" },
    side: { label: "yan projeler", val: "Next.js · React · React Native", sub: "hafta sonları, eğlence için" }
  }
};

// Add Projects
en.Projects = {
  tag: "// projects.list",
  title: "Selected work",
  sub: "A focused index. Click any row to expand.",
  col1: "NO.",
  col2: "YEAR",
  col3: "PROJECT",
  col4: "STACK",
  col5: "VIEW",
  media: "[ PROJECT MEDIA ]"
};
tr.Projects = {
  tag: "// projects.list",
  title: "Seçilmiş işler",
  sub: "Odaklı bir index. Detay için bir satıra tıklayın.",
  col1: "NO.",
  col2: "YIL",
  col3: "PROJE",
  col4: "TEKNOLOJİ",
  col5: "GÖRÜNTÜLE",
  media: "[ PROJE MEDYASI ]"
};

// Add Contact
en.Contact = {
  tag: "// contact.sh",
  title: "Get in touch",
  sub: "Backend engineer @ MapaGlobal. Reach out for partnership questions, integration support, or just to say hi.",
  message: "~/message.txt",
  nameLabel: "name",
  namePlaceholder: "Ada Lovelace",
  emailLabel: "email",
  emailPlaceholder: "ada@example.com",
  messageLabel: "message",
  messagePlaceholder: "Tell me about your project…",
  sendBtn: "./send_message.sh",
  openBtn: "open →",
  lookingHead: "// looking_for",
  lookingTitle: "What I'm up for",
  yes: "Yes please",
  yesItems: [
    "Banks or e-money / payment institutions exploring our services",
    "Integration questions on FAST, BKM, EFT or SWIFT",
    "Open-source collabs & code reviews",
    "Coffee chats with other backend / payments folks"
  ],
  no: "Not right now",
  noItems: [
    "Crypto / web3 token launches",
    "Cold recruiter spam without context",
    "Vendor pitches — please go through MapaGlobal"
  ],
  faqHead: "// faq.md",
  faqTitle: "Often asked",
  faq: {
    q1: { q: "Where do you work?", a: "Backend Engineer at MapaGlobal. Our team maintains and evolves the payment-integration services that connect to Turkey's rails (FAST, BKM, EFT) and SWIFT, and we provide technical support to the banks and licensed e-money / payment institutions that consume them." },
    q2: { q: "What does your day look like?", a: "Mostly extending and patching existing services as new requirements come in, debugging integration issues, and supporting the institutions that use us — message-level investigations, schema tweaks, performance fixes." },
    q3: { q: "What's your stack sweet spot?", a: "Java / Spring Boot, MSSQL and Oracle on the day job. Node.js, .NET and Python on the side. SQL, integrations and message contracts are where I spend most of my time." },
    q4: { q: "How fast do you reply?", a: "Within 24 hours on weekdays, usually faster. If it's urgent, mention it in the subject and I'll prioritize." }
  }
};
tr.Contact = {
  tag: "// iletisim.sh",
  title: "İletişime geç",
  sub: "MapaGlobal'da backend engineer. İşbirliği soruları, entegrasyon desteği veya sadece selam için yaz.",
  message: "~/mesaj.txt",
  nameLabel: "isim",
  namePlaceholder: "Ada Lovelace",
  emailLabel: "email",
  emailPlaceholder: "ada@example.com",
  messageLabel: "mesaj",
  messagePlaceholder: "Projenden bahset…",
  sendBtn: "./mesaj_gonder.sh",
  openBtn: "aç →",
  lookingHead: "// aradığım",
  lookingTitle: "Ne arıyorum",
  yes: "Evet, lütfen",
  yesItems: [
    "Servislerimizi değerlendiren banka / EPÖ kuruluşları",
    "FAST, BKM, EFT veya SWIFT entegrasyon soruları",
    "Açık kaynak işbirlikleri & code review",
    "Backend / ödeme sistemleri üzerine sohbet"
  ],
  no: "Şu an değil",
  noItems: [
    "Crypto / web3 token launchleri",
    "Bağlamsız soğuk recruiter mesajları",
    "Satıcı teklifleri — lütfen MapaGlobal'dan geçirin"
  ],
  faqHead: "// sss.md",
  faqTitle: "Sıkça sorulanlar",
  faq: {
    q1: { q: "Nerede çalışıyorsun?", a: "MapaGlobal'da Backend Engineer. Ekibimiz Turkiye'nin ödeme altyapılarına (FAST, BKM, EFT) ve sınır ötesi için SWIFT'e bağlanan ödeme entegrasyonu servislerinin bakımını yapıyor; hizmet sunduğumuz banka ve lisanslı elektronik para / ödeme kuruluşlarına teknik destek sağlıyoruz." },
    q2: { q: "Günün nasıl geçiyor?", a: "Genelde yeni gereksinimler geldiğinde mevcut servisleri geliştirmek/yamamak, entegrasyon sorunlarını debug etmek ve hizmet sunduğumuz kuruluşlara destek vermek — mesaj seviyesinde incelemeler, şema düzenlemeleri, performans çözümleri." },
    q3: { q: "Hangi stack'te en iyisin?", a: "İş yerinde Java / Spring Boot, MSSQL ve Oracle. Yan tarafta Node.js, .NET ve Python. SQL, entegrasyonlar ve mesaj kontratları en çok vakit geçirdiğim alanlar." },
    q4: { q: "Ne kadar hızlı dönüyorsun?", a: "Hafta içi 24 saat içinde, genelde daha hızlı. Aciliyet varsa konuda belirt, öne alırım." }
  }
};

// Add Footer
en.Footer = {
  navigate: "navigate",
  connect: "connect",
  now: "now",
  home: "home",
  desc: "Backend engineer @ MapaGlobal. Maintaining payment-integration services on FAST, BKM, EFT and SWIFT, and supporting the banks and e-money / payment institutions that use them.",
  pill: "backend engineer @ MapaGlobal",
  copy: "all rights reserved",
  source: "view source: "
};
tr.Footer = {
  navigate: "gezin",
  connect: "bağlan",
  now: "şimdi",
  home: "anasayfa",
  desc: "MapaGlobal'da backend engineer. FAST, BKM, EFT ve SWIFT üzerine kurulu ödeme entegrasyonu servislerimizin bakımını yapıyor, hizmet sunduğumuz banka ve EPÖ kuruluşlarına teknik destek sağlıyor.",
  pill: "MapaGlobal'da backend engineer",
  copy: "tüm hakları saklıdır",
  source: "kaynak: "
};

fs.writeFileSync('messages/en.json', JSON.stringify(en, null, 2));
fs.writeFileSync('messages/tr.json', JSON.stringify(tr, null, 2));
