// src/directives/ripple.ts
import { Directive, DirectiveBinding } from "vue";

const rippleDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    let pressTimer: any;
    let isLongPress = false;

    const addRipple = (event: MouseEvent) => {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");

      // 获取元素的尺寸
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);

      // 计算点击位置相对于元素的坐标
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;

      // 设置涟漪的样式
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      // 设置背景色
      // if (binding.value && binding.value.color) {
      //   ripple.style.backgroundColor = binding.value.color;
      // } else {
      //   ripple.style.backgroundColor = "rgba(255,255,255,0.6)";
      // }

      // 添加到元素中
      el.appendChild(ripple);

      // 动画结束时移除涟漪
      ripple.addEventListener(
        "animationend",
        () => {
          el.removeChild(ripple);
        },
        { once: true }
      );
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!isLongPress) {
        addRipple(event);
      }
      isLongPress = false;
    };

    const handleLongPress = (event: MouseEvent) => {
      isLongPress = true;
      addRipple(event);
    };

    el.addEventListener("mousedown", (event: MouseEvent) => {
      pressTimer = setTimeout(() => {
        handleLongPress(event);
      }, 500); // 调整长按时间
    });

    el.addEventListener("mouseup", (event: MouseEvent) => {
      clearTimeout(pressTimer);
      handleMouseUp(event);
    });

    el.addEventListener("mouseleave", () => {
      clearTimeout(pressTimer);
      isLongPress = false;
    });
  },
};

export default rippleDirective;
