<template>
  <view class="container">
    <view class="title">{{ isEdit ? "编辑记录" : "添加记录" }}</view>

    <view class="item">
      <text>服药剂量（g）</text>
      <input v-model="dosage" type="digit" placeholder="例如：6" />
    </view>

    <view class="item">
      <text>尿液 PH 值</text>
      <input v-model="phValue" type="digit" placeholder="例如：5.5" />
    </view>

    <!-- 安卓 100% 不空白：日期选择 -->
    <view class="item">
      <text>日期</text>
      <picker mode="date" :value="date" @change="onDateChange">
        <view class="picker-box">{{ date }}</view>
      </picker>
    </view>

    <!-- 安卓 100% 不空白：时间选择 -->
    <view class="item">
      <text>时间</text>
      <picker mode="time" :value="time" @change="onTimeChange">
        <view class="picker-box">{{ time }}</view>
      </picker>
    </view>

    <view class="save-btn" @click="save">
      保存记录
    </view>
  </view>
</template>

<script>
export default {
  data() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');

    return {
      dosage: "",
      phValue: "",
      date: `${year}-${month}-${day}`,
      time: `${hour}:${minute}`,
      isEdit: false,
      editIndex: -1,
    };
  },

  onLoad(options) {
    if (options.index != null) {
      this.isEdit = true;
      this.editIndex = Number(options.index);

      const list = uni.getStorageSync("drug_ph_records") || [];
      const item = JSON.parse(JSON.stringify(list[this.editIndex]));

      this.dosage = item.dosage || "";
      this.phValue = item.phValue || "";

      // 自动拆分日期和时间
      if (item.createTime) {
        const dt = item.createTime.split(" ");
        this.date = dt[0];
        this.time = dt[1];
      }
    }
  },

  methods: {
    onDateChange(e) {
      this.date = e.detail.value;
    },
    onTimeChange(e) {
      this.time = e.detail.value;
    },

    save() {
      if (!this.dosage) {
        uni.showToast({ title: "请输入剂量", icon: "none" });
        return;
      }
      if (!this.phValue) {
        uni.showToast({ title: "请输入PH值", icon: "none" });
        return;
      }

      const record = {
        createTime: `${this.date} ${this.time}`,
        dosage: this.dosage,
        phValue: this.phValue,
      };

      let list = uni.getStorageSync("drug_ph_records") || [];
      list = JSON.parse(JSON.stringify(list));

      if (this.isEdit) {
        list[this.editIndex] = record;
      } else {
        list.unshift(record);
      }

      uni.setStorageSync("drug_ph_records", list);
      uni.showToast({ title: "保存成功" });
      setTimeout(() => uni.navigateBack(), 1500);
    },
  },
};
</script>

<style scoped>
.container { padding: 40rpx; }
.title { font-size: 36rpx; font-weight: bold; text-align: center; margin-bottom: 60rpx; }
.item { margin-bottom: 40rpx; }
.item text { display: block; font-size: 28rpx; margin-bottom: 16rpx; }
.item input { border: 1rpx solid #ddd; border-radius: 8rpx; padding: 24rpx; font-size: 28rpx; }
.picker-box { border: 1rpx solid #ddd; border-radius: 8rpx; padding: 24rpx; font-size: 28rpx; color: #333; }
.save-btn { background: #07c160; color: white; text-align: center; padding: 28rpx; border-radius: 12rpx; margin-top: 40rpx; }
</style>