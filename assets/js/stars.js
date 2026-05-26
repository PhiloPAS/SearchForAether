const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
const crosshair = document.getElementById("crosshair");
const pointer = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  nx: 0,
  ny: 0
};

let stars = [];

function resizeStars() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.min(260, Math.floor((window.innerWidth * window.innerHeight) / 6200));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    z: Math.random() * .9 + .1,
    speed: Math.random() * .42 + .08,
    size: Math.random() * 1.9 + .4,
    angle: Math.random() * Math.PI * 2
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const star of stars) {
    const pullX = (pointer.x - star.x) * .0009 * star.z;
    const pullY = (pointer.y - star.y) * .0009 * star.z;
    const driftX = pointer.nx * .42 * star.z;

    star.angle += .004 * star.z;
    star.x += pullX + driftX + Math.cos(star.angle) * .025;
    star.y += pullY + star.speed + pointer.ny * .12 * star.z;

    if (star.y > window.innerHeight + 16) {
      star.y = -16;
      star.x = Math.random() * window.innerWidth;
    }

    if (star.x > window.innerWidth + 16) star.x = -16;
    if (star.x < -16) star.x = window.innerWidth + 16;

    const distance = Math.hypot(pointer.x - star.x, pointer.y - star.y);
    const near = Math.max(0, 1 - distance / 240);
    const alpha = .22 + star.z * .58 + near * .22;
    const radius = star.size * star.z + near * 1.4;

    ctx.beginPath();
    ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232, 250, 255, ${alpha})`;
    ctx.fill();

    if (star.z > .68 || near > .55) {
      ctx.beginPath();
      ctx.moveTo(star.x - pointer.nx * 10, star.y - 8 - pointer.ny * 4);
      ctx.lineTo(star.x, star.y);
      ctx.strokeStyle = `rgba(105, 231, 255, ${.08 + star.z * .12 + near * .16})`;
      ctx.lineWidth = .7 + near;
      ctx.stroke();
    }
  }

  requestAnimationFrame(drawStars);
}

function movePointer(event) {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.nx = (event.clientX / window.innerWidth - .5) * 2;
  pointer.ny = (event.clientY / window.innerHeight - .5) * 2;

  document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);

  if (crosshair) {
    crosshair.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  }
}

window.addEventListener("resize", resizeStars);
window.addEventListener("pointermove", movePointer);

resizeStars();
drawStars();
