import { useEffect } from 'react'
import * as d3 from 'd3'
import { useVisForces } from 'store/selectors'
import { setVisForces } from 'store/actions/settings'
import { useDispatch } from 'react-redux'

const INITIAL_VIS_FORCES = {
  alphaDecay: 0.0228,
  charge: {
    enabled: true,
    strength: -200,
    distanceMin: 1,
    distanceMax: 2000,
  },
  forceXY: {
    enabled: true,
    strength: 0.4,
  },
  link: {
    enabled: true,
    strength: 1,
    distance: {
      files: 10,
      folders: 10,
    },
    iterations: 4,
  },
  center: {
    enabled: true,
    strength: 1,
  },
  collide: {
    enabled: false,
    strength: 0.7,
    iterations: 1,
    radius: 5,
  },
}

export default function useAddForces({ simulation, nodes, links }) {
  const dispatch = useDispatch()
  const visForces = useVisForces()

  useEffect(() => {
    dispatch(setVisForces(INITIAL_VIS_FORCES))
  }, [dispatch])

  // init forces
  useEffect(() => {
    simulation
      .nodes(nodes)
      .force('link', d3.forceLink().links(links))
      .force('charge', d3.forceManyBody())
      .force('collide', d3.forceCollide())
      .force('center', d3.forceCenter())
      .force('forceX', d3.forceX())
      .force('forceY', d3.forceY())
  }, [simulation, nodes, links])

  // update forces
  useEffect(() => {
    if (!visForces) return

    simulation
      .force('center')
      .strength(visForces.center.strength * visForces.center.enabled)
    simulation
      .force('charge')
      .strength(visForces.charge.strength * visForces.charge.enabled)
      .distanceMin(visForces.charge.distanceMin)
      .distanceMax(visForces.charge.distanceMax)
    simulation
      .force('collide')
      .strength(visForces.collide.strength * visForces.collide.enabled)
      .radius(visForces.collide.radius)
      .iterations(visForces.collide.iterations)
    simulation
      .force('forceX')
      .strength(visForces.forceXY.strength * visForces.forceXY.enabled)
    simulation
      .force('forceY')
      .strength(visForces.forceXY.strength * visForces.forceXY.enabled)
    simulation
      .force('link')
      .strength(visForces.link.strength * visForces.link.enabled)
      .distance((d) =>
        d.target.children
          ? visForces.link.distance.folders
          : visForces.link.distance.files
      )
      .iterations(visForces.link.iterations)

    simulation.alphaDecay(visForces.alphaDecay)

    simulation.alpha(1).restart()
  }, [simulation, visForces])
}
