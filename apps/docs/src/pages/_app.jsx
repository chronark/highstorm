import Head from "next/head";
import { Router, useRouter } from "next/router";
import { MDXProvider } from "@mdx-js/react";

import { Layout } from "@/components/Layout";
import * as mdxComponents from "@/components/mdx";
import { useMobileNavigationStore } from "@/components/MobileNavigation";

import "@/styles/tailwind.css";
import "focus-visible";

function onRouteChange() {
  useMobileNavigationStore.getState().close();
}

Router.events.on("routeChangeStart", onRouteChange);
Router.events.on("hashChangeStart", onRouteChange);

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Head>
        {router.pathname === "/" ? (
          <title>Highstorm Docs</title>
        ) : (
          <title>{`${pageProps.title} - Highstorm Documentation`}</title>
        )}
        <meta name="description" content={pageProps.description} />
      </Head>
      <MDXProvider components={mdxComponents}>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
      </MDXProvider>
    </>
  );
}
