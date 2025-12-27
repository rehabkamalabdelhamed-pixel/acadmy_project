// contact.js

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    initContactPage();
});

function initContactPage() {
    // تحديث التاريخ
    updateCurrentDate();
    
    // تحميل بيانات المستخدم
    loadUserData();
    
    // إعداد النموذج
    setupContactForm();
    
    // إعداد الأكوورديون
    setupAccordion();
    
    // إعداد السايدبار للهواتف
    setupMobileSidebar();
}

// تحديث التاريخ الحالي
function updateCurrentDate() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    const dateString = now.toLocaleDateString('ar-EG', options);
    const dateElement = document.getElementById('currentDate');
    
    if (dateElement) {
        dateElement.textContent = dateString;
    }
}

// تحميل بيانات المستخدم
function loadUserData() {
    try {
        // محاكاة بيانات المستخدم (يمكن استبدالها ببيانات حقيقية)
        const userData = {
            name: localStorage.getItem('userName') || 'أحمد محمد',
            avatar: localStorage.getItem('userAvatar') || '../assets/images/avatar.png',
            role: localStorage.getItem('userRole') || 'طالب الصف الثاني الثانوي'
        };
        
        // تحديث العناصر في الواجهة
        const userNameElement = document.getElementById('userName');
        const userAvatarElement = document.getElementById('userAvatar');
        const userRoleElement = document.querySelector('.user-role');
        
        if (userNameElement) userNameElement.textContent = userData.name;
        if (userAvatarElement) userAvatarElement.src = userData.avatar;
        if (userRoleElement) userRoleElement.textContent = userData.role;
    } catch (error) {
        console.error('خطأ في تحميل بيانات المستخدم:', error);
    }
}

// إعداد نموذج التواصل
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (!contactForm) return;
    
    // إضافة تحقق من الصحة أثناء الكتابة
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });
    
    // إرسال النموذج
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // إظهار حالة التحميل
            showLoadingState();
            
            try {
                // محاكاة إرسال البيانات (يمكن استبدالها بـ fetch حقيقي)
                await submitFormData(getFormData());
                
                // إظهار رسالة النجاح
                showSuccessMessage();
                
                // إعادة تعيين النموذج
                contactForm.reset();
                
                // إرسال إشعار
                showNotification('تم إرسال رسالتك بنجاح!');
                
            } catch (error) {
                showErrorMessage('حدث خطأ أثناء إرسال الرسالة. الرجاء المحاولة مرة أخرى.');
            } finally {
                hideLoadingState();
            }
        }
    });
    
    // إعادة تعيين النموذج
    const resetBtn = contactForm.querySelector('.btn-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetFormValidation();
        });
    }
    
    // التحقق من حجم الملف المرفق
    const attachmentInput = document.getElementById('attachment');
    if (attachmentInput) {
        attachmentInput.addEventListener('change', function() {
            validateAttachment(this);
        });
    }
}

// تحقق من حقل واحد
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    switch (field.id) {
        case 'name':
            isValid = value.length >= 2;
            break;
            
        case 'email':
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailPattern.test(value);
            break;
            
        case 'phone':
            const phonePattern = /^01[0-9]{9}$/;
            isValid = phonePattern.test(value);
            break;
            
        case 'inquiryType':
            isValid = value !== '';
            break;
            
        case 'subject':
            isValid = value.length >= 5;
            break;
            
        case 'message':
            isValid = value.length >= 10;
            break;
    }
    
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
    
    return isValid;
}

// تحقق من النموذج كاملاً
function validateForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// تحقق من الملف المرفق
function validateAttachment(input) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const file = input.files[0];
    
    if (!file) return true;
    
    if (file.size > maxSize) {
        alert('حجم الملف كبير جداً! الحد الأقصى 5MB');
        input.value = '';
        return false;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 
                          'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
        alert('نوع الملف غير مسموح به! يرجى رفع صورة أو ملف PDF أو Word');
        input.value = '';
        return false;
    }
    
    return true;
}

// جمع بيانات النموذج
function getFormData() {
    const form = document.getElementById('contactForm');
    const formData = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        phone: form.querySelector('#phone').value,
        inquiryType: form.querySelector('#inquiryType').value,
        subject: form.querySelector('#subject').value,
        message: form.querySelector('#message').value,
        timestamp: new Date().toISOString()
    };
    
    return formData;
}

// محاكاة إرسال البيانات
function submitFormData(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('بيانات النموذج المرسلة:', formData);
            
            // حفظ البيانات محلياً (لأغراض العرض)
            saveContactMessage(formData);
            
            // محاكاة نجاح الإرسال
            const shouldFail = Math.random() < 0.1; // 10% فرصة للفشل
            if (shouldFail) {
                reject(new Error('فشل الاتصال بالخادم'));
            } else {
                resolve({ success: true, message: 'تم إرسال الرسالة بنجاح' });
            }
        }, 1500);
    });
}

// حفظ الرسالة محلياً
function saveContactMessage(message) {
    try {
        let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push(message);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
    } catch (error) {
        console.error('خطأ في حفظ الرسالة:', error);
    }
}

// إظهار رسالة النجاح
function showSuccessMessage() {
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.classList.remove('d-none');
        successMessage.style.display = 'block';
        
        // إخفاء الرسالة بعد 5 ثواني
        setTimeout(() => {
            successMessage.classList.add('d-none');
        }, 5000);
    }
}

// إظهار حالة التحميل
function showLoadingState() {
    const submitBtn = document.querySelector('.btn-send');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        جاري الإرسال...
    `;
    submitBtn.disabled = true;
    
    // حفظ النص الأصلي
    submitBtn.dataset.originalText = originalText;
}

// إخفاء حالة التحميل
function hideLoadingState() {
    const submitBtn = document.querySelector('.btn-send');
    
    if (submitBtn.dataset.originalText) {
        submitBtn.innerHTML = submitBtn.dataset.originalText;
    }
    submitBtn.disabled = false;
}

// إعادة تعيين تحقق النموذج
function resetFormValidation() {
    const form = document.getElementById('contactForm');
    const fields = form.querySelectorAll('.form-control, .form-select');
    
    fields.forEach(field => {
        field.classList.remove('is-valid', 'is-invalid');
    });
}

// إعداد الأكوورديون
function setupAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach((item, index) => {
        const button = item.querySelector('.accordion-button');
        const collapse = item.querySelector('.accordion-collapse');
        
        if (button && collapse) {
            button.addEventListener('click', function() {
                // إضافة تأثير سلس
                collapse.classList.toggle('show');
                
                // تسجيل الفتح/الإغلاق
                const isOpen = collapse.classList.contains('show');
                console.log(`السؤال ${index + 1}: ${isOpen ? 'مفتوح' : 'مغلق'}`);
            });
        }
    });
}

// إعداد السايدبار للهواتف
function setupMobileSidebar() {
    if (window.innerWidth < 768) {
        const sidebar = document.querySelector('.sidebar');
        const header = document.querySelector('.main-header');
        
        if (!sidebar || !header) return;
        
        // إنشاء زر التبديل
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle btn btn-primary';
        toggleBtn.innerHTML = '<i class="bi bi-list"></i>';
        toggleBtn.style.position = 'absolute';
        toggleBtn.style.left = '15px';
        toggleBtn.style.top = '15px';
        toggleBtn.style.zIndex = '1000';
        
        header.style.position = 'relative';
        header.appendChild(toggleBtn);
        
        // إضافة حدث النقر
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            
            // منع التمرير عند فتح السايدبار
            if (sidebar.classList.contains('show')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // إغلاق السايدبار عند النقر خارجها
        document.addEventListener('click', function(event) {
            if (sidebar.classList.contains('show') && 
                !sidebar.contains(event.target) && 
                !toggleBtn.contains(event.target)) {
                sidebar.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
        
        // إغلاق السايدبار عند تغيير حجم النافذة
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 768) {
                sidebar.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
}

// إظهار الإشعارات
function showNotification(message, type = 'success') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification);
    
    // إضافة الأنيميشن
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // إزالة الإشعار بعد 3 ثواني
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // إضافة CSS للإشعار
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                left: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 9999;
                transform: translateX(-150%);
                transition: transform 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-right: 4px solid #2ecc71;
            }
            
            .notification-error {
                border-right: 4px solid #e74c3c;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
                color: #2c3e50;
                font-weight: 500;
            }
            
            .notification-content i {
                font-size: 1.2rem;
            }
            
            .notification-success .notification-content i {
                color: #2ecc71;
            }
            
            .notification-error .notification-content i {
                color: #e74c3c;
            }
        `;
        document.head.appendChild(style);
    }
}

// إظهار رسالة الخطأ
function showErrorMessage(message) {
    showNotification(message, 'error');
}

// إضافة تأثيرات عند التمرير
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // مراقبة العناصر المراد تحريكها
    const elementsToAnimate = document.querySelectorAll('.contact-card, .section-header');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// تهيئة تأثيرات التمرير
initScrollEffects();

// تصدير الدوال للاستخدام في وحدة الاختبار
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        validateForm,
        validateAttachment,
        getFormData,
        submitFormData
    };
}