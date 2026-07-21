import bniMobileBanking from "@/assets/thumbnails/video-frames/bni-mobile-banking.jpg";
import lazadaRamadan from "@/assets/thumbnails/video-frames/lazada-ramadan-sale.jpg";
import oppoEncobuds from "@/assets/thumbnails/video-frames/oppo-encobuds.jpg";
import oppoRenoA54 from "@/assets/thumbnails/video-frames/oppo-reno-a54.jpg";
import oppoReno4 from "@/assets/thumbnails/video-frames/oppo-reno4.jpg";
import rejoice3in1 from "@/assets/thumbnails/video-frames/rejoice-3in1.jpg";
import wulingAirEv from "@/assets/thumbnails/video-frames/wuling-air-ev.jpg";

const CURATED_CATALOG_POSTERS: Readonly<Record<string, string>> = Object.freeze({
  "158c5a2a-0d77-44d2-93fc-1e102ebcbdf3": wulingAirEv,
  "bf7532f7-a00a-4da0-a926-48ea830f291a": rejoice3in1,
  "71dbd58a-17d8-4a19-92c7-606bc603b0d9": lazadaRamadan,
  "053786ab-4079-48d7-b5e5-3d86bd75aaf7": bniMobileBanking,
  "775d8087-2904-4b45-9dee-c6f58d518d21": oppoRenoA54,
  "690085d5-e4dd-4be1-ab99-5a30e9009030": oppoEncobuds,
  "fecea45e-5b87-415a-88c1-f9b829982c19": oppoReno4,
});

export const curatedCatalogPoster = (projectId: string) => CURATED_CATALOG_POSTERS[projectId] || "";
