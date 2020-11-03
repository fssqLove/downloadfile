# 下载网络资源包并保存到对应路径

## 使用方法

+ 1.打开data.json 配置包 **相对路径** 和对应的 **网络下载地址**  例如:

```script
[
    [
        "vue/2.6.12/vue.min.js", // **包相对路劲**
        "https://cdn.bootcdn.net/ajax/libs/vue/2.6.12/vue.min.js" // **文件下载地址**
    ],
    [
        "vuex/3.5.1/vuex.min.js",
        "https://cdn.bootcdn.net/ajax/libs/vuex/3.5.1/vuex.min.js"
    ],
    [
        "element-ui/2.14.0/index.min.js",
        "https://cdn.bootcdn.net/ajax/libs/element-ui/2.14.0/index.min.js"
    ]
]
```

+ 2.运行`node .\index.js` 开始下载

+ 3.下载成功

```script
vuex/3.5.1/vuex.min.js success
vue/2.6.12/vue.min.js success
element-ui/2.14.0/index.min.js success
```