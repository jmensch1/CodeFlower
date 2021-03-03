import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { saveSvgAsPng } from 'save-svg-as-png'
import * as d3 from 'd3'
import { useRepo } from 'store/selectors'
import TextButton from 'components/core/TextButton'
import Slider from 'components/core/Slider'
import Checkbox from 'components/core/Checkbox'
import Select from 'components/core/Select'

const useStyles = makeStyles((theme) => ({
  root: {
    userSelect: 'none',
    '& > *': {
      marginBottom: '1.25em',
    }
  },
  instructions: {
    fontSize: '0.875em',
    fontStyle: 'italic',
    marginBottom: '2em',
    textAlign: 'left',
  },
  format: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.875em',
    marginBottom: '1.5em',
    '& > select': {
      width: '4em',
      borderBottom: 'none',
      padding: 0,
      fontSize: '1em',
      userSelect: 'none',
    }
  },
  slider: {
    width: '100%',
    display: 'inline-block',
  },
  button: {
    width: '100%',
    marginTop: '2em',
  },
}))

const FORMATS = ['png', 'svg']
const SCALE_RANGE = [1, 6]

// returns the screen dimensions, viewBox dimensions, and ratio between them
function getSvgDimensions(svg) {
  const screen = svg.getBoundingClientRect()
  const matrix = svg.getCTM().inverse()

  // top-left corner of svg
  const pt0 = svg.createSVGPoint()
  pt0.x = 0
  pt0.y = 0
  const svgPt0 = pt0.matrixTransform(matrix)

  // bottom-right corner
  const pt1 = svg.createSVGPoint()
  pt1.x = screen.width
  pt1.y = screen.height
  const svgPt1 = pt1.matrixTransform(matrix)

  const viewBox = {
    left: svgPt0.x,
    top: svgPt0.y,
    width: svgPt1.x - svgPt0.x,
    height: svgPt1.y - svgPt0.y,
  }

  return {
    screen,
    viewBox,
    ratio: viewBox.width / screen.width,
  }
}

const CameraControls = ({ flash, transparent, setTransparent }) => {
  const repo = useRepo()
  const theme = useTheme()
  const classes = useStyles()
  const [svg, setSvg] = useState(null)
  const [svgDimensions, setSvgDimensions] = useState(null)
  const [format, setFormat] = useState(FORMATS[0])
  const [scale, setScale] = useState(2)
  const [showRepoInfo, setShowRepoInfo] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setSvg(document.querySelector('#fdg-container svg'))
    })
  }, [])

  useEffect(() => {
    if (!svg) return

    const observer = new ResizeObserver(() => {
      setSvgDimensions(getSvgDimensions(svg))
    })

    observer.observe(document.querySelector('#fdg-container'))

    return () => observer.disconnect()
  }, [svg])

  const backgroundColor = useMemo(() => {
    return transparent ? 'transparent' : theme.palette.background.default
  }, [theme, transparent])

  useEffect(() => {
    if (!svg || !repo) return

    const repoInfo = d3
      .select(svg)
      .append('text')
      .attr('class', 'repo-info')
      .text(`${repo.owner} / ${repo.name}`)
      .style('fill', 'white')
      .style('font-size', 16)
      .style('font-family', 'sans-serif')
      .style('visibility', 'hidden')

    return () => repoInfo.remove()
  }, [svg, repo])

  useEffect(() => {
    if (!svg || !svgDimensions) return

    const { left, top, height } = svgDimensions.viewBox

    d3
      .select(svg)
      .select('.repo-info')
      .attr('x', left + 10)
      .attr('y', top + height - 10)
      .style('visibility', showRepoInfo ? 'visible' : 'hidden')
  }, [svg, showRepoInfo, svgDimensions])

  const savePng = useCallback(() => {
    if (!svg || !svgDimensions) return

    const { viewBox, ratio } = svgDimensions
    const adjustedScale = scale / (window.devicePixelRatio * ratio)

    saveSvgAsPng(svg, `${repo.name}.png`, {
      ...viewBox,
      scale: adjustedScale,
      excludeCss: true,
      encoderOptions: 1.0,
      backgroundColor,
    })
  }, [svg, svgDimensions, scale, backgroundColor, repo])

  // http://bl.ocks.org/curran/7cf9967028259ea032e8
  const saveSvg = useCallback(() => {
    const origBackground = svg.style.backgroundColor
    svg.style.backgroundColor = backgroundColor

    const svgAsXML = (new XMLSerializer()).serializeToString(svg)
    const dataURL = "data:image/svg+xml," + encodeURIComponent(svgAsXML)

    const dl = document.createElement('a')
    document.body.appendChild(dl) // This line makes it work in Firefox.
    dl.setAttribute('href', dataURL)
    dl.setAttribute('download', `${repo.name}.svg`)
    dl.click()
    document.body.removeChild(dl)

    setTimeout(() => {
      svg.style.backgroundColor = origBackground
    })
  }, [svg, backgroundColor, repo])

  const download = useCallback(() => {
    flash()
    setTimeout(format === 'svg' ? saveSvg : savePng, 500)
  }, [flash, format, savePng, saveSvg])

  const renderDimensions = useCallback(() => {
    if (!svgDimensions) return null
    const width = (svgDimensions.screen.width * scale).toFixed(0)
    const height = (svgDimensions.screen.height * scale).toFixed(0)
    return `${width} x ${height}`
  }, [svgDimensions, scale])

  return (
    <div className={classes.root}>
      <div className={classes.instructions}>
        Download a snapshot of the main window.
      </div>
      <div className={classes.format}>
        <div>image format</div>
        <Select
          value={format}
          onChange={setFormat}
          options={FORMATS}
        />
      </div>
      {format !== 'svg' && (
        <Slider
          value={scale}
          onChange={setScale}
          range={SCALE_RANGE}
          label='image dimensions'
          renderValue={renderDimensions}
        />
      )}
      <Checkbox
        label='transparent background'
        checked={transparent}
        onChange={setTransparent}
      />
      <Checkbox
        label='stamp owner/name'
        checked={showRepoInfo}
        onChange={setShowRepoInfo}
      />
      <TextButton
        className={classes.button}
        label='download'
        onClick={download}
      />
    </div>
  )
}

export default CameraControls
