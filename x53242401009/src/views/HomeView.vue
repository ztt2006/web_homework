<template>
  <div class="home">
    <!-- 头部操作区 -->
    <div class="header-section">
      <div class="page-title">
        <h2>数据管理</h2>
        <p>管理您的个人信息数据</p>
      </div>
      <div class="btn-group">
        <el-button type="primary" @click="collect" icon="el-icon-plus">添加数据</el-button>
        <el-button @click="exit" icon="el-icon-switch-button" plain>退出登录</el-button>
      </div>
    </div>

    <!-- 表格区域 -->
    <div class="table-container">
      <el-table
        :data="tableData"
        style="width: 100%"
        border
        stripe
        :header-cell-style="{
          background: '#f8f9fa',
          color: '#606266',
          fontWeight: '600'
        }"
        class="custom-table"
      >
        <el-table-column
          label="编号"
          prop="id"
          width="100"
          align="center">
        </el-table-column>

        <el-table-column
          label="姓名"
          prop="name"
          width="120"
          align="center">
          <template slot-scope="scope">
            <span class="name-text">{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="联系电话"
          prop="tel"
          width="140"
          align="center">
          <template slot-scope="scope">
            <span class="tel-text">{{ scope.row.tel }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="地址"
          prop="address"
          min-width="200">
          <template slot-scope="scope">
            <span class="address-text">{{ scope.row.address }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="创建日期"
          prop="date"
          width="120"
          align="center">
          <template slot-scope="scope">
            <span class="date-text">{{ scope.row.date }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="240"
          align="center">
          <template slot-scope="scope">
            <div class="action-buttons">
              <el-button
                size="mini"
                type="primary"
                @click="handleEdit(scope.row)"
                icon="el-icon-edit"
                plain>编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                icon="el-icon-delete"
                plain>删除</el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleDetail(scope.row)"
                icon="el-icon-view"
                plain>详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      width="500px"
      center
      :close-on-click-modal="false"
      class="custom-dialog"
    >
      <el-form :model="form" label-position="top" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="姓名">
              <el-input
                v-model="form.name"
                placeholder="请输入姓名"
                :disabled="disabled"
                prefix-icon="el-icon-user">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="联系电话">
              <el-input
                v-model="form.tel"
                placeholder="请输入联系电话"
                :disabled="disabled"
                prefix-icon="el-icon-phone">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="地址">
              <el-input
                v-model="form.address"
                placeholder="请输入地址"
                :disabled="disabled"
                prefix-icon="el-icon-location">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="日期">
              <el-date-picker
                v-model="form.date"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :disabled="disabled"
                prefix-icon="el-icon-date"
                style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleClick" v-if="!disabled">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data () {
    return {
      // 对话框的初始值
      dialogFormVisible: false,
      formLabelWidth: '100px',
      disabled: false,
      flag: 1,
      form: {
        id: Math.random(),
        name: '',
        tel: '',
        address: '',
        date: ''
      },
      tableData: [
        {
          id: 'e1',
          name: '王小虎',
          tel: '13000000000',
          address: '上海市普陀区金沙江路1518弄',
          date: '2016-05-02'
        },
        {
          id: 'e2',
          name: '李小明',
          tel: '13000000001',
          address: '上海市普陀区金沙江路1517弄',
          date: '2016-05-04'
        },
        {
          id: 'e3',
          name: '张小红',
          tel: '13000000002',
          address: '上海市普陀区金沙江路1519弄',
          date: '2016-05-01'
        },
        {
          id: 'e4',
          name: '刘小刚',
          tel: '13000000003',
          address: '上海市普陀区金沙江路1516弄',
          date: '2016-05-03'
        }
      ]
    }
  },
  computed: {
    dialogTitle () {
      if (this.disabled) {
        return '查看详情'
      } else if (this.flag === 1) {
        return '添加数据'
      } else {
        return '编辑数据'
      }
    }
  },
  methods: {
    // 退出登录
    exit () {
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({
          path: '/'
        })
        this.$message.success('退出成功')
      }).catch(() => {
        this.$message.info('已取消退出')
      })
    },

    // 添加数据
    collect () {
      this.dialogFormVisible = true
      this.disabled = false
      this.form = {
        id: 'e' + Date.now(),
        name: '',
        tel: '',
        address: '',
        date: ''
      }
      this.flag = 1
    },

    // 编辑
    handleEdit (row) {
      this.dialogFormVisible = true
      this.disabled = false
      this.form = { ...row }
      this.flag = 2
    },

    // 详情
    handleDetail (row) {
      this.dialogFormVisible = true
      this.disabled = true
      this.form = { ...row }
    },

    // 删除
    handleDelete (row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData = this.tableData.filter(function (item) {
          return item.id !== row.id
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 对话框的确定按钮
    handleClick () {
      if (!this.form.name || !this.form.tel) {
        this.$message.warning('请填写完整信息')
        return
      }

      if (this.flag === 1) {
        // 添加
        const newData = {
          id: 'e' + Date.now(),
          name: this.form.name,
          tel: this.form.tel,
          address: this.form.address,
          date: this.form.date
        }
        this.tableData.push(newData)
        this.$message.success('添加成功!')
        this.dialogFormVisible = false
      } else {
        // 编辑
        const index = this.tableData.findIndex(item => item.id === this.form.id)
        if (index !== -1) {
          this.tableData.splice(index, 1, {
            id: this.form.id,
            name: this.form.name,
            tel: this.form.tel,
            address: this.form.address,
            date: this.form.date
          })
          this.$message.success('编辑成功!')
        }
        this.dialogFormVisible = false
      }
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 24px;
}

/* 头部区域 */
.header-section {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title h2 {
  color: #303133;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.page-title p {
  color: #909399;
  font-size: 14px;
  margin: 0;
}

.btn-group {
  display: flex;
  gap: 12px;
}

/* 表格容器 */
.table-container {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 表格样式 */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
}

.custom-table .el-table__header {
  background: #f8f9fa;
}

.name-text {
  font-weight: 600;
  color: #409eff;
}

.tel-text {
  font-family: 'Monaco', 'Menlo', monospace;
  color: #67c23a;
}

.address-text {
  color: #606266;
  line-height: 1.5;
}

.date-text {
  color: #909399;
  font-size: 13px;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  margin: 0;
  padding: 6px 12px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.action-buttons .el-button:hover {
  transform: translateY(-1px);
}

/* 对话框样式 */
.custom-dialog .el-dialog__header {
  background: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
  padding: 20px 24px;
  border-radius: 8px 8px 0 0;
}

.custom-dialog .el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.custom-dialog .el-dialog__body {
  padding: 24px;
}

.dialog-form {
  padding: 0;
}

.dialog-form .el-form-item {
  margin-bottom: 20px;
}

.dialog-form .el-form-item__label {
  color: #606266;
  font-weight: 600;
  font-size: 14px;
  padding-bottom: 8px;
}

.dialog-form .el-input__inner {
  border-radius: 6px;
  border: 1px solid #dcdfe6;
  transition: all 0.3s ease;
}

.dialog-form .el-input__inner:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.dialog-footer {
  padding: 16px 24px;
  border-top: 1px solid #ebeef5;
  text-align: right;
  border-radius: 0 0 8px 8px;
}

.dialog-footer .el-button {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
}

</style>
