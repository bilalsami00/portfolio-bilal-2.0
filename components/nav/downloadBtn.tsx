import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { generalInfo } from "../../config";
import { resolveFontAwesomeIcon } from "../../utilities/resolveFontAwesomeIcon";
import Button from "../buttons/button";

const fileDownloadIcon = resolveFontAwesomeIcon("fas", "file-download");

type Props = {
  className?: string;
  label?: string;
};
const DownloadResumeBtn = ({ className, label }: Props) => (
  <Link href={generalInfo.resumeURL} target="_blank">
    <Button className={`flex justify-between ${className || ""}`}>
      {label}
      {fileDownloadIcon && (
        <FontAwesomeIcon className="ml-3 w-[15px]" icon={fileDownloadIcon} />
      )}
    </Button>
  </Link>
);
DownloadResumeBtn.defaultProps = {
  className: "hidden",
  label: "Resume.pdf",
};
export default DownloadResumeBtn;
