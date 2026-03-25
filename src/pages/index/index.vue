<template>
  <view class="container">
    <view class="title">服药 & PH 记录</view>

    <view class="add-btn" @click="goAdd">
      <text>+ 添加新记录</text>
    </view>

    <view class="list">
      <view class="item" v-for="(item, index) in recordList" :key="index">
        <view class="time">{{ item.createTime }}</view>
        <view class="info">服药剂量：{{ item.dosage }}g</view>
        <view class="info">尿液 PH：{{ item.phValue }}</view>
        
        <view class="btns">
          <view class="edit-btn" @click="goEdit(index)">编辑</view>
          <view class="del-btn" @click="del(index)">删除</view>
        </view>
      </view>

      <view class="empty" v-if="recordList.length === 0">
        暂无记录，点击上方添加
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from 'vue'
import { getRecordList, deleteRecord } from '../../utils/storage'

export default {
  data() {
    return {
      recordList: []
    }
  },
  onLoad() {
    this.loadList()
  },
  onShow() {
    this.loadList()
  },
  methods: {
    loadList() {
      this.recordList = getRecordList()
    },
    goAdd() {
      uni.navigateTo({ url: '/pages/add/add' })
    },
    goEdit(index) {
      uni.navigateTo({ url: '/pages/add/add?index=' + index })
    },
    del(index) {
      uni.showModal({
        title: '确认删除',
        content: '删除后无法恢复',
        success: (res) => {
          if (res.confirm) {
            deleteRecord(index)
            this.loadList()
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.container { padding: 20rpx; background: #f5f5f5; min-height: 100vh; }
.title { font-size: 36rpx; font-weight: bold; text-align: center; margin: 20rpx 0; }
.add-btn { background: #07c160; color: white; text-align: center; padding: 24rpx; border-radius: 12rpx; margin-bottom: 30rpx; }
.list { background: white; border-radius: 16rpx; padding: 20rpx; }
.item { padding: 24rpx; border-bottom: 1rpx solid #eee; }
.time { font-size: 24rpx; color: #999; margin-bottom: 12rpx; }
.info { font-size: 28rpx; line-height: 1.6; }
.btns { display: flex; gap: 20rpx; margin-top: 20rpx; }
.edit-btn { color: #07c160; font-size: 26rpx; }
.del-btn { color: #ff6666; font-size: 26rpx; }
.empty { text-align: center; padding: 60rpx 0; color: #999; }
</style>