// 当页面加载完成时执行
document.addEventListener('DOMContentLoaded', () => {
    // 初始化登录表单
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 初始化注册表单
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

// 处理登录表单提交
async function handleLogin(e) {
    e.preventDefault();
    
    // 获取表单数据
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const messageDiv = document.getElementById('login-message');
    
    // 简单验证
    if (!username || !password) {
        messageDiv.innerHTML = '<p class="form-error">请填写所有字段</p>';
        return;
    }
    
    try {
        // 发送登录请求到API
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // 登录成功
            messageDiv.innerHTML = `<p style="color: green">${data.message}</p>`;
            
            // 存储用户信息到localStorage和sessionStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            sessionStorage.setItem('user', JSON.stringify(data.user));
            
            // 延迟跳转到首页
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            // 登录失败
            messageDiv.innerHTML = `<p class="form-error">${data.message}</p>`;
        }
    } catch (error) {
        console.error('登录错误:', error);
        
        // 如果API请求失败，使用本地存储进行模拟登录
        // 通常这里应该显示网络错误，但为了演示功能，我们使用模拟数据
        
        // 获取已注册用户
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // 检查用户是否存在
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // 登录成功
            messageDiv.innerHTML = '<p style="color: green">登录成功！</p>';
            
            // 存储用户信息（除了密码）
            const userData = {
                id: user.id,
                username: user.username,
                email: user.email
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            sessionStorage.setItem('user', JSON.stringify(userData));
            
            // 延迟跳转到首页
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        } else {
            // 登录失败
            messageDiv.innerHTML = '<p class="form-error">用户名或密码错误</p>';
        }
    }
}

// 处理注册表单提交
async function handleRegister(e) {
    e.preventDefault();
    
    // 获取表单数据
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    
    // 获取错误提示元素
    const usernameError = document.getElementById('username-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const confirmPasswordError = document.getElementById('confirm-password-error');
    const messageDiv = document.getElementById('register-message');
    
    // 清空所有错误消息
    usernameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
    messageDiv.innerHTML = '';
    
    // 表单验证
    let isValid = true;
    
    // 用户名验证 (5-20个字符，只能包含字母、数字、下划线)
    const usernameRegex = /^[a-zA-Z0-9_]{5,20}$/;
    if (!usernameRegex.test(username)) {
        usernameError.textContent = '用户名必须是5-20个字符，只能包含字母、数字和下划线';
        isValid = false;
    }
    
    // 邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = '请输入有效的电子邮箱地址';
        isValid = false;
    }
    
    // 密码验证 (至少8个字符，包含字母和数字)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        passwordError.textContent = '密码必须至少8个字符，包含字母和数字';
        isValid = false;
    }
    
    // 确认密码验证
    if (password !== confirmPassword) {
        confirmPasswordError.textContent = '两次输入的密码不一致';
        isValid = false;
    }
    
    // 如果验证不通过，停止注册
    if (!isValid) return;
    
    try {
        // 发送注册请求到API
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // 注册成功
            messageDiv.innerHTML = `<p style="color: green">${data.message}</p>`;
            
            // 延迟跳转到登录页
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            // 注册失败
            messageDiv.innerHTML = `<p class="form-error">${data.message}</p>`;
        }
    } catch (error) {
        console.error('注册错误:', error);
        
        // 如果API请求失败，使用本地存储进行模拟注册
        // 通常这里应该显示网络错误，但为了演示功能，我们使用本地存储
        
        // 获取已注册用户
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // 检查用户名或邮箱是否已被使用
        if (users.some(user => user.username === username)) {
            messageDiv.innerHTML = '<p class="form-error">用户名已被使用</p>';
            return;
        }
        
        if (users.some(user => user.email === email)) {
            messageDiv.innerHTML = '<p class="form-error">邮箱已被使用</p>';
            return;
        }
        
        // 创建新用户
        const newUser = {
            id: Date.now(),
            username,
            email,
            password,  // 注意：实际应用中应该加密密码
            created_at: new Date().toISOString()
        };
        
        // 添加到用户列表
        users.push(newUser);
        
        // 保存用户列表
        localStorage.setItem('users', JSON.stringify(users));
        
        // 注册成功
        messageDiv.innerHTML = '<p style="color: green">注册成功，请登录</p>';
        
        // 延迟跳转到登录页
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const passwordToggle = document.getElementById('password-toggle');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');
    const loginMessage = document.getElementById('login-message');
    
    // 密码显示/隐藏切换
    passwordToggle.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordToggle.classList.remove('fa-eye');
            passwordToggle.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            passwordToggle.classList.remove('fa-eye-slash');
            passwordToggle.classList.add('fa-eye');
        }
    });
    
    // 输入框验证
    function validateInput(input, errorElement, message) {
        if (!input.value.trim()) {
            errorElement.textContent = message;
            input.style.borderColor = '#e74c3c';
            return false;
        } else {
            errorElement.textContent = '';
            input.style.borderColor = '#27ae60';
            return true;
        }
    }
    
    // 实时验证
    document.getElementById('username').addEventListener('blur', function() {
        validateInput(this, document.getElementById('username-error'), '请输入用户名');
    });
    
    document.getElementById('password').addEventListener('blur', function() {
        validateInput(this, document.getElementById('password-error'), '请输入密码');
    });
    
    // 表单提交处理
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const rememberMe = document.getElementById('remember-me').checked;
        
        // 验证输入
        const usernameValid = validateInput(
            document.getElementById('username'),
            document.getElementById('username-error'),
            '请输入用户名'
        );
        
        const passwordValid = validateInput(
            document.getElementById('password'),
            document.getElementById('password-error'),
            '请输入密码'
        );
        
        if (!usernameValid || !passwordValid) {
            return;
        }
        
        // 显示加载状态
        showLoading(true);
        
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // 保存用户信息
                const userData = {
                    username: data.user.username,
                    email: data.user.email,
                    token: data.token,
                    loginTime: new Date().toISOString()
                };
                
                // 根据"记住我"选择存储方式
                if (rememberMe) {
                    localStorage.setItem('user', JSON.stringify(userData));
                } else {
                    sessionStorage.setItem('user', JSON.stringify(userData));
                }
                
                showMessage('登录成功！正在跳转...', 'success');
                
                // 延迟跳转，让用户看到成功消息
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
                
            } else {
                showMessage(data.message || '登录失败，请检查用户名和密码', 'error');
            }
            
        } catch (error) {
            console.error('登录错误:', error);
            showMessage('网络错误，请稍后重试', 'error');
        } finally {
            showLoading(false);
        }
    });
    
    // 显示加载状态
    function showLoading(isLoading) {
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoading = loginBtn.querySelector('.btn-loading');
        
        if (isLoading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-flex';
            loginBtn.disabled = true;
        } else {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            loginBtn.disabled = false;
        }
    }
    
    // 显示消息
    function showMessage(message, type) {
        loginMessage.textContent = message;
        loginMessage.className = `message ${type}`;
        loginMessage.style.display = 'block';
        
        // 3秒后自动隐藏消息
        setTimeout(() => {
            loginMessage.style.display = 'none';
        }, 3000);
    }
    
    // 社交登录（演示功能）
    document.querySelector('.wechat-btn').addEventListener('click', function() {
        showMessage('微信登录功能正在开发中...', 'error');
    });
    
    document.querySelector('.qq-btn').addEventListener('click', function() {
        showMessage('QQ登录功能正在开发中...', 'error');
    });
    
    // 忘记密码（演示功能）
    document.querySelector('.forgot-password').addEventListener('click', function(e) {
        e.preventDefault();
        showMessage('忘记密码功能正在开发中...', 'error');
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