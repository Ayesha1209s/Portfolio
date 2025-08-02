// Global variables
let scene, camera, renderer
let heroGlobe, aboutCube, contactTorus
const skillSpheres = []
const particles = []

// Import THREE.js
const THREE = window.THREE

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initFloatingParticles()
  initHero3D()
  initAbout3D()
  initSkills3D()
  initContact3D()
  initScrollAnimations()
  initNavigation()
  initContactForm()

  // Start animation loop
  animate()
})

// Floating Particles
function initFloatingParticles() {
  const particlesContainer = document.getElementById("particles")

  for (let i = 0; i < 50; i++) {
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.left = Math.random() * 100 + "%"
    particle.style.top = Math.random() * 100 + "%"
    particle.style.animationDelay = Math.random() * 6 + "s"
    particle.style.animationDuration = Math.random() * 3 + 3 + "s"
    particlesContainer.appendChild(particle)
  }
}

// Hero 3D Globe
function initHero3D() {
  const container = document.getElementById("hero-canvas")
  if (!container) return

  // Scene setup
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

  renderer.setSize(container.offsetWidth, container.offsetHeight)
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  // Globe
  const geometry = new THREE.SphereGeometry(2, 32, 32)
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  })
  heroGlobe = new THREE.Mesh(geometry, material)
  scene.add(heroGlobe)

  // Floating particles
  const particleGeometry = new THREE.BufferGeometry()
  const particleCount = 100
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.05,
  })
  const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particleSystem)

  camera.position.z = 5

  // Animation
  function animateHero() {
    requestAnimationFrame(animateHero)

    if (heroGlobe) {
      heroGlobe.rotation.y += 0.005
    }

    particleSystem.rotation.y += 0.001
    particleSystem.rotation.x += 0.0005

    renderer.render(scene, camera)
  }
  animateHero()

  // Handle resize
  window.addEventListener("resize", () => {
    camera.aspect = container.offsetWidth / container.offsetHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.offsetWidth, container.offsetHeight)
  })
}

// About 3D Cube
function initAbout3D() {
  const container = document.getElementById("about-canvas")
  if (!container) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

  renderer.setSize(container.offsetWidth, container.offsetHeight)
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  // Cube
  const geometry = new THREE.BoxGeometry(2, 2, 2)
  const material = new THREE.MeshBasicMaterial({
    color: 0x9d4edd,
    wireframe: true,
    transparent: true,
    opacity: 0.7,
  })
  aboutCube = new THREE.Mesh(geometry, material)
  scene.add(aboutCube)

  camera.position.z = 5

  // Animation
  function animateAbout() {
    requestAnimationFrame(animateAbout)

    if (aboutCube) {
      aboutCube.rotation.x += 0.01
      aboutCube.rotation.y += 0.01
    }

    renderer.render(scene, camera)
  }
  animateAbout()

  // Handle resize
  window.addEventListener("resize", () => {
    camera.aspect = container.offsetWidth / container.offsetHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.offsetWidth, container.offsetHeight)
  })
}

// Skills 3D Spheres
function initSkills3D() {
  const container = document.getElementById("skills-canvas")
  if (!container) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

  renderer.setSize(container.offsetWidth, container.offsetHeight)
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
  scene.add(ambientLight)

  // Add point light
  const pointLight = new THREE.PointLight(0xffffff, 1, 100)
  pointLight.position.set(10, 10, 10)
  scene.add(pointLight)

  // Create skill spheres with labels
  const skills = [
    { name: "Java", position: [-3, 2, 0], color: 0x00ffff },
    { name: "Python", position: [3, 2, 0], color: 0x9d4edd },
    { name: "JavaScript", position: [-2, -1, 1], color: 0x00ffff },
    { name: "React.js", position: [2, -1, 1], color: 0x9d4edd },
    { name: "Node.js", position: [0, 0, -2], color: 0x00ffff },
    { name: "Security", position: [-1, 1, 2], color: 0x9d4edd },
    { name: "SQL", position: [1, -2, 0], color: 0x00ffff },
  ]

  const skillMeshes = []

  skills.forEach((skill, index) => {
    // Create sphere geometry
    const geometry = new THREE.SphereGeometry(0.5, 16, 16)

    // Create material with emissive properties for glow effect
    const material = new THREE.MeshStandardMaterial({
      color: skill.color,
      emissive: skill.color,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.8,
    })

    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(...skill.position)

    // Add to scene and store reference
    scene.add(sphere)
    skillMeshes.push({ mesh: sphere, originalY: skill.position[1], index })

    // Create text label (HTML overlay)
    const labelDiv = document.createElement("div")
    labelDiv.className = "skill-label"
    labelDiv.textContent = skill.name
    labelDiv.style.position = "absolute"
    labelDiv.style.color = "#fff"
    labelDiv.style.fontSize = "12px"
    labelDiv.style.fontWeight = "bold"
    labelDiv.style.background = "rgba(0,0,0,0.7)"
    labelDiv.style.padding = "4px 8px"
    labelDiv.style.borderRadius = "4px"
    labelDiv.style.pointerEvents = "none"
    labelDiv.style.transform = "translate(-50%, -50%)"
    labelDiv.style.zIndex = "10"
    container.appendChild(labelDiv)

    // Store label reference
    sphere.userData.label = labelDiv
  })

  camera.position.set(0, 0, 8)

  // Mouse interaction
  const mouse = new THREE.Vector2()
  const raycaster = new THREE.Raycaster()
  let hoveredSphere = null

  container.addEventListener("mousemove", (event) => {
    const rect = container.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(skillMeshes.map((s) => s.mesh))

    // Reset previous hover
    if (hoveredSphere) {
      hoveredSphere.scale.set(1, 1, 1)
      hoveredSphere.material.emissiveIntensity = 0.2
    }

    if (intersects.length > 0) {
      hoveredSphere = intersects[0].object
      hoveredSphere.scale.set(1.3, 1.3, 1.3)
      hoveredSphere.material.emissiveIntensity = 0.5
    } else {
      hoveredSphere = null
    }
  })

  // Animation loop
  function animateSkills() {
    requestAnimationFrame(animateSkills)

    const time = Date.now() * 0.001

    skillMeshes.forEach((skillObj) => {
      const { mesh, originalY, index } = skillObj

      // Floating animation
      mesh.position.y = originalY + Math.sin(time * 0.5 + index) * 0.3

      // Rotation
      mesh.rotation.y += 0.01
      mesh.rotation.x += 0.005

      // Update label position
      if (mesh.userData.label) {
        const vector = new THREE.Vector3()
        mesh.getWorldPosition(vector)
        vector.project(camera)

        const x = (vector.x * 0.5 + 0.5) * container.offsetWidth
        const y = (vector.y * -0.5 + 0.5) * container.offsetHeight

        mesh.userData.label.style.left = x + "px"
        mesh.userData.label.style.top = y + "px"
        mesh.userData.label.style.opacity = vector.z < 1 ? "1" : "0"
      }
    })

    // Auto-rotate camera slightly
    camera.position.x = Math.sin(time * 0.1) * 2
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)
  }

  animateSkills()

  // Handle resize
  window.addEventListener("resize", () => {
    if (container.offsetWidth > 0 && container.offsetHeight > 0) {
      camera.aspect = container.offsetWidth / container.offsetHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.offsetWidth, container.offsetHeight)
    }
  })
}

// Contact 3D Torus
function initContact3D() {
  const container = document.getElementById("contact-canvas")
  if (!container) return

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

  renderer.setSize(container.offsetWidth, container.offsetHeight)
  renderer.setClearColor(0x000000, 0)
  container.appendChild(renderer.domElement)

  // Torus
  const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100)
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0.6,
  })
  contactTorus = new THREE.Mesh(geometry, material)
  scene.add(contactTorus)

  camera.position.z = 5

  // Animation
  function animateContact() {
    requestAnimationFrame(animateContact)

    if (contactTorus) {
      contactTorus.rotation.x += 0.01
      contactTorus.rotation.y += 0.02
    }

    renderer.render(scene, camera)
  }
  animateContact()

  // Handle resize
  window.addEventListener("resize", () => {
    camera.aspect = container.offsetWidth / container.offsetHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.offsetWidth, container.offsetHeight)
  })
}

// Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Add animation classes and observe elements
  const animatedElements = document.querySelectorAll(
    ".skill-category, .project-card, .experience-item, .certification-card",
  )
  animatedElements.forEach((el, index) => {
    el.classList.add("fade-in")
    el.style.transitionDelay = `${index * 0.1}s`
    observer.observe(el)
  })

  // Parallax effect for hero
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const heroContent = document.querySelector(".hero-content")
    const hero3D = document.querySelector(".hero-3d")

    if (heroContent && hero3D) {
      heroContent.style.transform = `translateY(${scrolled * 0.5}px)`
      hero3D.style.transform = `translateY(${scrolled * 0.3}px)`
    }

    // Navbar background
    const navbar = document.querySelector(".navbar")
    if (scrolled > 100) {
      navbar.style.background = "rgba(10, 25, 47, 0.95)"
    } else {
      navbar.style.background = "rgba(10, 25, 47, 0.9)"
    }
  })
}

// Navigation
function initNavigation() {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Mobile menu toggle
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })
  }
}

// Contact Form
function initContactForm() {
  const form = document.querySelector(".contact-form")
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const formData = new FormData(form)
      const name = form.querySelector('input[type="text"]').value
      const email = form.querySelector('input[type="email"]').value
      const subject = form.querySelector('input[placeholder="Subject"]').value
      const message = form.querySelector("textarea").value

      // Simple validation
      if (!name || !email || !subject || !message) {
        alert("Please fill in all fields")
        return
      }

      // Simulate form submission
      const submitBtn = form.querySelector('button[type="submit"]')
      const originalText = submitBtn.textContent
      submitBtn.textContent = "Sending..."
      submitBtn.disabled = true

      setTimeout(() => {
        alert("Message sent successfully!")
        form.reset()
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }, 2000)
    })
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate)

  // Add any global animations here
  const time = Date.now() * 0.001

  // Animate floating particles
  document.querySelectorAll(".particle").forEach((particle, index) => {
    const speed = 0.5 + Math.random() * 0.5
    const amplitude = 50 + Math.random() * 50
    particle.style.transform = `translateY(${Math.sin(time * speed + index) * amplitude}px)`
  })
}

// Utility functions
function lerp(start, end, factor) {
  return start + (end - start) * factor
}

function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
}

// Handle window resize
window.addEventListener("resize", () => {
  // Update any responsive elements here
  const canvases = document.querySelectorAll("canvas")
  canvases.forEach((canvas) => {
    const container = canvas.parentElement
    if (container) {
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
    }
  })
})

// Add some interactive hover effects
document.addEventListener("mousemove", (e) => {
  const cursor = { x: e.clientX, y: e.clientY }

  // Add subtle parallax to skill categories
  document.querySelectorAll(".skill-category").forEach((card) => {
    const rect = card.getBoundingClientRect()
    const cardCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }

    const distance = Math.sqrt(Math.pow(cursor.x - cardCenter.x, 2) + Math.pow(cursor.y - cardCenter.y, 2))

    if (distance < 200) {
      const strength = (200 - distance) / 200
      const moveX = (cursor.x - cardCenter.x) * strength * 0.1
      const moveY = (cursor.y - cardCenter.y) * strength * 0.1

      card.style.transform = `translate(${moveX}px, ${moveY}px)`
    } else {
      card.style.transform = "translate(0px, 0px)"
    }
  })
})

// Add glow effect to buttons on hover
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("mouseenter", function () {
    this.style.boxShadow = "0 0 20px rgba(0, 255, 255, 0.5)"
  })

  btn.addEventListener("mouseleave", function () {
    this.style.boxShadow = "none"
  })
})

// Add typing effect to hero subtitle
function typeWriter(element, text, speed = 100) {
  let i = 0
  element.textContent = ""

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }

  type()
}

// Initialize typing effect when page loads
window.addEventListener("load", () => {
  const subtitle = document.querySelector(".hero-subtitle")
  if (subtitle) {
    const originalText = subtitle.textContent
    setTimeout(() => {
      typeWriter(subtitle, originalText, 50)
    }, 1000)
  }
})
