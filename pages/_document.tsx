import { Head, Html, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="min-h-screen bg-white font-sans text-slate-900 antialiased dark:bg-black dark:text-slate-50">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
