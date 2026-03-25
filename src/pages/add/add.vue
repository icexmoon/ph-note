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

    <!-- 时间选择器：修复可点击、可选择、可显示 -->
  <view class="item">
    <text>记录时间</text>
    <picker mode="datetime" :value="createTime" fields="month-day-hour-minute" @change="timeChange">
      <view class="picker-box">{{ createTime }}</view>
    </picker>
  </view>

    <view class="save-btn" @click="save">
      保存记录
    </view>
  </view>
</template>

<script>
import { saveRecord, updateRecord, getRecordList } from '../../utils/storage'

export default {
  data() {
    const now = new Date()
    const defaultTime = now.toISOString().slice(0, 16).replace('T', ' ')
    
    return {
      dosage: '',
      phValue: '',
      createTime: defaultTime,
      isEdit: false,
      editIndex: -1
    }
  },
  
  onLoad(options) {
    if (options.index != null) {
      this.isEdit = true
      this.editIndex = Number(options.index)
        
      const list = getRecordList()
      const item = list[this.editIndex]
        
      this.dosage = item.dosage || ''
      this.phValue = item.phValue || ''
      this.createTime = item.createTime || this.createTime
    }
  },
  
  methods: {
    timeChange(e) {
      // 时间选择后赋值
      this.createTime = e.detail.value
    },
      
    save() {
      if (!this.dosage) {
        uni.showToast({ title: '请输入剂量', icon: 'none' })
        return
      }
      if (!this.phValue) {
        uni.showToast({ title: '请输入PH值', icon: 'none' })
        return
      }

      const record = {
        createTime: this.createTime,
        dosage: this.dosage,
        phValue: this.phValue
      }

      if (this.isEdit) {
        updateRecord(record, this.editIndex)
      } else {
        saveRecord(record)
      }

      uni.showToast({ title: '保存成功' })
      setTimeout(() => uni.navigateBack(), 1500)
    }
  }
}
</script>

<style scoped>
.container { padding: 40rpx; }
.title { font-size: 36rpx; font-weight: bold; text-align: center; margin-bottom: 60rpx; }
.item { margin-bottom: 40rpx; }
.item text { display: block; font-size: 28rpx; margin-bottom: 16rpx; }
.item input {
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 24rpx;
  font-size: 28rpx;
}
.picker-box {
  border: 1rpx solid #ddd;
  border-radius: 8rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: #333;
}
.save-btn {
  background: #07c160;
  color: white;
  text-align: center;
  padding: 28rpx;
  border-radius: 12rpx;
  margin-top: 40rpx;
}
</style>