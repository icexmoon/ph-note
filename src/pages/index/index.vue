<template>
  <view class="container">
    <view class="top">
      <view class="title">服药 & PH 记录</view>
      <view class="right-btns">
        <text class="chart-btn" @click="goChart">图表</text>
        <text class="setting" @click="goSetting">设置</text>
      </view>
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
    return { list: [] };
  },
  onShow() { this.getList(); },
  methods: {
    getList() {
      let data = uni.getStorageSync("drug_ph_records") || [];
      data.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
      this.list = data;
    },
    goAdd() { uni.navigateTo({ url:"/pages/add/add" }); },
    goEdit(index) { uni.navigateTo({ url:"/pages/add/add?index="+index }); },
    goSetting() { uni.navigateTo({ url:"/pages/setting/setting" }); },
    goChart() { uni.navigateTo({ url:"/pages/chart/chart" }); },
    del(index) {
      uni.showModal({
        title:"确认删除",
        success:res=>{
          if(res.confirm){
            this.list.splice(index,1);
            uni.setStorageSync("drug_ph_records",this.list);
            this.getList();
          }
        }
      })
    },
    getPhColor(ph){
      ph=Number(ph);
      if(ph<6)return"#ffc107";
      if(ph>=6&&ph<7)return"#4caf50";
      return"#2196f3";
    }
  }
};
</script>

<style scoped>
.container{padding:30rpx;}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:30rpx;}
.right-btns{display:flex;gap:20rpx;}
.title{font-size:36rpx;font-weight:bold;}
.setting,.chart-btn{font-size:28rpx;color:#409eff;}
.add-btn{background:#409eff;color:white;text-align:center;padding:28rpx;border-radius:12rpx;margin-bottom:30rpx;}
.item{display:flex;flex-direction:row;align-items:stretch;background:#fff;border-radius:12rpx;margin-bottom:20rpx;overflow:hidden;}
.left-bar{width:12rpx;}
.content{padding:30rpx;flex:1;}
.operate{display:flex;gap:30rpx;margin-top:20rpx;color:#409eff;}
</style>