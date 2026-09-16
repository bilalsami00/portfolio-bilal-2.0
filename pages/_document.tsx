import { Head, Html, Main, NextScript } from "next/document";

/**
 * Injects theme before paint to avoid a flash of the wrong palette.
 */
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('portfolio-theme');
    var theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

const Document = () => (
  <Html lang="en" data-theme="dark">
    <Head>
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: themeInitScript }}
      />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
