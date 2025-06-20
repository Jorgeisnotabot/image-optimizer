const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

const inputDir = "./input";
const outputDir = "./output";

const sizes = [
    { width: 800, height: 770, suffix: "800x770" },      // mobile
    { width: 1200, height: 770, suffix: "1200x770" },    // tablet
    { width: 1600, height: 770, suffix: "1600x770" },    // desktop
    { width: 3200, height: 1540, suffix: "3200x1540" },  // retina
  ];

const qualitySettings = {
  webp: 93,
  avif: 85,
  jpeg: 92,
};

async function optimizeImage(file) {
  const ext = path.extname(file);
  const name = path.basename(file, ext);
  const inputPath = path.join(inputDir, file);

  for (const size of sizes) {
    const { width, height, suffix } = size;
    const baseOutputPath = path.join(outputDir, `${name}-${suffix}`);

    // WEBP
    await sharp(inputPath)
    .resize(width, height, {
        fit: "cover",
        position: "center", // default
        kernel: sharp.kernel.lanczos3,
      })
      .webp({ quality: qualitySettings.webp, effort: 5 })
      .toFile(`${baseOutputPath}.webp`);

    // AVIF
    await sharp(inputPath)
    .resize(width, height, {
        fit: "cover",
        position: "center", // default
        kernel: sharp.kernel.lanczos3,
      })
      .avif({ quality: qualitySettings.avif, effort: 4 })
      .toFile(`${baseOutputPath}.avif`);

    // Optional: JPEG fallback
    await sharp(inputPath)
        .resize(width, height, {
        fit: "cover",
        position: "center", // default
        kernel: sharp.kernel.lanczos3,
      })
      .jpeg({ quality: qualitySettings.jpeg, mozjpeg: true })
      .toFile(`${baseOutputPath}.jpg`);
  }
}

async function optimizeAll() {
  await fs.ensureDir(outputDir);
  const files = await fs.readdir(inputDir);
  const imageFiles = files.filter(file => /\.(jpe?g|png)$/i.test(file));

  for (const file of imageFiles) {
    console.log("Optimizing:", file);
    await optimizeImage(file);
  }

  console.log("✅ Done! Optimized images saved in /output");
}

optimizeAll();