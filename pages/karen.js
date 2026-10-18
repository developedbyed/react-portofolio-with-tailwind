import Head from "next/head";
import Link from "next/link";

import EnergyAgentConversation from "../components/EnergyAgentConversation";

const siteUrl = "https://pascal-maker.github.io/";
const pageUrl = `${siteUrl}karen`;
const karenApiUrl =
  process.env.NEXT_PUBLIC_KAREN_API_URL || "https://pascal-maker-belgian-energy-voice-assistant.hf.space/api/answer";
const pageTitle = "EnergyAgent Karen | Pascal Musabyimana";
const pageDescription =
  "Proof of concept: a Dutch voice and chat assistant for Belgian household energy questions, answering from official supplier and regulator sources.";

export default function KarenPage() {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#234f38" />
        <link rel="canonical" href={pageUrl} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${siteUrl}og-image.jpg`} />
      </Head>
      <main className="min-h-screen bg-[#f6f7f3] px-4 py-8 text-[#1e2b23] md:px-10">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm font-medium text-[#234f38] hover:underline">
            ← Back to portfolio
          </Link>
          <header className="mb-6 mt-4 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4b805e]">Proof of concept</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">EnergyAgent Karen</h1>
            <p className="mt-3 text-base leading-relaxed text-[#56645b]">
              A Dutch voice and chat assistant for Belgian household energy questions. Karen answers from a bundled
              energy FAQ, curated official supplier and regulator pages, and an optional PDF of your bill, and shows
              the source passage behind every answer. Ask in Dutch; don&apos;t share personal details.
            </p>
          </header>
          <div className="overflow-hidden rounded-3xl border border-[#e2e7df] bg-white">
            <EnergyAgentConversation apiEndpoint={karenApiUrl} />
          </div>
          <p className="mt-4 text-sm text-[#56645b]">
            Source code:{" "}
            <a
              href="https://github.com/pascal-maker/karen-energy-agent"
              className="font-medium text-[#234f38] hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              pascal-maker/karen-energy-agent
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
