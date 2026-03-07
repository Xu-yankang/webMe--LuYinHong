/**
 * main.js - 网站主脚本文件
 * 包含网站的核心功能，如签名显示、头像随机、背景图片加载等
 */

// 全局变量
let customSignatures = [];

/**
 * 获取座右铭
 * @param {Array} mottoData - 座右铭数据
 */
function getMotto(mottoData) {
    const mottoElement = document.getElementById('motto');
    if (mottoElement && mottoData && mottoData.length > 0) {
        mottoElement.textContent = mottoData[0].content || '';
    }
}

/**
 * 获取自定义签名列表
 * @param {Array} signatures - 签名列表
 */
function getCustomSignatures(signatures) {
    customSignatures = signatures;
    showRandomSignature();
}

/**
 * 显示随机签名
 */
function showRandomSignature() {
    const descElement = document.getElementById('description');
    
    if (descElement && customSignatures.length > 0) {
        const randomSignature = getRandomSignature();
        const textNode = document.createTextNode(randomSignature.content);
        
        descElement.innerHTML = '';
        descElement.appendChild(textNode);
        
        if (randomSignature.author && randomSignature.author.trim() !== '') {
            const br = document.createElement('br');
            const fromText = document.createTextNode(' -「');
            const strong = document.createElement('strong');
            strong.textContent = randomSignature.author;
            const endText = document.createTextNode('」');
            
            descElement.appendChild(br);
            descElement.appendChild(fromText);
            descElement.appendChild(strong);
            descElement.appendChild(endText);
        }
    }
}

/**
 * 页面元素动画工具
 */
const iUp = (function () {
    let time = 0;
    const duration = 150;
    
    const clean = () => {
        time = 0;
    };
    
    const up = (element) => {
        setTimeout(() => {
            element.classList.add("up");
        }, time);
        time += duration;
    };
    
    const down = (element) => {
        element.classList.remove("up");
    };
    
    const toggle = (element) => {
        setTimeout(() => {
            element.classList.toggle("up");
        }, time);
        time += duration;
    };
    
    return {
        clean,
        up,
        down,
        toggle
    };
})();

// BING图片URL模式
const BING_IMAGE_URL_PATTERN = /^\/th\?id=OHR\.[a-zA-Z0-9_\-]+\.jpg(&[a-zA-Z0-9=._\-]+)*$/;

/**
 * 加载Bing背景图片
 * @param {Array} imgUrls - 图片URL列表
 */
function getBingImages(imgUrls) {
    const panel = document.querySelector('#panel');
    if (!panel || !imgUrls || !Array.isArray(imgUrls) || imgUrls.length === 0) {
        return;
    }
    
    const indexName = "bing-image-index";
    let index = parseInt(sessionStorage.getItem(indexName), 10);
    const maxIndex = imgUrls.length - 1;
    
    if (isNaN(index) || index > maxIndex) {
        index = 0;
    } else {
        index++;
        if (index > maxIndex) {
            index = 0;
        }
    }
    
    const imgUrl = imgUrls[index];
    if (!imgUrl || typeof imgUrl !== 'string' || !imgUrl.match(BING_IMAGE_URL_PATTERN)) {
        return;
    }
    
    const url = "https://www.cn.bing.com" + imgUrl;
    panel.style.backgroundImage = `url('${url.replace(/['\\]/g, '\\$&')}')`;
    panel.style.backgroundPosition = "center center";
    panel.style.backgroundRepeat = "no-repeat";
    panel.style.backgroundColor = "#666";
    panel.style.backgroundSize = "cover";
    sessionStorage.setItem(indexName, index);
}

/**
 * 解密邮件地址
 * @param {string} encoded - 加密的邮件地址
 */
function decryptEmail(encoded) {
    const address = atob(encoded);
    window.location.href = `mailto:${address}`;
}

/**
 * 获取随机签名
 * @returns {Object} 随机签名对象
 */
function getRandomSignature() {
    const randomIndex = Math.floor(Math.random() * customSignatures.length);
    return customSignatures[randomIndex];
}

/**
 * 随机头像函数
 */
function randomAvatar() {
    // 头像图片路径列表
    const avatarImages = [
        './assets/img/myself/01.png',
        './assets/img/myself/02.png',
        './assets/img/myself/03.jpg'
    ];

    const avatar = document.getElementById('avatar');
    if (avatar) {
        if (avatarImages.length > 0) {
            const randomIndex = Math.floor(Math.random() * avatarImages.length);
            const randomImage = avatarImages[randomIndex];
            avatar.src = randomImage;
            avatar.alt = '随机头像';
        } else {
            avatar.src = './assets/img/myself/01.png';
            avatar.alt = '默认头像';
        }
    }
}



// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 初始化页面元素动画
    const iUpElements = document.querySelectorAll(".iUp");
    iUpElements.forEach(element => {
        iUp.up(element);
    });

    // 加载随机头像
    randomAvatar();

    // 头像加载完成后添加显示类
    const avatarElement = document.querySelector(".js-avatar");
    if (avatarElement) {
        avatarElement.addEventListener('load', function () {
            avatarElement.classList.add("show");
        });
    }

    // 初始化移动端菜单
    const btnMobileMenu = document.querySelector('.btn-mobile-menu__icon');
    const navigationWrapper = document.querySelector('.navigation-wrapper');

    if (btnMobileMenu && navigationWrapper) {
        btnMobileMenu.addEventListener('click', function () {
            const isVisible = navigationWrapper.classList.contains('visible');
            
            function handleAnimationEnd() {
                navigationWrapper.classList.remove('visible', 'animated', 'bounceOutUp');
                navigationWrapper.removeEventListener('animationend', handleAnimationEnd);
            }
            
            if (isVisible) {
                navigationWrapper.addEventListener('animationend', handleAnimationEnd);
                navigationWrapper.classList.remove('bounceInDown');
                navigationWrapper.classList.add('animated', 'bounceOutUp');
            } else {
                navigationWrapper.classList.add('visible', 'animated', 'bounceInDown');
            }
            
            btnMobileMenu.classList.toggle('icon-list');
            btnMobileMenu.classList.toggle('icon-angleup');
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const emailToggleBtn = document.querySelector('.email-toggle-btn');
    const emailExpandPanel = document.querySelector('.email-expand-panel');
    
    if (emailToggleBtn && emailExpandPanel) {
        emailToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            emailExpandPanel.classList.toggle('show');
        });
    }
});

function toggleBlogPopup() {
    const popup = document.getElementById('blogPopup');
    const overlay = document.getElementById('blogPopupOverlay');
    if (popup && overlay) {
        popup.classList.toggle('show');
        overlay.classList.toggle('show');
    }
}

function closeBlogPopup() {
    const popup = document.getElementById('blogPopup');
    const overlay = document.getElementById('blogPopupOverlay');
    if (popup && overlay) {
        popup.classList.remove('show');
        overlay.classList.remove('show');
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeBlogPopup();
    }
});