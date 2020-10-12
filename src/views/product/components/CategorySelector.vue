<template>
  <div>
    <el-form inline :model="form">
      <!-- 一级分类 -->
      <!-- change事件 下拉框中的change事件:选中值发送变化时触发，回调参数是当前选中的值 -->
      <el-form-item label="一级分类">
        <el-select
          v-model="form.category1Id"
          placeholder="请选择"
          @change="changeCategory1"
          :disabled="isDisabled"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in category1List"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 二级分类 -->
      <el-form-item label="二级分类">
        <el-select
          v-model="form.category2Id"
          placeholder="请选择"
          @change="changeCategory2"
          :disabled="isDisabled"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in category2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 三级分类 -->
      <el-form-item label="三级分类">
        <el-select
          v-model="form.category3Id"
          placeholder="请选择"
          @change="changeCategory3"
          :disabled="isDisabled"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in category3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
  data() {
    return {
      form: {
        category1Id: "", //一级分类的id
        category2Id: "", //二级分类的id
        category3Id: "", //三级分类的id
      },
      category1List: [], //保存一级分类的数据
      category2List: [], //保存二级分类的数据
      category3List: [], //保存三级分类的数据
      isDisabled : false
    };
  },
  // 在界面加载后的生命周期回调中的获取一级分类信息
  mounted() {
    // 一级分类信息
    this.getCategory1List();
  },
  methods: {
    // 调用接口函数
    async getCategory1List() {
      const result = await this.$API.category.getCategorys1();
      // 判断是否成功
      if (result.code === 200) {
        // 把数据储存到category1List中
        this.category1List = result.data;
      }
    },
    // 一级分类内容选中后的回调
    async changeCategory1(category1Id) {
      // 当一级分类选中内容发送改变时，二级分类和三级分类的id和数据都需要清空
      this.form.category2Id = null;
      this.form.category3Id = null;
      this.category2List = [];
      this.category3List = [];
      //   分发父级组件的自定义事件，把一级分类的id和级别传递过去
      this.$emit("changeCategory", { categoryId: category1Id, level: 1 });
      // 调用api接口函数
      const result = await this.$API.category.getCategorys2(category1Id);
      // 判断是否成功
      if (result.code === 200) {
        // 把数据储存到category2List中
        this.category2List = result.data;
      }
    },
    // 二级分类内容选中后的回调
    async changeCategory2(category2Id) {
      // 当二级分类选中内容发送改变时，三级分类的id和数据都需要清空
      this.form.category3Id = null;
      this.category3List = [];
      //   分发父级组件的自定义事件，把二级级分类的id和级别传递过去
      this.$emit("changeCategory", { categoryId: category2Id, level: 2 });
      // 调用api接口函数
      const result = await this.$API.category.getCategorys3(category2Id);
      // 判断是否成功
      if (result.code === 200) {
        // 把数据储存到category3List中
        this.category3List = result.data;
      }
    },
    // 三级分类
    changeCategory3(category3Id) {
      // 分发父级组件的自定义事件，把三级分类的id和级别传递过去
      this.$emit("changeCategory", { categoryId: category3Id, level: 3 });
    },
  },
};
</script>

<style>
</style>
