import {ImageResponse} from 'next/og';

/**
 * Social preview card.
 *
 * Rendered at build time rather than kept as an asset, so it cannot drift from
 * the wording on the site. The square logo was being used before, which most
 * platforms crop badly; this is the 1200x630 they expect.
 */
export const size={width:1200,height:630};
export const contentType='image/png';
export const alt='Averan — admin automation for solar, heat pump and electrical installers in Ireland';

export default function OpengraphImage(){
 return new ImageResponse(
  (
   <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',background:'#2D2245',color:'#FFFFFF',padding:'72px 80px',fontFamily:'system-ui, sans-serif'}}>
    <div style={{display:'flex',alignItems:'center',gap:18,fontSize:26,letterSpacing:14,textTransform:'uppercase',color:'#D8CAE9'}}>Averan</div>
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
     <div style={{fontSize:72,lineHeight:1.05,fontWeight:700,letterSpacing:-2}}>Stop losing installer enquiries.</div>
     <div style={{fontSize:72,lineHeight:1.05,fontWeight:700,letterSpacing:-2,color:'#957ACA'}}>Automate the admin.</div>
    </div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',fontSize:24,color:'#D8CAE9'}}>
     <div style={{display:'flex'}}>Solar · Heat pumps · Retrofit · Electrical</div>
     <div style={{display:'flex'}}>Cork, Ireland</div>
    </div>
   </div>
  ),
  size,
 );
}
