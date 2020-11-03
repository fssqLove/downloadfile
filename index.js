const http = require('http');
const https = require('https')
const fs = require('fs')
const path = require('path')
const data = require('./data.json')

/**
 * 循环创建目录
 * */
function mkdir(dir) {
    // 判断目录存在
    try {
        const stats = fs.statSync(dir)

        if (stats && stats.isDirectory()) {
            return
        } else {
            return `${dir}冲突`
        }
    } catch (error) {

    }

    //拿到上级路径
    let tempDir = path.parse(dir).dir;
    const status = mkdir(tempDir)
    if (status) {
        return status
    }

    try {
        fs.mkdirSync(dir)
    } catch (error) {
        return error
    }

    return
}

/**
 * 下载页面
 * */
function downLoadFile(url) {
    let hp = http
    if (/^https/.test(url)) {
        hp = https
    }

    return new Promise((resolve, reject) => {
        let cur = 0, timeHandle;
        hp.get(url, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];
            const len = parseInt(res.headers['content-length'], 10);

            let error;
            // 任何 2xx 状态码都表示成功的响应，但是这里只检查 200。
            if (statusCode !== 200) {
                error = new Error(`${url}:请求失败 - 状态码: ${statusCode}`);
            }

            if (error) {
                // 消费响应的数据来释放内存。
                res.resume();
                reject(error.message)
                return;
            }

            res.setEncoding('binary');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; cur += chunk.length });
            res.on('end', () => {
                clearInterval(timeHandle)
                resolve(rawData)
            });

            timeHandle = setInterval(() => {
                console.log(`${url} - progress:${(100.0 * cur / len).toFixed(2)}%`)
            }, 3000)
        }).on('error', (e) => {
            clearInterval(timeHandle)
            reject(`出现错误: ${e.message}`)
        });
    })
}


/**
 * 保存文件
 * */
function saveFile(filePath, resData) {
    return new Promise((resolve, reject) => {
        // 循环创建目录
        const dir = path.parse(filePath).dir;
        const status = mkdir(dir)
        if (status) {
            reject(status)
            return
        }

        // 写入文件
        fs.writeFile(filePath, resData, 'binary', (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}



for (const [k, v] of data) {
    const filePath = path.join(__dirname, `libs/${k}`)

    const err = mkdir(path.parse(filePath).dir)
    if (err) {
        console.error(k, err)
        return
    }

    downLoadFile(v)
        .then(res => {
            return saveFile(filePath, res)
        })
        .then(() => {
            console.log(k, 'success')
        })
        .catch(err => {
            console.log(k, err)
        })
}