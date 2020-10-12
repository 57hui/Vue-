<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelector @changeCategory="changeCategory" />
    </el-card>
    <el-card>
      <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 20px"
        >添加SPU</el-button
      >
      <el-table :data="spuInfoList" stripe style="width: 100%" border>
        <el-table-column type="index" label="序号" width="80px" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
        <el-table-column prop="description" label="SPU描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row, $index }">
            <HintButton
              title="添加SPU"
              icon="el-icon-plus"
              type="primary"
              size="mini"
            />
            <HintButton
              title="修改SPU"
              icon="el-icon-edit"
              type="primary"
              size="mini"
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
    </el-card>
  </div>
</template>

<script>
export default {
  name: "spuList",
  data() {
    return {
      category1Id: "", //一级分类的id
      category2Id: "", //二级分类的id
      category3Id: "", //三级分类的id
      page: 1, //默认第一页
      limit: 3, // 默认每页三条数据
      total: 0, //总条数
      spuInfoList: [], // spu的列表数据
    };
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
  },
};
</script>

<style>
</style>