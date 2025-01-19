import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Contact Us
        </h1>

        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="flex items-center gap-3 text-purple-600 dark:text-purple-400">
            <Mail size={24} />
            <a
              href="mailto:kanti.ylocation@gmail.com"
              className="text-xl hover:underline"
            >
              kanti.ylocation@gmail.com
            </a>
          </div>

          <div className="max-w-2xl text-center text-gray-600 dark:text-gray-300">
            <p className="mb-4">
              Have questions or need support? We're here to help! Feel free to
              reach out to our support team via email.
            </p>
            <p>
              Our team typically responds within 24 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
