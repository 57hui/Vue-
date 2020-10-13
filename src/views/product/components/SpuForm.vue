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
      <el-select value="2">
        <el-option label="选择颜色" value="1"></el-option>
        <el-option label="选择版本" value="2"></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
      <!-- 表格 -->
      <el-table data="" stripe style="width: 100%; margin-top: 20px" border>
        <el-table-column type="index" label="序号" width="80px" align="center">
        </el-table-column>
        <el-table-column prop="" label="属性名" width="150px">
        </el-table-column>
        <el-table-column prop="" label="属性值名称列表"> </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="{ row, $index }">
            <HintButton
              title="删除"
              icon="el-icon-delete"
              type="danger"
              size="mini"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <!-- 两个按钮 -->
    <el-form-item>
      <el-button type="primary">保存</el-button>
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
    };
  },
  methods: {
    initUpdateData(spuId) {
      this.spuId = spuId;
      //   根据spuId获取spuInfo对象信息
      this.getSpuInfo();
      // 根据spuId获取当前的spuInfo对象中所有的图片信息数据对象数组
      this.getSpuImageList();
      // 根据所有的品牌信息数据数组
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
        spuImageList.forEach(item=>{
            item.name=item.imgName
            item.url=item.imgUrl
        })
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
      this.spuImageList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 上传成功时立即更新图片信息数组
    handleSuccess(res, file, fileList) {
        this.spuImageList = fileList
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

    back() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style>
</style>
