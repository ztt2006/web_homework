document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    const passwordToggles = document.querySelectorAll('.password-toggle');
    const registerBtn = document.getElementById('register-btn');
    const registerMessage = document.getElementById('register-message');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    // 密码显示/隐藏切换
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
    
    // 密码强度检测
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = checkPasswordStrength(password);
        updatePasswordStrength(strength);
    });
    
    function checkPasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        if (score < 3) return 'weak';
        if (score < 4) return 'fair';
        if (score < 5) return 'good';
        return 'strong';
    }
    
    function updatePasswordStrength(strength) {
        const fill = document.getElementById('password-strength-fill');
        const text = document.getElementById('password-strength-text');
        
        fill.className = `strength-fill ${strength}`;
        
        const strengthTexts = {
            weak: '密码强度：弱',
            fair: '密码强度：一般',
            good: '密码强度：良好',
            strong: '密码强度：强'
        };
        
        text.textContent = strengthTexts[strength];
    }
    
    // 表单验证函数
    function validateUsername(username) {
        if (!username.trim()) {
            return '请输入用户名';
        }
        if (username.length < 3 || username.length > 20) {
            return '用户名长度应在3-20个字符之间';
        }
        return '';
    }
    
    function validateEmail(email) {
        if (!email.trim()) {
            return '请输入邮箱地址';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return '请输入有效的邮箱地址';
        }
        return '';
    }
    
    function validatePhone(phone) {
        if (phone.trim() && !/^1[3-9]\d{9}$/.test(phone)) {
            return '请输入有效的手机号码';
        }
        return '';
    }
    
    function validatePassword(password) {
        if (!password.trim()) {
            return '请输入密码';
        }
        if (password.length < 6 || password.length > 20) {
            return '密码长度应在6-20个字符之间';
        }
        return '';
    }
    
    function validateConfirmPassword(password, confirmPassword) {
        if (!confirmPassword.trim()) {
            return '请确认密码';
        }
        if (password !== confirmPassword) {
            return '两次输入的密码不一致';
        }
        return '';
    }
    
    // 实时验证
    function setupRealTimeValidation() {
        const validations = [
            { input: 'username', validator: (val) => validateUsername(val), error: 'username-error' },
            { input: 'email', validator: (val) => validateEmail(val), error: 'email-error' },
            { input: 'phone', validator: (val) => validatePhone(val), error: 'phone-error' },
            { input: 'password', validator: (val) => validatePassword(val), error: 'password-error' },
        ];
        
        validations.forEach(({ input, validator, error }) => {
            const inputElement = document.getElementById(input);
            const errorElement = document.getElementById(error);
            
            inputElement.addEventListener('blur', function() {
                const errorMsg = validator(this.value);
                showFieldError(this, errorElement, errorMsg);
            });
        });
        
        // 确认密码单独处理
        confirmPasswordInput.addEventListener('blur', function() {
            const errorMsg = validateConfirmPassword(passwordInput.value, this.value);
            showFieldError(this, document.getElementById('confirm-password-error'), errorMsg);
        });
    }
    
    function showFieldError(input, errorElement, message) {
        if (message) {
            errorElement.textContent = message;
            input.style.borderColor = '#e74c3c';
            return false;
        } else {
            errorElement.textContent = '';
            input.style.borderColor = '#27ae60';
            return true;
        }
    }
    
    // 初始化实时验证
    setupRealTimeValidation();
    
    // 表单提交处理
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = {
            username: formData.get('username').trim(),
            email: formData.get('email').trim(),
            phone: formData.get('phone').trim(),
            password: formData.get('password').trim(),
            confirmPassword: formData.get('confirm-password').trim()
        };
        
        // 验证所有字段
        const errors = {
            username: validateUsername(data.username),
            email: validateEmail(data.email),
            phone: validatePhone(data.phone),
            password: validatePassword(data.password),
            confirmPassword: validateConfirmPassword(data.password, data.confirmPassword)
        };
        
        // 显示错误信息
        let hasErrors = false;
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(`${field === 'confirmPassword' ? 'confirm-password' : field}-error`);
            const inputElement = document.getElementById(field === 'confirmPassword' ? 'confirm-password' : field);
            
            if (errors[field]) {
                showFieldError(inputElement, errorElement, errors[field]);
                hasErrors = true;
            }
        });
        
        // 检查协议同意
        const agreeTerms = document.getElementById('agree-terms').checked;
        if (!agreeTerms) {
            showMessage('请先阅读并同意用户协议和隐私政策', 'error');
            return;
        }
        
        if (hasErrors) {
            showMessage('请修正表单中的错误信息', 'error');
            return;
        }
        
        // 显示加载状态
        showLoading(true);
        
        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    phone: data.phone,
                    password: data.password
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('注册成功！正在跳转到登录页面...', 'success');
                
                // 延迟跳转
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                
            } else {
                showMessage(result.message || '注册失败，请稍后重试', 'error');
            }
            
        } catch (error) {
            console.error('注册错误:', error);
            showMessage('网络错误，请稍后重试', 'error');
        } finally {
            showLoading(false);
        }
    });
    
    // 显示加载状态
    function showLoading(isLoading) {
        const btnText = registerBtn.querySelector('.btn-text');
        const btnLoading = registerBtn.querySelector('.btn-loading');
        
        if (isLoading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            registerBtn.disabled = true;
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            registerBtn.disabled = false;
        }
    }
    
    // 显示消息
    function showMessage(message, type) {
        registerMessage.textContent = message;
        registerMessage.className = `message ${type}`;
        registerMessage.style.display = 'block';
        
        // 5秒后自动隐藏消息
        setTimeout(() => {
            registerMessage.style.display = 'none';
        }, 5000);
    }
    
    // 社交注册（演示功能）
    document.querySelector('.wechat-btn').addEventListener('click', function() {
        showMessage('微信注册功能正在开发中...', 'error');
    });
    
    document.querySelector('.qq-btn').addEventListener('click', function() {
        showMessage('QQ注册功能正在开发中...', 'error');
    });
    
    // 协议链接（演示功能）
    document.querySelector('.terms-link').addEventListener('click', function(e) {
        e.preventDefault();
        showMessage('用户协议页面正在开发中...', 'error');
    });
    
    document.querySelector('.privacy-link').addEventListener('click', function(e) {
        e.preventDefault();
        showMessage('隐私政策页面正在开发中...', 'error');
    });
    
    // 输入框焦点效果
    const inputs = document.querySelectorAll('.input-wrapper input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
});