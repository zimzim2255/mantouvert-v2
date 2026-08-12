 /* ============================================================
   MANTOUVERT — INTERNATIONALIZATION (i18n)
   Languages: English (default) · French · Arabic
   ============================================================ */
(function () {
  'use strict';

  const STORAGE_KEY = 'mantouvert-lang';

  /* --------------------------------------------
     Translation dictionaries.
     Key = the original English text (also the
     `data-i18n` attribute value). Missing keys
     fall back to English automatically.
     -------------------------------------------- */
  const dict = {
    fr: {
      /* Navigation */
      'Home': 'Accueil',
      'Projects': 'Projets',
      'Services': 'Services',
      'About': 'À propos',
      'Request a Quote': 'Demander un devis',
      'Open menu': 'Ouvrir le menu',
      'Close menu': 'Fermer le menu',

      /* Home — hero cards */
      'Hardscaping': 'Aménagement paysager',
      'Irrigation': 'Irrigation',
      'Maintenance': 'Entretien',
      'Always for the smile': 'Toujours pour le sourire',
      'We design, build and repair luxury pools and gardens across Morocco — from concept to completion, with craftsmanship you can trust.': 'Nous concevons, construisons et réparons des piscines et jardins de luxe partout au Maroc — de la conception à la réalisation, avec un savoir-faire de confiance.',

      /* Home — Atherton */
      'Two accessory structures rich in detail, designed to frame the landscape and extend the living space into the garden.': 'Deux annexes riches en détails, conçues pour encadrer le paysage et prolonger l\'espace de vie jusqu\'au jardin.',
      'Vertical timber slats, glass walls and a quiet material palette — architecture that belongs to its site.': 'Lames de bois verticales, parois vitrées et une palette de matériaux douce — une architecture qui appartient à son site.',
      'Atherton<br>Pavilions.': 'Atherton<br>Pavilions.',
      'The Atherton Pavilions are two accessory structures rich in detail, designed to frame the landscape and extend the living space into the garden.': 'Les Pavilions Atherton sont deux annexes riches en détails, conçues pour encadrer le paysage et prolonger l\'espace de vie jusqu\'au jardin.',
      'Explore all projects': 'Explorer tous les projets',
      'Main image — Atherton Pavilions, vertical timber slats and glass walls set within the forest.': 'Image principale — Pavilions Atherton, lames de bois verticales et parois vitrées au cœur de la forêt.',

      /* Home — Azure */
      'A serene poolscape wrapped in deep blue tones, designed to mirror the sky and bring calm to the outdoor living space.': 'Un paysage de piscine serein aux tons bleu profond, conçu pour refléter le ciel et apporter du calme à l\'espace de vie extérieur.',
      'Water, stone and glass in quiet dialogue — a composition that feels both modern and timeless.': 'Eau, pierre et verre en dialogue silencieux — une composition à la fois moderne et intemporelle.',
      'Azure<br>Reflections.': 'Riflessions<br>Azure.',
      'A luxury pool and terrace composition where deep blue water becomes the centerpiece of the garden.': 'Une composition de piscine et de terrasse de luxe où l\'eau bleu profond devient la pièce maîtresse du jardin.',
      'Main image — Azure Reflections, a luxury poolscape in deep blue tones.': 'Image principale — Riflessions Azure, un paysage de piscine de luxe aux tons bleu profond.',

      /* Home — Terra */
      'Warm timber, natural stone and earthy tones — a garden retreat grounded in the landscape.': 'Bois chaleureux, pierre naturelle et tons terreux — un refuge de jardin ancré dans le paysage.',
      'Rich brown textures and soft evening light create a quiet, intimate outdoor atmosphere.': 'Des textures brunes riches et une lumière douce du soir créent une atmosphère extérieure intime et calme.',
      'Terra<br>Garden.': 'Terra<br>Garden.',
      'An outdoor living space built from warm woods and natural stone, designed for slow evenings and quiet gatherings.': 'Un espace de vie extérieur construit en bois chaleureux et pierre naturelle, conçu pour des soirées lentes et des rassemblements paisibles.',
      'Main image — Terra Garden, warm timber and natural stone in the evening light.': 'Image principale — Terra Garden, bois chaleureux et pierre naturelle dans la lumière du soir.',

      /* Projects */
      'SELECTED<br>WORK': 'SÉLECTION<br>DE PROJETS',
      'REQUEST A QUOTE': 'DEMANDER UN DEVIS',
      '— 01 — Portfolio': '— 01 — Portfolio',
      'A curated collection of pools, gardens, villas and outdoor living spaces.': 'Une collection choisie de piscines, jardins, villas et espaces de vie extérieurs.',
      'Projects Completed': 'Projets réalisés',
      'Years of Experience': 'Années d\'expérience',
      'Happy Customers': 'Clients satisfaits',
      '— 03 — Your Turn': '— 03 — À vous',
      'Be the Next Project': 'Soyez le prochain projet',
      'Every garden, pool and villa starts with a conversation. Tell us about your space — and we\'ll make it the next one we\'re proud to call ours.': 'Chaque jardin, piscine et villa commence par une conversation. Parlez-nous de votre espace — et nous en ferons le prochain dont nous serons fiers.',
      'START YOUR PROJECT': 'DÉMARRER VOTRE PROJET',
      'HAVE A<br>PROJECT?': 'UN<br>PROJET ?',

      /* Services */
      'WHAT<br>WE DO': 'CE QUE<br>NOUS FAISONS',
      '— 01 — Services': '— 01 — Services',
      'We design, build, repair and maintain complete outdoor environments.': 'Nous concevons, construisons, réparons et entretenons des environnements extérieurs complets.',
      'Pool Construction': 'Construction de piscines',
      'Pool Repair': 'Réparation de piscines',
      'Pool Renovation': 'Rénovation de piscines',
      'Waterfalls': 'Cascades',
      'Cascade Systems': 'Systèmes de cascade',
      'Garden Design': 'Conception de jardins',
      'Landscape Architecture': 'Architecture paysagère',
      'Outdoor Lighting': 'Éclairage extérieur',
      'Stone Work': 'Travaux de pierre',
      'Concrete Works': 'Travaux en béton',
      'Luxury Outdoor Spaces': 'Espaces extérieurs de luxe',
      'Commercial Projects': 'Projets commerciaux',
      'Residential Projects': 'Projets résidentiels',
      'Specialized Services': 'Services spécialisés',
      'LET\'S<br>BUILD': 'CONSTRUISONS<br>ENSEMBLE',

      /* About */
      'THE<br>COMPANY': 'L\'ENTREPRISE',
      '— 01 — Our Story': '— 01 — Notre Histoire',
      'Mantouvert is a Moroccan company specializing in building, repairing and maintaining luxury pools and gardens — founded in 2019.': 'Mantouvert est une entreprise marocaine spécialisée dans la construction, la réparation et l\'entretien de piscines et jardins de luxe — fondée en 2019.',
      '— 02 — Philosophy': '— 02 — Philosophie',
      'Precision in Every Detail': 'La précision dans chaque détail',
      'Body copy about the studio\'s philosophy: craftsmanship, luxury, timelessness. Editorial tone with generous spacing.': 'Texte sur la philosophie de l\'entreprise : artisanat, luxe, intemporalité. Ton éditorial avec un espacement généreux.',
      'We design, build, repair and maintain complete outdoor environments — from luxury pools and cascading water features to gardens, villas and outdoor living spaces.': 'Nous concevons, construisons, réparons et entretenons des environnements extérieurs complets — des piscines de luxe et jeux d\'eau en cascade aux jardins, villas et espaces de vie extérieurs.',
      'View Our Work': 'Voir nos réalisations',
      'Design Awards': 'Prix de design',
      '— 03 — Testimonials': '— 03 — Témoignages',
      'What Clients Say': 'Ce que disent nos clients',
      '“A calm, beautiful quote about the experience with Mantouvert.”': '« Une citation calme et belle sur l\'expérience avec Mantouvert. »',
      'Client Name — Project Title': 'Nom du client — Titre du projet',
      '— 04 — Gallery': '— 04 — Galerie',
      'Based in Morocco, we bring together skilled craftsmanship and thoughtful design to build and restore pools, gardens and outdoor living spaces that last.': 'Basés au Maroc, nous allions un savoir-faire artisanal et une conception réfléchie pour construire et restaurer des piscines, jardins et espaces de vie extérieurs durables.',
      'Every project is guided by precision and care — from the first sketch to the final stone.': 'Chaque projet est guidé par la précision et le soin — du premier croquis à la dernière pierre.',
      'The Company': 'L\'Entreprise',
      'The Yard — 01': 'Le Jardin — 01',
      'The Yard — 02': 'Le Jardin — 02',
      'LET\'S<br>TALK': 'PARLONS-EN',

      /* Contact */
      'EMAIL US': 'ÉCRIVEZ-NOUS',
      '— 01 — Contact': '— 01 — Contact',
      'Tell us about your project. We\'ll respond within 24 hours.': 'Parlez-nous de votre projet. Nous répondrons sous 24 heures.',
      'Name': 'Nom',
      'Email': 'Email',
      'Phone': 'Téléphone',
      'Service': 'Service',
      'Waterfalls & Cascades': 'Cascades & jeux d\'eau',
      'Villas & Renovations': 'Villas & rénovations',
      'Other': 'Autre',
      'Project Details': 'Détails du projet',
      'SEND REQUEST': 'ENVOYER LA DEMANDE',
      'Contact': 'Contact',
      'Company': 'Entreprise',
      'Hours': 'Heures',
      'Mon – Sat · 9:00 – 18:00': 'Lun – Sam · 9:00 – 18:00',
      'BUILD<br>WITH US': 'CONSTRUISONS<br>ENSEMBLE',

      /* Service detail */
      'POOL<br>CONSTRUCTION': 'PISCINE<br>SUR MESURE',
      'Design · Build · Maintain': 'Conception · Construction · Entretien',
      '— 01 — Overview': '— 01 — Aperçu',
      'Luxury pools designed and built as architectural experiences, not afterthoughts.': 'Des piscines de luxe conçues et construites comme des expériences architecturales, jamais comme des après-coup.',
      'The Approach': 'Notre approche',
      'Body copy describing the service: process, materials, and craftsmanship. Editorial tone, generous spacing.': 'Texte décrivant le service : processus, matériaux et artisanat. Ton éditorial, espacement généreux.',
      'Process': 'Processus',
      'Consultation → Design → Build': 'Consultation → Conception → Construction',
      'Materials': 'Matériaux',
      'Natural stone · Concrete · Glass': 'Pierre naturelle · Béton · Verre',
      'Scope': 'Portée',
      'Residential · Commercial': 'Résidentiel · Commercial',
      '— 02 — Gallery': '— 02 — Galerie',
      'Recent Work': 'Travaux récents',
      'Project — 01': 'Projet — 01',
      'Project — 02': 'Projet — 02',
      '— 03 — Related': '— 03 — Associés',
      'Related Services': 'Services associés',

      /* Project detail */
      'VILLA<br>AMBRE': 'VILLA<br>AMBRE',
      'A private villa with an infinity pool, cascading water features and a curated garden.': 'Une villa privée avec une piscine à débordement, des jeux d\'eau en cascade et un jardin aménagé.',
      'The Brief': 'Le projet',
      'Body copy describing the project scope, design approach and materials used. Editorial tone with generous spacing.': 'Texte décrivant le périmètre du projet, l\'approche de conception et les matériaux utilisés. Ton éditorial avec un espacement généreux.',
      'Location': 'Lieu',
      'Year': 'Année',
      'Pool · Garden · Stone Work': 'Piscine · Jardin · Pierre',
      'Duration': 'Durée',
      '9 Months': '9 mois',
      'Detail — 01': 'Détail — 01',
      'Detail — 02': 'Détail — 02',
      'Detail — 03': 'Détail — 03',
      'Detail — 04': 'Détail — 04',
      'Next Project': 'Projet suivant',
      'Cascade House': 'Cascade House',
      'START<br>YOURS': 'COMMENCEZ<br>LE VÔTRE',

      /* Mega footer */
      'Design, build, repair and maintain complete outdoor environments — from luxury pools and cascading water features to gardens, villas and outdoor living spaces.': 'Nous concevons, construisons, réparons et entretenons des environnements extérieurs complets — des piscines de luxe et jeux d\'eau en cascade aux jardins, villas et espaces de vie extérieurs.',
      '© 2026 Mantouvert. All rights reserved.': '© 2026 Mantouvert. Tous droits réservés.',
      'Pool Construction · Garden Design · Landscaping · Villas': 'Piscines · Conception de jardins · Paysagisme · Villas',

      /* Infinite gallery */
      'Close': 'Fermer',
      'Explore the Collection': 'Explorer la collection',
      'Pools': 'Piscines',
      'Gardens': 'Jardins',
      'Fountains': 'Fontaines'
    },

    ar: {
      /* Navigation */
      'Home': 'الرئيسية',
      'Projects': 'المشاريع',
      'Services': 'الخدمات',
      'About': 'عنا',
      'Request a Quote': 'اطلب عرض سعر',
      'Open menu': 'فتح القائمة',
      'Close menu': 'إغلاق القائمة',

      /* Home — hero cards */
      'Hardscaping': 'البناء الخارجي',
      'Irrigation': 'الري',
      'Maintenance': 'الصيانة',
      'Always for the smile': 'دائمًا من أجل الابتسامة',
      'We design, build and repair luxury pools and gardens across Morocco — from concept to completion, with craftsmanship you can trust.': 'نصمم ونبني ونصلح المسابح والحدائق الفاخرة في جميع أنحاء المغرب — من الفكرة إلى الإنجاز، بحرفية تثق بها.',

      /* Home — Atherton */
      'Two accessory structures rich in detail, designed to frame the landscape and extend the living space into the garden.': 'مبنيان إضافيان غنيان بالتفاصيل، مصممان لتأطير المناظر الطبيعية وتمديد مساحة المعيشة إلى الحديقة.',
      'Vertical timber slats, glass walls and a quiet material palette — architecture that belongs to its site.': 'شرائح خشبية عمودية وجدران زجاجية ولوحة مواد هادئة — هندسة معمارية تنتمي إلى موقعها.',
      'Atherton<br>Pavilions.': 'أثيرتون<br>بافيليون.',
      'The Atherton Pavilions are two accessory structures rich in detail, designed to frame the landscape and extend the living space into the garden.': 'أجنحة أثيرتون عبارة عن مبنيين إضافيين غنيين بالتفاصيل، مصممان لتأطير المناظر الطبيعية وتمديد مساحة المعيشة إلى الحديقة.',
      'Explore all projects': 'استكشف جميع المشاريع',
      'Main image — Atherton Pavilions, vertical timber slats and glass walls set within the forest.': 'الصورة الرئيسية — أجنحة أثيرتون، شرائح خشبية عمودية وجدران زجاجية وسط الغابة.',

      /* Home — Azure */
      'A serene poolscape wrapped in deep blue tones, designed to mirror the sky and bring calm to the outdoor living space.': 'منظر مسبح هادئ بألوان زرقاء عميقة، مصمم ليعكس السماء ويجلب الهدوء إلى مساحة المعيشة الخارجية.',
      'Water, stone and glass in quiet dialogue — a composition that feels both modern and timeless.': 'ماء وحجر وزجاج في حوار هادئ — تكوين يبدو حديثًا وخالدًا في آن واحد.',
      'Azure<br>Reflections.': 'انعكاسات<br>اللازورد.',
      'A luxury pool and terrace composition where deep blue water becomes the centerpiece of the garden.': 'تكوين فاخر من مسبح وتراس حيث يصبح الماء الأزرق العميق قطعة الحديقة المركزية.',
      'Main image — Azure Reflections, a luxury poolscape in deep blue tones.': 'الصورة الرئيسية — انعكاسات اللازورد، منظر مسبح فاخر بألوان زرقاء عميقة.',

      /* Home — Terra */
      'Warm timber, natural stone and earthy tones — a garden retreat grounded in the landscape.': 'خشب دافئ وحجر طبيعي وألوان ترابية — ملاذ حديقة متجذر في المناظر الطبيعية.',
      'Rich brown textures and soft evening light create a quiet, intimate outdoor atmosphere.': 'أنسجة بنية غنية وضوء مسائي ناعم يخلقان جوًا خارجيًا هادئًا وحميميًا.',
      'Terra<br>Garden.': 'حديقة<br>تيرا.',
      'An outdoor living space built from warm woods and natural stone, designed for slow evenings and quiet gatherings.': 'مساحة معيشة خارجية مبنية من أخشاب دافئة وحجر طبيعي، مصممة لأمسيات هادئة وتجمعات مريحة.',
      'Main image — Terra Garden, warm timber and natural stone in the evening light.': 'الصورة الرئيسية — حديقة تيرا، خشب دافئ وحجر طبيعي في ضوء المساء.',

      /* Projects */
      'SELECTED<br>WORK': 'أعمال<br>مختارة',
      'REQUEST A QUOTE': 'اطلب عرض سعر',
      '— 01 — Portfolio': '— 01 — الأعمال',
      'A curated collection of pools, gardens, villas and outdoor living spaces.': 'مجموعة مختارة من المسابح والحدائق والفيلات ومساحات المعيشة الخارجية.',
      'Projects Completed': 'مشاريع منجزة',
      'Years of Experience': 'سنوات من الخبرة',
      'Happy Customers': 'عملاء سعداء',
      '— 03 — Your Turn': '— 03 — دورك',
      'Be the Next Project': 'كن المشروع القادم',
      'Every garden, pool and villa starts with a conversation. Tell us about your space — and we\'ll make it the next one we\'re proud to call ours.': 'كل حديقة ومسبح وفيلا تبدأ بمحادثة. أخبرنا عن مساحتك — وسنجعلها التالية التي نفخر بها.',
      'START YOUR PROJECT': 'ابدأ مشروعك',
      'HAVE A<br>PROJECT?': 'لديك<br>مشروع؟',

      /* Services */
      'WHAT<br>WE DO': 'ماذا<br>نفعل',
      '— 01 — Services': '— 01 — الخدمات',
      'We design, build, repair and maintain complete outdoor environments.': 'نصمم ونبني ونصلح ونصون بيئات خارجية متكاملة.',
      'Pool Construction': 'بناء المسابح',
      'Pool Repair': 'إصلاح المسابح',
      'Pool Renovation': 'تجديد المسابح',
      'Waterfalls': 'الشلالات',
      'Cascade Systems': 'أنظمة الشلالات',
      'Garden Design': 'تصميم الحدائق',
      'Landscape Architecture': 'هندسة المناظر الطبيعية',
      'Outdoor Lighting': 'الإضاءة الخارجية',
      'Stone Work': 'أعمال الحجر',
      'Concrete Works': 'الأعمال الخرسانية',
      'Luxury Outdoor Spaces': 'المساحات الخارجية الفاخرة',
      'Commercial Projects': 'المشاريع التجارية',
      'Residential Projects': 'المشاريع السكنية',
      'Specialized Services': 'خدمات متخصصة',
      'LET\'S<br>BUILD': 'لنبدأ<br>البناء',

      /* About */
      'THE<br>COMPANY': 'الشركة',
      '— 01 — Our Story': '— 01 — قصتنا',
      'Mantouvert is a Moroccan company specializing in building, repairing and maintaining luxury pools and gardens — founded in 2019.': 'مانتوفير شركة مغربية متخصصة في بناء وإصلاح وصيانة المسابح والحدائق الفاخرة — تأسست عام 2019.',
      '— 02 — Philosophy': '— 02 — الفلسفة',
      'Precision in Every Detail': 'الدقة في كل تفصيل',
      'Body copy about the studio\'s philosophy: craftsmanship, luxury, timelessness. Editorial tone with generous spacing.': 'نص عن فلسفة الشركة: الحرفية، الفخامة، الخلود. نبرة تحريرية بمسافات واسعة.',
      'We design, build, repair and maintain complete outdoor environments — from luxury pools and cascading water features to gardens, villas and outdoor living spaces.': 'نصمم ونبني ونصلح ونصون بيئات خارجية متكاملة — من المسابح الفاخرة ونوافير المياه المتدفقة إلى الحدائق والفيلات ومساحات المعيشة الخارجية.',
      'View Our Work': 'شاهد أعمالنا',
      'Design Awards': 'جوائز تصميم',
      '— 03 — Testimonials': '— 03 — آراء العملاء',
      'What Clients Say': 'ماذا يقول العملاء',
      '“A calm, beautiful quote about the experience with Mantouvert.”': '«اقتباس هادئ وجميل عن التجربة مع مانتوفير.»',
      'Client Name — Project Title': 'اسم العميل — عنوان المشروع',
      '— 04 — Gallery': '— 04 — المعرض',
      'Based in Morocco, we bring together skilled craftsmanship and thoughtful design to build and restore pools, gardens and outdoor living spaces that last.': 'مقيمون في المغرب، نجمع بين الحرفية الماهرة والتصميم المدروس لبناء وترميم المسابح والحدائق ومساحات المعيشة الخارجية التي تدوم.',
      'Every project is guided by precision and care — from the first sketch to the final stone.': 'كل مشروع يُدار بدقة وعناية — من أول رسم إلى آخر حجر.',
      'The Company': 'الشركة',
      'The Yard — 01': 'الحديقة — 01',
      'The Yard — 02': 'الحديقة — 02',
      'LET\'S<br>TALK': 'لنتحدث',

      /* Contact */
      'EMAIL US': 'راسلنا',
      '— 01 — Contact': '— 01 — التواصل',
      'Tell us about your project. We\'ll respond within 24 hours.': 'أخبرنا عن مشروعك. سنرد خلال 24 ساعة.',
      'Name': 'الاسم',
      'Email': 'البريد الإلكتروني',
      'Phone': 'الهاتف',
      'Service': 'الخدمة',
      'Waterfalls & Cascades': 'الشلالات والنوافير',
      'Villas & Renovations': 'الفيلات والتجديدات',
      'Other': 'أخرى',
      'Project Details': 'تفاصيل المشروع',
      'SEND REQUEST': 'إرسال الطلب',
      'Contact': 'اتصل بنا',
      'Company': 'الشركة',
      'Hours': 'ساعات العمل',
      'Mon – Sat · 9:00 – 18:00': 'الإثنين – السبت · 9:00 – 18:00',
      'BUILD<br>WITH US': 'ابنِ<br>معنا',

      /* Service detail */
      'POOL<br>CONSTRUCTION': 'بناء<br>المسابح',
      'Design · Build · Maintain': 'تصميم · بناء · صيانة',
      '— 01 — Overview': '— 01 — نظرة عامة',
      'Luxury pools designed and built as architectural experiences, not afterthoughts.': 'مسابح فاخرة مصممة ومبنية كتجارب معمارية، وليست إضافات لاحقة.',
      'The Approach': 'منهجنا',
      'Body copy describing the service: process, materials, and craftsmanship. Editorial tone, generous spacing.': 'نص يصف الخدمة: العملية والمواد والحرفية. نبرة تحريرية بمسافات واسعة.',
      'Process': 'العملية',
      'Consultation → Design → Build': 'استشارة → تصميم → بناء',
      'Materials': 'المواد',
      'Natural stone · Concrete · Glass': 'حجر طبيعي · خرسانة · زجاج',
      'Scope': 'النطاق',
      'Residential · Commercial': 'سكني · تجاري',
      '— 02 — Gallery': '— 02 — المعرض',
      'Recent Work': 'أعمال حديثة',
      'Project — 01': 'المشروع — 01',
      'Project — 02': 'المشروع — 02',
      '— 03 — Related': '— 03 — ذات صلة',
      'Related Services': 'خدمات ذات صلة',

      /* Project detail */
      'VILLA<br>AMBRE': 'فيلا<br>أمبر',
      'A private villa with an infinity pool, cascading water features and a curated garden.': 'فيلا خاصة مع مسبح لا متناهي ونوافير مياه متدفقة وحديقة منسقة.',
      'The Brief': 'الملف التعريفي',
      'Body copy describing the project scope, design approach and materials used. Editorial tone with generous spacing.': 'نص يصف نطاق المشروع ومنهج التصميم والمواد المستخدمة. نبرة تحريرية بمسافات واسعة.',
      'Location': 'الموقع',
      'Year': 'السنة',
      'Pool · Garden · Stone Work': 'مسبح · حديقة · حجر',
      'Duration': 'المدة',
      '9 Months': '9 أشهر',
      'Detail — 01': 'تفصيل — 01',
      'Detail — 02': 'تفصيل — 02',
      'Detail — 03': 'تفصيل — 03',
      'Detail — 04': 'تفصيل — 04',
      'Next Project': 'المشروع التالي',
      'Cascade House': 'منزل الشلال',
      'START<br>YOURS': 'ابدأ<br>مشروعك',

      /* Mega footer */
      'Design, build, repair and maintain complete outdoor environments — from luxury pools and cascading water features to gardens, villas and outdoor living spaces.': 'نصمم ونبني ونصلح ونصون بيئات خارجية متكاملة — من المسابح الفاخرة ونوافير المياه المتدفقة إلى الحدائق والفيلات ومساحات المعيشة الخارجية.',
      '© 2026 Mantouvert. All rights reserved.': '© 2026 مانتوفير. جميع الحقوق محفوظة.',
      'Pool Construction · Garden Design · Landscaping · Villas': 'المسابح · تصميم الحدائق · تنسيق المواقع · الفيلات',

      /* Infinite gallery */
      'Close': 'إغلاق',
      'Explore the Collection': 'استكشف المجموعة',
      'Pools': 'المسابح',
      'Gardens': 'الحدائق',
      'Fountains': 'النوافير'
    }
  };

  const LANGS = ['en', 'fr', 'ar'];

  const getSavedLang = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) { /* ignore */ }
    return 'en';
  };

  let current = getSavedLang();

  const t = (key) => {
    if (!key) return '';
    const table = dict[current];
    return (table && table[key]) ? table[key] : key;
  };

  /* Apply translations to every [data-i18n] element under `root`. */
  const translate = (root) => {
    const scope = root || document;
    const nodes = scope.querySelectorAll('[data-i18n]');
    nodes.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (!key) return;
      el.innerHTML = t(key);
    });

    // Translate images with a data-i18n-alt attribute
    const alts = scope.querySelectorAll('[data-i18n-alt]');
    alts.forEach((el) => {
      const key = el.getAttribute('data-i18n-alt');
      if (!key) return;
      el.setAttribute('alt', t(key));
    });

    // Translate placeholders
    const phs = scope.querySelectorAll('[data-i18n-placeholder]');
    phs.forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (!key) return;
      el.setAttribute('placeholder', t(key));
    });
  };

  const applyDocumentDirection = () => {
    const html = document.documentElement;
    html.setAttribute('lang', current === 'en' ? 'en' : current);
    html.setAttribute('dir', current === 'ar' ? 'rtl' : 'ltr');
  };

  const setLang = (code) => {
    if (LANGS.indexOf(code) === -1) return;
    current = code;
    try { localStorage.setItem(STORAGE_KEY, code); } catch (e) { /* ignore */ }
    applyDocumentDirection();
    translate(document);
    updateSwitcherState();
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: code } }));
  };

  /* ---- Language switcher UI ---- */
  let switcher = null;

  const buildSwitcher = () => {
    const container = document.createElement('div');
    container.className = 'lang-switcher';
    container.setAttribute('role', 'group');
    container.setAttribute('aria-label', 'Language');

    LANGS.forEach((code) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lang-switcher__btn';
      btn.dataset.lang = code;
      btn.textContent = code.toUpperCase();
      btn.setAttribute('aria-pressed', current === code ? 'true' : 'false');
      btn.addEventListener('click', () => setLang(code));
      container.appendChild(btn);
    });

    return container;
  };

  const updateSwitcherState = () => {
    if (!switcher) return;
    switcher.querySelectorAll('.lang-switcher__btn').forEach((btn) => {
      const active = btn.dataset.lang === current;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  };

  const injectSwitcher = () => {
    // Place the switcher inside the header, outside the centered nav column
    const header = document.querySelector('.site-header');
    if (!header) return;
    switcher = buildSwitcher();
    header.appendChild(switcher);
    updateSwitcherState();
  };

  /* Public API */
  window.MantouvertI18n = {
    t: t,
    translate: translate,
    setLang: setLang,
    getLang: () => current
  };

  /* Bootstrap */
  document.addEventListener('DOMContentLoaded', () => {
    applyDocumentDirection();
    translate(document);
    injectSwitcher();
    updateSwitcherState();
  });
})();