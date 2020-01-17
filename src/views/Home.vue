<template>
  <div class="home">
    <div class="top">
      <img src="../assets/logo.svg" alt />
      <div class="login">
        <span>{{successName}}</span>
        <el-button type="success" @click="dialogVisible = true">登录</el-button>

        <el-dialog title="登录" :visible.sync="dialogVisible" width="50%">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="ruleForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="userPwd">
              <el-input v-model="ruleForm.userPwd" type="password"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleLogin">确 定</el-button>
          </span>
        </el-dialog>
        <el-button type="info" @click="handleLogout">退出</el-button>

        <router-link :to="{name:'about'}">
          <img src="../assets/购物车.png" alt />
        </router-link>
      </div>
    </div>
    <div class="box">
      <div class="container">
        <span class="page">首页</span> >
        <span>商品详细</span>
        <div class="sort">
          <span>排序</span>
          <span @click="handleDefault">默认</span>
          <span @click="handleSort">
            价格
            <i class="iconfont">{{(sortFlag==1)?'&#xe616;':'&#xe617;'}}</i>
          </span>
        </div>
        <div class="price-contnet">
          <div class="price">
            <h3>P R I C E:</h3>
            <div class="val" v-for="item of searchPrice" :key="item.id">
              <p class @click="handlePrice(item.gt,item.lt)">{{item.gt}}--{{item.lt}}</p>
            </div>
          </div>
          <div class="content">
            <div class="item" v-for="item of goodslist" :key="item.productName">
              <img class="bg" :src="item.productImage" alt />
              <p class="name">{{item.productName}}</p>
              <p class="rate">￥{{item.salePrice}}</p>
              <el-button @click="addCart(item.productId)" class="cart" type="danger" plain>购物车</el-button>
            </div>
          </div>
        </div>
        <div class="bottom">
          <el-pagination @current-change="getPage" :page-size="8" :total="total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      searchPrice: [
        { gt: 0, lt: 100, id: 1001 },
        { gt: 100, lt: 500, id: 1002 },
        { gt: 500, lt: 1000, id: 1003 },
        { gt: 1000, lt: 5000, id: 1004 },
        { gt: 5000, lt: 10000, id: 100 }
      ],
      total: 0,
      limit: 8,
      start: 0,
      goodslist: [],
      dialogVisible: false,
      ruleForm: {
        userName: "",
        userPwd: ""
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        userPwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ]
      },
      sortFlag: 1,
      successName: ""
    };
  },
  mounted() {
    this.initData();
    this.$http("./users/checkLogin").then(res => {
      console.log(res.data);
      if (res.data.code == 200) {
        this.successName = res.data.result;
      } else {
        this.$message({
          message: "未登录",
          duration: 1000,
          type: "warning"
        });
      }
    });
  },
  methods: {
    handlePrice(gt, lt) {
      console.log(gt, lt);
      this.$http({
        url: "/goods/price",
        method: "get",
        params: {
          gt,
          lt
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.goodslist = res.data.result;
        } else {
          this.goodslist = [];
          this.$message({
            duration: 1000,
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    getPage(page) {
      console.log(1);
      this.start = (page - 1) * this.limit;
      this.initData();
    },
    initData() {
      this.$http
        .get("/goods/list", {
          params: { start: this.start, limit: this.limit }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.goodslist = res.data.result;
            this.total = res.data.total;
          }
        });
    },
    compareUp(value) {
      return (a, b) => {
        return a[value] - b[value];
      };
    },
    compareDown(value) {
      return (a, b) => {
        return b[value] - a[value];
      };
    },
    handleSort() {
      this.sortFlag = this.sortFlag == 1 ? -1 : 1;
      if (this.sortFlag == 1) {
        this.goodslist.sort(this.compareUp("salePrice"));
      } else {
        this.goodslist.sort(this.compareDown("salePrice"));
      }
    },
    handleDefault() {
      this.initData();
    },
    addCart(productId) {
      this.$http({
        method: "post",
        url: "/users/addCart",
        data: {
          productId
        }
      }).then(res => {
        this.$message({
          message: res.data.msg,
          duration: 1000,
          type: "success"
        });
      });
    },
    handleLogin() {
      if (this.ruleForm.userName && this.ruleForm.userPwd) {
        this.$http({
          url: "/users/login",
          method: "post",
          data: {
            userName: this.ruleForm.userName,
            userPwd: this.ruleForm.userPwd
          }
        }).then(res => {
          if (res.data.code == 200) {
            (this.dialogVisible = false),
              this.$message({
                message: res.data.msg,
                duration: 1000,
                type: "success"
              });
            this.successName = res.data.result;
          } else {
            this.$message({
              message: res.data.msg,
              duration: 1000,
              type: "error"
            });
          }
        });
      } else {
        this.$message({
          message: "用户名和密码不能为空",
          duration: 1000,
          type: "error"
        });
      }
    },
    handleLogout() {
      this.$http.post("/users/logout").then(res => {
        this.$message({
          message: res.data.msg,
          duration: 1000
        });
        this.successName = "";
      });
    }
  },
  beforeRouteLeave (to,from,next) {
   this.$http('./users/cartList').then(res=>{
     if(res.data.code == 200){
       next()
     }else{
       this.$message({
         message:res.data.msg,
         duration:1000
       })
     }
   })
  }
};
</script>
<style scoped>
.bg {
  width: 140px;
  height: 130px;
}
.item {
  background: #fff;
  margin-right: 1%;
  float: left;
  margin-bottom: 10px;
  padding: 10px;
}

.top {
  width: 70%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.top img {
  width: 50px;
  height: 50px;
}
.login span {
  font-size: 15px;
  color: #bbb8b8;
  margin-right: 10px;
}
.box {
  width: 100%;
  background: #ebebeb;
  height: 1000px;
}
.container {
  width: 70%;
  margin: 0 auto;
}
.sort {
  height: 30px;
  background: #fff;
  line-height: 30px;
  margin: 40px 0 20px 0;
  text-align: right;
}
.sort span {
  margin-left: 10px;
  cursor: pointer;
}
.price-contnet {
  width: 100%;
  height: 630px;
  display: flex;
}
.price {
  width: 230px;
  text-align: center;
}
.content {
  width: 750px;
  overflow: hidden;
}
.page {
  font-weight: bold;
}
.name {
  text-align: center;
  margin-bottom: 30px;
}
.rate {
  color: red;
  margin-bottom: 10px;
}
.cart {
  width: 100%;
  border: 1px solid red;
  color: red;
  /* margin: 0 auto; */
  cursor: pointer;
}
.cart:hover {
  background: red;
  color: #fff;
}
.val {
  margin: 10px 0;
}
.el-pagination {
  text-align: center;
}
</style>
