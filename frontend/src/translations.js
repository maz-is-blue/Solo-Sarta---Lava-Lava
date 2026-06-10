export const TRANSLATIONS = {
  en: {
    // direction
    back_arrow: '←',
    fwd_arrow: '→',
    back_home: 'HOME',
    back_to_home: 'BACK TO HOME',
    view_bag: 'VIEW BAG',
    // lava nav
    lava_collection: 'Collection',
    lava_story: 'Our Story',
    lava_contact: 'Contact',
    // solo nav
    solo_atelier: 'Atelier',
    solo_collection: 'Collection',
    solo_story: 'Story',
    solo_contact: 'Contact',
    // buttons - lava
    shop_drop: 'Shop the Drop ⚡',
    read_vibe: 'Read our vibe',
    add_to_bag: 'Add to Bag ⚡',
    added: '✓ Added',
    added_to_bag: '✓ ADDED TO BAG',
    add: 'ADD',
    add_to_bag_btn: 'ADD TO BAG',
    select_size: 'SELECT A SIZE',
    join: 'JOIN ✦',
    view_all: 'VIEW ALL',
    pieces: 'pieces',
    // buttons - solo
    explore_collection: 'EXPLORE COLLECTION',
    book_consultation: 'BOOK A CONSULTATION',
    our_story: 'OUR STORY',
    add_atelier_bag: 'ADD TO ATELIER BAG',
    request_invitation: 'REQUEST INVITATION',
    request_fitting: 'REQUEST A FITTING',
    view: 'VIEW →',
    bespoke_enquiries: 'BESPOKE ENQUIRIES',
    // loading / states
    loading: 'Loading...',
    no_pieces_yet: 'No pieces in this category yet.',
    no_two_alike: '. No two alike.',
    // product - lava
    tab_details: 'Details',
    tab_care: 'Care',
    tab_shipping: 'Shipping & Returns',
    colorway: 'COLORWAY',
    size_label: 'SIZE',
    quantity: 'QUANTITY',
    // product - solo
    fabric_label: 'FABRIC',
    process_label: 'PROCESS TIME',
    method_label: 'METHOD',
    atelier_label: 'ATELIER',
    // cart / checkout
    your_bag: 'Your Bag',
    checkout_btn: 'Proceed to Checkout',
    empty_bag: 'Your bag is empty',
    // currency
    currency: '$',
    // language toggle
    lang_label: 'عربي',
  },
  ar: {
    // direction
    back_arrow: '→',
    fwd_arrow: '←',
    back_home: 'الرئيسية',
    back_to_home: 'العودة للرئيسية',
    view_bag: 'الحقيبة',
    // lava nav
    lava_collection: 'المجموعة',
    lava_story: 'قصتنا',
    lava_contact: 'تواصل',
    // solo nav
    solo_atelier: 'الأتيليه',
    solo_collection: 'المجموعة',
    solo_story: 'القصة',
    solo_contact: 'تواصل',
    // buttons - lava
    shop_drop: 'تسوق الإصدار ⚡',
    read_vibe: 'اقرأ قصتنا',
    add_to_bag: 'أضف للحقيبة ⚡',
    added: '✓ أُضيف',
    added_to_bag: '✓ أُضيف للحقيبة',
    add: 'أضف',
    add_to_bag_btn: 'أضف للحقيبة',
    select_size: 'اختر المقاس',
    join: 'انضم ✦',
    view_all: 'عرض الكل',
    pieces: 'قطعة',
    // buttons - solo
    explore_collection: 'استكشف المجموعة',
    book_consultation: 'احجز استشارة',
    our_story: 'قصتنا',
    add_atelier_bag: 'أضف للحقيبة',
    request_invitation: 'طلب دعوة',
    request_fitting: 'طلب قياس',
    view: 'عرض ←',
    bespoke_enquiries: 'استفسارات حسب الطلب',
    // loading / states
    loading: 'جارٍ التحميل...',
    no_pieces_yet: 'لا توجد قطع في هذه الفئة حتى الآن.',
    no_two_alike: '. لا قطعتان متشابهتان.',
    // product - lava
    tab_details: 'التفاصيل',
    tab_care: 'العناية',
    tab_shipping: 'الشحن والإرجاع',
    colorway: 'الألوان',
    size_label: 'المقاس',
    quantity: 'الكمية',
    // product - solo
    fabric_label: 'القماش',
    process_label: 'وقت التنفيذ',
    method_label: 'الأسلوب',
    atelier_label: 'الأتيليه',
    // cart / checkout
    your_bag: 'حقيبتك',
    checkout_btn: 'إتمام الطلب',
    empty_bag: 'حقيبتك فارغة',
    // currency
    currency: 'جنيه',
    // language toggle
    lang_label: 'EN',
  },
}

export const t = (key, lang) =>
  TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key
