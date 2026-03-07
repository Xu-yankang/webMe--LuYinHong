const https = require('https')
const fs = require('fs')
const path = require('path')

function fetchBingImages() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.bing.com',
      port: 443,
      path: '/HPImageArchive.aspx?format=js&idx=0&n=8',
      method: 'GET'
    }

    console.log('正在获取Bing壁纸数据...')

    const req = https.request(options, bing_res => {
      const chunks = [];
      bing_res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      bing_res.on('end', () => {
        try {
          const bing_data = Buffer.concat(chunks).toString();
          const data = JSON.parse(bing_data);
          const img_url = data.images.map(img => img.url);
          const jsonpStr = "getBingImages(" + JSON.stringify(img_url) + ")";
          const filePath = path.join(__dirname, '../assets/json/images.json');
          
          fs.writeFile(filePath, jsonpStr, (err) => {
            if (err) {
              console.error('保存Bing壁纸数据失败:', err);
              reject(err);
            } else {
              console.log("Bing壁纸数据已更新: " + new Date().toLocaleString());
              console.log("获取到 " + img_url.length + " 张壁纸");
              img_url.forEach((url, i) => {
                console.log(`  ${i + 1}. ${url.split('?')[0]}`);
              });
              resolve(img_url);
            }
          });
        } catch (error) {
          console.error('解析Bing数据失败:', error);
          reject(error);
        }
      });
    })

    req.on('error', error => {
      console.error('请求Bing API失败:', error);
      reject(error);
    })

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.end()
  })
}

fetchBingImages()
  .then(() => {
    console.log('更新完成！');
    process.exit(0);
  })
  .catch(err => {
    console.error('更新失败:', err.message);
    process.exit(1);
  });
