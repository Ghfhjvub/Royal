ROYAL TABLE - Firebase Hassony (بدون Firebase Storage)

تم ربط إعدادات الويب بالمشروع:
Project ID: hassony-c71fc

الخدمات المستخدمة:
- Firebase Authentication (Email/Password)
- Cloud Firestore
- لا يستخدم الموقع Firebase Storage.
- صور المنتجات تحفظ كرابط https مباشر في حقل img.

قبل النشر:
1) في Firebase Console للمشروع hassony-c71fc فعّل Authentication > Email/Password.
2) أنشئ Cloud Firestore Database.
3) انشر ملف firestore.rules الموجود مع المشروع في Firestore > Rules.
4) أنشئ حساب المدير في Authentication.
5) انسخ UID للحساب، ثم أنشئ مستنداً في مجموعة users بنفس UID، واجعل الحقول:
   email: بريد المدير
   displayName: اسم المدير
   role: admin
6) ارفع ملفات الموقع إلى الاستضافة.

ملاحظة: لا يكفي إعداد Firebase في الكود وحده؛ يجب تفعيل Authentication وإنشاء Firestore وضبط قواعده وإنشاء مستند users للمدير.
