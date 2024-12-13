<template>
    <div>
        <h1>RSS 阅读器</h1>
        <button @click="fetchRssFeed">获取RSS内容</button>
        <ul v-if="rssItems.length">
            <li v-for="item in rssItems" :key="item.link">
                <a :href="item.link" target="_blank">{{ item.title }}</a>
                <p>{{ item.description }}</p>
            </li>
        </ul>
        <p v-else>暂无RSS内容</p>
    </div>
    <img src="http://i0.hdslb.com/bfs/archive/49f62c70f17d0afe00e5e620dd366c68149c780e.jpg" alt="Centered Image">
</template>

<script setup lang="ts">
import { ref } from 'vue'

const rssItems = ref<any[]>([]) // 用于存储RSS数据

const fetchRssFeed = async () => {
    const rssUrl = 'http://120.53.88.192:1200/douyu/room/24422' // 请替换为你自己搭建的RSSHub服务的URL
    try {
        const response = await fetch(rssUrl)
        const xmlText = await response.text()

        // 使用 DOMParser 解析 XML 数据
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml')
        const items = xmlDoc.getElementsByTagName('item')

        // 将 RSS 数据提取并存储到 rssItems 中
        rssItems.value = Array.from(items).map((item: any) => ({
            title: item.getElementsByTagName('title')[0].textContent,
            link: item.getElementsByTagName('link')[0].textContent,
            description: item.getElementsByTagName('description')[0]?.textContent || '无描述'
        }))
    } catch (error) {
        console.error('获取RSS失败:', error)
    }
}
</script>

<style scoped>
button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin: 15px 0;
}

a {
    text-decoration: none;
    color: #007bff;
}

a:hover {
    text-decoration: underline;
}
</style>