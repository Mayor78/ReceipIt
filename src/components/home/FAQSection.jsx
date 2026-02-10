import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is ReceiptIt?",
    a: "ReceiptIt is a free online receipt generator for small businesses to create professional receipts instantly."
  },
  {
    q: "Is ReceiptIt really free?",
    a: "Yes. ReceiptIt is 100% free with no signup or hidden charges."
  },
  {
    q: "Does ReceiptIt support Nigerian Naira?",
    a: "Yes. ReceiptIt supports ₦ currency and 7.5% VAT calculations."
  },
  {
    q: "Can I print or download my receipts?",
    a: "You can download receipts as high-quality PNG files or print them instantly."
  },
  {
    q: "Do I need to create an account?",
    a: "No signup or login is required."
  }
];

const FAQSection = () => {
  return (
    <section className="py-20 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-10">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((item, i) => (
          <details
            key={i}
            className="group border border-gray-200 rounded-xl p-5 bg-white shadow-sm"
          >
            <summary className="flex justify-between items-center cursor-pointer font-medium">
              {item.q}
              <ChevronDown className="transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-4 text-gray-600 leading-relaxed">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
