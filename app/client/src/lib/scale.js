
// TODO: handle scaling just width or just height?
export default function scale(options) {
  let computedScale = options.scale ||
    Math.min(options.maxWidth / options.width, options.maxHeight / options.height);

  computedScale = Math.min(computedScale, options.maxScale || 1);

  return {
    scale: computedScale,
    width: options.width * computedScale,
    height: options.height * computedScale,
  };
}
