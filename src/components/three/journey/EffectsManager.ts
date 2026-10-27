import * as THREE from "three";

interface SkidSegment {
  mesh: THREE.Mesh;
  opacity: number;
  age: number;
}

interface ConfettiParticle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  rotVelocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

export class EffectsManager {
  private scene: THREE.Scene;

  // Skid Marks
  private skidGroup: THREE.Group;
  private skidSegments: SkidSegment[] = [];
  private readonly MAX_SKIDS = 90;
  private lastSkidTime = 0;
  private skidGeo: THREE.PlaneGeometry;

  // Confetti
  private confettiGroup: THREE.Group;
  private confettiParticles: ConfettiParticle[] = [];
  private confettiGeo: THREE.PlaneGeometry;
  private isConfettiActive = false;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    // Skid marks setup
    this.skidGroup = new THREE.Group();
    this.scene.add(this.skidGroup);
    this.skidGeo = new THREE.PlaneGeometry(0.4, 0.9);
    this.skidGeo.rotateX(-Math.PI / 2);

    // Confetti setup
    this.confettiGroup = new THREE.Group();
    this.scene.add(this.confettiGroup);
    this.confettiGeo = new THREE.PlaneGeometry(0.28, 0.28);
  }

  /**
   * Drops skid marks under the rear wheels if the vehicle is drifting or braking at speed.
   */
  public addSkidMark(
    rearLeftPos: THREE.Vector3,
    rearRightPos: THREE.Vector3,
    angle: number,
    intensity: number
  ) {
    const now = performance.now();
    if (now - this.lastSkidTime < 60) return; // throttle emission
    this.lastSkidTime = now;

    [rearLeftPos, rearRightPos].forEach((pos) => {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x090d16,
        transparent: true,
        opacity: Math.min(0.65, 0.35 + intensity * 0.3),
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(this.skidGeo, mat);
      mesh.position.set(pos.x, 0.025, pos.z);
      mesh.rotation.y = angle;

      this.skidGroup.add(mesh);
      this.skidSegments.push({ mesh, opacity: mat.opacity, age: 0 });
    });

    // Prune oldest segments if over capacity
    while (this.skidSegments.length > this.MAX_SKIDS) {
      const oldest = this.skidSegments.shift();
      if (oldest) {
        this.skidGroup.remove(oldest.mesh);
        (oldest.mesh.material as THREE.Material).dispose();
      }
    }
  }

  /**
   * Triggers a colorful celebratory confetti explosion (e.g. at the Finish Line or unlocking all milestones)
   */
  public launchConfetti(origin: THREE.Vector3, count = 140) {
    const colors = [
      0x38bdf8, 0xf59e0b, 0x10b981, 0xec4899, 0xa855f7, 0xef4444, 0xfacc15,
    ];

    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const mat = new THREE.MeshBasicMaterial({
        color,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(this.confettiGeo, mat);
      mesh.position.copy(origin).add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 6,
          4 + Math.random() * 3,
          (Math.random() - 0.5) * 4
        )
      );

      // Random burst velocity
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        12 + Math.random() * 14,
        (Math.random() - 0.5) * 16
      );

      const rotVelocity = new THREE.Vector3(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 14
      );

      this.confettiGroup.add(mesh);
      this.confettiParticles.push({
        mesh,
        velocity,
        rotVelocity,
        life: 0,
        maxLife: 3.5 + Math.random() * 2.0,
      });
    }

    this.isConfettiActive = true;
  }

  public update(delta: number) {
    // 1. Fade skid marks over time
    for (let i = this.skidSegments.length - 1; i >= 0; i--) {
      const seg = this.skidSegments[i];
      seg.age += delta;
      if (seg.age > 6.0) {
        const mat = seg.mesh.material as THREE.MeshBasicMaterial;
        mat.opacity -= delta * 0.35;
        if (mat.opacity <= 0.01) {
          this.skidGroup.remove(seg.mesh);
          mat.dispose();
          this.skidSegments.splice(i, 1);
        }
      }
    }

    // 2. Confetti physics
    if (this.isConfettiActive && this.confettiParticles.length > 0) {
      const gravity = -14.0;
      for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
        const p = this.confettiParticles[i];
        p.life += delta;

        // Apply velocity & flutter drag
        p.velocity.y += gravity * delta;
        p.velocity.x *= 0.98;
        p.velocity.z *= 0.98;

        p.mesh.position.addScaledVector(p.velocity, delta);
        p.mesh.rotation.x += p.rotVelocity.x * delta;
        p.mesh.rotation.y += p.rotVelocity.y * delta;
        p.mesh.rotation.z += p.rotVelocity.z * delta;

        // Ground bounce / settle
        if (p.mesh.position.y < 0.1) {
          p.mesh.position.y = 0.1;
          p.velocity.set(0, 0, 0);
          p.rotVelocity.set(0, 0, 0);
        }

        if (p.life >= p.maxLife) {
          this.confettiGroup.remove(p.mesh);
          (p.mesh.material as THREE.Material).dispose();
          this.confettiParticles.splice(i, 1);
        }
      }

      if (this.confettiParticles.length === 0) {
        this.isConfettiActive = false;
      }
    }
  }

  public dispose() {
    this.skidSegments.forEach((seg) => {
      this.skidGroup.remove(seg.mesh);
      (seg.mesh.material as THREE.Material).dispose();
    });
    this.skidSegments = [];
    this.skidGeo.dispose();

    this.confettiParticles.forEach((p) => {
      this.confettiGroup.remove(p.mesh);
      (p.mesh.material as THREE.Material).dispose();
    });
    this.confettiParticles = [];
    this.confettiGeo.dispose();

    this.scene.remove(this.skidGroup);
    this.scene.remove(this.confettiGroup);
  }
}
