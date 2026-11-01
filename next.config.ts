import type {NextConfig} from 'next';
const config:NextConfig={turbopack:{root:process.cwd()},outputFileTracingRoot:process.cwd(),poweredByHeader:false,async redirects(){return [{source:'/installers',destination:'/',permanent:true}]},devIndicators:false,async headers(){return [{source:'/(.*)',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'}]}]}};
export default config;
