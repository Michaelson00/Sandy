# 🎂 Happy Birthday Sandra Appiah — Website

A fully interactive, responsive birthday website built with pure HTML, CSS, and JavaScript.

---

## 📁 Folder Structure

```
sandra-birthday/
├── index.html           ← Main page (all sections)
├── css/
│   └── style.css        ← All styles, animations, responsive breakpoints
├── js/
│   ├── fireworks.js     ← Fireworks canvas engine (hero background)
│   ├── gallery.js       ← Lightbox for photo gallery
│   └── app.js           ← Scroll reveals, countdown, flip cards, cursor trail
├── images/
│   ├── photo-1.jpg      ← ← ← ADD YOUR PHOTOS HERE
│   ├── photo-2.jpg
│   └── ...
└── README.md
```

---

## ✅ Customisation Checklist

### 1. Add your photos
Drop your image files into the `images/` folder.
Then update `index.html` (the gallery section) to point to the correct filenames:

```html
<img src="images/YOUR-FILE-NAME.jpg" alt="Description of photo" />
```

You can add or remove `.gallery-item` blocks freely — the grid adjusts automatically.

---

### 2. Insert your YouTube video ID
In `index.html`, find this line:

```html
src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE?rel=0&modestbranding=1"
```

Replace `YOUR_VIDEO_ID_HERE` with your actual video ID.
**Example:** if your video URL is `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
→ the ID is `dQw4w9WgXcQ`
→ src becomes: `https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1`

---

### 3. Personalise the letter
In `index.html`, scroll to the `<!-- PLACEHOLDER: PERSONALISE YOUR LETTER HERE -->` comment.
Edit the `<p>` paragraphs with your own heartfelt message.
Also replace `<!-- YOUR NAME HERE -->` with your actual name.

---

### 4. Set Sandra's birthday for the live countdown
In `js/app.js`, find these two lines and update them:

```js
const BIRTHDAY_MONTH = 3;   // ← Sandra's birth month (1 = January)
const BIRTHDAY_DAY   = 17;  // ← Sandra's birth day
```

The counter automatically shows how much time has passed since her last birthday.

---

### 5. Edit the fun-fact flip cards *(optional)*
In `index.html`, find the `#fun-facts` section.
Change the emoji, front text, and back text of each `.flip-card` to something personal.
Add more cards by duplicating a `.flip-card` `<li>` block.

---

## 🚀 Running the site

This is a plain HTML/CSS/JS site — no build step needed.

**Easiest way:**
1. Open `index.html` directly in any modern browser.

**For local development (recommended):**
```bash
# With VS Code: use the "Live Server" extension
# Or with Node.js:
npx serve .
# Or with Python:
python3 -m http.server 8080
```

> **Note:** YouTube embeds require a server (not `file://`) to load properly.
> Use one of the local server methods above when testing the video section.

---

## ♿ Accessibility features
- Semantic HTML5 elements throughout
- All interactive elements are keyboard-navigable
- Lightbox traps focus and returns it on close
- `aria-label`, `aria-modal`, `role` attributes where needed
- Animations are disabled for users who prefer reduced motion
- Contrast ratios meet WCAG AA on all key text

---

## 🎨 Design tokens
All colours, spacing, fonts, and timing are controlled by CSS custom properties at the top of `style.css`. Change the values in `:root {}` to retheme the entire site instantly.

---

Made with ❤️ especially for Sandra Appiah.
