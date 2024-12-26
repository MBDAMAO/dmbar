<template>
    <div class="ripple-effect" @click="handleClick">
        长按或点击我
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue';

const ripple = ref(null);

const handleClick = (event) => {
    // 创建涟漪效果的元素
    const span = document.createElement('span');
    span.style.left = `${event.offsetX}px`;
    span.style.top = `${event.offsetY}px`;
    span.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
    span.style.width = '50px';
    span.style.height = '50px';
    span.style.borderRadius = '50%';
    span.style.position = 'absolute';
    span.style.transform = 'translate(-50%, -50%)';
    span.style.opacity = '1';
    span.style.transition = 'opacity 1s, transform 1s';

    // 添加动画效果
    const animation = document.createAttribute('style');
    animation.value = `
      @keyframes ripple {
        from {
          transform: translate(-50%, -50%) scale(0);
          opacity: 1;
        }
        to {
          transform: translate(-50%, -50%) scale(10);
          opacity: 0;
        }
      }
    `;
    span.setAttributeNode(animation);

    // 将涟漪效果添加到容器中
    ripple.value.appendChild(span);

    // 移除涟漪效果
    setTimeout(() => {
        span.remove();
    }, 1000);
};
</script>

<style scoped>
.ripple-effect {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    height: 60px;
    width: 100%;
    background-color: #3c1818;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #333;
    font-size: 16px;
}

.ripple-effect span {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.2);
    pointer-events: none;
}

/* 涟漪动画 */
@keyframes ripple {
    from {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
    }

    to {
        transform: translate(-50%, -50%) scale(10);
        opacity: 0;
    }
}
</style>