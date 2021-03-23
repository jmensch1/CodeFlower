import React, { useEffect, useCallback, useState } from 'react'
import * as d3 from 'd3'
import { makeStyles } from '@material-ui/core/styles'
import { useSelectedFolder, useCamera } from 'store/selectors'
import useAddStyles from './useAddStyles'
import useAddForces from './useAddForces'
import useAddMouse from './useAddMouse'
import useAddZoom from './useAddZoom'
import Extras from './Extras'
import useKeyPressed from 'hooks/useKeyPressed'

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    '& > svg': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      cursor: ({ inDragMode }) => (inDragMode ? 'grab' : 'default'),
      '& .file': {
        cursor: ({ inDragMode }) => (inDragMode ? 'inherit' : 'pointer'),
      },
      '& circle:not(.file)': {
        cursor: ({ inDragMode }) => (inDragMode ? 'inherit' : 'move'),
      },
    },
  },
}))

const Enhancers = ({ visElements, inDragMode }) => {
  const {
    svg,
    nodes,
    nodeG,
    node,
    links,
    linkG,
    link,
    simulation,
  } = visElements

  useAddStyles({ svg, node, nodeG, link, linkG })
  useAddForces({ simulation, nodes, links })
  useAddMouse({ node, simulation, inDragMode })
  useAddZoom({ svg, node, link, inDragMode })

  return null
}

const ForceDirectedGraph = () => {
  /*
    NOTE: hold shift to enter drag mode. This will disable the tooltip
    and node-drag functionality, which is useful when the nodes are so
    large that they fill all or most of the screen, and would effectively
    block the full-vis-drag functionality from d3.zoom.
  */
  const inDragMode = useKeyPressed('Shift')
  const classes = useStyles({ inDragMode })
  const tree = useSelectedFolder()
  const [visElements, setVisElements] = useState(null)
  const [alpha, setAlpha] = useState(0)
  const [restartKey, setRestartKey] = useState(0)
  const { showAperture } = useCamera()

  useEffect(() => {
    if (!tree) return

    //// DATA ////

    const root = d3.hierarchy(tree)

    // remove unknown languages
    const nodes = root.descendants().filter((n) => !n.data.languageUnknown)
    const links = root.links().filter((l) => !l.target.data.languageUnknown)

    // this ensures that larger nodes are on top of smaller ones,
    // and you don't get the weird look where the smaller ones are on
    // top but the links are invisible
    nodes.sort((a, b) => (a.data.size || 0) - (b.data.size || 0))

    //// DOM ////

    const container = document.querySelector('#vis-container')
    const { width, height } = container.getBoundingClientRect()
    const svg = d3
      .select(container)
      .append('svg')
      .attr('viewBox', [-width / 2, -height / 2, width, height])

    // highlight the viewbox (testing only)
    // svg
    //   .append('rect')
    //   .attr('x', -width / 2)
    //   .attr('y', -height / 2)
    //   .attr('width', width)
    //   .attr('height', height)
    //   .style('stroke', 'red')
    //   .style('stroke-width', 4)
    //   .style('fill', 'transparent')

    const linkG = svg.append('g').attr('class', 'links')

    const link = linkG
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('class', 'link')

    const nodeG = svg.append('g').attr('class', 'nodes')

    const node = nodeG
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('class', (d) => (d.children ? 'folder' : 'file'))

    //// SIMULATION ////

    const simulation = d3.forceSimulation().stop()

    simulation
      .on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y)

        node.attr('cx', (d) => d.x).attr('cy', (d) => d.y)

        setAlpha(simulation.alpha())
      })
      .on('end', () => setAlpha(0))

    //// FINISH ////

    setVisElements({ svg, nodes, nodeG, node, links, linkG, link, simulation })
    return () => {
      container.innerHTML = ''
    }
  }, [tree, restartKey])

  const restart = useCallback(() => {
    setRestartKey((key) => 1 - key)
  }, [])

  return (
    <>
      <div className={classes.root} id="vis-container" />
      {visElements && (
        <>
          <Enhancers visElements={visElements} inDragMode={inDragMode} />
          {!showAperture && <Extras alpha={alpha} onRestart={restart} />}
        </>
      )}
    </>
  )
}

export default ForceDirectedGraph
