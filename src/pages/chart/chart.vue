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
    // 根据 PH 值获取对应颜色
    getPhColor(ph) {
      ph = Number(ph);
      if (ph < 6) return "#ffc107";    // 黄色
      if (ph >= 6 && ph < 7) return "#4caf50"; // 绿色
      return "#2196f3";               // 蓝色
    },

    drawChart() {
      let data = uni.getStorageSync("drug_ph_records") || [];
      
      if (data.length === 0) {
        uni.showToast({ title: "暂无数据", icon: "none" });
        return;
      }

      // 按时间正序
      data.sort((a, b) => new Date(a.createTime) - new Date(b.createTime));

      const ctx = uni.createCanvasContext("phCanvas", this);
      const width = 340;
      const height = 300;
      const pad = 40;
      const w = width - pad * 2;
      const h = height - pad * 2;
      const maxPh = 14;

      // 清空画布
      ctx.clearRect(0, 0, width, height);

      // --- 1. 绘制坐标轴 ---
      ctx.beginPath();
      ctx.setStrokeStyle("#e0e0e0");
      ctx.setLineWidth(1);
      // Y轴 (左侧竖线)
      ctx.moveTo(pad, pad);
      ctx.lineTo(pad, pad + h);
      // X轴 (底部横线)
      ctx.lineTo(pad + w, pad + h);
      ctx.stroke();

      // --- 2. 绘制 Y 轴刻度 (PH 0~14) ---
      ctx.setFillStyle("#666");
      ctx.setFontSize(12);
      ctx.setTextAlign("right");
      for (let i = 0; i <= maxPh; i += 2) {
        const y = pad + h - (i / maxPh) * h;
        ctx.fillText(i.toString(), pad - 8, y + 4);
        // 刻度小横线
        ctx.beginPath();
        ctx.setStrokeStyle("#e0e0e0");
        ctx.moveTo(pad - 5, y);
        ctx.lineTo(pad, y);
        ctx.stroke();
      }

      // --- 3. 绘制 X 轴刻度 (时间标签) ---
      const times = data.map(item => item.createTime.slice(5, 16)); // MM-DD HH:mm
      ctx.setTextAlign("center");
      ctx.setFontSize(10);
      const step = Math.max(1, Math.ceil(data.length / 5));
      data.forEach((item, i) => {
        if (i % step === 0 || i === data.length - 1) {
          const x = pad + (i / (data.length - 1 || 1)) * w;
          ctx.fillText(times[i], x, pad + h + 20);
        }
      });

      // --- 4. 绘制折线（统一蓝色） ---
      const points = data.map((item, i) => ({
        x: pad + (i / (data.length - 1 || 1)) * w,
        y: pad + h - (Number(item.phValue) / maxPh) * h,
        ph: item.phValue
      }));

      ctx.beginPath();
      ctx.setStrokeStyle("#2196F3");
      ctx.setLineWidth(2.5);
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // --- 5. 绘制数据点（按 PH 颜色区分） ---
      points.forEach(p => {
        const color = this.getPhColor(p.ph);
        ctx.beginPath();
        ctx.setFillStyle(color);
        ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
        ctx.fill();
        // 白色外圈
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
.container {
  padding: 30rpx;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}
.canvas {
  width: 680rpx;
  height: 600rpx;
  background: #fff;
  border-radius: 16rpx;
  margin: 0 auto;
}
.legend {
  margin-top: 30rpx;
  font-size: 28rpx;
  line-height: 2;
}
.color {
  display: inline-block;
  width: 24rpx;
  height: 24rpx;
  border-radius: 4rpx;
  margin-right: 10rpx;
  vertical-align: middle;
}
.yellow { background: #ffc107; }
.green { background: #4caf50; }
.blue { background: #2196f3; }
</style>