import * as THREE from "three";
import { VehicleControlState, Telemetry } from "./types";
import { journeyAudio } from "./journeyAudio";

interface SpringDamper {
  value: number;
  velocity: number;
  target: number;
  stiffness: number; // spring constant k
  damping: number;   // damping constant c
}

export class Vehicle {
  public group: THREE.Group;
  public position: THREE.Vector3;
  public velocity: THREE.Vector3;
  public angle: number = 0; // heading angle in radians
  public speed: number = 0;
  public steeringAngle: number = 0;
  public isBoosting: boolean = false;
  private boostTimeLeft: number = 0;

  // Visual sub-meshes for animation
  private bodyMesh: THREE.Group;
  private frontLeftWheel: THREE.Group;
  private frontRightWheel: THREE.Group;
  private rearLeftWheel: THREE.Mesh;
  private rearRightWheel: THREE.Mesh;
  private shadowDecal: THREE.Mesh;
  private headlights: THREE.SpotLight[] = [];
  private headlightMeshes: THREE.Mesh[] = [];
  private underglowLight: THREE.PointLight | null = null;
  private isNightMode: boolean = false;
  private hornFlashTimer: number = 0;

  // Physics Springs (Pitch, Roll, Heave)
  private pitchSpring: SpringDamper = {
    value: 0,
    velocity: 0,
    target: 0,
    stiffness: 110.0,
    damping: 9.5,
  };

  private rollSpring: SpringDamper = {
    value: 0,
    velocity: 0,
    target: 0,
    stiffness: 120.0,
    damping: 10.0,
  };

  private heaveSpring: SpringDamper = {
    value: 0,
    velocity: 0,
    target: 0,
    stiffness: 140.0,
    damping: 11.0,
  };

  // Exhaust particles
  private particles: {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    life: number;
    maxLife: number;
  }[] = [];
  private particleGroup: THREE.Group;
  private particleGeo: THREE.SphereGeometry;
  private particleMat: THREE.MeshBasicMaterial;

  // Physics constants
  private readonly ACCELERATION = 34.0;
  private readonly REVERSE_ACCEL = 20.0;
  private readonly MAX_SPEED = 24.0;
  private readonly MAX_REVERSE_SPEED = -10.5;
  private readonly FRICTION = 0.945;
  private readonly BRAKE_FRICTION = 0.86;
  private readonly STEER_SPEED = 7.0;
  private readonly MAX_STEER_ANGLE = 0.54; // ~31 degrees
  private readonly TURN_FACTOR = 2.5;

  constructor() {
    this.group = new THREE.Group();
    this.position = new THREE.Vector3(0, 0, 0);
    this.velocity = new THREE.Vector3(0, 0, 0);

    // Build the soft-ground ambient contact shadow decal
    this.shadowDecal = this.buildContactShadow();
    this.group.add(this.shadowDecal);

    // Build the stylized cyber truck
    this.bodyMesh = new THREE.Group();
    this.buildBody();
    this.group.add(this.bodyMesh);

    // Build wheels
    const wheels = this.buildWheels();
    this.frontLeftWheel = wheels.frontLeft;
    this.frontRightWheel = wheels.frontRight;
    this.rearLeftWheel = wheels.rearLeft;
    this.rearRightWheel = wheels.rearRight;

    // Particle pool for exhaust smoke/boost sparks
    this.particleGroup = new THREE.Group();
    this.group.add(this.particleGroup);
    this.particleGeo = new THREE.SphereGeometry(0.18, 8, 8);
    this.particleMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.55,
    });
  }

  /**
   * Studio-grade soft contact shadow directly under the vehicle chassis.
   * Gives objects that tactile, physical diorama grounding.
   */
  private buildContactShadow(): THREE.Mesh {
    const canvas = typeof document !== "undefined" ? document.createElement("canvas") : null;
    let texture: THREE.CanvasTexture | null = null;

    if (canvas) {
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
        gradient.addColorStop(0, "rgba(0, 0, 0, 0.75)");
        gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.45)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        texture = new THREE.CanvasTexture(canvas);
      }
    }

    const geo = new THREE.PlaneGeometry(3.6, 5.8);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 0.03;
    return mesh;
  }

  private buildBody() {
    // 1. Lower chassis / frame with bevelled side skirts
    const chassisGeo = new THREE.BoxGeometry(2.2, 0.45, 4.2);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.35,
      metalness: 0.75,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 0.5;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    this.bodyMesh.add(chassis);

    // Aerodynamic side skirts
    [-1.15, 1.15].forEach((x) => {
      const skirt = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.25, 2.6),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
      );
      skirt.position.set(x, 0.35, 0);
      this.bodyMesh.add(skirt);
    });

    // 2. Main vehicle cabin / bodywork (Cyber blue finish with metallic sheen)
    const cabinGeo = new THREE.BoxGeometry(2.0, 0.72, 3.2);
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.2,
      metalness: 0.65,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.18,
    });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.position.set(0, 1.0, -0.2);
    cabin.castShadow = true;
    cabin.receiveShadow = true;
    this.bodyMesh.add(cabin);

    // Front hood slope wedge
    const hoodGeo = new THREE.BoxGeometry(1.96, 0.35, 0.9);
    const hood = new THREE.Mesh(hoodGeo, cabinMat);
    hood.position.set(0, 0.8, 1.55);
    hood.rotation.x = 0.15;
    hood.castShadow = true;
    this.bodyMesh.add(hood);

    // 3. Cabin roof & tinted windshield
    const roofGeo = new THREE.BoxGeometry(1.68, 0.65, 1.8);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.6,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.set(0, 1.6, -0.4);
    roof.castShadow = true;
    this.bodyMesh.add(roof);

    // Windshield glass with cyan sky reflection
    const windshieldGeo = new THREE.BoxGeometry(1.62, 0.52, 0.05);
    const windshieldMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.08,
      metalness: 0.95,
      transparent: true,
      opacity: 0.82,
    });
    const windshield = new THREE.Mesh(windshieldGeo, windshieldMat);
    windshield.position.set(0, 1.55, 0.52);
    windshield.rotation.x = 0.25;
    this.bodyMesh.add(windshield);

    // 4. Neon Cyber Accents (Amber side stripes)
    const stripeGeo = new THREE.BoxGeometry(2.06, 0.1, 3.0);
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.9,
    });
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0, 0.96, -0.2);
    this.bodyMesh.add(stripe);

    // 5. Rear Racing Wing / Spoiler
    const spoilerGeo = new THREE.BoxGeometry(2.0, 0.08, 0.42);
    const spoilerMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.85,
    });
    const spoiler = new THREE.Mesh(spoilerGeo, spoilerMat);
    spoiler.position.set(0, 1.62, -1.8);
    spoiler.castShadow = true;
    this.bodyMesh.add(spoiler);

    [-0.7, 0.7].forEach((x) => {
      const strutGeo = new THREE.BoxGeometry(0.08, 0.42, 0.1);
      const strut = new THREE.Mesh(strutGeo, spoilerMat);
      strut.position.set(x, 1.4, -1.8);
      this.bodyMesh.add(strut);
    });

    // Rear aerodynamic diffuser
    const diffuser = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.18, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x020617, metalness: 0.9 })
    );
    diffuser.position.set(0, 0.38, -2.1);
    this.bodyMesh.add(diffuser);

    // 6. Front Headlights & Cones
    [-0.75, 0.75].forEach((x) => {
      const lightMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      lightMesh.position.set(x, 0.85, 1.95);
      this.bodyMesh.add(lightMesh);
      this.headlightMeshes.push(lightMesh);

      // SpotLight projecting light beam forward onto the road
      const spot = new THREE.SpotLight(0xfffbeb, 2.8, 26, Math.PI / 6, 0.4, 1.5);
      spot.position.set(x, 0.85, 1.95);
      const spotTarget = new THREE.Object3D();
      spotTarget.position.set(x, 0, 14);
      this.bodyMesh.add(spotTarget);
      spot.target = spotTarget;
      this.bodyMesh.add(spot);
      this.headlights.push(spot);
    });

    // 6.1 Cyberpunk Chassis Underglow Light (Electric Cyan)
    const underglow = new THREE.PointLight(0x06b6d4, 0, 8.5);
    underglow.position.set(0, 0.25, 0);
    this.bodyMesh.add(underglow);
    this.underglowLight = underglow;

    // 7. Rear Tail Lights (Glowing Crimson LED strip)
    [-0.75, 0.75].forEach((x) => {
      const tailLight = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.12, 0.06),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      tailLight.position.set(x, 0.85, -1.95);
      this.bodyMesh.add(tailLight);
    });
  }

  private buildWheels() {
    const tireGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.4, 20);
    tireGeo.rotateZ(Math.PI / 2);

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.75,
      metalness: 0.25,
    });

    const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.42, 14);
    rimGeo.rotateZ(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.15,
      metalness: 0.85,
    });

    const createWheelMesh = () => {
      const wheelGroup = new THREE.Group();
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.castShadow = true;
      const rim = new THREE.Mesh(rimGeo, rimMat);
      wheelGroup.add(tire);
      wheelGroup.add(rim);
      return wheelGroup;
    };

    // Front Left (steering group -> rolling wheel)
    const flGroup = new THREE.Group();
    flGroup.position.set(1.15, 0.48, 1.2);
    const flMesh = createWheelMesh();
    flGroup.add(flMesh);
    this.group.add(flGroup);

    // Front Right
    const frGroup = new THREE.Group();
    frGroup.position.set(-1.15, 0.48, 1.2);
    const frMesh = createWheelMesh();
    frGroup.add(frMesh);
    this.group.add(frGroup);

    // Rear Left
    const rlMesh = createWheelMesh();
    rlMesh.position.set(1.15, 0.48, -1.2);
    this.group.add(rlMesh);

    // Rear Right
    const rrMesh = createWheelMesh();
    rrMesh.position.set(-1.15, 0.48, -1.2);
    this.group.add(rrMesh);

    return {
      frontLeft: flGroup,
      frontRight: frGroup,
      rearLeft: rlMesh as unknown as THREE.Mesh,
      rearRight: rrMesh as unknown as THREE.Mesh,
    };
  }

  public triggerTurboBoost(duration = 2.5) {
    this.isBoosting = true;
    this.boostTimeLeft = duration;
    this.speed = Math.max(this.speed, 32.0);
    // Suspension impulse on boost launch
    this.pitchSpring.velocity += 1.4;
    this.heaveSpring.velocity += 1.2;
    journeyAudio.playBoost();
  }

  public resetPosition(x = 0, y = 0, z = 0, angle = 0) {
    this.position.set(x, y, z);
    this.velocity.set(0, 0, 0);
    this.speed = 0;
    this.angle = angle;
    this.group.position.copy(this.position);
    this.group.rotation.set(0, this.angle, 0);

    this.pitchSpring.value = 0;
    this.pitchSpring.velocity = 0;
    this.rollSpring.value = 0;
    this.rollSpring.velocity = 0;
    this.heaveSpring.value = 0;
    this.heaveSpring.velocity = 0;
  }

  public getTelemetry(): Telemetry {
    return {
      x: this.position.x,
      z: this.position.z,
      angle: this.angle,
      speed: this.speed,
      boosting: this.isBoosting,
    };
  }

  public setNightMode(enabled: boolean) {
    this.isNightMode = enabled;
  }

  public triggerHornFlash() {
    this.hornFlashTimer = 0.28;
    journeyAudio.playHorn();
  }

  /**
   * Evaluates a 2nd-order damped harmonic spring oscillator.
   */
  private stepSpring(spring: SpringDamper, delta: number) {
    const displacement = spring.value - spring.target;
    const springForce = -spring.stiffness * displacement;
    const dampingForce = -spring.damping * spring.velocity;
    const acceleration = springForce + dampingForce;

    spring.velocity += acceleration * delta;
    spring.value += spring.velocity * delta;
  }

  public update(delta: number, controls: VehicleControlState) {
    // 0. Update Horn Flash and Dynamic Headlights / Underglow
    if (this.hornFlashTimer > 0) {
      this.hornFlashTimer -= delta;
    }

    const baseHeadlightIntensity = this.isNightMode ? 9.5 : 2.8;
    const baseDistance = this.isNightMode ? 42 : 26;
    const isHonking = this.hornFlashTimer > 0;
    const finalIntensity = isHonking ? 24.0 : baseHeadlightIntensity;

    this.headlights.forEach((spot) => {
      spot.intensity = finalIntensity;
      spot.distance = isHonking ? 55 : baseDistance;
    });

    if (this.underglowLight) {
      const targetUnderglow = this.isNightMode ? (this.isBoosting ? 6.5 : 3.8) : 0;
      this.underglowLight.intensity = THREE.MathUtils.lerp(
        this.underglowLight.intensity,
        targetUnderglow,
        0.1
      );
    }

    // 1. Handle Turbo Boost duration
    if (this.isBoosting) {
      this.boostTimeLeft -= delta;
      if (this.boostTimeLeft <= 0) {
        this.isBoosting = false;
      }
    }

    const currentMaxSpeed = this.isBoosting ? 38.0 : this.MAX_SPEED;
    const accel = this.isBoosting ? this.ACCELERATION * 1.5 : this.ACCELERATION;

    // 2. Acceleration / Reversing / Braking
    let isAccelerating = false;
    if (controls.forward) {
      this.speed += accel * delta;
      if (this.speed > currentMaxSpeed) this.speed = currentMaxSpeed;
      isAccelerating = true;
    } else if (controls.backward) {
      this.speed -= this.REVERSE_ACCEL * delta;
      if (this.speed < this.MAX_REVERSE_SPEED) this.speed = this.MAX_REVERSE_SPEED;
      isAccelerating = true;
    } else {
      // Natural rolling friction deceleration
      this.speed *= Math.pow(this.FRICTION, delta * 60);
      if (Math.abs(this.speed) < 0.05) this.speed = 0;
    }

    if (controls.brake) {
      this.speed *= Math.pow(this.BRAKE_FRICTION, delta * 60);
    }

    // 3. Steering interpolation
    let targetSteer = 0;
    if (controls.left) targetSteer += this.MAX_STEER_ANGLE;
    if (controls.right) targetSteer -= this.MAX_STEER_ANGLE;

    this.steeringAngle = THREE.MathUtils.lerp(
      this.steeringAngle,
      targetSteer,
      this.STEER_SPEED * delta
    );

    // Apply wheel turning
    this.frontLeftWheel.rotation.y = this.steeringAngle;
    this.frontRightWheel.rotation.y = this.steeringAngle;

    // 4. Turn Vehicle based on steering and speed with realistic low-speed vs high-speed curves
    if (Math.abs(this.speed) > 0.1) {
      const turnDir = this.speed > 0 ? 1 : -1;
      const speedRatio = Math.abs(this.speed) / currentMaxSpeed;
      // High speed reduces turning radius slightly (understeer curve)
      const dynamicTurnFactor = this.TURN_FACTOR * (1.1 - speedRatio * 0.25);
      this.angle += this.steeringAngle * speedRatio * dynamicTurnFactor * turnDir * delta;
    }

    // 5. Update Position
    const moveX = Math.sin(this.angle) * this.speed * delta;
    const moveZ = Math.cos(this.angle) * this.speed * delta;
    this.position.x += moveX;
    this.position.z += moveZ;

    this.group.position.set(this.position.x, 0, this.position.z);
    this.group.rotation.y = this.angle;

    // 6. Roll wheels forward/backward
    const rollAngle = (this.speed * delta) / 0.48;
    this.frontLeftWheel.children[0].rotation.x += rollAngle;
    this.frontRightWheel.children[0].rotation.x += rollAngle;
    this.rearLeftWheel.rotation.x += rollAngle;
    this.rearRightWheel.rotation.x += rollAngle;

    // 7. Advanced Suspension Dynamics (Damped Harmonic Spring Oscillations)
    // Pitch: Squats back on acceleration, dives forward on braking
    const accelIntensity = controls.forward ? -0.1 : controls.backward ? 0.09 : controls.brake ? 0.14 : 0;
    this.pitchSpring.target = accelIntensity * (Math.abs(this.speed) / currentMaxSpeed);
    this.stepSpring(this.pitchSpring, delta);

    // Roll: Centripetal roll towards the outside of curves
    const rollIntensity = -this.steeringAngle * (this.speed / currentMaxSpeed) * 0.26;
    this.rollSpring.target = rollIntensity;
    this.stepSpring(this.rollSpring, delta);

    // Heave: Subtle road vibration and chassis settling
    const roadVibration = Math.abs(this.speed) > 2.0 ? (Math.random() - 0.5) * 0.015 : 0;
    this.heaveSpring.target = roadVibration;
    this.stepSpring(this.heaveSpring, delta);

    // Apply combined suspension spring transformation to chassis body
    this.bodyMesh.rotation.x = this.pitchSpring.value;
    this.bodyMesh.rotation.z = this.rollSpring.value;
    this.bodyMesh.position.y = this.heaveSpring.value;

    // 8. Lateral tire slip & procedural asphalt skid audio
    const slipRatio = Math.abs(this.steeringAngle) * (Math.abs(this.speed) / this.MAX_SPEED);
    const brakeMultiplier = controls.brake ? 2.2 : 1.0;
    const driftIntensity = Math.min(1.0, slipRatio * 1.5 * brakeMultiplier);
    journeyAudio.updateSkid(driftIntensity > 0.35 ? driftIntensity : 0);

    // 9. Engine audio update (RPM harmonics & throttle)
    const normSpeed = Math.min(1.0, Math.abs(this.speed) / this.MAX_SPEED);
    journeyAudio.updateEngine(normSpeed, isAccelerating);

    // 10. Emit exhaust particles when driving
    if (Math.abs(this.speed) > 2.0 && Math.random() < 0.4) {
      this.emitExhaustParticle();
    }
    this.updateParticles(delta);
  }

  private emitExhaustParticle() {
    if (this.particles.length > 25) return;

    const pMesh = new THREE.Mesh(this.particleGeo, this.particleMat);
    // Position at rear bumper in world space
    const offset = new THREE.Vector3(0, 0.4, -2.0).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.angle
    );
    pMesh.position.copy(this.position).add(offset);
    this.group.parent?.add(pMesh);

    const pVel = new THREE.Vector3(
      (Math.random() - 0.5) * 1.5,
      1.0 + Math.random() * 1.5,
      (Math.random() - 0.5) * 1.5
    );

    this.particles.push({
      mesh: pMesh,
      velocity: pVel,
      life: 0,
      maxLife: 0.5 + Math.random() * 0.3,
    });
  }

  private updateParticles(delta: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += delta;
      p.mesh.position.addScaledVector(p.velocity, delta);

      const progress = p.life / p.maxLife;
      const scale = 1.0 + progress * 2.5;
      p.mesh.scale.set(scale, scale, scale);

      if (p.life >= p.maxLife) {
        this.group.parent?.remove(p.mesh);
        p.mesh.geometry.dispose();
        this.particles.splice(i, 1);
      }
    }
  }

  public isDrifting(): boolean {
    return (
      Math.abs(this.speed) > 8.5 &&
      (Math.abs(this.steeringAngle) > 0.15 || this.isBoosting)
    );
  }

  public getRearWheelPositions(): { left: THREE.Vector3; right: THREE.Vector3 } {
    const leftLocal = new THREE.Vector3(1.15, 0.05, -1.2).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.angle
    );
    const rightLocal = new THREE.Vector3(-1.15, 0.05, -1.2).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.angle
    );
    return {
      left: new THREE.Vector3().copy(this.position).add(leftLocal),
      right: new THREE.Vector3().copy(this.position).add(rightLocal),
    };
  }

  public dispose() {
    this.particleGeo.dispose();
    this.particleMat.dispose();
    this.particles.forEach((p) => {
      this.group.parent?.remove(p.mesh);
    });
  }
}
