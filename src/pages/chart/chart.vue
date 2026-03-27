<template>
  <view class="container">
    <view class="title">PH 值变化趋势</view>

    <canvas canvas-id="phCanvas" class="canvas"></canvas>

    <view class="legend">
      <view><view class="color yellow"></view> 0~6 酸性</view>
      <view><view class="color green"></view> 6~7 中性</view>
      <view><view class="color blue"></view> 7~14 碱性</view>
    </view>
  </view>
</template>

<script>
export default {
  onReady() {
    setTimeout(() => {
      this.drawChart();
    }, 300);
  },

  methods: {
    // 获取 PH 对应颜色
    getPhColor(ph) {
      ph = Number(ph);
      if (ph < 6) return "#ffc107";
      if (ph >= 6 && ph < 7) return "#4caf50";
      return "#2196f3";
    },

    drawChart() {
      let data = uni.getStorageSync("drug_ph_records") || [];
      if (data.length === 0) {
        uni.showToast({ title: "暂无数据", icon: "none" });
        return;
      }

      data.sort((a, b) => new Date(a.createTime) - new Date(b.createTime));
      const ctx = uni.createCanvasContext("phCanvas", this);
      const width = 340;
      const height = 300;
      const pad = 40;
      const w = width - pad * 2;
      const h = height - pad * 2;
      const maxPh = 14;

      ctx.clearRect(0, 0, width, height);

      // 坐标轴
      ctx.beginPath();
      ctx.setStrokeStyle("#e0e0e0");
      ctx.moveTo(pad, pad);
      ctx.lineTo(pad, pad + h);
      ctx.lineTo(pad + w, pad + h);
      ctx.stroke();

      // Y轴刻度
      ctx.setFillStyle("#666");
      ctx.setFontSize(12);
      ctx.setTextAlign("right");
      for (let i = 0; i <= maxPh; i += 2) {
        const y = pad + h - (i / maxPh) * h;
        ctx.fillText(i.toString(), pad - 8, y + 4);
      }

      // 计算所有点
      const points = data.map((item, i) => ({
        x: pad + (i / (data.length - 1 || 1)) * w,
        y: pad + h - (Number(item.phValue) / maxPh) * h,
        ph: item.phValue
      }));

      // ======================
      // 分段绘制彩色折线
      // ======================
      ctx.setLineWidth(2.5);
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const color = this.getPhColor(p1.ph);
        ctx.beginPath();
        ctx.setStrokeStyle(color);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // ======================
      // 绘制对应颜色的圆点
      // ======================
      points.forEach(p => {
        const color = this.getPhColor(p.ph);
        ctx.beginPath();
        ctx.setFillStyle(color);
        ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.setStrokeStyle("#fff");
        ctx.setLineWidth(1.5);
        ctx.stroke();
      });

      ctx.draw();
    }
  }
};
</script>

<style scoped>
.container { padding: 30rpx; }
.title { font-size: 36rpx; font-weight: bold; text-align: center; margin-bottom: 30rpx; }
.canvas { width: 680rpx; height: 600rpx; background: #fff; border-radius: 16rpx; margin: 0 auto; }
.legend { margin-top: 30rpx; font-size: 28rpx; line-height: 2; }
.color { display: inline-block; width: 24rpx; height: 24rpx; border-radius: 4rpx; margin-right: 10rpx; vertical-align: middle; }
.yellow { background: #ffc107; }
.green { background: #4caf50; }
.blue { background: #2196f3; }
</style>