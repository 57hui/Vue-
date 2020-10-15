<template>
  <el-form v-show="visible" label-width="100px">
    <!-- spu名称 -->
    <el-form-item label="SPU名称">
      <el-input
        type="text"
        placeholder="请输入SPU名称"
        v-model="spuInfo.spuName"
      ></el-input>
    </el-form-item>
    <!-- spu品牌 -->
    <el-form-item label="品牌">
      <el-select v-model="spuInfo.tmId">
        <el-option
          :label="tm.tmName"
          :value="tm.id"
          v-for="tm in trademarkList"
          :key="tm.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <!-- spu描述 -->
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        rows="4"
        placeholder="请输入描述信息"
        v-model="spuInfo.description"
      ></el-input>
    </el-form-item>
    <!-- spu图片 -->
    <el-form-item label="SPU图片">
      <el-upload
        action="/dev-api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="spuImageList"
        :on-success="handleSuccess"
        :before-upload="beforeAvatarUpload"
        multiple
      >
        <i class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过2M
        </div>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-form-item>

    <!-- 销售属性 -->
    <el-form-item label="销售属性">
      <el-select
        v-model="attrIdAttrName"
        :placeholder="`${
          unSelectedSaleAttrList.length > 0
            ? `还有${unSelectedSaleAttrList.length}可以选择`
            : '么得了'
        }`"
      >
        <el-option
          :label="attr.name"
          :value="attr.id + ':' + attr.name"
          v-for="attr in unSelectedSaleAttrList"
          :key="attr.id"
        ></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus" @click="addAttr"
        >添加销售属性</el-button
      >
      <!-- 表格 -->
      <el-table
        :data="spuInfo.spuSaleAttrList"
        stripe
        style="width: 100%; margin-top: 20px"
        border
      >
        <el-table-column type="index" label="序号" width="80px" align="center">
        </el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="150px">
        </el-table-column>
        <el-table-column label="属性值名称列表">
          <template slot-scope="{ row, $index }">
            <el-tag
              :key="value.id"
              v-for="(value, index) in row.spuSaleAttrValueList"
              closable
              :disable-transitions="false"
              @close="handleClose(row.spuSaleAttrValueList, index)"
            >
              {{ value.saleAttrValueName }}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="row.edit"
              v-model="row.saleAttrValueName"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            >
            </el-input>
            <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput(row)"
              >+ 添加</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="{ row, $index }">
            <el-popconfirm
              :title="`您确定要删除 ${row.saleAttrName} 吗？`"
              @onConfirm="deleteSaleAttr($index)"
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
    </el-form-item>

    <!-- 两个按钮 -->
    <el-form-item>
      <el-button type="primary" @click="saveSpu">保存</el-button>
      <el-button @click="back">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "SpuForm",
  props: ["visible"],
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spuId: "", //spu的id值
      attrIdAttrName: "", //用来存储选中的某个平台属性的id值和名称
      //spuInfo对象
      spuInfo: {
        spuName: "", //SPU名称
        description: "", //spu描述
        category3Id: "", //三级分类id
        tmId: "", //品牌id
        spuSaleAttrList: [], //销售属性信息数组
        spuImageList: [], // 图片数组信息数据
      },
      trademarkList: [], //品牌信息数据
      spuImageList: [], //图片信息数据
      saleAttrList: [], //销售属性数据
      attrId: "", // 用来存储选中的某个平台属性的id值
      inputVisible: false,
      inputValue: "",
    };
  },
  // 计算属性
  computed: {
    unSelectedSaleAttrList() {
      const {
        saleAttrList,
        spuInfo: { spuSaleAttrList },
      } = this;
      return saleAttrList.filter(
        (sa) => !spuSaleAttrList.some((ssa) => ssa.saleAttrName === sa.name)
      );
    },
  },
  methods: {
    //   根据id删除销售属性操作
    deleteSaleAttr(index) {
      this.spuInfo.spuSaleAttrList.splice(index, 1);
    },
    initUpdateData(spuId) {
      this.spuId = spuId;
      //   根据spuId获取spuInfo对象信息
      this.getSpuInfo();
      // 根据spuId获取当前的spuInfo对象中所有的图片信息数据对象数组
      this.getSpuImageList();
      // 获取所有的品牌信息数据数组
      this.getTrademarkList();
      // 获取所有的销售属性数据数组
      this.getSpuSaleAttrList();
    },
    // 根据spuId获取spuInfo对象信息
    async getSpuInfo() {
      // 获取api接口
      const result = await this.$API.spu.getSpuInfoById(this.spuId);
      // 判断是否成功
      if (result.code === 200) {
        // 更新数据
        this.spuInfo = result.data;
      }
    },
    // 根据spuId获取当前的spuInfo对象中所有的图片信息数据对象数组
    async getSpuImageList() {
      // 调用api接口
      const result = await this.$API.sku.getSpuImageList(this.spuId);
      // 判断是否成功
      if (result.code === 200) {
        // 更新数据
        const spuImageList = result.data;
        // 因为el-upload组件中如果要显示图片，必须有name和url两个属性
        spuImageList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = spuImageList;
      }
    },
    // 根据所有的品牌信息数据数组
    async getTrademarkList() {
      // 调用api接口
      const result = await this.$API.trademark.getTrademarkList();
      // 判断是否成功
      if (result.code === 200) {
        // 更新数据
        this.trademarkList = result.data;
      }
    },
    // 获取所有的销售属性数据数组
    async getSpuSaleAttrList() {
      // 调用api接口
      const result = await this.$API.spu.getBaseSaleAttrList();
      // 判断是否成功
      if (result.code === 200) {
        // 更新数据
        this.saleAttrList = result.data;
      }
    },

    //   图片的回调函数
    // 执行删除图片操作时，立即更新图片信息数组
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传成功时立即更新图片信息数组
    handleSuccess(res, file, fileList) {
      this.spuImageList = fileList;
    },
    // 上传图片的限制的回调函数
    beforeAvatarUpload(file) {
      // 设置图片的类型
      // const isJPG = file.type === 'image/jpeg'||file.type==='image/png'
      // 当前限制的图片类型中是否包含上传图片的类型
      const isJPG = ["image/jpeg", "image/png"].includes(file.type);
      // 限制图片的大小的
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }, // end

    // 销售属性的回调函数
    // 点击删除按钮 删除属性值操作
    handleClose(valueList, index) {
      valueList.splice(index, 1);
    },

    showInput(attr) {
      // 要进入到编辑模式
      // 因为attr是销售属性对象,edit这个属性是后添加的,不是响应式的属性数据,所以,直接修改true或者false,是不是让界面渲染的
      if (!attr.hasOwnProperty("edit")) {
        // 添加这个响应式属性
        this.$set(attr, "edit", true);
      } else {
        attr.edit = true;
      }
      this.$nextTick((_) => {
        // 获取焦点
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 添加属性值操作
    handleInputConfirm(attr) {
      // 获取文本框中输入的内容
      const saleAttrValueName = attr.saleAttrValueName;
      // 判断数据是否存在
      if (saleAttrValueName) {
        const isRespeat = attr.spuSaleAttrValueList.some(
          (value) => value.saleAttrValueName === saleAttrValueName
        );
        // 判断数据是否重复
        if (!isRespeat) {
          attr.spuSaleAttrValueList.push({
            baseSaleAttrId: attr.baseSaleAttrId,
            saleAttrValueName,
          });
        } else {
          // 失败的提示信息
          this.$message.warning("不能添加重复值");
          return;
        }
      }
      // 进入查看模式
      attr.edit = false;
      // 清空文本框
      attr.saleAttrValueName = "";
    },
    // 添加销售属性
    addAttr() {
      // 获取当前选中的销售属性数据
      const [baseSaleAttrId, saleAttrName] = this.attrIdAttrName.split(":");
      // 把当前选中的销售属性添加到表格中
      this.spuInfo.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      });
      // 清空
      this.attrIdAttrName = "";
    },
    // 保存spu
    async saveSpu() {
      // 获取spuInfo和spuImageList数据
      const { spuInfo, spuImageList } = this;
      // 过滤销售属性数据和删除无用数据(spuInfo.spuSaleAttrList)
      spuInfo.spuSaleAttrList = spuInfo.spuSaleAttrList.filter((item) => {
        // 判断当前的销售属性对象中的属性值数组中有数据
        if (item.spuSaleAttrValueList.length > 0) {
          delete item.edit;
          delete item.saleAttrValueName;
          return true;
        }
        return false;
      });
      // 过滤图片信息数据 spuImageList
      spuInfo.spuImageList = spuImageList.map((img) => ({
        imgName: img.name,
        imgUrl: img.response ? img.response.data : img.imgUrl,
      }));
      // 调用api接口
      const result = await this.$API.spu.addOrUpdateSpuInfo(spuInfo);
      // 判断是否成功
      if (result.code === 200) {
        // 成功的提示信息
        this.$message.success("保存SPU成功");
        // 关闭界面
        // this.back()
        this.$emit("update:visible", false);
        // 重置数据
        this.resetData();
        // 通知父级组件
        this.$emit("saveSusccess");
      } else {
        this.$message.error("保存SPU失败");
      }
    },
    // 重置数据
    resetData() {
      this.dialogImageUrl = "";
      this.dialogVisible = false;
      this.spuId = ""; //spu的id值
      this.attrIdAttrName = ""; //用来存储选中的某个平台属性的id值和名称
      //spuInfo对象
      (this.spuInfo = {
        spuName: "", //SPU名称
        description: "", //spu描述
        category3Id: "", //三级分类id
        tmId: "", //品牌id
        spuSaleAttrList: [], //销售属性信息数组
        spuImageList: [], // 图片数组信息数据
      }),
        (this.trademarkList = []); //品牌信息数据
      this.spuImageList = []; //图片信息数据
      this.saleAttrList = []; //销售属性数据
      this.attrId = ""; // 用来存储选中的某个平台属性的id值
      this.inputVisible = false;
      this.inputValue = "";
    },
    //  添加spu操作的时候的初始化数据方法
    initAddData(category3Id) {
      // 将category3Id保存在spuInfo对象中
      this.spuInfo.category3Id = category3Id;
      // 重新获取品牌信息数据
      this.getTrademarkList();
      //  重新获取销售属性信息数据
      this.getSpuSaleAttrList()
    },
    back() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
