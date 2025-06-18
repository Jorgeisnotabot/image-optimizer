const sharp = require("sharp");
const fs = require("fs-extra");
const path = require("path");

const inputDir = "./input";
const outputDir = "./output";

const widths = [800, 1600, 2400]; // For mobile, standard, and retina
const qualitySettings = {
  webp: 95,
  avif: 85,
};

async function optimizeImage(file) {
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const inputPath = path.join(inputDir, file);
  
    for (const width of widths) {
      const baseOutputPath = path.join(outputDir, `${name}-${width}`);
  
      await sharp(inputPath)
        .resize({ width, fit: "inside", kernel: sharp.kernel.lanczos3 })
        .webp({ quality: qualitySettings.webp, effort: 6 }) // visually lossless
        .toFile(`${baseOutputPath}.webp`);
  
      await sharp(inputPath)
        .resize({ width, fit: "inside", kernel: sharp.kernel.lanczos3 })
        .avif({ quality: qualitySettings.avif, effort: 4 }) // high but compressed
        .toFile(`${baseOutputPath}.avif`);
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
  
    console.log("✅ Done! High-quality images saved in /output");
  }
  
  optimizeAll();