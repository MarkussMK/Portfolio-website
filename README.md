Markuss Šube - Portfolio Website
==================================

Overview
--------
A modern, responsive portfolio website for Markuss Šube, Automation Engineer and back-end programmer. Features smooth scroll animations, responsive design, and interactive elements across multiple pages.

## Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Scroll Animations**: Engaging animations for About Me, project cards, and experience bullets
- **Interactive Hero Section**: Parallax background with animated text and scroll indicator
- **Contact Form**: Functional contact form powered by Formspree
- **Modern Styling**: Clean design with gradient backgrounds and professional styling

Files Structure
---------------
- `index.html` — Homepage with hero section, About Me, and project previews
- `Experience.html` — Experience page with animated bullet points
- `Projects.html` — Full projects showcase with detailed descriptions and images
- `Contact.html` — Contact page with form and social media links
- `styles.css` — Centralized styling, animations, and responsive design

## Key Components

### Homepage (`index.html`)
- **Hero Section**: Animated text overlay with parallax background image
- **Scroll Indicator**: Animated indicator that guides users to scroll down
- **About Me**: Three-section layout with alternating text and images
- **Project Previews**: Animated cards showcasing key projects
- **Contact Preview**: Quick contact section with social media links

### Experience Page (`Experience.html`)
- **Professional Summary**: Highlighted introduction paragraph
- **Animated Achievements**: Bullet points that animate in sequence when scrolled into view
- **Responsive Layout**: Mobile-optimized design

### Projects Page (`Projects.html`)
- **Project Cards**: Detailed project descriptions with images
- **Scroll Animations**: Cards animate in with staggered timing
- **External Links**: Direct links to project recognitions and resources
- **Image Integration**: Project screenshots and relevant images

### Contact Page (`Contact.html`)
- **Contact Form**: JavaScript-powered form with success messaging
- **Social Media Integration**: Links to Instagram, LinkedIn, and Spotify
- **Professional Image**: Profile photo for personal connection
- **Responsive Design**: Mobile-friendly layout

## Technical Details

### Animations
- **CSS Keyframes**: Smooth entrance animations for text and elements
- **Intersection Observer**: Efficient scroll-triggered animations
- **Staggered Timing**: Sequential animations for better visual impact
- **Mobile Optimized**: Animations work smoothly on all devices

### Responsive Design
- **Mobile Navigation**: Centered navigation buttons on smaller screens
- **Flexible Layouts**: Content adapts to different screen sizes
- **Image Optimization**: Responsive images with proper scaling
- **Typography**: Readable fonts at all screen sizes

### Performance
- **Efficient Animations**: Hardware-accelerated CSS transforms
- **Lazy Loading**: Intersection Observer for performance
- **Minimal JavaScript**: Lightweight scripts for better load times
- **Optimized CSS**: Efficient selectors and minimal redundancy

## Setup & Preview

### Local Development
From the project folder, run a simple HTTP server:

```bash
# Python HTTP server
python -m http.server 8000

# Node.js alternative
npx http-server . -p 8000
```

Then open http://localhost:8000/index.html

### VS Code Live Server (Recommended)
Use the "Live Server" extension for real-time editing previews.

## Customization

### Key CSS Variables (in `:root`)
- `--bg`: Main gradient background
- `--accent`: Accent color for highlights and links
- `--header-text-offset`: Header alignment offset
- `--pill-nudge`: Navigation button alignment

### Animation Timing
- Homepage animations: Quick, subtle (0.6s)
- Projects page animations: Dramatic (0.7s) 
- Experience bullets: Sequential (staggered delays)

### Image Requirements
- `page background.jpg` - Hero background image
- `aboutmesection.jpg` - About Me first image
- `aboutmesection1.jpg` - About Me second image  
- `aboutmesection2.jpg` - About Me third image
- `pfp.jpg` - Contact page profile image
- `nordpool project.jpeg` - NordPool project image
- `jmeter-tutorial.png` - JMeter project image

## Browser Support
- Modern browsers with Intersection Observer support
- Mobile Safari, Chrome, Firefox, Edge
- Graceful degradation for older browsers

## Contact Form Setup
The contact form uses Formspree (https://formspree.io/) for backend processing. Update the endpoint in `Contact.html` if needed.

## Future Enhancements
- **Dark/Light Mode Toggle**: Theme switching capability
- **More Projects**: Additional project showcases
- **Blog Section**: Technical writing and insights
- **Performance Metrics**: Loading time optimizations
- **SEO Optimization**: Meta tags and structured data

---

**Note**: This portfolio showcases modern web development practices including responsive design, CSS animations, and user experience optimization.
