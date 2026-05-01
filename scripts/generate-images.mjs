import { GoogleGenAI } from '@google/genai';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public', 'auto');

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!API_KEY) {
  console.error('Missing GOOGLE_GENERATIVE_AI_API_KEY in environment');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const STYLE_SUFFIX = 'Professional photography, high resolution, clean modern aesthetic, warm natural lighting, commercial quality. Do NOT include any text, logos, watermarks, labels, or branding overlays in the image.';

const HERO_STYLE = 'Cinematic editorial photography, 16:9 widescreen composition with strong horizontal framing, ' +
  'soft natural light, warm color grade, shallow depth of field, premium financial-services aesthetic. ' +
  'Subject placed off-center with negative space on one side so darker overlays read cleanly. ' +
  'Absolutely no text, logos, watermarks, captions, signage, license plates, or readable writing of any kind. ' +
  'Photorealistic, ultra-detailed, no illustration, no CGI look.';

const images = [
  // Service images
  {
    filename: 'svc-auto-refinance.jpg',
    prompt: `A sleek modern sedan parked inside a bright, luxurious car dealership showroom. Polished floors reflecting the car. Clean, aspirational setting suggesting auto financing and refinancing. ${STYLE_SUFFIX}`,
  },
  {
    filename: 'svc-vehicle-coverage.jpg',
    prompt: `A luxury SUV being inspected by a professional technician in a modern, well-lit auto service bay. Diagnostic equipment visible. Clean environment conveying vehicle protection and coverage. ${STYLE_SUFFIX}`,
  },
  {
    filename: 'hero-home-refinance-v2.webp',
    prompt: `Cinematic editorial real-estate photography of a stunning modern two-story home with warm amber interior light glowing through large floor-to-ceiling windows at deep blue hour. The house sits in the right two-thirds of the frame, its driveway and a manicured lawn with stately trees curving toward the camera. The LEFT THIRD of the frame is dark, atmospheric sky and silhouetted foliage, deeply shadowed for white headline overlay text. Subtle mist hangs in the air, soft volumetric light spills from windows onto the lawn. ARRI Alexa look, Roger Deakins style cinematography, anamorphic 35mm lens, ultra high detail, photorealistic. Home refinancing and equity concept. ${HERO_STYLE}`,
  },
  {
    filename: 'hero-auto-insurance-v2.webp',
    prompt: `Cinematic automotive editorial photography of a sleek unbranded charcoal-gray sedan, three-quarter front view, parked on a wet glossy driveway under a modern glass-roofed carport during a soft rain at twilight. The car sits in the right two-thirds of the frame, headlights catching the rain droplets, polished hood beaded with water. The LEFT THIRD is dark stormy sky and falling rain, rendered as moody negative space for white headline overlay. The grille and front end are completely plain — NO manufacturer logo, NO badge, NO emblem of any kind, just smooth horizontal mesh. ARRI Alexa look, anamorphic widescreen, dramatic falloff, ultra high detail, photorealistic. Auto insurance coverage and protection concept. ${HERO_STYLE}`,
  },
  {
    filename: 'hero-life-insurance-v2.webp',
    prompt: `Cinematic editorial portrait of a young family — two parents and a small child — walking hand in hand away from camera down a tree-lined park path at golden hour, framed in the right two-thirds of the composition. Long warm shadows stretch across the path, sun flares wrap around the parents, soft volumetric backlight illuminates dust motes in the air. The LEFT THIRD of the frame is deep shaded foliage and warm bokeh, rendered as soft negative space for headline overlay. Faces are tastefully obscured (back of heads, hair catching the light). ARRI Alexa look, anamorphic 35mm lens, shallow depth of field, ultra high detail, photorealistic. Life insurance, family security, and legacy concept. ${HERO_STYLE}`,
  },
  {
    filename: 'svc-credit-consultations.jpg',
    prompt: `A financial advisor reviewing credit documents and charts with a client in a sleek modern office. Professional setting with warm lighting. Credit consultation and financial planning concept. ${STYLE_SUFFIX}`,
  },

  // Benefit images (carousel cards, 280x160 display, 16:9 source)
  {
    filename: 'benefit-roadside.webp',
    prompt: `A flatbed tow truck with amber warning lights softly glowing parks behind a stranded unbranded sedan on a quiet two-lane highway shoulder at twilight. A uniformed technician approaches the driver. Wet pavement reflects warm sodium lights. Wide cinematic horizontal composition, atmospheric depth, motion-blurred passing headlights in background. 24-hour roadside assistance concept. ${HERO_STYLE}`,
  },
  {
    filename: 'benefit-road-hazard.webp',
    prompt: `Dramatic low-angle close-up of a fresh, deep tire tread on glossy wet black asphalt scattered with sharp gravel and a single rusty nail in the foreground. Soft rim light catches water droplets on the rubber. Shallow depth of field, cinematic moody color grade. Road hazard and tire protection concept. ${HERO_STYLE}`,
  },
  {
    filename: 'benefit-rental.webp',
    prompt: `Cinematic editorial automotive photography, ultra-wide 16:9 frame, BRIGHT and EVENLY-LIT throughout — absolutely no dark interior shadows, no moody negative space, no vignette, no empty corners. The composition is a wide outdoor shot of a sunlit rental car lot at golden hour: three or four pristine unbranded compact sedans (white, silver, charcoal) parked side-by-side in a tidy row, all visible across the full width of the frame from left edge to right edge. The closest sedan is in the right-center, three-quarter front view, gleaming with warm sunlight across hood and windshield. To its left, two more sedans recede in shallow perspective, still clearly visible. In the lower foreground, a uniformed attendant's hand offers a clean keys-on-fob toward the camera. Background fills with palm-tree silhouettes against a warm dusk sky and a clean modern rental office facade — every corner of the 16:9 frame has photographic interest, the entire image reads bright and full. NO manufacturer logos, NO badges, NO emblems, NO license plates, NO readable signage or text anywhere. ARRI Alexa look, anamorphic 35mm lens, ultra high detail, photorealistic. Rental car reimbursement and replacement vehicle coverage concept. ${HERO_STYLE}`,
  },
  {
    filename: 'benefit-trip.webp',
    prompt: `A long empty desert highway curves through dramatic red-rock mountains under a sweeping golden-hour sky, painted clouds streaking the horizon. A single small unbranded sedan drives toward the vanishing point, casting a long shadow. Cinematic widescreen vista, anamorphic-style horizontal compression. Trip interruption and travel coverage concept. ${HERO_STYLE}`,
  },
  {
    filename: 'benefit-maintenance.webp',
    prompt: `Inside a pristine modern auto service bay, a skilled technician's hands torque a clean wheel-hub component under bright directional task lighting. Polished chrome tools laid out on a stainless tray in the foreground. Spotless gray epoxy floor, blurred lift in the background. Scheduled maintenance and care concept. ${HERO_STYLE}`,
  },
  {
    filename: 'benefit-extended.webp',
    prompt: `A close-up of a master technician using a glowing modern OBD diagnostic tablet over a polished open engine bay of a generic luxury sedan. Cool blue UI light reflects off the engine, warm shop lights bounce in the background. Hands and tablet hero, face out of frame. Extended warranty and mechanical breakdown coverage concept. ${HERO_STYLE}`,
  },

  // Page hero images
  {
    filename: 'hero-credit-calculator-v2.webp',
    prompt: `Cinematic editorial photography, over-the-shoulder framing of a financial advisor in a tailored charcoal suit (face out of frame, only shoulder and hand visible) gesturing toward a sleek modern tablet on a dark walnut desk. The tablet displays a softly glowing clean rising line graph in cool blue and white — abstract enough to read as a credit score trend, no readable text or numbers. A second hand belonging to the client rests on a closed leather portfolio across the desk. Warm directional window light streams in from the upper right casting long subtle shadows; cool blue tablet glow contrasts with warm tungsten ambience. The tablet and hands sit in the right two-thirds of the frame. The LEFT THIRD is deep blurred wood-grain and shadowed office interior, rendered as moody negative space for white headline overlay text. Subtle film grain, rich blacks, ARRI Alexa color science, anamorphic 35mm lens, shallow depth of field, ultra high detail, photorealistic. NO readable text, logos, or watermarks anywhere. Credit consultation, credit score improvement, and personalized financial planning concept. ${HERO_STYLE}`,
  },
  {
    filename: 'loan3.jpg',
    prompt: `A modern, bright office space with floor-to-ceiling windows overlooking a city skyline. A consultation table with chairs. Professional financial services atmosphere. ${STYLE_SUFFIX}`,
  },
  {
    filename: 'car-loan4.jpg',
    prompt: `A diverse professional business team in a modern conference room having a productive meeting. Corporate setting with glass walls and city view. Teamwork and expertise concept. ${STYLE_SUFFIX}`,
  },

  // Other marketing images
  {
    filename: 'car-hero.jpg',
    prompt: `A premium luxury sedan photographed in dramatic studio lighting with a dark background. Reflections on the polished body. Hero-style automotive photography. ${STYLE_SUFFIX}`,
  },
  {
    filename: 'car.jpg',
    prompt: `A luxury sports car photographed in a high-end studio with dramatic side lighting. Sleek lines and reflections. Premium automotive photography. ${STYLE_SUFFIX}`,
  },
  {
    filename: 'hero-garage.png',
    prompt: `Interior of a modern luxury car garage with dramatic moody lighting. Multiple premium vehicles visible. Dark tones with accent lighting highlighting the cars. ${STYLE_SUFFIX}`,
  },
  {
    filename: 'hero-vehicle-coverage-v2.webp',
    prompt: `Cinematic automotive editorial photography of a pristine unbranded luxury sports coupe, three-quarter side view, parked inside an upscale private garage with polished mirror-like concrete floors and architectural slatted dark wood walls. Warm tungsten strip lighting traces the ceiling and reflects off the polished bodywork in long slashes. The car sits in the right two-thirds of the frame; the LEFT THIRD is deep shadow and dark wood paneling rendered as moody negative space for white headline overlay text. Volumetric haze in the air, dramatic chiaroscuro, NO manufacturer logo, NO badge, NO emblem, NO license plate, NO text. ARRI Alexa look, anamorphic 35mm lens, ultra high detail, photorealistic. Vehicle protection and coverage concept. ${HERO_STYLE}`,
  },
  {
    filename: 'hero-auto-refinance-v2.webp',
    prompt: `Cinematic editorial automotive photography of a sleek unbranded charcoal-graphite luxury sedan, three-quarter front view, parked on a wet polished concrete plaza at blue hour. The car sits in the right two-thirds of the frame, headlights and chrome trim glowing with cool LED accents and reflecting in the glossy ground. A faint mist hangs in the air; soft rim light wraps the body, dramatic falloff into deep shadow on the LEFT THIRD of the frame which is rendered as moody negative space — a dark, smooth, gradient backdrop perfect for overlaying white headline text. Out-of-focus modern architecture and scattered city bokeh in the deep background. Anamorphic widescreen feel, ARRI Alexa look, Roger Deakins style cinematography, 35mm anamorphic lens, shallow depth of field, ultra high detail, photorealistic, no manufacturer logos, no badges, no license plate, no text, no watermarks, no signage. Auto loan refinancing concept. ${HERO_STYLE}`,
  },
  {
    filename: 'hero-services-page.webp',
    prompt: `Cinematic editorial architecture photography, ultra-wide 16:9 frame: a stunning modern glass-and-steel financial-district skyscraper photographed from a low upward angle at deep blue hour, its illuminated lobby and warm interior lights glowing through the floor-to-ceiling glass on the lower floors. The tower rises in the right two-thirds of the frame, its sharp geometric facade catching cool LED accent light along structural fins. The LEFT THIRD of the frame is open dusk sky transitioning from deep navy at top to a hint of warm city glow at bottom — rendered as moody atmospheric negative space for white headline overlay text. Faint volumetric haze, scattered architectural lights and the suggestion of an empty plaza in the foreground. NO readable signage, NO logos, NO license plates, NO text on buildings. ARRI Alexa look, Roger Deakins style cinematography, anamorphic 35mm lens, ultra high detail, photorealistic. Comprehensive financial services and trusted nationwide partner concept. ${HERO_STYLE}`,
  },
  {
    filename: 'hero-benefits-page.webp',
    prompt: `Cinematic editorial automotive coverage photography, ultra-wide 16:9 frame: a pristine unbranded silver luxury SUV parked dead-center inside an upscale glass-walled private garage with mirror-polished concrete floors. Long warm tungsten strip lights trace the ceiling and reflect in long slashes across the polished bodywork and the floor. The SUV sits in the right two-thirds of the frame, three-quarter front view, headlights cool-white and grille completely plain (no manufacturer logo, no badge, no emblem). The LEFT THIRD of the frame is deep architectural shadow with subtle slatted dark wood paneling, rendered as moody negative space for white headline overlay text. Subtle volumetric haze in the air, dramatic chiaroscuro lighting. NO text, NO license plate, NO signage anywhere. ARRI Alexa look, anamorphic 35mm lens, ultra high detail, photorealistic. Vehicle coverage, protection, and certification benefits concept. ${HERO_STYLE}`,
  },
];

const DELAY_MS = 3000;
const MAX_RETRIES = 2;

async function generateImage(config) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`  Generating: ${config.filename} (attempt ${attempt + 1})...`);

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: config.prompt,
        config: {
          responseModalities: ['IMAGE', 'TEXT'],
        },
      });

      // Extract image from response parts
      const parts = response?.candidates?.[0]?.content?.parts;
      if (!parts) {
        throw new Error('No parts in response');
      }

      for (const part of parts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          const imageBytes = Buffer.from(part.inlineData.data, 'base64');
          const outputPath = path.join(PUBLIC_DIR, config.filename);
          const ext = path.extname(config.filename).toLowerCase();

          let pipeline = sharp(imageBytes, { failOn: 'none' })
            .resize(1920, 1080, { fit: 'cover', position: 'centre', kernel: 'lanczos3' });
          pipeline = ext === '.webp'
            ? pipeline.webp({ quality: 92, effort: 6, smartSubsample: true })
            : pipeline.jpeg({ quality: 92, mozjpeg: true });

          const out = await pipeline.toBuffer();
          fs.writeFileSync(outputPath, out);
          const sizeKB = Math.round(out.length / 1024);
          console.log(`  Saved: ${config.filename} (${sizeKB} KB, 1792x1008 16:9)`);
          return true;
        }
      }

      throw new Error('No image data in response');
    } catch (error) {
      console.error(`  Error on ${config.filename}: ${error.message}`);
      if (attempt < MAX_RETRIES) {
        console.log(`  Retrying in ${DELAY_MS}ms...`);
        await new Promise((r) => setTimeout(r, DELAY_MS));
      } else {
        console.error(`  FAILED after ${MAX_RETRIES + 1} attempts: ${config.filename}`);
        return false;
      }
    }
  }
  return false;
}

async function main() {
  // Allow filtering by --only=filename
  const onlyArg = process.argv.find((a) => a.startsWith('--only='));
  const onlyFile = onlyArg?.split('=')[1];

  const toGenerate = onlyFile
    ? images.filter((img) => img.filename === onlyFile)
    : images;

  if (toGenerate.length === 0) {
    console.error(`No matching image found for: ${onlyFile}`);
    process.exit(1);
  }

  console.log(`\nGenerating ${toGenerate.length} image(s)...\n`);

  let succeeded = 0;
  let failed = 0;

  for (const img of toGenerate) {
    const ok = await generateImage(img);
    if (ok) succeeded++;
    else failed++;

    // Rate limit between images
    if (toGenerate.indexOf(img) < toGenerate.length - 1) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\nDone: ${succeeded} succeeded, ${failed} failed out of ${toGenerate.length} total.\n`);
  if (failed > 0) process.exit(1);
}

main();
