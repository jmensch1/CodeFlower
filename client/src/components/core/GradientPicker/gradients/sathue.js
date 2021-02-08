// import tinycolor from 'tinycolor2'
import { hueGradient } from 'services/utils'

const saturationGradient = ({ alpha, lightness }) => {
  return `
    linear-gradient(
      90deg,
        hsla(0,0%,${lightness}%,${alpha}),
        hsla(0,0%,${lightness}%,0)
    )
  `
}

const SaturationHue = ({
  saturationRange = [0, 100],
  hueRange = [0, 360],
  lightness = 0,
  alpha = 1.0,
  backgroundColor = 'hsla(0, 0%, 0%, 1.0)',
}) => {
  // const backgroundLightness = tinycolor(backgroundColor).toHsl().l * 100
  return [
    saturationGradient({
      alpha: 1,
      lightness,
    }),
    // `
    //   linear-gradient(
    //     90deg,
    //       hsla(0,0%,${backgroundLightness}%,1),
    //       hsla(0,0%,${backgroundLightness}%,0)
    //   )
    // `,
    hueGradient({
      hueMin: hueRange[0],
      hueMax: hueRange[1],
      saturation: 100,
      lightness,
      alpha,
      steps: 20,
      direction: 'bottom',
    }),
  ].join(',')
}

export default SaturationHue
