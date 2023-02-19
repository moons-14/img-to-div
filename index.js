const fs = require('fs');
const Jimp = require('jimp');
const startTime = performance.now();
// 画像ファイルのパス
const imagePath = 'test.jpg';

// 画像を読み込む
Jimp.read(imagePath, function (err, image) {
  if (err) throw err;

  // 画像の幅と高さを取得
  const width = image.bitmap.width;
  const height = image.bitmap.height;

  // ピクセルの色情報を格納する配列
  const pixels = [];
  const hexCunt = [];


  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelColor = Jimp.intToRGBA(image.getPixelColor(x, y));
      const hex = rgba2hex(`rgba(${pixelColor.r},${pixelColor.g},${pixelColor.b})`).slice( 0, -2 )
      hexCunt.push(hex)
    }
  }
  const uniqueHex = Array.from(new Set(hexCunt));
  const hexObj = {};
  uniqueHex.map((un, _v) => {
    hexObj[un] = _v;
  })
  console.log("Unique Complete")

  // 画像のピクセルを1つずつ処理する
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      // ピクセルの色情報を取得
      const pixelColor = Jimp.intToRGBA(image.getPixelColor(x, y));
      const tag = hexObj[rgba2hex(`rgba(${pixelColor.r},${pixelColor.g},${pixelColor.b})`).slice( 0, -2 )]
      // 配列に格納
      row.push(`<i${tag}></i${tag}>`);
    }
    pixels.push(`<l>` + row.join("") + `</l>`);
    console.log((y + 1) / height * 100 + "%")
  }

  const html = `<html><head><meta charset="UTF-8" /><title></title><style>l *{width:1px;height:1px}l{display:flex}${uniqueHex.map((un, _v) => { return `i${_v}{background:#${un}}` }).join("")}</style></head><body>${pixels.join("")}</body></html>`;

  // ピクセルの色情報をファイルに保存
  fs.writeFile('pixels.html', html, function (err) {
    if (err) throw err;
    console.log('Done!');
    const endTime = performance.now();
    console.log(endTime - startTime);
    console.log(uniqueHex.length)
  });
});



function rgba2hex(orig) {
  var a, isPercent,
    rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
    alpha = (rgb && rgb[4] || "").trim(),
    hex = rgb ?
      (rgb[1] | 1 << 8).toString(16).slice(1) +
      (rgb[2] | 1 << 8).toString(16).slice(1) +
      (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

  if (alpha !== "") {
    a = alpha;
  } else {
    a = 01;
  }
  // multiply before convert to HEX
  a = ((a * 255) | 1 << 8).toString(16).slice(1)
  hex = hex + a;

  return hex;
}
