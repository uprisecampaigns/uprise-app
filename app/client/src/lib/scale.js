
// TODO: handle scaling just width or just height?
export default function scale (options) {
  let scale = options.scale ||
    Math.min(options.maxWidth/options.width, options.maxHeight/options.height);

  scale = Math.min(scale, options.maxScale || 1);

  return {
    scale: scale,
    width: options.width * scale,
    height: options.height * scale
  };
}
