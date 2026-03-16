# QTMB Portfolio - Cloudflare Deployment Guide

## نظرة عامة

تم تحويل المشروع بالكامل من Netlify إلى Cloudflare مع:

1. **Cloudflare KV** - للبيانات النصية الصغيرة (إعدادات، SEO، بيانات المستخدمين)
2. **Cloudflare R2** - للملفات الثقيلة (الصور، الفيديوهات)
3. **Cloudflare Pages Functions** - بدلاً من Netlify Functions

---

## خطوات النشر

### 1. إنشاء KV Namespace

```bash
wrangler kv:namespace create CONTENT
```

انسخ الـ ID الناتج وضعه في ملف `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "CONTENT"
id = "your-kv-namespace-id-here"
```

### 2. إنشاء R2 Bucket

```bash
wrangler r2 bucket create qtmb-media
```

### 3. تعديل كلمة مرور الأدمن

في ملف `wrangler.toml`:

```toml
[vars]
ADMIN_PASSWORD = "your-secure-password-here"
```

### 4. نشر المشروع

```bash
wrangler pages deploy . --project-name=qtmb-portfolio
```

أو اربط المستودع بـ Cloudflare Pages من لوحة التحكم.

---

## الميزات الجديدة

### 1. SEO & Open Graph Tags
- تعديل كل الـ Meta Tags من لوحة التحكم
- Open Graph للفيسبوك وواتساب ولينكد إن
- Twitter Cards
- Schema Markup تلقائي
- معاينة مباشرة للكروة

### 2. حماية صفحة الأدمن
- كلمة مرور مطلوبة للدخول
- يمكن تغييرها من إعدادات الأدمن
- الجلسة تنتهي عند إغلاق المتصفح

### 3. إدارة الميديا عبر R2
- رفع الصور والفيديوهات
- حجم أقصى: 50MB للملف
- أنواع مدعومة: JPG, PNG, GIF, WebP, SVG, MP4, WebM
- نسخ رابط الملف بسهولة

### 4. تحرير كامل
- تحريك العناصر (drag & drop)
- تعديل كل شيء
- إضافة/حذف مشاريع، مهارات، خبرات، خدمات
- تصدير المحتوى كـ JSON

---

## هيكل المشروع

```
qtmb_cloudflare_v2/
├── index.html          # الصفحة الرئيسية
├── admin.html          # لوحة التحكم
├── wrangler.toml       # إعدادات Cloudflare
├── _routes.json        # توجيه الـ Functions
├── css/
│   ├── style.css       # أنماط الموقع
│   ├── admin.css       # أنماط لوحة التحكم
│   └── block-editor.css
├── js/
│   ├── script.js       # سكريبت الموقع
│   ├── admin.js        # سكريبت لوحة التحكم
│   ├── content-loader.js # تحميل المحتوى
│   └── media-manager.js # إدارة الميديا
├── functions/
│   └── api/
│       ├── content.js  # API المحتوى (KV)
│       ├── auth.js     # API التحقق من كلمة المرور
│       ├── media.js    # API رفع الملفات (R2)
│       └── media/
│           └── [key].js # خدمة الملفات
└── data/
    └── content.json    # المحتوى الافتراضي
```

---

## المتغيرات البيئية

في لوحة تحكم Cloudflare Pages > Settings > Environment variables:

| المتغير | الوصف |
|---------|-------|
| `ADMIN_PASSWORD` | كلمة مرور الأدمن |

---

## الأوامر المفيدة

```bash
# عرض قائمة KV
wrangler kv:key list --namespace-id=YOUR_ID

# عرض محتوى
wrangler kv:key get "portfolio-content" --namespace-id=YOUR_ID

# حذف محتوى
wrangler kv:key delete "portfolio-content" --namespace-id=YOUR_ID

# قائمة ملفات R2
wrangler r2 object list qtmb-media
```

---

## الملفات المعدلة/الجديدة

### ملفات معدلة:
- `index.html` - إضافة Open Graph Tags
- `admin.html` - إضافة حماية كلمة المرور وصفحة SEO
- `js/admin.js` - دعم SEO والتحقق من كلمة المرور
- `js/content-loader.js` - تحديث الـ Meta Tags ديناميكياً
- `wrangler.toml` - إعدادات KV و R2

### ملفات جديدة:
- `functions/api/content.js` - API للمحتوى
- `functions/api/auth.js` - API للتحقق
- `functions/api/media.js` - API للرفع
- `functions/api/media/[key].js` - خدمة الملفات
- `js/media-manager.js` - مدير الميديا

---

## ملاحظات مهمة

1. **كلمة المرور الافتراضية**: `qtmb2024admin` - غيّرها فوراً!
2. **الـ KV**: تأكد من إنشاء الـ namespace قبل النشر
3. **الـ R2**: تأكد من إنشاء الـ bucket قبل النشر
4. **الـ CORS**: تم إعداده للسماح بالطلبات من أي مصدر

---

## الدعم

للمساعدة أو الإبلاغ عن مشاكل، راجع:
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Cloudflare KV Docs](https://developers.cloudflare.com/kv/)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
