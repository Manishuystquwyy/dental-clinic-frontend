import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const jobs = [
  { input: 'public/images/dental-clinic-hero.jpg', output: 'public/images/dental-clinic-hero.webp', width: 2200, quality: 82 },
  ...Array.from({ length: 12 }, (_, i) => ({
    input: `public/images/service${i + 1}.png`,
    output: `public/images/service${i + 1}.webp`,
    width: 960,
    quality: 82,
  })),
  { input: 'src/assets/logo.png', output: 'src/assets/logo.webp', width: 360, quality: 76 },
]

for (const job of jobs) {
  const transformer = sharp(job.input)
    .rotate()
    .resize({ width: job.width, withoutEnlargement: true })

  await transformer.webp({ quality: job.quality, effort: 6 }).toFile(job.output)

  const before = fs.statSync(job.input).size
  const after = fs.statSync(job.output).size
  const savings = (((before - after) / before) * 100).toFixed(1)

  console.log(
    `${path.basename(job.input)} -> ${path.basename(job.output)} | ${before} -> ${after} bytes | ${savings}% smaller`,
  )
}

await sharp('src/assets/logo.png')
  .extract({ left: 85, top: 70, width: 1084, height: 1084 })
  .resize({
    width: 256,
    height: 256,
    fit: 'cover',
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  })
  .webp({ quality: 82, effort: 6 })
  .toFile('src/assets/logo-mark.webp')

const markBefore = fs.statSync('src/assets/logo.png').size
const markAfter = fs.statSync('src/assets/logo-mark.webp').size
const markSavings = (((markBefore - markAfter) / markBefore) * 100).toFixed(1)

console.log(
  `logo.png -> logo-mark.webp | ${markBefore} -> ${markAfter} bytes | ${markSavings}% smaller`,
)
