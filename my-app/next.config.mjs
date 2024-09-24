/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      // Adding a rule to handle .glb and .gltf files
      config.module.rules.push({
        test: /\.(glb|gltf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
          },
        },
      });
  
      return config;
    },
  };
  
  export default nextConfig;
  