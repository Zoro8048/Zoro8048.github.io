import * as THREE from "three";
import { JOURNEY_ZONES } from "./zonesData";
import { DynamicObstacle } from "./types";
import { getTrackPoints, ROAD_WIDTH } from "./track";
import {
  createTextTexture,
  createCheckeredTexture,
  createContactShadowTexture,
} from "./textures";

export interface WorldBuildResult {
  group: THREE.Group;
  dynamicObstacles: DynamicObstacle[];
  boostPadBounds: { xMin: number; xMax: number; zMin: number; zMax: number };
  lightBeams: { zoneId: string; mesh: THREE.Mesh }[];
}

export class WorldBuilder {
  private group: THREE.Group;
  private dynamicObstacles: DynamicObstacle[] = [];
  private boostPadBounds = { xMin: -52, xMax: -40, zMin: -52, zMax: -40 };
  private lightBeams: { zoneId: string; mesh: THREE.Mesh }[] = [];

  constructor() {
    this.group = new THREE.Group();
  }

  public build(): WorldBuildResult {
    this.buildTerrain();
    this.buildContinuousRoad();
    this.buildMilestoneZones();
    this.buildScenery();

    return {
      group: this.group,
      dynamicObstacles: this.dynamicObstacles,
      boostPadBounds: this.boostPadBounds,
      lightBeams: this.lightBeams,
    };
  }

  // 1. Sleek Terrain with subtle grid
  private buildTerrain() {
    const terrainGeo = new THREE.PlaneGeometry(360, 360, 40, 40);
    terrainGeo.rotateX(-Math.PI / 2);

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f1d,
      roughness: 0.9,
      metalness: 0.1,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.y = -0.05;
    terrain.receiveShadow = true;
    this.group.add(terrain);

    // Warm aesthetic coordinate grid
    const grid = new THREE.GridHelper(360, 72, 0x1e3a8a, 0x0f172a);
    grid.position.y = -0.03;
    this.group.add(grid);
  }

  // Helper to add soft radial ambient occlusion contact shadows
  private addContactShadow(
    parent: THREE.Group,
    x: number,
    y: number,
    z: number,
    width: number,
    length: number,
    opacity = 0.7
  ): THREE.Mesh {
    const geo = new THREE.PlaneGeometry(width, length);
    geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      opacity,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(geo, mat);
    shadow.position.set(x, y + 0.02, z);
    parent.add(shadow);
    return shadow;
  }

  // 2. Continuous Road Network built along the CatmullRom track curve with race kerbs & runway lights
  private buildContinuousRoad() {
    const points = getTrackPoints(400);

    // Build ribbon road mesh
    const roadVertices: number[] = [];
    const roadUvs: number[] = [];
    const roadIndices: number[] = [];

    const halfWidth = ROAD_WIDTH / 2;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const nextP = points[(i + 1) % points.length];
      const tangent = new THREE.Vector3().subVectors(nextP, p).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      const left = new THREE.Vector3().copy(p).addScaledVector(normal, halfWidth);
      const right = new THREE.Vector3().copy(p).addScaledVector(normal, -halfWidth);

      roadVertices.push(left.x, 0.02, left.z);
      roadVertices.push(right.x, 0.02, right.z);

      const u = i / (points.length - 1);
      roadUvs.push(0, u * 40);
      roadUvs.push(1, u * 40);

      if (i < points.length - 1) {
        const idx = i * 2;
        roadIndices.push(idx, idx + 1, idx + 2);
        roadIndices.push(idx + 1, idx + 3, idx + 2);
      }
    }

    const roadGeo = new THREE.BufferGeometry();
    roadGeo.setAttribute("position", new THREE.Float32BufferAttribute(roadVertices, 3));
    roadGeo.setAttribute("uv", new THREE.Float32BufferAttribute(roadUvs, 2));
    roadGeo.setIndex(roadIndices);
    roadGeo.computeVertexNormals();

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.65,
      metalness: 0.25,
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.receiveShadow = true;
    this.group.add(roadMesh);

    // Dashed center line along track
    const dashLineGroup = new THREE.Group();
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const dashGeo = new THREE.PlaneGeometry(0.35, 2.5);
    dashGeo.rotateX(-Math.PI / 2);

    for (let i = 0; i < points.length; i += 6) {
      const p = points[i];
      const nextP = points[(i + 1) % points.length];
      const angle = Math.atan2(nextP.x - p.x, nextP.z - p.z);

      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.position.set(p.x, 0.04, p.z);
      dash.rotation.y = angle;
      dashLineGroup.add(dash);
    }
    this.group.add(dashLineGroup);

    // Professional Red & White Alternating Racing Kerbs (Curbing) along road edges
    const kerbMatRed = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.4,
      metalness: 0.3,
    });
    const kerbMatWhite = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
      metalness: 0.2,
    });
    const kerbGeo = new THREE.BoxGeometry(0.45, 0.12, 1.8);

    const kerbGroup = new THREE.Group();
    for (let i = 0; i < points.length; i += 3) {
      const p = points[i];
      const nextP = points[(i + 1) % points.length];
      const tangent = new THREE.Vector3().subVectors(nextP, p).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
      const angle = Math.atan2(tangent.x, tangent.z);

      const isWhite = Math.floor(i / 3) % 2 === 0;
      const mat = isWhite ? kerbMatWhite : kerbMatRed;

      // Left kerb block
      const leftKerb = new THREE.Mesh(kerbGeo, mat);
      const leftPos = new THREE.Vector3().copy(p).addScaledVector(normal, halfWidth + 0.22);
      leftKerb.position.set(leftPos.x, 0.05, leftPos.z);
      leftKerb.rotation.y = angle;
      leftKerb.castShadow = true;
      kerbGroup.add(leftKerb);

      // Right kerb block
      const rightKerb = new THREE.Mesh(kerbGeo, mat);
      const rightPos = new THREE.Vector3().copy(p).addScaledVector(normal, -(halfWidth + 0.22));
      rightKerb.position.set(rightPos.x, 0.05, rightPos.z);
      rightKerb.rotation.y = angle;
      rightKerb.castShadow = true;
      kerbGroup.add(rightKerb);
    }
    this.group.add(kerbGroup);

    // Glowing Runway Edge Beacon Lights every 15 points
    const beaconGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.18, 8);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const beaconGroup = new THREE.Group();

    for (let i = 0; i < points.length; i += 15) {
      const p = points[i];
      const nextP = points[(i + 1) % points.length];
      const tangent = new THREE.Vector3().subVectors(nextP, p).normalize();
      const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

      [-1, 1].forEach((dir) => {
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        const pos = new THREE.Vector3().copy(p).addScaledVector(normal, dir * (halfWidth + 0.55));
        beacon.position.set(pos.x, 0.09, pos.z);
        beaconGroup.add(beacon);
      });
    }
    this.group.add(beaconGroup);
  }

  // 3. Career Milestone Zones along the track
  private buildMilestoneZones() {
    JOURNEY_ZONES.forEach((zone) => {
      const [x, z] = zone.position;
      const zoneGroup = new THREE.Group();
      zoneGroup.position.set(x, 0, z);

      // A. Ground Plaza Pad
      const plazaGeo = new THREE.CylinderGeometry(13, 13, 0.2, 32);
      const plazaMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(zone.color).multiplyScalar(0.25),
        roughness: 0.7,
      });
      const plaza = new THREE.Mesh(plazaGeo, plazaMat);
      plaza.position.y = 0.04;
      plaza.receiveShadow = true;
      zoneGroup.add(plaza);

      // B. Glowing Vertical Light Beam (Reaching into sky like Bruno Simon milestones)
      if (zone.milestone) {
        const beamGeo = new THREE.CylinderGeometry(0.8, 0.8, 60, 16, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(zone.color),
          transparent: true,
          opacity: 0.25,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.position.y = 30;
        zoneGroup.add(beam);
        this.lightBeams.push({ zoneId: zone.id, mesh: beam });
      }

      // C. Landmark 3D Objects for each specific milestone
      switch (zone.id) {
        case "start":
          this.buildStartProps(zoneGroup);
          break;
        case "nit":
          this.buildNitProps(zoneGroup);
          break;
        case "neogrowth":
          this.buildNeoGrowthProps(zoneGroup);
          break;
        case "cars24":
          this.buildCars24Props(zoneGroup);
          break;
        case "stonybrook":
          this.buildStonyBrookProps(zoneGroup);
          break;
        case "amazon":
          this.buildAmazonProps(zoneGroup);
          break;
        case "skills":
          this.buildSkillsProps(zoneGroup, x, z);
          break;
        case "contact":
          this.buildContactProps(zoneGroup);
          break;
      }

      this.group.add(zoneGroup);
    });
  }

  // Zone 0: Starting Line Arch & Lights
  private buildStartProps(group: THREE.Group) {
    this.addContactShadow(group, -6, 0, 0, 3.8, 3.8);
    this.addContactShadow(group, 6, 0, 0, 3.8, 3.8);

    const archMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.2,
    });

    const leftCol = new THREE.Mesh(new THREE.BoxGeometry(1.2, 8, 1.2), archMat);
    leftCol.position.set(-6, 4, 0);
    leftCol.castShadow = true;
    group.add(leftCol);

    const rightCol = new THREE.Mesh(new THREE.BoxGeometry(1.2, 8, 1.2), archMat);
    rightCol.position.set(6, 4, 0);
    rightCol.castShadow = true;
    group.add(rightCol);

    const beam = new THREE.Mesh(new THREE.BoxGeometry(13.2, 1.2, 1.2), archMat);
    beam.position.set(0, 8, 0);
    beam.castShadow = true;
    group.add(beam);

    // Glowing Sign Banner with authentic branding texture
    const startTex = createTextTexture({
      title: "KEERTHAN'S CAREER",
      subtitle: "START LINE · DRIVE FORWARD",
      bgColor: "#0f172a",
      textColor: "#ffffff",
      accentColor: "#38bdf8",
      width: 512,
      height: 128,
    });
    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 2.2),
      new THREE.MeshBasicMaterial({ map: startTex, side: THREE.DoubleSide })
    );
    banner.position.set(0, 8, 0.7);
    group.add(banner);

    // Start Checkered Line
    const checkTex = createCheckeredTexture();
    const checkLine = new THREE.Mesh(
      new THREE.PlaneGeometry(ROAD_WIDTH, 2.8),
      new THREE.MeshStandardMaterial({ map: checkTex, roughness: 0.6 })
    );
    checkLine.rotation.x = -Math.PI / 2;
    checkLine.position.set(0, 0.05, 0);
    group.add(checkLine);
  }

  // Zone 1: NIT Durgapur Academic Foundations
  private buildNitProps(group: THREE.Group) {
    this.addContactShadow(group, 0, 0, -8, 16, 11, 0.75);
    this.addContactShadow(group, 0, 0, 2, 4.2, 4.2, 0.6);

    const buildMat = new THREE.MeshStandardMaterial({
      color: 0xe07a5f,
      roughness: 0.5,
      metalness: 0.4,
    });
    const hall = new THREE.Mesh(new THREE.BoxGeometry(12, 7, 7), buildMat);
    hall.position.set(0, 3.5, -8);
    hall.castShadow = true;
    group.add(hall);

    // NIT Signboard
    const nitTex = createTextTexture({
      title: "NIT DURGAPUR",
      subtitle: "B.Tech CS · Apnicart Co-Founder",
      bgColor: "#7c2d12",
      textColor: "#ffedd5",
      accentColor: "#fb923c",
      width: 512,
      height: 160,
    });
    const nitSign = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 2.5),
      new THREE.MeshBasicMaterial({ map: nitTex })
    );
    nitSign.position.set(0, 5, -4.4);
    group.add(nitSign);

    // Pediment roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(7, 3, 4),
      new THREE.MeshStandardMaterial({ color: 0xc45c43 })
    );
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.4, 1.0, 0.8);
    roof.position.set(0, 8.5, -8);
    roof.castShadow = true;
    group.add(roof);

    // Pillars
    [-4, -1.5, 1.5, 4].forEach((x) => {
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 7, 16),
        new THREE.MeshStandardMaterial({ color: 0xf4a261 })
      );
      col.position.set(x, 3.5, -4.2);
      col.castShadow = true;
      group.add(col);
    });

    // Graduation Mortarboard pedestal
    const mortarboard = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.2, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 })
    );
    mortarboard.rotation.y = Math.PI / 4;
    mortarboard.position.set(0, 2.2, 2);
    mortarboard.castShadow = true;
    group.add(mortarboard);

    const ped = new THREE.Mesh(
      new THREE.CylinderGeometry(1.2, 1.4, 2.0, 16),
      new THREE.MeshStandardMaterial({ color: 0x334155 })
    );
    ped.position.set(0, 1.0, 2);
    group.add(ped);
  }

  // Zone 2: NeoGrowth FinTech District (DiGibizz)
  private buildNeoGrowthProps(group: THREE.Group) {
    this.addContactShadow(group, 0, 0, -7, 14, 12, 0.75);
    this.addContactShadow(group, 6, 0, 0, 4.0, 4.0, 0.6);

    const vaultMat = new THREE.MeshStandardMaterial({
      color: 0xd16ba5,
      metalness: 0.7,
      roughness: 0.2,
    });
    const vault = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 8), vaultMat);
    vault.position.set(0, 4, -7);
    vault.castShadow = true;
    group.add(vault);

    // NeoGrowth Signboard
    const neoTex = createTextTexture({
      title: "NEOGROWTH",
      subtitle: "DiGibizz · Youngest Employee of the Month",
      bgColor: "#831843",
      textColor: "#fdf2f8",
      accentColor: "#f472b6",
      width: 512,
      height: 160,
    });
    const neoSign = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 2.5),
      new THREE.MeshBasicMaterial({ map: neoTex })
    );
    neoSign.position.set(0, 5, -2.8);
    group.add(neoSign);

    // Chrome vault dial
    const dial = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 0.4, 24),
      new THREE.MeshStandardMaterial({ color: 0xf472b6, metalness: 0.9, roughness: 0.1 })
    );
    dial.rotation.x = Math.PI / 2;
    dial.position.set(0, 2.4, -2.8);
    group.add(dial);

    // Floating Rotating Golden Coins
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
    });
    [-4, 0, 4].forEach((x, i) => {
      const coin = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.2, 20), coinMat);
      coin.position.set(x, 1.8 + (i % 2) * 0.4, 3);
      coin.rotation.x = Math.PI / 2;
      coin.castShadow = true;
      group.add(coin);
    });

    // Employee of the Month Trophy Pedestal
    const trophyPed = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 1.8, 2.0),
      new THREE.MeshStandardMaterial({ color: 0x1f2937 })
    );
    trophyPed.position.set(6, 0.9, 0);
    group.add(trophyPed);

    const trophy = new THREE.Mesh(
      new THREE.ConeGeometry(0.7, 1.4, 16),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9 })
    );
    trophy.rotation.x = Math.PI;
    trophy.position.set(6, 2.5, 0);
    group.add(trophy);
  }

  // Zone 3: CARS24 Raceway & Turbo Boost Pad (-40% Latency Speedup)
  private buildCars24Props(group: THREE.Group) {
    this.addContactShadow(group, -8, 0, 0, 8.5, 4.5, 0.65);
    this.addContactShadow(group, 13, 0, -5, 14, 3.5, 0.5);

    // 4 International Market Flags (India, UAE, Indonesia, Thailand)
    const flagColors = [0xff9933, 0x00732f, 0xff0000, 0x00247d];
    flagColors.forEach((col, i) => {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 7.5, 12),
        new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8 })
      );
      pole.position.set(8 + i * 3.2, 3.75, -5);
      pole.castShadow = true;
      group.add(pole);

      const flag = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 1.3),
        new THREE.MeshStandardMaterial({ color: col, side: THREE.DoubleSide })
      );
      flag.position.set(9.1 + i * 3.2, 6.8, -5);
      group.add(flag);
    });

    // CARS24 Billboard Sign
    const carsTex = createTextTexture({
      title: "CARS24 RACING",
      subtitle: "⚡ -40% Latency Turbo · 3x Tech Awards",
      bgColor: "#064e3b",
      textColor: "#f0fdf4",
      accentColor: "#2dd4bf",
      width: 512,
      height: 160,
    });
    const carsSign = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 2.5),
      new THREE.MeshBasicMaterial({ map: carsTex })
    );
    carsSign.position.set(0, 5, -5.5);
    group.add(carsSign);

    // TURBO BOOST PAD (-40% Latency Speedup!)
    const padGeo = new THREE.PlaneGeometry(ROAD_WIDTH, 10);
    padGeo.rotateX(-Math.PI / 2);
    const padMat = new THREE.MeshBasicMaterial({
      color: 0x2a9d8f,
      transparent: true,
      opacity: 0.85,
    });
    const turboPad = new THREE.Mesh(padGeo, padMat);
    turboPad.position.set(0, 0.05, 0);
    group.add(turboPad);

    // Glowing Chevrons on the boost pad
    [-2.5, 0, 2.5].forEach((z) => {
      const chevron = new THREE.Mesh(
        new THREE.ConeGeometry(1.6, 2.0, 3),
        new THREE.MeshBasicMaterial({ color: 0x48cae4 })
      );
      chevron.rotation.x = -Math.PI / 2;
      chevron.position.set(0, 0.07, z);
      group.add(chevron);
    });

    // 3x Trophy Podium
    const pMat = new THREE.MeshStandardMaterial({ color: 0x134e4a });
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.4, 2.2), pMat);
    p1.position.set(-8, 1.2, 0);
    group.add(p1);

    const p2 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 2.2), pMat);
    p2.position.set(-10.4, 0.8, 0);
    group.add(p2);

    const p3 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.0, 2.2), pMat);
    p3.position.set(-5.6, 0.5, 0);
    group.add(p3);
  }

  // Zone 4: Stony Brook University Graduate Citadel
  private buildStonyBrookProps(group: THREE.Group) {
    this.addContactShadow(group, 0, 0, -9, 18, 12, 0.75);
    this.addContactShadow(group, 0, 0, 2, 5.0, 5.0, 0.6);

    const buildMat = new THREE.MeshStandardMaterial({
      color: 0xd1495b,
      roughness: 0.4,
      metalness: 0.4,
    });
    const library = new THREE.Mesh(new THREE.BoxGeometry(14, 8, 8), buildMat);
    library.position.set(0, 4, -9);
    library.castShadow = true;
    group.add(library);

    // Stony Brook Sign
    const sbuTex = createTextTexture({
      title: "STONY BROOK UNIVERSITY",
      subtitle: "M.S. Computer Science · Distributed Systems",
      bgColor: "#881337",
      textColor: "#fff1f2",
      accentColor: "#fb7185",
      width: 512,
      height: 160,
    });
    const sbuSign = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 2.5),
      new THREE.MeshBasicMaterial({ map: sbuTex })
    );
    sbuSign.position.set(0, 5.2, -4.9);
    group.add(sbuSign);

    // Dome / Observatory roof
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(3.5, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0x9f1239, metalness: 0.8, roughness: 0.2 })
    );
    dome.position.set(0, 8, -9);
    dome.castShadow = true;
    group.add(dome);

    // Distributed Systems & Cloud Research Pedestal
    const core = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.6, 0),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.5,
        metalness: 0.8,
      })
    );
    core.position.set(0, 3.2, 2);
    group.add(core);

    const coreBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.8, 2.0, 1.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x1e293b })
    );
    coreBase.position.set(0, 0.9, 2);
    group.add(coreBase);
  }

  // Zone 5: Amazon AWS Cloud Citadel (Current SDE II Role)
  private buildAmazonProps(group: THREE.Group) {
    [-6, 0, 6].forEach((x) => this.addContactShadow(group, x, 0, -11, 6.5, 6.5, 0.7));
    this.addContactShadow(group, 0, 0, 2, 6.8, 6.8, 0.6);

    const serverMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.85,
      roughness: 0.25,
    });

    // Amazon Signboard
    const amzTex = createTextTexture({
      title: "AMAZON AWS",
      subtitle: "Software Development Engineer II · Tier-1 Services",
      bgColor: "#09090b",
      textColor: "#ffffff",
      accentColor: "#f59e0b",
      width: 512,
      height: 160,
    });
    const amzSign = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 2.8),
      new THREE.MeshBasicMaterial({ map: amzTex })
    );
    amzSign.position.set(0, 10, -8.8);
    group.add(amzSign);

    // 3 Tier-1 AWS Cloud Server Monoliths
    [-6, 0, 6].forEach((x, idx) => {
      const tower = new THREE.Mesh(
        new THREE.BoxGeometry(4.0, 13 + (idx % 2) * 3, 4.0),
        serverMat
      );
      tower.position.set(x, 6.5 + (idx % 2) * 1.5, -11);
      tower.castShadow = true;
      group.add(tower);

      // Glowing rack status LEDs (Amber & Cyan)
      for (let r = 0; r < 7; r++) {
        const led = new THREE.Mesh(
          new THREE.BoxGeometry(3.4, 0.14, 0.05),
          new THREE.MeshBasicMaterial({
            color: (idx + r) % 2 === 0 ? 0xf4a261 : 0x38bdf8,
          })
        );
        led.position.set(x, 2 + r * 1.4, -8.95);
        group.add(led);
      }
    });

    // Central SDE II Cloud Core (Rotating AWS Nexus)
    const awsCore = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.0, 1),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.6,
        metalness: 0.8,
        roughness: 0.2,
      })
    );
    awsCore.position.set(0, 4.2, 2);
    group.add(awsCore);

    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.4, 0.08, 16, 64),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    orbitRing.rotation.x = Math.PI / 3;
    orbitRing.position.set(0, 4.2, 2);
    group.add(orbitRing);
  }

  // Zone 6: Tech Stack Yard (Physical 3D stackable cubes you can smash into!)
  private buildSkillsProps(group: THREE.Group, zoneX: number, zoneZ: number) {
    this.addContactShadow(group, 0, 0, 1, 14, 10, 0.65);

    // Arena Signboard
    const skillsTex = createTextTexture({
      title: "TECH STACK YARD",
      subtitle: "RAM CAR INTO PYRAMID · WATCH BLOCKS FLY!",
      bgColor: "#0f172a",
      textColor: "#ffffff",
      accentColor: "#10b981",
      width: 512,
      height: 160,
    });
    const skillsSign = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 2.5),
      new THREE.MeshBasicMaterial({ map: skillsTex })
    );
    skillsSign.position.set(0, 6.5, -6);
    group.add(skillsSign);

    const skills = [
      { name: "AWS", color: "#ea580c" },
      { name: "Java", color: "#d97706" },
      { name: "TypeScript", color: "#2563eb" },
      { name: "Python", color: "#059669" },
      { name: "React", color: "#0891b2" },
      { name: "Next.js", color: "#475569" },
      { name: "Node.js", color: "#16a34a" },
      { name: "Spring", color: "#65a30d" },
      { name: "Swift", color: "#e11d48" },
      { name: "Kotlin", color: "#7c3aed" },
    ];

    // Build a neat pyramid stack directly on the arena pad
    let idx = 0;
    const spacing = 2.3;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4 - row; col++) {
        const item = skills[idx % skills.length];
        idx++;

        const cubeTex = createTextTexture({
          title: item.name,
          bgColor: item.color,
          textColor: "#ffffff",
          accentColor: "#ffffff",
          width: 256,
          height: 256,
          isTechCube: true,
        });

        const cube = new THREE.Mesh(
          new THREE.BoxGeometry(2.0, 2.0, 2.0),
          new THREE.MeshStandardMaterial({
            map: cubeTex,
            roughness: 0.35,
            metalness: 0.3,
          })
        );

        const xPos = zoneX + (col - (4 - row) / 2) * spacing;
        const yPos = 1.0 + row * 2.05;
        const zPos = zoneZ + 1.0;

        cube.position.set(xPos, yPos, zPos);
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.group.add(cube);

        // Register as a dynamic obstacle that responds to car collisions
        this.dynamicObstacles.push({
          mesh: cube,
          velocity: new THREE.Vector3(0, 0, 0),
          angularVelocity: new THREE.Vector3(0, 0, 0),
          mass: 1.2,
          radius: 1.4,
          initialPos: new THREE.Vector3(xPos, yPos, zPos),
        });
      }
    }
  }

  // Zone 7: Finish Line & Connect
  private buildContactProps(group: THREE.Group) {
    this.addContactShadow(group, -6, 0, 0, 3.8, 3.8);
    this.addContactShadow(group, 6, 0, 0, 3.8, 3.8);

    const archMat = new THREE.MeshStandardMaterial({
      color: 0x7b61ff,
      metalness: 0.7,
      roughness: 0.3,
    });
    const leftCol = new THREE.Mesh(new THREE.BoxGeometry(1.2, 8, 1.2), archMat);
    leftCol.position.set(-6, 4, 0);
    group.add(leftCol);

    const rightCol = new THREE.Mesh(new THREE.BoxGeometry(1.2, 8, 1.2), archMat);
    rightCol.position.set(6, 4, 0);
    group.add(rightCol);

    const beam = new THREE.Mesh(new THREE.BoxGeometry(13.2, 1.2, 1.2), archMat);
    beam.position.set(0, 8, 0);
    group.add(beam);

    // Finish Signboard
    const finishTex = createTextTexture({
      title: "FINISH LINE",
      subtitle: "JOURNEY COMPLETE · LET'S CONNECT",
      bgColor: "#3b0764",
      textColor: "#ffffff",
      accentColor: "#c084fc",
      width: 512,
      height: 160,
    });
    const banner = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 2.2),
      new THREE.MeshBasicMaterial({ map: finishTex, side: THREE.DoubleSide })
    );
    banner.position.set(0, 8, 0.7);
    group.add(banner);

    // Finish Checkered Road Line
    const checkTex = createCheckeredTexture();
    const checkLine = new THREE.Mesh(
      new THREE.PlaneGeometry(ROAD_WIDTH, 2.8),
      new THREE.MeshStandardMaterial({ map: checkTex, roughness: 0.6 })
    );
    checkLine.rotation.x = -Math.PI / 2;
    checkLine.position.set(0, 0.05, 0);
    group.add(checkLine);

    // Interactive Portals (LinkedIn, GitHub, Resume, Message)
    const portals = [
      { color: 0x0a66c2, x: -6 },
      { color: 0x333333, x: -2 },
      { color: 0x2563eb, x: 2 },
      { color: 0x10b981, x: 6 },
    ];
    portals.forEach((p) => {
      this.addContactShadow(group, p.x, 0, 6, 3.4, 3.4, 0.55);

      const stand = new THREE.Mesh(
        new THREE.CylinderGeometry(1.4, 1.6, 1.2, 16),
        new THREE.MeshStandardMaterial({ color: 0x1e293b })
      );
      stand.position.set(p.x, 0.6, 6);
      group.add(stand);

      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 16, 16),
        new THREE.MeshStandardMaterial({
          color: p.color,
          emissive: p.color,
          emissiveIntensity: 0.5,
          metalness: 0.8,
        })
      );
      orb.position.set(p.x, 2.0, 6);
      group.add(orb);
    });
  }

  // 4. Stylized Low-Poly Trees and Street Lamps
  private buildScenery() {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.6 });
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8 });

    // Trees scattered around the landscape
    const treePositions = [
      [-25, 48],
      [-15, 75],
      [-65, 30],
      [-55, 15],
      [-85, -20],
      [-65, -35],
      [-25, -60],
      [22, -75],
      [45, -65],
      [68, -25],
      [82, 18],
      [62, 50],
      [25, 55],
      [10, 40],
      [-10, -20],
      [15, -15],
      [30, 10],
    ];

    treePositions.forEach(([x, z]) => {
      this.addContactShadow(this.group, x, 0, z, 4.4, 4.4, 0.6);

      const tree = new THREE.Group();
      tree.position.set(x, 0, z);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 2.0, 8), trunkMat);
      trunk.position.y = 1.0;
      trunk.castShadow = true;
      tree.add(trunk);

      [
        { r: 2.0, h: 2.2, y: 2.6 },
        { r: 1.5, h: 1.8, y: 3.9 },
        { r: 1.0, h: 1.4, y: 5.0 },
      ].forEach((tier) => {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(tier.r, tier.h, 7), foliageMat);
        cone.position.y = tier.y;
        cone.castShadow = true;
        tree.add(cone);
      });

      this.group.add(tree);
    });

    // Street Lamps along roads
    const lampPositions = [
      [-20, 52],
      [-60, 20],
      [-65, -25],
      [-20, -55],
      [25, -55],
      [62, -18],
      [65, 25],
      [20, 50],
    ];

    lampPositions.forEach(([x, z]) => {
      this.addContactShadow(this.group, x, 0, z, 1.8, 1.8, 0.45);

      const lamp = new THREE.Group();
      lamp.position.set(x, 0, z);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 5.5, 8), lampMat);
      pole.position.y = 2.75;
      lamp.add(pole);

      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      bulb.position.set(0.6, 5.3, 0);
      lamp.add(bulb);

      const light = new THREE.PointLight(0xfef08a, 1.2, 18);
      light.position.set(0.6, 5.1, 0);
      lamp.add(light);

      this.group.add(lamp);
    });
  }
}
