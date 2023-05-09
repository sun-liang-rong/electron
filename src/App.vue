<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
const xiabanTemplate = ref<String>("");
const time = reactive({
  year: "00",
  month: "00",
  day: "00",
  hour: "00",
  minute: "00",
  second: "00",
});
onMounted(() => {
  (function clock() {
    var canvas = document.getElementById("canvas") as HTMLCanvasElement
    let ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
    var now = new Date(),
      sec = now.getSeconds(),
      min = now.getMinutes(),
      hr = now.getHours();
    hr = hr > 12 ? hr - 12 : hr;

    //绘制表盘底色
    ctx.save();
    ctx.clearRect(0, 0, 160, 160);
    ctx.translate(80, 80);
    ctx.rotate(-Math.PI / 2); //将坐标轴逆时针旋转90度，x轴正方向对准12点方向
    var lingrad = ctx.createLinearGradient(75, 0, -75, 0);
    lingrad.addColorStop(0, "#242f37");
    lingrad.addColorStop(1, "#48585c");
    ctx.fillStyle = lingrad;
    ctx.beginPath();
    ctx.arc(0, 0, 75, 0, Math.PI * 2, true);
    ctx.fill();

    //小时刻度
    ctx.save();
    for (var i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.rotate(Math.PI / 6);
      ctx.moveTo(70, 0);
      ctx.lineTo(60, 0);
      ctx.stroke();
    }
    ctx.restore();

    //分钟刻度
    ctx.save();
    ctx.beginPath();
    for (i = 0; i < 60; i++) {
      if (i % 5 !== 0) {
        ctx.beginPath();
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 2;
        ctx.moveTo(70, 0);
        ctx.lineTo(65, 0);
        ctx.stroke();
      }
      ctx.rotate(Math.PI / 30);
    }
    ctx.restore();

    //时间文字
    ctx.save();
    ctx.rotate(Math.PI / 2);
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.font = "14px Microsoft yahei";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("3", 50, 0);
    ctx.fillText("6", 0, 50);
    ctx.fillText("9", -50, 0);
    ctx.fillText("12", 0, -50);
    ctx.restore();

    //时针
    ctx.save();
    ctx.rotate(
      hr * (Math.PI / 6) + min * (Math.PI / 360) + sec * (Math.PI / 21600)
    );
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(40, 0);
    ctx.stroke();

    ctx.fillStyle = "#FA016D";
    ctx.arc(37, 0, 3, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();

    //分针
    ctx.save();
    ctx.rotate(min * (Math.PI / 30) + sec * (Math.PI / 1800));
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(60, 0);
    ctx.stroke();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#34434c";
    ctx.beginPath();
    ctx.moveTo(65, 0);
    ctx.lineTo(50, 0);
    ctx.stroke();
    ctx.restore();

    //秒针
    ctx.save();
    ctx.rotate(sec * (Math.PI / 30));
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#F55555";
    ctx.moveTo(0, 0);
    ctx.lineTo(70, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#F55555";
    ctx.moveTo(0, 0);
    ctx.lineTo(-38, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.arc(0, 0, 15, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = "#F55555";
    ctx.lineWidth = 1;
    ctx.arc(0, 0, 8, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.restore();

    //边框
    ctx.beginPath();
    ctx.lineWidth = 7;
    var lingrad2 = ctx.createLinearGradient(150, 0, -150, 0);
    lingrad2.addColorStop(0, "#FFF6B7");
    lingrad2.addColorStop(1, "#F6416C");
    ctx.strokeStyle = lingrad2;
    ctx.arc(0, 0, 74, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.restore();

    window.requestAnimationFrame(clock);
  })();
});
const getCurrentTime = () => {
  const now = new Date();
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  time.day = day;
  time.hour = hour;
  time.minute = minute;
  time.month = month;
  time.second = second;
  time.year = year;
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};
const countdown = () => {
  const now = new Date();
  const targetTime = new Date(now);
  if (now.getHours() >= 18 || now.getHours() < 9 || (now.getHours() == 9 && now.getMinutes() < 30)) {
    // 如果当前时间已经过了下班时间，或者还没到上班时间9:30
    targetTime.setDate(targetTime.getDate() + 1); // 将目标时间设置为明天
    targetTime.setHours(9, 30, 0, 0); // 设置目标时间为明天上午九点半
    xiabanTemplate.value = `距离上班还有${formatTime(targetTime, now)}`;
  } else {
    // 如果当前时间在下班时间之前
    targetTime.setHours(18, 30, 0, 0); // 设置目标时间为今天下午六点半
    xiabanTemplate.value = `距离下班还有${formatTime(targetTime, now)}`;
  }
};

const formatTime = (targetTime: any, now: any) => {
  const diff = targetTime.getTime() - now.getTime(); // 计算相差的毫秒数
  const hours = Math.floor(diff / (1000 * 60 * 60)); // 计算相差的小时数
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // 计算相差的分钟数
  const seconds = Math.floor((diff % (1000 * 60)) / 1000); // 计算相差的秒数
  return `${hours}小时${minutes}分钟${seconds}秒`;
};
setInterval(() => {
  getCurrentTime();
  countdown();
}, 1000);
</script>

<template>
  <div class="box">
    <div class="title">摸摸鱼</div>
    <div class="time-number">
      现在是{{ time.year }} - {{ time.month }} - {{ time.day }}
      {{ time.hour }} : {{ time.minute }} : {{ time.second }}
    </div>
    <div class="goto-home">{{ xiabanTemplate }} </div>
    <div>
      <canvas id="canvas" width="160" height="160"></canvas>
    </div>
  </div>
</template>

<style scoped>
.box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-image: linear-gradient( 135deg, #FFF3B0 10%, #CA26FF 100%);
  /* align-items: space-evenly; */
  justify-content: space-evenly;
}
.title {
  width: 100%;
  height: 36px;
  text-align: center;
  font-size: 36px;
  line-height: 36px;
  background: linear-gradient(to bottom, #da24b5, #6d6d86);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.time-number {
  width: 100%;
  height: 20px;
  text-align: center;
  font-size: 18px;
  line-height: 20px;
  background: linear-gradient(to bottom, #ef2207, #01acfb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.goto-home {
  margin: 0 auto;
  font-size: 18px;
  font-family: "Arial", sans-serif;
  text-align: center;
  color: #333;
  overflow: hidden; /* 隐藏文本溢出部分 */
  border-right: 2px solid #333; /* 添加光标效果 */
  white-space: nowrap; /* 禁止换行 */
  letter-spacing: 2px; /* 设置字符间距 */
  animation: typing 5s steps(20) infinite;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
</style>
