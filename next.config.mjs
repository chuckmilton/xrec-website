/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: [process.env.SUPABASE_URL],
    },
  };
  
  export default nextConfig;
  