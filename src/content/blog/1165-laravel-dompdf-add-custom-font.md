---
title: "Laravel DomPdf Add Custom Font"
description: "Title: Effortlessly Adding Custom Fonts to Laravel DomPDF Generations Introduction: DomPDF is an open source PHP library for generating PDF documents from..."
pubDate: 2026-06-29
author: "Stefan Bogdanescu"
tags: ["Laravel", "Content", "Performance", "HTML"]
featured: false
---

Title: Effortlessly Adding Custom Fonts to Laravel DomPDF Generations

Introduction: DomPDF is an open-source PHP library for generating PDF documents from HTML content. With its extensive support for CSS, it’s a powerful tool in many web development projects. One crucial yet challenging aspect of using DomPDF can be integrating custom fonts within your generated PDF files. In this comprehensive blog post, we'll explore the process of including custom fonts, the possible challenges you might encounter, and provide solutions to troubleshoot common issues like using Old English fonts with Laravel.

Body:

1. Including Custom Fonts in View Files
Firstly, ensure your custom font files are properly referenced in your application's view. For instance, assuming your font file is saved as "OldEnglishFont.ttf" in the "fonts" directory inside your Laravel project, you could include it like this:

<code>{{ HTML::style('css/styles.css') }}</code>
Inside styles.css, add the following line:

<pre>.custom_font {
  font-family: 'OldEnglishFont';
}</pre>
Then, in your Laravel view file use it as necessary:

<code>&lt;div class="custom_font"&gt;Your Content Here&lt;/div&gt;</code>

2. DomPDF Font Family Cache Configuration
DomPDF uses a font family cache to ensure that the library doesn't load each font file every time you generate a new PDF document. This can speed up your application's performance, but for a custom font like Old English, you may need to manually configure the cache. Follow these steps:

1. Backup the existing dompdf_font_family_cache.dist.php file:
   <code>cp dompdf/vendor/dompdf/dompdf/config/dompdf_font_family_cache.dist.php dompdf/vendor/dompdf/dompdf/config/dompdf_font_family_cache.original.php</code>
2. Make a copy of the original file:
   <code>cp dompdf/vendor/dompdf/dompdf/config/dompdf_font_family_cache.original.php dompdf/vendor/dompdf/dompdf/config/dompdf_font_family_cache.php</code>
3. Open the new file, dompdf_font_family_cache.php, and add your custom font details:
   <pre>.custom_font {
  base_name: OldEnglishFont;
  dir: /path/to/your/fonts/OldEnglishFont.ttf;
}</pre>
4. Save the updated file and replace the original one by moving dompdf_font_family_cache.php into the dist folder:
   <code>mv dompdf/vendor/dompdf/dompdf/config/dompdf_font_family_cache.php dompdf/vendor/dompdf/dompdf/config/dompdf_font_family_cache.dist.php</code>
5. Run the following command to clear DomPDF's cache:
   <code>composer update</code>

3. Common Issues and Solutions
Ensure that your custom font file is in the correct format. Font files like TrueType (e.g., .ttf) or Open Type (e.g., .otf) are commonly compatible with HTML rendering engines. If using a different type of font, you may need to convert it to one of these formats for Laravel DomPDF to recognize it correctly.

In case your custom font doesn't render properly in the generated PDF file, you can try adding the @font-face rule directly into your CSS file:
<code>
@font-face {
  font-family: 'OldEnglishFont';
  src: url('font/OldEnglishFont.ttf') format('truetype');
}
</code>
Then, in your view, reference the custom class you created containing the @font-face rule instead of simply specifying ".custom_font":
<code>&lt;div class="class_with_font"&gt;Your Content Here&lt;/div&gt;</code>

Conclusion:
In conclusion, adding a custom font to your Laravel application's DomPDF generated PDFs can be done by carefully referencing the font file in your view, configuring the font family cache, and troubleshooting any potential issues that may arise. By following these best practices, you can ensure that your PDF documents are visually appealing and maintain consistency with your branding while staying within your application's capabilities.
