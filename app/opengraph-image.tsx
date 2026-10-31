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
export const alt='Averan — operations and technology consulting, Cork, Ireland';

export default function OpengraphImage(){
 return new ImageResponse(
  (
   <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',background:'#0b1220',color:'#f6f7fb',padding:'72px 80px',fontFamily:'system-ui, sans-serif'}}>
    <div style={{display:'flex',alignItems:'center',gap:18,fontSize:26,letterSpacing:14,textTransform:'uppercase',color:'#9fb0d0'}}>Averan</div>
    <div style={{display:'flex',flexDirection:'column',gap:22}}>
     <div style={{fontSize:76,lineHeight:1.05,fontWeight:600,letterSpacing:-2}}>Capture enquiries.</div>
     <div style={{fontSize:76,lineHeight:1.05,fontWeight:600,letterSpacing:-2,color:'#8ea6ff'}}>Simplify the work.</div>
    </div>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',fontSize:24,color:'#9fb0d0'}}>
     <div style={{display:'flex'}}>Operations · Systems · Technology</div>
     <div style={{display:'flex'}}>Cork, Ireland</div>
    </div>
   </div>
  ),
  size,
 );
}
