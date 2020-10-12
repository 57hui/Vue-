<template>
  <div>
    <el-card style="margin-bottom: 20px">
      <CategorySelector ref="cs" @changeCategory="changeCategory" />
    </el-card>
    <el-card>
      <div v-show="isShowAttr">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 20px"
          @click="addAttr"
          :disabled="!category3Id"
          >添加属性</el-button
        >
        <el-table :data="attrList" stripe style="width: 100%" border>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column>
          <el-table-column prop="attrValueList" label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="info"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
                >{{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px">
            <template slot-scope="{ row, $index }">
              <HintButton
                title="修改"
                icon="el-icon-edit"
                type="primary"
                size="mini"
                @click="showUpdateAttr(row)"
              />
              <el-popconfirm
                :title="`您确定要删除 ${row.attrName} 吗？`"
                @onConfirm="deleteAttr(row.id)"
              >
                <HintButton
                  title="删除"
                  icon="el-icon-delete"
                  type="danger"
                  size="mini"
                  slot="reference"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowAttr">
        <!-- 表单标签 -->
        <el-form inline :model="formAttr">
          <el-form-item label="属性名">
            <el-input
              v-model="formAttr.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 两个按钮 -->
        <div style="margin-bottom: 20px">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addAttrValue"
            :disabled="!formAttr.attrName"
            >添加属性值</el-button
          >
          <el-button @click="isShowAttr = true">取消</el-button>
        </div>

        <!-- 表格 -->
        <el-table
          :data="formAttr.attrValueList"
          stripe
          style="width: 100%; margin-bottom: 20px"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="valueName" label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                type="text"
                placeholder="请输入属性名称"
                v-model="row.valueName"
                size="mini"
                v-if="row.edit"
                :ref="$index"
                @blur="toView(row)"
                @keyup.enter.native="toView(row)"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: inline-block; width: 100%"
                >{{ row.valueName }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`您确定要删除 ${row.valueName} 吗？`"
                @onConfirm="deleteValue($index)"
              >
                <HintButton
                  title="删除"
                  icon="el-icon-delete"
                  type="danger"
                  size="mini"
                  slot="reference"
                />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="updateAttr" :disabled="!isSaveValid"
          >保存</el-button
        >
        <el-button @click="isShowAttr = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
// 按需引入
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "AttrList",
  data() {
    return {
      category1Id: "", //一级分类的id
      category2Id: "", //二级分类的id
      category3Id: "", //三级分类的id
      attrList: [], // 存储分类信息对应的平台属性数据
      isShowAttr: true, //控制修改与展示平台属性页面的显示
      //存储要修改的平台属性对象
      formAttr: {
        attrName: "", //属性的名字
        attrValueList: [], // 属性值数组
      },
    };
  },
  // 计算属性
  computed: {
    // 只有当平台属性名有值并且属性值至少有一个 保存按钮才能使用
    // some 数组中有一个数据就返回true 没有则返回false
    isSaveValid() {
      // return this.formAttr.attrName.trim()&&this.formAttr.attrValueList.length>0
      return (
        this.formAttr.attrName.trim() &&
        this.formAttr.attrValueList.some((item) => item.valueName.trim())
      );
    },
  },
  // 监视
  // 分类是否可以使用取决于父级组件界面是否切换
  watch: {
    isShowAttr(val) {
      this.$refs.cs.isDisabled = !val;
    },
  },
  methods: {
    // 获取数据
    async getAttrList() {
      // 调用api接口函数
      const result = await this.$API.attr.getAttrList(
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
      // 判断是否成功
      if (result.code === 200) {
        // 将数据保存在attrList中
        this.attrList = result.data;
      }
    },
    // categoryId:传过来的id,level:传过来的级别
    changeCategory({ categoryId, level }) {
      // 判断级别 只有级别等于3时，才获取数据
      if (level === 3) {
        // 保存三级分类id
        this.category3Id = categoryId;
        // 获取数据
        this.getAttrList();
      } else if (level === 2) {
        // 重置二级分类和三级分类以及平台属性数值
        this.category2Id = null;
        this.category3Id = null;
        this.attrList = [];
        // 保存二级分类id
        this.category2Id = categoryId;
      } else if (level === 1) {
        // 重置三级分类以及平台属性数值
        this.category3Id = null;
        this.attrList = [];
        // 保存一级级分类id
        this.category1Id = categoryId;
      }
    },
    // 点击修改按钮修改界面
    showUpdateAttr(attr) {
      // 切换界面
      this.isShowAttr = false;
      // 传递数据
      // 这两个对象的地址是相同的，所以其中任意一个对象的数据发生变化，另外一个对象也会发生变化
      // this.formAttr = attr;
      // 浅拷贝
      // this.formAttr = {...attr}
      // 深拷贝
      this.formAttr = cloneDeep(attr);
    },
    // 删除某个平台属性值对象
    deleteValue(index) {
      this.formAttr.attrValueList.splice(index, 1);
    },
    // 添加平台属性值
    addAttrValue() {
      this.formAttr.attrValueList.push({
        valueName: "", // 属性值
        attrId: this.formAttr.id, //当前的平台属性的id值
        edit: true, //input与sapn进行切换的标识符
      });
      // 最后一个文本框有焦点
      this.$nextTick(() => {
        this.$refs[this.formAttr.attrValueList.length - 1].focus();
      });
    },
    // 进入查看模式
    toView(item) {
      // 判断文本框是否有数据，如果没有失去焦点还是文本框模式，如果有失去焦点后变成查看模式
      if (item.valueName) {
        item.edit = false;
      }
    },
    // 进入编辑模式
    toEdit(item, index) {
      // 判断是不是响应式数据，如果是则修改该属性的值，如果不是则给当前数据添加响应式的属性
      if (!item.hasOwnProperty("edit")) {
        this.$set(item, "edit", true);
      } else {
        item.edit = true;
      }
      // 获取焦点
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 修改或添加操作
    async updateAttr() {
      // 干掉无用的属性数据 过滤掉无用的数据
      this.formAttr.attrValueList = this.formAttr.attrValueList.filter(
        (item) => {
          // 干掉无用的属性数据
          delete item.edit;
          // 过滤掉无用的数据
          return item.valueName.trim();
        }
      );
      // 调用api接口函数
      const result = await this.$API.attr.saveOrUpdateAttr(this.formAttr);
      // 判断是否成功
      if (result.code === 200) {
        this.$message.success("添加成功");
        // 关闭当前页面
        this.isShowAttr = true;
        // 重新获取数据
        this.getAttrList();
      } else {
        // 失败
        this.$message.error("添加失败");
      }
    },
    // 添加平台属性操作
    addAttr() {
      // 添加平台属性
      this.formAttr = {
        attrName: "", // 平台属性名称
        attrValueList: [], // 平台属性数组
        categoryId: this.category3Id, // 当前的三级分类id
        categoryLevel: 3, // 当前分类的级别
      };
      // 显示添加(修改)平台属性的界面 添加和修改是同一个界面 并且保存按钮调用的接口有添加和修改的功能
      this.isShowAttr = false;
    },
    // 根据id删除平台属性信息数据
    async deleteAttr(id) {
      // 调用api接口
      const result = await this.$API.attr.deleteAttrById(id);
      // 判断是否成功
      if (result.code === 200) {
        // 成功的提示信息
        this.$message.success("删除成功");
        // 重新获取数据
        this.getAttrList();
      } else {
        // 失败的提示信息
        this.$message.error("删除失败");
      }
    },
  },
};
</script>
<style scoped>
</style>