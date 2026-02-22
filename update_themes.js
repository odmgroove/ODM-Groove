const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-[var(--black)]': 'bg-white dark:bg-[#0a0a0a]',
  'bg-[var(--dark)]': 'bg-[#f8f9fa] dark:bg-[#111111]',
  'bg-[var(--dark-card)]': 'bg-white dark:bg-[#1a1a1a]',
  'border-[var(--dark-border)]': 'border-[#e9ecef] dark:border-[#2a2a2a]',
  'border-[var(--black)]': 'border-[#ffffff] dark:border-[#0a0a0a]',
  'text-[var(--off-white)]': 'text-gray-900 dark:text-[#f5f0e8]',
  'text-[var(--warm-gray)]': 'text-gray-600 dark:text-[#8a8072]',
  'text-[var(--text-muted)]': 'text-gray-500 dark:text-[#6b6257]',
  'bg-[#0a0a0a]': 'bg-white dark:bg-[#0a0a0a]',
  'bg-[#111111]': 'bg-[#f8f9fa] dark:bg-[#111111]',
  'text-[var(--foreground)]': 'text-gray-900 dark:text-[#f5f0e8]',
  'bg-[var(--background)]': 'bg-white dark:bg-[#0a0a0a]'
};

const targetFiles = [
  'app/page.tsx',
  'app/blog/page.tsx',
  'app/components/AboutSection.tsx',
  'app/components/AIChatWidget.tsx',
  'app/components/AmenitiesSection.tsx',
  'app/components/BookingCTASection.tsx',
  'app/components/BookingModal.tsx',
  'app/components/EventsSection.tsx',
  'app/components/FAQSection.tsx',
  'app/components/Footer.tsx',
  'app/components/HeroSection.tsx',
  'app/components/Navbar.tsx',
  'app/components/RoomsSection.tsx',
  'app/components/TestimonialsSection.tsx',
  'app/components/GallerySection.tsx'
];

targetFiles.forEach(relPath => {
  const fullPath = path.join(__dirname, relPath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;
  
  for (const [search, replace] of Object.entries(replacements)) {
    if (content.includes(search)) {
      content = content.split(search).join(replace);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${relPath}`);
  }
});
