const fs = require('fs');
const path = require('path');

// 图片文件夹路径
const IMAGE_DIR = path.join(__dirname, 'assets', 'img', 'myself');
// main.js文件路径
const MAIN_JS = path.join(__dirname, 'assets', 'js', 'main.js');
// 排除的文件夹
const EXCLUDED_DIRS = ['原图'];
// 支持的图片格式
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// 读取图片文件夹
function readImages(dir) {
    const images = [];
    
    try {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                // 排除指定文件夹
                if (!EXCLUDED_DIRS.includes(file)) {
                    // 递归读取子文件夹
                    const subImages = readImages(filePath);
                    images.push(...subImages);
                }
            } else if (stat.isFile()) {
                // 检查文件扩展名是否为支持的图片格式
                const ext = path.extname(file).toLowerCase();
                if (SUPPORTED_FORMATS.includes(ext)) {
                    // 生成相对路径
                    const relativePath = './assets/img/myself/' + file;
                    images.push(relativePath);
                }
            }
        });
    } catch (error) {
        console.error('读取图片文件夹出错:', error);
    }
    
    return images;
}

// 更新main.js中的图片列表
function updateMainJs() {
    const images = readImages(IMAGE_DIR);
    
    // 读取main.js文件内容
    let jsContent;
    try {
        jsContent = fs.readFileSync(MAIN_JS, 'utf8');
    } catch (error) {
        console.error('读取main.js文件出错:', error);
        return;
    }
    
    // 构建新的图片列表数组字符串
    const imagesArrayStr = images.map(img => `        '${img}'`).join(',\n');
    
    // 构建新的图片列表代码块
    const newImagesArrayCode = `    // 头像图片路径列表
    const avatarImages = [
${imagesArrayStr}
    ];`;
    
    // 找到图片列表代码块的开始和结束位置
    const startMarker = '    // 头像图片路径列表';
    const endMarker = '    ];';
    
    const startIndex = jsContent.indexOf(startMarker);
    if (startIndex === -1) {
        console.error('未找到图片列表代码块的开始标记！');
        return;
    }
    
    const endIndex = jsContent.indexOf(endMarker, startIndex) + endMarker.length;
    if (endIndex === -1) {
        console.error('未找到图片列表代码块的结束标记！');
        return;
    }
    
    // 替换旧的图片列表代码块
    const updatedJsContent = jsContent.substring(0, startIndex) + 
                              newImagesArrayCode + 
                              jsContent.substring(endIndex);
    
    // 保存更新后的main.js文件
    try {
        fs.writeFileSync(MAIN_JS, updatedJsContent, 'utf8');
        console.log('成功更新main.js中的图片列表！');
        console.log(`共找到 ${images.length} 张图片:`);
        images.forEach((img, index) => {
            console.log(`${index + 1}. ${img}`);
        });
    } catch (error) {
        console.error('保存main.js文件出错:', error);
    }
}

// 运行脚本
updateMainJs();