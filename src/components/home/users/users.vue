<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" class="add-btn">添加用户</el-button>
      <!-- 展示用户信息表格区域 -->
      <el-table :data="usersdata" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="用户名" width="120px"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="phone" label="手机"></el-table-column>
        <el-table-column prop="minute" label="欠费金额" width="80px">
          <template slot-scope="scope">
            {{scope.row.status===1?'免费使用':scope.row.minute}}
          </template>
        </el-table-column>
        <el-table-column label="性别" width="50px">
          <template slot-scope="scope">
            <div>{{scope.row.gender===-1?'保密':scope.row.gender===1?'男':'女'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="身份" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.username==='Asunat'">超级管理员</div>
            <div v-else>{{scope.row.status===1?'管理员':scope.row.status===0?'普通用户':'违规用户'}}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建日期">
          <template slot-scope="scope">{{scope.row.createdate | dateformat()}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="small"
              @click="edituser(scope.row._id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              @click="removeuser(scope.row._id)"
            ></el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              circle
              size="small"
              @click="editstatus(scope.row._id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 编辑用户对话框 -->
      <el-dialog :title="upstatus==='status'?'更改权限':'编辑用户'" :visible.sync="dialogEdit" width="40%">
        <el-form
          :model="updateuser"
          :rules="rulesedit"
          ref="ruleFormedit"
          label-width="100px"
          class="demo-ruleForm"
          v-if="updateuser"
        >
          <div v-if="upstatus">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="updateuser.username" class="editinp-dis" disabled></el-input>
            </el-form-item>
            <el-form-item label="权限">
              <el-select v-model="updateuser.status" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                  :disabled="updateuser.username==='Asunat'"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="id" v-show="!updateuser._id">
              <el-input v-model="updateuser._id" class="editinp"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model="updateuser.username" class="editinp" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="updateuser.email" class="editinp"></el-input>
            </el-form-item>
            <el-form-item label="手机" >
              <el-input v-model="updateuser.phone" class="editinp"></el-input>
            </el-form-item>
            <el-form-item label="gender" >
              <el-input v-model="updateuser.gender" class="editinp"></el-input>
            </el-form-item>
            <el-form-item label="region" >
              <el-input v-model="updateuser.region" class="editinp"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogEdit = false" size="medium">取 消</el-button>
          <el-button type="primary" @click="Edituser" size="medium">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分页区域 -->
      <!-- :current-page="currentPage4" -->
      <div class="pagenum">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryinfo.pagenum"
          :page-sizes="[1, 3, 5, 10]"
          :page-size="queryinfo.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
      // res[0].status =  res[0].status ===0 ?'普通用户':(res[0].status ===1 ?'管理员':'禁止登录')
      // res[0].status =  res[0].username === 'Asunat'?'超级管理员': res[0].status
import { finddata, deleted } from "../../../common/crod/index";
export default {
  data() {
    return {
      usersdata: null,
      finuser: "/home/users",
      // 数据请求体
      queryinfo: {
        query: { username: "" },
        limit: 5,
        pagenum: 1
      },
      // 全部数据条数
      total: null,
      // 数据更新
      updateuser: null,
      // 表单数据更新
      // 表单验证数据
      rulesedit: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度为 11 个字符", trigger: "blur" }
        ]
      },
      dialogEdit: false,
      // 判断是否为编辑用户
      upstatus: "",
      // 可修改权限数据
      options: [
        {
          value: "0",
          label: "普通用户"
        },
        {
          value: "1",
          label: "管理员"
        },
        {
          value: "2",
          label: "禁止登录"
        },
      ]
    };
  },
  created() {
    this.getusers();
    this.emitevent();
  },
  methods: {
    // 发送请求获取用户数据
    async getusers() {
      const res = await finddata(this.finuser, this.queryinfo);
      if (res.code == 5)
        return this.$message({
          showClose: true,
          message: res.msg,
          duration: 1500,
          type: "error"
        });
      if (res.code == 1) {
        this.usersdata = res.data;
        this.total = res.total;
      }
    },
    // 向home页面发送请求路径
    emitevent() {
      this.$emit("finduser", this.finuser);
    },
    // 根据id获取某一条数据
    async edituser(id) {
      const { data: res } = await finddata(this.finuser, {
        query: { _id: id },
        limit: "",
        pagenum: 1
      });
      if (res.code == 5)
        return this.$message({
          showClose: true,
          message: res.msg,
          duration: 1500,
          type: "error"
        });
      
      this.updateuser = res[0];
      this.upstatus = "";
      // console.log(this.upstatus);
      this.dialogEdit = true;
    },
    // 监听每页显示多少条
    handleSizeChange(val) {
      this.queryinfo.limit = val;
      this.getusers();
    },
    // 监听当前页的变化
    handleCurrentChange(val) {
      this.queryinfo.pagenum = val;
      this.getusers();
    },
    // 删除用户
    async removeuser(id) {
      // 判断是否删除成功
      const code = await deleted(this.finuser, { _id: id });
      if (code === 1) {
        this.getusers();
      }
    },
    // 更新用户
    async Edituser() {
      // 发送网路请求
      const { data: res } = await this.$http.post(
        this.finuser,
        this.updateuser
      );
      console.log(res)
      if (res.code !== 1)
        return this.$message({
          message: res.msg,
          duration: 1500,
          type: "error"
        });
      this.$message({
        type: "success",
        message: res.msg,
        duration: 1500
      });
      this.getusers();
      this.dialogEdit = false;
    },
    // 判断是否显示更改权限
    async editstatus(id) {
      await this.edituser(id);
      this.dialogEdit = true;
      this.upstatus = "status";
    }
  }
};
</script>
<style scoped>
.add-btn {
  margin-bottom: 10px;
}
.el-dialog__body {
  padding: 20px 10px 0;
}
body .el-table th.gutter {
  display: table-cell !important;
}
.editinp {
  width: 90%;
}
.pagenum {
  margin-top: 10px;
}
.editinp-dis {
  border: none;
  width: 80px;
}
</style>