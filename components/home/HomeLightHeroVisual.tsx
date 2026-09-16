import FloatingImages from "../introduction/floatingImages";
import RoundShape from "../svgs/roundShape";
import { siteIdentity } from "../../data/site";

/**
 * Classic cute OpenFolio hero visual — teal blob + floaties + illustration.
 * Intended for light mode only.
 */
const HomeLightHeroVisual = () => (
  <div className="relative mx-auto w-full max-w-md lg:max-w-none min-h-[360px] sm:min-h-[440px] lg:min-h-[500px] flex items-center justify-center">
    <FloatingImages />

    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-[92%] max-w-[420px]">
      <RoundShape className="h-auto w-full opacity-90" />
    </span>

    <img
      src="/assets/images/programmer.png"
      width={420}
      height={500}
      alt={`${siteIdentity.fullName} — illustration`}
      className="relative z-[1] w-[85%] max-w-[380px] h-auto object-contain"
    />
  </div>
);

export default HomeLightHeroVisual;
