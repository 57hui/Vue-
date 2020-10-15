<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelector ref="cs" @changeCategory="changeCategory" />
    </el-card>
    <el-card>
      <div v-show="!isShowSpuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          @click="addSpu"
          :disabled="!category3Id"
          >添加SPU</el-button
        >
        <el-table :data="spuInfoList" stripe style="width: 100%" border>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
          <el-table-column prop="description" label="SPU描述">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <HintButton
                title="添加SKU"
                icon="el-icon-plus"
                type="primary"
                size="mini"
              />
              <HintButton
                title="修改SPU"
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="updateSpuForm(row.id)"
              />
              <HintButton
                title="查看SKU"
                icon="el-icon-info"
                type="info"
                size="mini"
              />
              <HintButton
                title="删除"
                icon="el-icon-delete"
                type="danger"
                size="mini"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getspuInfoList"
          :current-page="page"
          :page-sizes="[3, 6, 9, 12]"
          :page-size="limit"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="total"
          style="margin-top: 20px; text-align: center"
          background
        >
        </el-pagination>
      </div>
      <!-- 当父级组件向子级组件传递数据，子级组件需要修改父级组件的数据时，子级组件不能直接修改父级组件的数据，可以使用.sync来实现 -->
      <SpuForm
        :visible.sync="isShowSpuForm"
        ref="spuForm"
        @saveSusccess="saveSusccess"
      />
    </el-card>
  </div>
</template>

<script>
// 引入组件
import SpuForm from "../components/SpuForm";
export default {
  name: "spuList",
  // 注册组件
  components: {
    SpuForm,
  },
  data() {
    return {
      category1Id: "", //一级分类的id
      category2Id: "", //二级分类的id
      category3Id: "", //三级分类的id
      page: 1, //默认第一页
      limit: 3, // 默认每页三条数据
      total: 0, //总条数
      spuInfoList: [], // spu的列表数据
      isShowSpuForm: false, //默认添加修改界面不显示
    };
  },
  watch: {
    isShowSpuForm(val) {
      this.$refs.cs.isDisabled = val;
    },
  },
  methods: {
    // 获取数据
    async getspuInfoList(page = 1) {
      this.page = page;
      const { limit, category3Id } = this;
      // 调用api接口
      const result = await this.$API.spu.getSpuInfoList(
        page,
        limit,
        category3Id
      );
      // 判断是否成功
      if (result.code === 200) {
        // 更新数据
        const { records, total } = result.data;
        // 更新数据
        this.total = total;
        this.spuInfoList = records;
      }
    },
    // categoryId:传过来的id,level:传过来的级别
    changeCategory({ categoryId, level }) {
      // 判断级别 只有级别等于3时，才获取数据
      if (level === 3) {
        // 保存三级分类id
        this.category3Id = categoryId;
        // 获取数据
        this.getspuInfoList();
      } else if (level === 2) {
        // 重置二级分类和三级分类以及spu数据总条数
        this.category2Id = null;
        this.category3Id = null;
        this.total = 0;
        this.spuInfoList = [];
        // 保存二级分类id
        this.category2Id = categoryId;
      } else if (level === 1) {
        // 重置三级分类以及spu数据总条数
        this.category3Id = null;
        this.total = 0;
        this.spuInfoList = [];
        // 保存一级级分类id
        this.category1Id = categoryId;
      }
    },
    // 分页组件的回调函数
    handleSizeChange(val) {
      // 更新每页条数的数据
      this.limit = val;
      // 重新获取数据
      this.getspuInfoList();
    },
    // 点击修改按钮 切换添加或修改界面
    updateSpuForm(spuId) {
      // 调用SpuForm组件中的初始化数据方法
      this.$refs.spuForm.initUpdateData(spuId);
      // 显示修改界面
      this.isShowSpuForm = true;
    },
    // 保存成功
    saveSusccess() {
      this.isShowSpuForm = false;
    },
    // 添加SPU
    addSpu() {
      // 只有当获取三级分类id时才能添加SPU
      const category3Id = this.category3Id;
      // 因为父级组件中没有spuInfo对象，所以我们可以在子级组件中完成添加功能，通过$refs的方法可以获得添加功能的方法，但是因为子级组件没有三级分类id所以需要把category3Id传过去
      this.$refs.spuForm.initAddData(category3Id);
      // 切换页面
      this.isShowSpuForm = true;
    },
  },
};
</script>

<style>
</style>