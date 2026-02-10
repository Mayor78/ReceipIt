import { Helmet } from "react-helmet-async";

const SEO = () => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["SoftwareApplication", "WebApplication"],
          "name": "ReceiptIt",
          "url": "https://receipit.digital",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "All",
          "description":
            "ReceiptIt is a free online receipt generator for small businesses to create professional receipts instantly.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "NGN"
          },
          "creator": {
            "@type": "Organization",
            "name": "ReceiptIt"
          },
          "featureList": [
            "Free receipt generator",
            "Nigerian Naira support",
            "VAT calculation",
            "Download and print receipts",
            "No signup required"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
