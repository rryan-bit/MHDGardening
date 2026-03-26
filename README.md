# 🌿 MHD Gardening Website

A professional, responsive website for **MHD Gardening** — Brisbane-based lawn and garden care.

---

## 📄 Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero with instant booking widget, services preview, photo strip |
| Services | `services.html` | Simple Mow, Hedges & Lawn, Full Service, Gutter Cleaning |
| Book | `booking.html` | Full booking form with interactive calendar |
| Contact | `contact.html` | On-page enquiry form (EmailJS) + contact details |

---

## ✉️ Enabling On-Page Contact Form (EmailJS — Free)

The contact form sends email **without leaving the website** using [EmailJS](https://emailjs.com).  
Setup takes about 5 minutes and is completely free.

### Steps:

1. **Sign up** at [https://emailjs.com](https://emailjs.com) (free account)

2. **Add an Email Service**
   - Go to **Email Services** → **Add New Service** → choose **Gmail**
   - Sign in with `mhdgardening@gmail.com` and authorise
   - Note your **Service ID** (e.g. `service_abc1234`)

3. **Create an Email Template**
   - Go to **Email Templates** → **Create New Template**
   - Set **To Email**: `mhdgardening@gmail.com`
   - Set **Subject**: `{{subject}} from {{from_name}}`
   - Set **Body** (paste this):
     ```
     New enquiry from MHD Gardening website

     Name:    {{from_name}}
     Email:   {{from_email}}
     Phone:   {{phone}}
     Suburb:  {{suburb}}
     Subject: {{subject}}

     Message:
     {{message}}
     ```
   - Note your **Template ID** (e.g. `template_xyz7890`)

4. **Get your Public Key**
   - Go to **Account** → **General** → copy **Public Key** (e.g. `aBcDeFgHiJkLmNoP`)

5. **Add the keys to `contact.html`**
   Open `contact.html` and find these three lines near the top and replace the placeholder values:
   ```js
   window.EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
   window.EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
   window.EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";
   ```

6. **Upload the updated `contact.html`** to your GitHub repo — done!

> **Until EmailJS is configured**, the form falls back to opening your email client pre-filled, so it still works.

---

## 🚀 Deploying to GitHub Pages

1. Push all files to a GitHub repository (make sure `index.html` is at the root)
2. Go to **Settings → Pages**
3. Set Source → **Deploy from a branch** → `main` → `/ (root)`
4. Live at: `https://yourusername.github.io/repository-name/`

### Running locally:
```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

---

## 🗂 File Structure

```
mhd-gardening/
├── index.html        # Home page
├── services.html     # All 4 services
├── booking.html      # Booking + calendar
├── contact.html      # Contact + EmailJS form
├── hero-garden.png   # Hero background photo
├── style.css         # All styles
├── main.js           # All JavaScript
└── README.md         # This file
```

---

## 📞 Contact Details
- **Phone:** 0421 722 604
- **Email:** mhdgardening@gmail.com
- **Service Area:** Brisbane & Surrounds, QLD
