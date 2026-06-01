<?php
namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // No placeholder products — all products are managed via the admin CMS.
        return;

        // ─── Lava Lava products ───────────────────────────────────────────────
        $lavaProducts = [
            ['slug'=>'halo-slip','name'=>'The Halo Slip','price'=>3499,'cat'=>'Slips','palette'=>['#FF5A2C','#F08A8B','#EFA0BA'],'accent'=>'#D7A8E8','tag'=>'Featured','sub'=>'Bias-cut viscose, gradient dyed','sizes'=>['XS','S','M','L'],'drop'=>'04','story'=>'Cut on the bias from a whisper-weight viscose, the Halo Slip follows the body the way light follows water.','details'=>'100% Viscose. Bias cut. Hand-finished hem.','care'=>'Hand wash cold. Dry flat.','fit'=>'True to size. 32" length from waist.','silhouette'=>'slip'],
            ['slug'=>'neon-bloom','name'=>'Neon Bloom','price'=>3499,'cat'=>'Tops','palette'=>['#EFA0BA','#D7A8E8','#E8C0F0'],'accent'=>'#FF5A2C','tag'=>'New','sub'=>'Cropped silk-blend, gradient print','sizes'=>['XS','S','M','L','XL'],'drop'=>'04','story'=>'A crop that catches light from every angle.','details'=>'70% Silk 30% Polyester. Cropped. Hidden zip.','care'=>'Dry clean only.','fit'=>'Cropped. Size up for relaxed.','silhouette'=>'crop'],
            ['slug'=>'soft-riot','name'=>'Soft Riot','price'=>2899,'cat'=>'Tops','palette'=>['#F08A8B','#EFA0BA','#FF5A2C'],'accent'=>'#E8C0F0','tag'=>null,'sub'=>'Off-shoulder cotton gauze','sizes'=>['XS','S','M','L'],'drop'=>'04','story'=>'An off-shoulder top in the softest cotton gauze.','details'=>'100% Cotton gauze. Off-shoulder. Elasticated neck.','care'=>'Machine wash cool.','fit'=>'Oversized. Size down for fitted.','silhouette'=>'offshoulder'],
            ['slug'=>'velvet-mango','name'=>'Velvet Mango','price'=>3799,'cat'=>'Outerwear','palette'=>['#FF5A2C','#F08A8B','#E8C0F0'],'accent'=>'#D7A8E8','tag'=>'Limited','sub'=>'Cropped velvet jacket','sizes'=>['XS','S','M','L'],'drop'=>'04','story'=>'A cropped velvet jacket with contrast lining.','details'=>'100% Velvet shell. Cropped. Single-breasted.','care'=>'Dry clean only.','fit'=>'Slightly cropped. True to size.','silhouette'=>'jacket'],
            ['slug'=>'disco-petal','name'=>'Disco Petal','price'=>2499,'cat'=>'Sets','palette'=>['#EFA0BA','#F08A8B','#D7A8E8'],'accent'=>'#FF5A2C','tag'=>null,'sub'=>'Two-piece jersey co-ord','sizes'=>['XS','S','M','L','XL'],'drop'=>'04','story'=>'A jersey two-piece that moves as one.','details'=>'95% Cotton 5% Elastane. Crop top + shorts.','care'=>'Machine wash cool.','fit'=>'Relaxed. True to size.','silhouette'=>'set'],
            ['slug'=>'tangerine-daze','name'=>'Tangerine Daze','price'=>3199,'cat'=>'Slips','palette'=>['#FF5A2C','#F08A8B','#EFA0BA'],'accent'=>'#E8C0F0','tag'=>null,'sub'=>'Mini slip, sunset wash','sizes'=>['XS','S','M','L'],'drop'=>'04','story'=>'Our shortest slip, cut in sunset-washed satin.','details'=>'100% Polyester satin. Mini length. Adjustable straps.','care'=>'Hand wash cold.','fit'=>'Mini. True to size.','silhouette'=>'minislip'],
            ['slug'=>'lilac-pulse','name'=>'Lilac Pulse','price'=>2799,'cat'=>'Tops','palette'=>['#D7A8E8','#E8C0F0','#EFA0BA'],'accent'=>'#FF5A2C','tag'=>'Restock','sub'=>'Stretch satin bodysuit','sizes'=>['XS','S','M','L'],'drop'=>'04','story'=>'A stretch satin bodysuit in lilac.','details'=>'92% Polyester 8% Elastane. Snap closure. Square neck.','care'=>'Machine wash cool.','fit'=>'Fitted. True to size.','silhouette'=>'bodysuit'],
            ['slug'=>'cherry-halo','name'=>'Cherry Halo','price'=>3599,'cat'=>'Outerwear','palette'=>['#F08A8B','#EFA0BA','#FF5A2C'],'accent'=>'#D7A8E8','tag'=>null,'sub'=>'Bomber with printed twill','sizes'=>['XS','S','M','L','XL'],'drop'=>'04','story'=>'A bomber jacket in printed twill with ribbed cuffs.','details'=>'100% Polyester twill. Ribbed cuffs. Zip front.','care'=>'Machine wash warm.','fit'=>'Relaxed. Size down for slim.','silhouette'=>'bomber'],
            ['slug'=>'cosmic-sorbet','name'=>'Cosmic Sorbet','price'=>2999,'cat'=>'Sets','palette'=>['#E8C0F0','#D7A8E8','#EFA0BA'],'accent'=>'#FF5A2C','tag'=>null,'sub'=>'Knit skirt set','sizes'=>['XS','S','M','L'],'drop'=>'04','story'=>'A knit two-piece in sherbet tones.','details'=>'60% Cotton 40% Acrylic. Crop top + midi skirt.','care'=>'Hand wash cold.','fit'=>'Relaxed. Size up for ease.','silhouette'=>'skirtset'],
            ['slug'=>'sun-spell','name'=>'Sun Spell','price'=>4299,'cat'=>'Outerwear','palette'=>['#FF5A2C','#E8C0F0','#D7A8E8'],'accent'=>'#F08A8B','tag'=>'New','sub'=>'Long panelled coat','sizes'=>['XS','S','M','L'],'drop'=>'04','story'=>'A long panelled coat in contrast blocking.','details'=>'70% Wool 30% Polyester. Longline. Belt included.','care'=>'Dry clean only.','fit'=>'Longline. Size up for oversized.','silhouette'=>'longcoat'],
            ['slug'=>'orchid-flame','name'=>'Orchid Flame','price'=>3299,'cat'=>'Slips','palette'=>['#D7A8E8','#E8C0F0','#FF5A2C'],'accent'=>'#F08A8B','tag'=>null,'sub'=>'Maxi slip, gradient dyed','sizes'=>['XS','S','M','L','XL'],'drop'=>'04','story'=>'A gradient-dyed maxi slip that pools at the floor.','details'=>'100% Viscose. Maxi length. Bias cut.','care'=>'Hand wash cold.','fit'=>'True to size. 58" length from shoulder.','silhouette'=>'maxi'],
            ['slug'=>'sherbet-blazer','name'=>'Sherbet Blazer','price'=>4599,'cat'=>'Outerwear','palette'=>['#EFA0BA','#D7A8E8','#F08A8B'],'accent'=>'#FF5A2C','tag'=>null,'sub'=>'Boyfriend blazer, pastel stripe','sizes'=>['XS','S','M','L'],'drop'=>'04','story'=>'An oversized boyfriend blazer in pastel stripe.','details'=>'55% Cotton 45% Polyester. Boyfriend fit. Lined.','care'=>'Dry clean only.','fit'=>'Oversized. Size down for structured.','silhouette'=>'blazer'],
        ];

        foreach ($lavaProducts as $data) {
            Product::firstOrCreate(
                ['slug' => $data['slug']],
                array_merge($data, ['brand' => 'lava', 'active' => true])
            );
        }

        // ─── Solo Sarto products ──────────────────────────────────────────────
        $soloProducts = [
            ['slug'=>'ivory-drape-gown','name'=>'Ivory Drape Gown','price'=>285000,'cat'=>'Gown','code'=>'HC-01','process_time'=>'14–18 weeks','fabric'=>'Ivory silk crepe, hand-rolled hem','product_desc'=>'A fluid column of ivory silk crepe, cut on the bias and finished entirely by hand. The bodice drapes from a single shoulder worked in hand-rolled pleats. Each curve is shaped to the client alone — no two cuts are ever identical.'],
            ['slug'=>'bias-silk-slip','name'=>'Bias Silk Slip','price'=>142000,'cat'=>'Slip','code'=>'EE-02','process_time'=>'8–10 weeks','fabric'=>'Silk charmeuse, cotton lace trim','product_desc'=>'Pure-silk charmeuse cut on the bias for a living drape. Delicate lace trim at the hem and adjustable spaghetti straps. An understatement that speaks volumes.'],
            ['slug'=>'hand-embroidered-bodice','name'=>'Hand-Embroidered Bodice','price'=>198000,'cat'=>'Bodice','code'=>'HC-03','process_time'=>'20–24 weeks','fabric'=>'Raw silk, silk thread, seed pearls','product_desc'=>'Two hundred hours of hand embroidery on raw silk. Botanical motifs rendered in silk thread and seed pearls. Worn with anything — remembered forever.'],
            ['slug'=>'tailored-tuxedo','name'=>'Tailored Tuxedo','price'=>168000,'cat'=>'Suit','code'=>'MC-04','process_time'=>'10–12 weeks','fabric'=>'Italian wool-silk, satin lapels','product_desc'=>'A single-button tuxedo in Italian wool-silk. Peak lapels, functioning sleeve buttons, and a slim silhouette cut to your exact proportions. Nothing like off-the-rack.'],
            ['slug'=>'charcoal-sheath','name'=>'Charcoal Sheath','price'=>125000,'cat'=>'Dress','code'=>'EE-05','process_time'=>'8–10 weeks','fabric'=>'Japanese wool-blend, grosgrain zip','product_desc'=>'A clean sheath in charcoal Japanese wool. Column silhouette with a concealed back zip and a hem cut to the millimetre for your exact height. Architecture you can wear.'],
            ['slug'=>'saffron-sari-drape','name'=>'Saffron Sari Drape','price'=>210000,'cat'=>'Sari','code'=>'HC-06','process_time'=>'12–16 weeks','fabric'=>'Tissue silk, hand-blocked bronze border','product_desc'=>'A contemporary interpretation of the classic drape. Saffron tissue silk with a hand-blocked border in bronze. The pallu is pre-stitched for a perfect drape, every time.'],
        ];

        foreach ($soloProducts as $data) {
            Product::firstOrCreate(
                ['slug' => $data['slug']],
                array_merge($data, [
                    'brand'   => 'solo',
                    'active'  => true,
                    'palette' => [],
                    'sizes'   => [],
                ])
            );
        }
    }
}
