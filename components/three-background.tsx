"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    // Create floating cards
    const cards: THREE.Mesh[] = []
    const cardGeometry = new THREE.PlaneGeometry(0.8, 1.2)

    const colors = [
      0xd8b4fe, // purple-300
      0xa5b4fc, // indigo-300
      0x93c5fd, // blue-300
      0x7dd3fc, // sky-300
    ]

    for (let i = 0; i < 15; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      })

      const card = new THREE.Mesh(cardGeometry, material)

      // Random position
      card.position.x = (Math.random() - 0.5) * 10
      card.position.y = (Math.random() - 0.5) * 10
      card.position.z = (Math.random() - 0.5) * 5

      // Random rotation
      card.rotation.x = Math.random() * Math.PI
      card.rotation.y = Math.random() * Math.PI

      // Store random movement values
      ;(card as any).moveSpeed = {
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        rotX: (Math.random() - 0.5) * 0.002,
        rotY: (Math.random() - 0.5) * 0.002,
      }

      scene.add(card)
      cards.push(card)
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Animate each card
      cards.forEach((card) => {
        const speed = (card as any).moveSpeed

        card.position.x += speed.x
        card.position.y += speed.y
        card.rotation.x += speed.rotX
        card.rotation.y += speed.rotY

        // Boundary check and reverse direction
        if (Math.abs(card.position.x) > 6) {
          speed.x *= -1
        }
        if (Math.abs(card.position.y) > 6) {
          speed.y *= -1
        }
      })

      renderer.render(scene, camera)
    }

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }

      // Dispose geometries and materials
      cardGeometry.dispose()
      cards.forEach((card) => {
        ;(card.material as THREE.Material).dispose()
      })
    }
  }, [])

  return <div ref={containerRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />
}
