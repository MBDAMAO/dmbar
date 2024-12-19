<template>
    <div class="settings-container">
        <!-- 页面标题 -->
        <h1 class="settings-title">Settings</h1>

        <!-- 设置分组 -->
        <div class="settings-group">
            <h2 class="settings-group-title">General</h2>
            <div class="settings-item" @click="onNavigate('account')">
                <span>Account</span>
                <span class="settings-item-right">&gt;</span>
            </div>
            <div class="settings-item" @click="onNavigate('notifications')">
                <span>Notifications</span>
                <span class="settings-item-right">&gt;</span>
            </div>
        </div>

        <div class="settings-group">
            <h2 class="settings-group-title">Preferences</h2>
            <div class="settings-item" @click="onNavigate('theme')">
                <span>Theme</span>
                <span class="settings-item-right">&gt;</span>
            </div>
            <div class="settings-item" @click="onNavigate('language')">
                <span>Language</span>
                <span class="settings-item-right">&gt;</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
function onNavigate(page: string) {
    console.log(`Navigate to ${page}`); // 模拟导航，可以替换为实际逻辑
}
</script>

<style scoped>
/* 整体容器 */
.settings-container {
    padding: 24px;
    background-color: #0d1117;
    /* GitHub 深色背景 */
    color: #c9d1d9;
    /* GitHub 文本颜色 */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    min-height: 100vh;
    box-sizing: border-box;
}

/* 标题样式 */
.settings-title {
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 24px;
}

/* 设置分组 */
.settings-group {
    margin-bottom: 32px;
}

/* 分组标题 */
.settings-group-title {
    font-size: 18px;
    font-weight: 600;
    color: #8b949e;
    margin-bottom: 16px;
}

/* 设置项 */
.settings-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background-color: #161b22;
    /* GitHub 卡片背景 */
    border: 1px solid #30363d;
    /* 边框颜色 */
    border-radius: 6px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: background-color 0.2s, box-shadow 0.2s;
}

.settings-item:hover {
    background-color: #21262d;
    /* 悬停时更浅的深色 */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    /* 轻微阴影 */
}

/* 右侧箭头 */
.settings-item-right {
    font-size: 16px;
    color: #8b949e;
}
</style>