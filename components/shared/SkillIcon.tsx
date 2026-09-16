import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ElectronIcon from "../svgs/electronIcon";
import JestIcon from "../svgs/jestIcon";
import MongoDBIcon from "../svgs/mongoDBIcon";
import NextIcon from "../svgs/nextIcon";
import NodeJSIcon from "../svgs/nodeJSIcon";
import ReactIcon from "../svgs/reactIcon";
import ReactNativeIcon from "../svgs/reactNativeIcon";
import TypescriptIcon from "../svgs/typescriptIcon";
import { resolveFontAwesomeIcon } from "../../utilities/resolveFontAwesomeIcon";

type SkillIconProps = {
  iconKey?: string;
  className?: string;
};

/**
 * Maps skill icon keys to existing SVG components or Font Awesome glyphs.
 */
const SkillIcon = ({ iconKey, className = "h-6 w-6" }: SkillIconProps) => {
  switch (iconKey) {
    case "react":
      return <ReactIcon className={className} />;
    case "react-native":
      return <ReactNativeIcon className={className} />;
    case "typescript":
      return <TypescriptIcon className={className} />;
    case "mongodb":
      return <MongoDBIcon className={className} />;
    case "electron":
      return <ElectronIcon className={className} />;
    case "jest":
      return <JestIcon className={className} />;
    case "next":
      return <NextIcon className={className} />;
    case "nodejs":
      return <NodeJSIcon className={className} />;
    default: {
      const fallback = resolveFontAwesomeIcon("fas", "code");
      return fallback ? (
        <FontAwesomeIcon
          icon={fallback}
          className={`${className} text-crimson-400`}
        />
      ) : null;
    }
  }
};

export default SkillIcon;
