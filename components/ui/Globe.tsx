"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3, Mesh } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
  isVisible?: boolean;
}

function disposeGlobe(globe: ThreeGlobe) {
  globe.traverse((obj) => {
    const mesh = obj as Mesh;
    mesh.geometry?.dispose();
    const { material } = mesh;
    if (material) {
      if (Array.isArray(material)) {
        material.forEach((m) => m.dispose());
      } else {
        material.dispose();
      }
    }
  });
}

export function Globe({ globeConfig, data }: WorldProps) {
  const [globeData, setGlobeData] = useState<
    | {
        size: number;
        order: number;
        color: (t: number) => string;
        lat: number;
        lng: number;
      }[]
    | null
  >(null);

  const globeObjRef = useRef<ThreeGlobe | null>(null);
  const numbersOfRingsRef = useRef<number[]>([0]);

  if (!globeObjRef.current) {
    globeObjRef.current = new ThreeGlobe();
  }

  const defaultProps = useMemo(
    () => ({
      pointSize: 1,
      atmosphereColor: "#ffffff",
      showAtmosphere: true,
      atmosphereAltitude: 0.1,
      polygonColor: "rgba(255,255,255,0.7)",
      globeColor: "#1d072e",
      emissive: "#000000",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      arcTime: 2000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      ...globeConfig,
    }),
    [globeConfig]
  );

  useEffect(() => {
    return () => {
      if (globeObjRef.current) {
        disposeGlobe(globeObjRef.current);
        globeObjRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!globeObjRef.current) return;

    const globeMaterial = globeObjRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(globeConfig.globeColor);
    globeMaterial.emissive = new Color(globeConfig.emissive);
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  }, [
    globeConfig.globeColor,
    globeConfig.emissive,
    globeConfig.emissiveIntensity,
    globeConfig.shininess,
  ]);

  useEffect(() => {
    const arcs = data;
    const points = [];
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number };
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: defaultProps.pointSize,
        order: arc.order,
        color: (t: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${1 - t})`,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }

    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex((v2) =>
          ["lat", "lng"].every(
            (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"]
          )
        ) === i
    );

    setGlobeData(filteredPoints);
  }, [data, defaultProps.pointSize]);

  useEffect(() => {
    if (!globeObjRef.current || !globeData) return;

    let cancelled = false;

    import("@/data/globe.json").then((countries) => {
      if (cancelled || !globeObjRef.current || !globeData) return;

      globeObjRef.current
        .hexPolygonsData(countries.default.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.7)
        .showAtmosphere(defaultProps.showAtmosphere)
        .atmosphereColor(defaultProps.atmosphereColor)
        .atmosphereAltitude(defaultProps.atmosphereAltitude)
        .hexPolygonColor(() => defaultProps.polygonColor);

      interface ArcData {
        order: number;
        startLat: number;
        startLng: number;
        endLat: number;
        endLng: number;
        arcAlt: number;
        color: string;
      }

      globeObjRef.current
        .arcsData(data as ArcData[])
        .arcStartLat((obj: object) => (obj as ArcData).startLat * 1)
        .arcStartLng((obj: object) => (obj as ArcData).startLng * 1)
        .arcEndLat((obj: object) => (obj as ArcData).endLat * 1)
        .arcEndLng((obj: object) => (obj as ArcData).endLng * 1)
        .arcColor((obj: object) => (obj as ArcData).color)
        .arcAltitude((obj: object) => {
          const e = obj as ArcData;
          return e.arcAlt * 1;
        })
        .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
        .arcDashLength(defaultProps.arcLength)
        .arcDashInitialGap((obj: object) => (obj as ArcData).order * 1)
        .arcDashGap(15)
        .arcDashAnimateTime(() => defaultProps.arcTime);

      globeObjRef.current
        .pointsData(data)
        .pointColor((e) => (e as { color: string }).color)
        .pointsMerge(true)
        .pointAltitude(0.0)
        .pointRadius(2);

      globeObjRef.current
        .ringsData([])
        .ringMaxRadius(defaultProps.maxRings)
        .ringPropagationSpeed(RING_PROPAGATION_SPEED)
        .ringRepeatPeriod(
          (defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings
        );
    });

    return () => {
      cancelled = true;
    };
  }, [globeData, data, defaultProps]);

  useEffect(() => {
    if (!globeObjRef.current || !globeData) return;

    const interval = setInterval(() => {
      if (!globeObjRef.current || !globeData) return;
      numbersOfRingsRef.current = genRandomNumbers(
        0,
        data.length,
        Math.floor((data.length * 4) / 5)
      );

      globeObjRef.current.ringsData(
        globeData.filter((_, i) => numbersOfRingsRef.current.includes(i))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [globeData, data.length]);

  return (
    <>{globeObjRef.current && <primitive object={globeObjRef.current} />}</>
  );
}

function VisibilityWatcher({ isVisible }: { isVisible: boolean }) {
  const { invalidate } = useThree();

  useEffect(() => {
    if (isVisible) invalidate();
  }, [isVisible, invalidate]);

  return null;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    const dpr = Math.min(window.devicePixelRatio, 2);
    gl.setPixelRatio(dpr);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, [gl, size.width, size.height]);

  return null;
}

export function World({ globeConfig, data, isVisible = true }: WorldProps) {
  const [pageVisible, setPageVisible] = useState(true);

  const scene = useMemo(() => {
    const nextScene = new Scene();
    nextScene.fog = new Fog(0xffffff, 400, 2000);
    return nextScene;
  }, []);

  const camera = useMemo(
    () => new PerspectiveCamera(50, aspect, 180, 1800),
    []
  );

  useEffect(() => {
    const handleVisibility = () => {
      setPageVisible(document.visibilityState !== "hidden");
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const shouldAnimate = isVisible && pageVisible;

  return (
    <Canvas
      scene={scene}
      camera={camera}
      dpr={[1, 2]}
      frameloop={shouldAnimate ? "always" : "never"}
    >
      <WebGLRendererConfig />
      <VisibilityWatcher isVisible={shouldAnimate} />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe globeConfig={globeConfig} data={data} isVisible={isVisible} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={globeConfig.autoRotateSpeed ?? 1}
        autoRotate={globeConfig.autoRotate ?? true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }

  return arr;
}
