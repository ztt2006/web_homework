<template>
  <div class="login">
    <div class="login-container">
      <div class="login-header">
        <div class="logo">
          <i class="el-icon-s-home"></i>
        </div>
        <h2>用户登录</h2>
        <p>欢迎回来，请输入您的账户信息</p>
      </div>
      <el-form :model="ruleForm" status-icon ref="ruleForm" class="login-form">
        <el-form-item prop="name">
          <el-input
            v-model="ruleForm.name"
            type="text"
            placeholder="请输入用户名"
            autocomplete="off"
            size="large"
            prefix-icon="el-icon-user"
          />
        </el-form-item>
        <el-form-item prop="pass">
          <el-input
            v-model="ruleForm.pass"
            type="password"
            placeholder="请输入密码"
            autocomplete="off"
            size="large"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm"
            size="large"
            class="login-btn"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data () {
    return {
      loading: false,
      ruleForm: {
        name: '',
        pass: ''
      }
    }
  },
  methods: {
    submitForm () {
      if (!this.ruleForm.name || !this.ruleForm.pass) {
        this.$message.warning('请输入用户名和密码')
        return
      }

      this.loading = true

      // 模拟登录延迟
      setTimeout(() => {
        if (this.ruleForm.name === 'admin' && this.ruleForm.pass === 'admin') {
          this.$message.success('登录成功')
          this.$router.push({
            path: '/home'
          })
        } else {
          this.$message.error('用户名或密码错误')
        }
        this.loading = false
      }, 1000)
    }
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
}

.login::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="0%" r="50%"><stop offset="0%" stop-color="%23fff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23fff" stop-opacity="0"/></radialGradient></defs><rect width="100" height="20" fill="url(%23a)"/></svg>') repeat;
  opacity: 0.1;
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.logo i {
  font-size: 28px;
  color: #fff;
}

.login-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.login-header p {
  font-size: 15px;
  color: #7f8c8d;
  margin: 0;
  font-weight: 400;
}

.login-form {
  width: 100%;
}

.login-form .el-form-item {
  margin-bottom: 24px;
}

.login-form .el-input__inner {
  border-radius: 12px;
  border: 2px solid #e8ecf4;
  padding: 16px 20px 16px 48px;
  font-size: 15px;
  background: #f8f9fc;
  transition: all 0.3s ease;
  color: #2c3e50;
  height: 52px;
}

.login-form .el-input__inner:focus {
  border-color: #667eea;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.login-form .el-input__inner::placeholder {
  color: #a0a6b1;
  font-weight: 400;
}

.login-form .el-input__prefix {
  left: 16px;
  color: #a0a6b1;
  font-size: 16px;
}

.login-form .el-input--large .el-input__prefix i {
  line-height: 52px;
}

.login-btn {
  width: 100%;
  height: 52px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  letter-spacing: 0.5px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}

.login-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.login-footer {
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.login-footer p {
  font-size: 13px;
  color: #95a5a6;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login {
    padding: 16px;
  }

  .login-container {
    padding: 32px 24px;
    border-radius: 12px;
  }

  .login-header h2 {
    font-size: 24px;
  }

  .logo {
    width: 56px;
    height: 56px;
    margin-bottom: 16px;
  }

  .login-form .el-input__inner {
    padding: 14px 18px 14px 44px;
    height: 48px;
  }

  .login-btn {
    height: 48px;
    font-size: 15px;
  }
}

/* 加载状态 */
.login-btn.is-loading {
  pointer-events: none;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-container {
  animation: fadeInUp 0.6s ease-out;
}
</style>
