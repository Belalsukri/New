# كيفية رؤية التحديثات الجديدة

## المشكلة
التحديثات موجودة في الكود ولكن لا تظهر في المتصفح.

## الحل

### الخطوة 1: تحديث المتصفح
قم بتحديث صفحة المتصفح بإحدى الطرق التالية:
- اضغط `Ctrl + Shift + R` (تحديث قوي)
- أو اضغط `Ctrl + F5`
- أو اضغط `F5` عدة مرات

### الخطوة 2: مسح الذاكرة المؤقتة (Cache)
إذا لم يعمل التحديث:
1. افتح أدوات المطور (F12)
2. انقر بزر الماوس الأيمن على زر التحديث
3. اختر "Empty Cache and Hard Reload"

### الخطوة 3: التحقق من الملفات
تأكد من أن التعديلات موجودة في الملفات:

✅ **الملفات المعدلة:**
- `backend/models/Store.js` - يحتوي على `bannerImage` و `phoneNumber`
- `backend/routes/store.routes.js` - يدعم حفظ الحقول الجديدة
- `src/pages/dashboard/StoreSettings.jsx` - يحتوي على حقول البانر والهاتف
- `src/pages/public/StoreDetails.jsx` - يعرض البانر والهاتف

### الخطوة 4: إعادة تشغيل الخوادم (إذا لزم الأمر)

#### Frontend (Vite):
```bash
# أوقف الخادم بـ Ctrl+C ثم شغله مرة أخرى
cd c:\Users\belal\Desktop\now
npm run dev
```

#### Backend:
```bash
# أوقف الخادم بـ Ctrl+C ثم شغله مرة أخرى
cd c:\Users\belal\Desktop\now\backend
npm run dev
```

## ما يجب أن تراه في صفحة "إعدادات المتجر":

1. **شعار المتجر** (موجود مسبقاً)
2. **صورة البانر (صورة كبيرة بالأعلى)** ← جديد ✨
   - منطقة رفع صورة بحجم كبير (عرض كامل × 200px ارتفاع)
   - نص: "انقر لتحميل صورة البانر"
   - نص: "الحجم الموصى به: 1200x400 بكسل"
3. **رقم الهاتف** ← جديد ✨
   - حقل إدخال مع أيقونة هاتف
   - Placeholder: "05xxxxxxxx"

## التحقق من أن الكود موجود:

يمكنك التحقق بنفسك:
```bash
# ابحث عن "البانر" في الملف
Get-Content "src\pages\dashboard\StoreSettings.jsx" -Encoding UTF8 | Select-String "البانر"

# ابحث عن "phoneNumber" في الملف
Get-Content "src\pages\dashboard\StoreSettings.jsx" | Select-String "phoneNumber"
```

## إذا استمرت المشكلة:

1. تأكد من أنك في الصفحة الصحيحة: `http://localhost:5173/dashboard/settings`
2. تأكد من أنك مسجل دخول كـ merchant
3. افتح Console في المتصفح (F12) وابحث عن أي أخطاء
4. تأكد من أن الخوادم تعمل (Frontend على 5173 و Backend على 5000)
