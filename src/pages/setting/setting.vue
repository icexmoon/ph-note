<template>
  <view class="container">
    <view class="title">设置</view>

    <view class="menu-item" @click="exportData">
      <text>导出数据（备份）</text>
    </view>

    <view class="menu-item" @click="importData">
      <text>导入数据（恢复）</text>
    </view>

    <view class="menu-item" @click="clearData">
      <text>清空所有数据</text>
    </view>

    <!-- 版本 + 版权信息 -->
    <view class="copyright-box">
      <view class="version">当前版本：{{ versionName }}</view>
      <view class="copyright">© 2026 icexmoon@qq.com</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      versionName: "1.0.0"
    };
  },

  onLoad() {
    this.getAppVersion();
  },

  methods: {
    // 获取APP版本
    getAppVersion() {
      // #ifdef APP-PLUS
      plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
        this.versionName = wgtinfo.version || "1.0.0";
      });
      // #endif
    },

    // 导出数据
    exportData() {
      const data = uni.getStorageSync("drug_ph_records") || [];
      if (data.length === 0) {
        uni.showToast({ title: "暂无数据", icon: "none" });
        return;
      }
      uni.setClipboardData({
        data: JSON.stringify(data),
        success: () => uni.showToast({ title: "已复制到剪贴板" }),
      });
    },

    // 导入数据
    importData() {
      uni.showModal({
        title: "确认导入",
        content: "导入会覆盖现有数据，是否继续？",
        success: (res) => {
          if (res.confirm) {
            uni.getClipboardData({
              success: (res) => {
                try {
                  const data = JSON.parse(res.data);
                  if (Array.isArray(data)) {
                    uni.setStorageSync("drug_ph_records", data);
                    uni.showToast({ title: "导入成功" });
                  }
                } catch (e) {
                  uni.showToast({ title: "数据格式错误", icon: "none" });
                }
              },
            });
          }
        },
      });
    },

    // 清空数据
    clearData() {
      uni.showModal({
        title: "确认清空",
        content: "确定删除所有记录？此操作不可恢复！",
        success: (res) => {
          if (res.confirm) {
            uni.setStorageSync("drug_ph_records", []);
            uni.showToast({ title: "已清空" });
          }
        },
      });
    },
  },
};
</script>

<style scoped>
.container {
  padding: 30rpx;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40rpx;
}
.menu-item {
  padding: 30rpx;
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  font-size: 28rpx;
}

/* 版本 & 版权 */
.copyright-box {
  margin-top: 80rpx;
  text-align: center;
  color: #999;
  font-size: 26rpx;
  line-height: 1.8;
}
.version {
  margin-bottom: 10rpx;
}
.copyright {
  color: #bbb;
  font-size: 24rpx;
}
</style>