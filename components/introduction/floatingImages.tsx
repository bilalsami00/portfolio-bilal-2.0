import Image from "../Image";
import styles from "../../styles/header.module.css";

const floatBox = `
  hero-float-card absolute z-10
  w-[56px] h-[56px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px] lg:w-[84px] lg:h-[84px]
  rounded-lg pointer-events-none
  flex items-center justify-center p-2
`;

/**
 * Floating tech badges for the shared hero.
 * Icon artwork stays untinted; the card chrome follows the theme.
 */
const FloatingImages = () => (
  <span className="pointer-events-none" aria-hidden>
    <div
      title="React"
      className={`${floatBox} top-[12%] left-[4%] sm:left-6 ${
        styles.floating_item || ""
      }`}
      style={{ animationDelay: "0s" }}
    >
      <Image
        loading="lazy"
        alt=""
        src="/assets/images/icons/react.png"
        width={72}
        height={72}
        className="pointer-events-none"
      />
    </div>

    <div
      title="Node.js"
      className={`${floatBox} top-[14%] right-[6%] sm:right-10 ${
        styles.floating_item || ""
      }`}
      style={{ animationDelay: "0.8s" }}
    >
      <Image
        loading="lazy"
        alt=""
        src="/assets/images/icons/nodejs.png"
        width={72}
        height={72}
        className="pointer-events-none"
      />
    </div>

    <div
      title="MongoDB"
      className={`${floatBox} bottom-[18%] right-[8%] sm:right-12 ${
        styles.floating_item || ""
      }`}
      style={{ animationDelay: "1.6s" }}
    >
      <Image
        loading="lazy"
        alt=""
        src="/assets/images/icons/mongoDB.png"
        width={72}
        height={72}
        className="pointer-events-none"
      />
    </div>

    <div
      title="Craft over claims"
      className={`
        hero-float-card absolute z-10 bottom-[16%] left-[2%] sm:left-6
        flex items-center gap-2 rounded-2xl
        py-2 px-3 pointer-events-none
        ${styles.floating_item || ""}
      `}
      style={{ animationDelay: "2.2s" }}
    >
      <Image
        loading="lazy"
        alt=""
        src="/assets/images/icons/complete.png"
        width={48}
        height={48}
        className="pointer-events-none"
      />
      <div className="pr-2 text-left">
        <p className="hero-float-title text-sm font-bold leading-tight">
          Clean builds
        </p>
        <p className="hero-float-subtitle text-xs">thoughtful delivery</p>
      </div>
    </div>
  </span>
);

export default FloatingImages;
