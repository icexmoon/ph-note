<template>
  <view class="container">
    <view class="title">服药 & PH 记录</view>

    <!-- 导出 导入 按钮 -->
    <view class="btns">
      <button class="btn" @click="exportData">导出备份</button>
      <button class="btn" @click="importData">导入恢复</button>
    </view>

    <view class="add-btn" @click="goAdd">
      添加新记录
    </view>

    <view class="list">
      <view class="item" v-for="(item, index) in list" :key="index">
        <view>剂量：{{ item.dosage }}g</view>
        <view>PH值：{{ item.phValue }}</view>
        <view>时间：{{ item.createTime }}</view>
        <view class="operate">
          <text @click="goEdit(index)">编辑</text>
          <text @click="del(index)">删除</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },

  onShow() {
    this.getList();
  },

  methods: {
    getList() {
      this.list = uni.getStorageSync("drug_ph_records") || [];
    },

    goAdd() {
      uni.navigateTo({ url: "/pages/add/add" });
    },

    goEdit(index) {
      uni.navigateTo({ url: "/pages/add/add?index=" + index });
    },

    del(index) {
      uni.showModal({
        title: "确认删除",
        success: (res) => {
          if (res.confirm) {
            this.list.splice(index, 1);
            uni.setStorageSync("drug_ph_records", this.list);
            this.getList();
          }
        }
      });
    },

    // ✅ 导出数据到剪贴板
    exportData() {
      const data = uni.getStorageSync("drug_ph_records") || [];
      if (data.length === 0) {
        uni.showToast({ title: "暂无数据", icon: "none" });
        return;
      }
      const str = JSON.stringify(data);
      uni.setClipboardData({
        data: str,
        success: () => {
          uni.showToast({ title: "已复制到剪贴板" });
        }
      });
    },

    // ✅ 从剪贴板导入数据
    importData() {
      uni.showModal({
        title: "提示",
        content: "导入会覆盖当前所有数据，确定继续？",
        success: (res) => {
          if (res.confirm) {
            uni.getClipboardData({
              success: (res) => {
                try {
                  const data = JSON.parse(res.data);
                  if (Array.isArray(data)) {
                    uni.setStorageSync("drug_ph_records", data);
                    this.getList();
                    uni.showToast({ title: "导入成功" });
                  } else {
                    uni.showToast({ title: "数据格式错误", icon: "none" });
                  }
                } catch (e) {
                  uni.showToast({ title: "数据格式错误", icon: "none" });
                }
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.container { padding: 30rpx; }
.title { font-size: 36rpx; font-weight: bold; text-align: center; margin-bottom: 30rpx; }
.btns { display: flex; gap: 20rpx; margin-bottom: 30rpx; }
.btn { flex: 1; background: #07c160; color: #fff; padding: 20rpx; border-radius: 12rpx; font-size: 26rpx; }
.add-btn { background: #409eff; color: white; text-align: center; padding: 28rpx; border-radius: 12rpx; margin-bottom: 30rpx; }
.item { padding: 30rpx; border: 1rpx solid #eee; border-radius: 12rpx; margin-bottom: 20rpx; }
.operate { display: flex; gap: 30rpx; margin-top: 20rpx; color: #409eff; }
</style>