export const MB = Math.pow(1024, 2);
export const KB = 1024;

export function sizeToText(size) {
  if (size >= MB) {
    return (size / MB).toFixed(2) + "M";
  } else {
    return (size / KB).toFixed(2) + "K";
  }
}

export function file2Base64(file, callback) {
  let fileReader = new FileReader();
  fileReader.onload = (e) => {
    typeof callback === "function" && callback(e.target.result);
  };
  fileReader.readAsDataURL(file);
}

export function aspectRatioToText(aspectRatio) {
  if (aspectRatio) {
    if (Array.isArray(aspectRatio)) {
      return aspectRatio.map((v) => v.replace("/", ":")).join(" ~ ");
    }
    return aspectRatio.replace("/", ":");
  }
  return "";
}
