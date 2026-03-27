<template>
  <view class="container">
    <view class="top">
      <view class="title">服药 & PH 记录</view>
      <text class="setting" @click="goSetting">设置</text>
    </view>

    <view class="add-btn" @click="goAdd">添加新记录</view>

    <view class="list">
      <view class="item" v-for="(item, index) in list" :key="index">
        <view class="left-bar" :style="{background: getPhColor(item.phValue)}"></view>
        
        <view class="content">
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
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [],
    };
  },

  onShow() {
    this.getList();
  },

  methods: {
    getList() {
      let data = uni.getStorageSync("drug_ph_records") || [];
      
      // ✅ 时间倒序排序（最新的在最上面）
      data.sort((a, b) => {
        return new Date(b.createTime) - new Date(a.createTime);
      });

      this.list = data;
    },

    goAdd() {
      uni.navigateTo({ url: "/pages/add/add" });
    },

    goEdit(index) {
      uni.navigateTo({ url: "/pages/add/add?index=" + index });
    },

    goSetting() {
      uni.navigateTo({ url: "/pages/setting/setting" });
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

    // 根据 PH 值返回颜色
    getPhColor(ph) {
      ph = Number(ph);
      if (ph < 6) {
        return "#ffc107"; // 黄色
      } else if (ph >= 6 && ph < 7) {
        return "#4caf50"; // 绿色
      } else {
        return "#2196f3"; // 蓝色
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 30rpx;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
}
.setting {
  font-size: 28rpx;
  color: #409eff;
}
.add-btn {
  background: #409eff;
  color: white;
  text-align: center;
  padding: 28rpx;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
}
.item {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}
.left-bar {
  width: 12rpx;
}
.content {
  padding: 30rpx;
  flex: 1;
}
.operate {
  display: flex;
  gap: 30rpx;
  margin-top: 20rpx;
  color: #409eff;
}
</style>