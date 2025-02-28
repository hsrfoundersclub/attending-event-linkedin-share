# HSR Founders Club Promo Generator

A simple, user-friendly web application for creating personalized promotional images for HSR Founders Club events.

## Features

- **Personalized Promo Images**: Generate professional-looking promotional images with your name, role, company, and profile photo.
- **Live Preview**: See how your promotional image looks as you input your information.
- **Easy Copying**: Copy both the image and promotional text to your clipboard with a single click.
- **Form Validation**: Proper validation to ensure all necessary information is provided.
- **Persistent Data**: Your information is saved in the browser, so you won't lose your progress if you refresh the page.

## Getting Started

### Prerequisites

- Node.js 14.0 or later
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hsrfc-image-promo
   ```

2. Install the dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How to Use

1. **Enter Your Information**: Fill in your name, role, and company in the provided form fields.
2. **Upload a Profile Photo**: Click on the upload area to select a profile photo.
3. **Preview Your Promo Image**: The right side of the screen shows a live preview of your personalized promotional image.
4. **Copy to Clipboard**: 
   - Click "Copy Image" to copy the image to your clipboard.
   - Click "Copy Text" to copy the promotional text to your clipboard.

## Built With

- [Next.js](https://nextjs.org/) - The React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [html-to-image](https://github.com/bubkoo/html-to-image) - A client-side library to generate images from DOM nodes

## License

This project is open source and available under the [MIT License](LICENSE).
