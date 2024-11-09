const fs = require('fs-extra');
const path = require('path');

function copyAssets() {
    const from = path.resolve(__dirname, '../../src/assets');
    const to = path.resolve(__dirname, '../../dist/ngx-slider-recaptcha/src/assets');
    fs.copy(from, to);
}

copyAssets();