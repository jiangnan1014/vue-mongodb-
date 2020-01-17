<template>
  <div class="about">
    <h1>我的购物车</h1>
    <div class="content">
      <div class="nav">
        <span style="width:250px">选择</span>
        <span style="width:280px">商品</span>
        <span style="width:280px">价格</span>
        <span style="width:280px">数量</span>
        <span style="width:280px">小计</span>
        <span style="width:280px">操作</span>
      </div>
      <div class="item" v-for="item of cartList" :key="item.id">
        <span style="width:250px">
          <van-checkbox  class="checked" v-model="item.checked"  @change="onChange(item)"></van-checkbox>
        </span>
        <span style="width:280px">
          <img class="bg" :src="item.productImage" alt />
          <p>{{item.productName}}</p>
        </span>
        <span style="width:280px">{{item.salePrice}}</span>
        <span style="width:280px">
          <van-stepper  @change="onChange(item)" v-model="item.productNum" />
        </span>
        <span style="width:280px">{{item.salePrice*item.productNum}}</span>
        <span style="width:280px">
          <el-button type="danger" @click="handleDelete(item.productId)">删除</el-button>
          <!-- <el-button type="text" @click="open2">点击打开 Message Box</el-button> -->
        </span>
      </div>
      <div>
        <van-submit-bar :disabled="sum==0?true:false" :price="sum" button-text="提交订单">
          <van-checkbox v-model="checkAll">全选</van-checkbox>
        </van-submit-bar>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cartList: [],
      disabled: true
    };
  },
  mounted() {
    this.initData();
  },
  computed: {
    checkAll: {
      get() {
        return this.cartList.every(item => item.checked);
      },
      set(val) {
        this.cartList.forEach(item => (item.checked = val));
      }
    },
    sum() {
      var total = 0;
      for (let i = 0; i < this.cartList.length; i++) {
        if (this.cartList[i].checked) {
          total =
            total + this.cartList[i].productNum * this.cartList[i].salePrice;
        } else {
          continue;
        }
      }
      return total * 100;
    }
  },
  methods: {
    handleDelete(productId) {
      this.$confirm("确定要删除该商品吗？ 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$http.post("/users/cartList/del", { productId }).then(res => {
            console.log(res);
            this.initData();
          }); //删除商品
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    initData() {
      this.$http.get("/users/cartList").then(res => {
        this.cartList = res.data.result;
      });
    },
    async onChange(item) {
      var { productId, productNum ,checked} = item;
      await this.$http.post("/users/cartList/edit", {
        productId,
        productNum,
        checked 
      });
    }
  }
};
</script>
<style  scoped>
.van-checkbox {
  margin-left: 80px;
}
h1 {
  width: 100%;
  text-align: center;
  background: #ebebeb;
  font-size: 20px;
  height: 40px;
  line-height: 40px;
}
.nav {
  width: 100%;
  height: 50px;
  background: black;
  color: #fff;
  display: flex;
  align-items: center;
  font-size: 20px;
}
.nav span {
  text-align: center;
}
.item {
  display: flex;
  align-items: center;
  font-size: 16px;
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #cccbcb;
}
.bg {
  width: 80px;
  height: 100px;
}
</style>
