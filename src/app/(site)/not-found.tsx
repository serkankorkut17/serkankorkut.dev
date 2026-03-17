import Link from "next/link";
import PageHeader from "@/components/Sections/PageHeader";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFoundPage");

  return (
    <>
      <PageHeader title={t("title")} />

      <main className="flex flex-col py-8 px-8 md:px-40 bg-white text-black">
        <div className="rounded-lg text-center">
          <p className="text-orange-500 font-bold mb-4">404</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {t("description")}
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-8">
            {t("longDescription")}
          </p>

          <div className="flex items-center justify-center space-x-4">
            <Link href="/" className="inline-block">
              <button className="text-white bg-orange-500 hover:bg-orange-700 transition-colors duration-300 font-medium rounded-lg text-sm px-5 py-3">
                {t("backToHome")}
              </button>
            </Link>

            <Link href="/contact" className="inline-block">
              <button className="bg-black text-white hover:bg-gray-800 transition-colors duration-300 font-medium rounded-lg text-sm px-5 py-3">
                {t("contact")}
              </button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
