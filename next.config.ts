import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: "",
                pathname: "/serkankorkut/image/upload/**",
            },
        ],
    },
};
const withNextIntl = createNextIntlPlugin();

export default withFlowbiteReact(withNextIntl(nextConfig));