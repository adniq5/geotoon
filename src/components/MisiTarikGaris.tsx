"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import {
  MATCHING_ANSWERS,
  scoreMatchingGame,
} from "@/lib/episode3Scoring";
import styles from "./MisiTarikGaris.module.css";

const components = [
  { id: "sun", label: "Matahari", icon: "sun" },
  { id: "satellite", label: "Satelit", icon: "satellite" },
  { id: "aircraft", label: "Pesawat", icon: "aircraft" },
  { id: "atmosphere", label: "Atmosfer", icon: "atmosphere" },
  { id: "sensor", label: "Sensor", icon: "sensor" },
] as const;

const functions = [
  { id: "carrier", label: "Wahana pembawa sensor di udara" },
  { id: "records", label: "Merekam energi dari objek" },
  { id: "source", label: "Sumber energi alami" },
  { id: "air-layer", label: "Lapisan udara yang dilalui energi" },
  { id: "orbit", label: "Mengorbit mengelilingi Bumi" },
] as const;

type ComponentId = (typeof components)[number]["id"];
type FunctionId = (typeof functions)[number]["id"];
type IconName = (typeof components)[number]["icon"] | "sensor-platform" | "measurement-grid" | "energy-wave" | "air-layers" | "orbit-globe";
type Point = { x: number; y: number };
type Connection = { component: ComponentId; function: FunctionId };
type MatchingResult = {
  correctCount: number;
  total: number;
  scorePercent: number;
};
type MisiTarikGarisProps = {
  onResult?: (result: MatchingResult) => void;
  onAdvance?: () => void;
};

const functionIcons: Record<FunctionId, IconName> = {
  carrier: "sensor-platform",
  records: "measurement-grid",
  source: "energy-wave",
  "air-layer": "air-layers",
  orbit: "orbit-globe",
};

function getPath(start: Point, end: Point) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const direction = dx >= 0 ? 1 : -1;
  const horizontalReach = Math.min(150, Math.max(34, Math.abs(dx) * 0.46));
  const verticalReach =
    Math.sign(dy || 1) * Math.min(112, Math.max(24, Math.abs(dy) * 0.3));
  const control1 = {
    x: start.x + horizontalReach * direction,
    y: start.y + verticalReach,
  };
  const control2 = {
    x: end.x - horizontalReach * direction,
    y: end.y - verticalReach,
  };

  return `M ${start.x} ${start.y} C ${control1.x} ${control1.y}, ${control2.x} ${control2.y}, ${end.x} ${end.y}`;
}

function ComponentIcon({ type }: { type: IconName }) {
  const sharedProps = {
    className: styles.componentIcon,
    viewBox: "0 0 40 40",
    "aria-hidden": true as const,
    focusable: false as const,
  };

  switch (type) {
    case "sun":
      return (
        <svg {...sharedProps}>
          <circle cx="20" cy="20" r="8" fill="#ffb21c" stroke="#d87912" strokeWidth="2" />
          <path d="M20 3v6m0 22v6M3 20h6m22 0h6M8 8l4 4m16 16 4 4m0-24-4 4m-16 16-4 4" stroke="#e58a16" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case "satellite":
      return (
        <svg {...sharedProps}>
          <path d="m14 14 12 12m-9-15-6 6 14 14 6-6z" fill="#d9efff" stroke="#315f76" strokeWidth="2" strokeLinejoin="round" />
          <path d="m8 8 7 2-5 5zm24 24-7-2 5-5z" fill="#4c93c9" stroke="#315f76" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="20" cy="20" r="4" fill="#ffcf4d" stroke="#315f76" strokeWidth="2" />
        </svg>
      );
    case "aircraft":
      return (
        <svg {...sharedProps}>
          <path d="m4 22 13-4 7-12c1-2 4-1 4 1l-3 12 9 5c2 1 1 4-1 4l-11-2-6 7-3-1 2-8-10 2z" fill="#d9efff" stroke="#315f76" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "atmosphere":
      return (
        <svg {...sharedProps}>
          <circle cx="20" cy="23" r="7" fill="#8fc76e" stroke="#315f76" strokeWidth="2" />
          <path d="M5 15c4-5 8 5 12 0s8 5 12 0m-24-6c4-5 8 5 12 0s8 5 12 0" fill="none" stroke="#4c93c9" strokeWidth="3" strokeLinecap="round" />
          <path d="M8 33c4-3 8 3 12 0s8 3 12 0" fill="none" stroke="#79b9dc" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "sensor":
      return (
        <svg {...sharedProps}>
          <path d="M7 14h6l3-4h9l3 4h5v17H7z" fill="#d9efff" stroke="#315f76" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="21" cy="22" r="6" fill="#4c93c9" stroke="#315f76" strokeWidth="2" />
          <circle cx="21" cy="22" r="2" fill="#fff" />
          <path d="M4 7h9m-5-3v6" stroke="#e58a16" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "sensor-platform":
      return (
        <svg {...sharedProps}>
          <rect x="15" y="7" width="10" height="14" rx="3" fill="#d9efff" stroke="#315f76" strokeWidth="2" />
          <path d="M4 10h9v12H4zm23 0h9v12h-9z" fill="#8fc76e" stroke="#315f76" strokeWidth="2" strokeLinejoin="round" />
          <path d="M20 22v4m-5-2-3 7m13-7 3 7" fill="none" stroke="#e58a16" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="20" cy="28" r="3" fill="#ffb21c" stroke="#d87912" strokeWidth="1.5" />
        </svg>
      );
    case "measurement-grid":
      return (
        <svg {...sharedProps}>
          <rect x="7" y="7" width="26" height="26" rx="4" fill="#e8f2df" stroke="#315f76" strokeWidth="2" />
          <path d="M12 13h5v5h-5zm11 0h5v5h-5zm-11 10h5v5h-5zm11 0h5v5h-5z" fill="#4c93c9" stroke="#315f76" strokeWidth="1" />
          <path d="M19 12v17m-7-8h16" stroke="#e58a16" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "energy-wave":
      return (
        <svg {...sharedProps}>
          <path d="M5 24c4-13 8-13 12 0s8 13 12 0 5-7 6-5" fill="none" stroke="#e58a16" strokeWidth="3" strokeLinecap="round" />
          <path d="M5 31h30" stroke="#315f76" strokeWidth="2" strokeLinecap="round" />
          <circle cx="9" cy="12" r="3" fill="#ffcf4d" />
          <circle cx="31" cy="12" r="3" fill="#ffcf4d" />
        </svg>
      );
    case "air-layers":
      return (
        <svg {...sharedProps}>
          <path d="M5 13h30M8 20h24M11 27h18" fill="none" stroke="#4c93c9" strokeWidth="3" strokeLinecap="round" />
          <path d="m17 7 3-4 3 4m-3-4v9" fill="none" stroke="#e58a16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m17 33 3 4 3-4" fill="none" stroke="#315f76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "orbit-globe":
      return (
        <svg {...sharedProps}>
          <circle cx="20" cy="21" r="9" fill="#78b77d" stroke="#315f76" strokeWidth="2" />
          <path d="M13 16c3 1 4 3 3 5s1 4 4 5m3-13c-1 2-1 4 1 5s3 2 4 1" fill="none" stroke="#4c93c9" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="20" cy="21" rx="17" ry="8" fill="none" stroke="#e58a16" strokeWidth="2" transform="rotate(-24 20 21)" />
          <circle cx="34" cy="12" r="2.5" fill="#ffcf4d" stroke="#315f76" strokeWidth="1" />
        </svg>
      );
  }
}

export default function MisiTarikGaris({
  onResult,
  onAdvance,
}: MisiTarikGarisProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const componentRefs = useRef(new Map<ComponentId, HTMLButtonElement>());
  const functionRefs = useRef(new Map<FunctionId, HTMLButtonElement>());
  const activePointerRef = useRef<{
    component: ComponentId;
    pointerId: number;
    start: Point;
    latestPoint: Point;
    clientX: number;
    clientY: number;
    moved: boolean;
  } | null>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  const activeOutlinePathRef = useRef<SVGPathElement>(null);
  const activeStartPointRef = useRef<SVGCircleElement>(null);
  const activeEndPointRef = useRef<SVGCircleElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const ignoreClickRef = useRef(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentId | null>(null);
  const [points, setPoints] = useState<
    Map<string, { start: Point; end: Point }>
  >(new Map());
  const [boardSize, setBoardSize] = useState({ width: 0, height: 0 });
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [cancelledLine, setCancelledLine] = useState<{
    start: Point;
    end: Point;
  } | null>(null);
  const [draggingComponent, setDraggingComponent] =
    useState<ComponentId | null>(null);
  const [hoveredFunction, setHoveredFunction] =
    useState<FunctionId | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const completionNotifiedRef = useRef(false);
  const resultNotifiedRef = useRef(false);
  const [message, setMessage] = useState(
    "Pilih komponen lalu pilih fungsi, atau tarik garis ke fungsi yang sesuai."
  );

  const measureConnections = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;

    const boardRect = board.getBoundingClientRect();
    setBoardSize((current) =>
      current.width === boardRect.width && current.height === boardRect.height
        ? current
        : { width: boardRect.width, height: boardRect.height }
    );
    const nextPoints = new Map<string, { start: Point; end: Point }>();

    for (const connection of connections) {
      const component = componentRefs.current.get(connection.component);
      const functionItem = functionRefs.current.get(connection.function);
      if (!component || !functionItem) continue;

      const componentAnchor = component.querySelector("[data-component-anchor]");
      const functionAnchor = functionItem.querySelector("[data-function-anchor]");
      if (!componentAnchor || !functionAnchor) continue;

      const componentRect = componentAnchor.getBoundingClientRect();
      const functionRect = functionAnchor.getBoundingClientRect();
      nextPoints.set(connection.component, {
        start: {
          x: componentRect.left + componentRect.width / 2 - boardRect.left,
          y: componentRect.top + componentRect.height / 2 - boardRect.top,
        },
        end: {
          x: functionRect.left + functionRect.width / 2 - boardRect.left,
          y: functionRect.top + functionRect.height / 2 - boardRect.top,
        },
      });
    }

    setPoints((current) => {
      if (current.size !== nextPoints.size) return nextPoints;
      for (const [key, point] of nextPoints) {
        const previous = current.get(key);
        if (
          !previous ||
          previous.start.x !== point.start.x ||
          previous.start.y !== point.start.y ||
          previous.end.x !== point.end.x ||
          previous.end.y !== point.end.y
        ) {
          return nextPoints;
        }
      }
      return current;
    });
    const activePointer = activePointerRef.current;
    const activeComponent = activePointer
      ? componentRefs.current.get(activePointer.component)
      : null;
    const activeAnchor = activeComponent?.querySelector(
      "[data-component-anchor]"
    );
    if (activePointer && activeAnchor) {
      const anchorRect = activeAnchor.getBoundingClientRect();
      activePointer.start = {
        x: anchorRect.left + anchorRect.width / 2 - boardRect.left,
        y: anchorRect.top + anchorRect.height / 2 - boardRect.top,
      };
      activePointer.latestPoint = {
        x: activePointer.clientX - boardRect.left,
        y: activePointer.clientY - boardRect.top,
      };
      activePathRef.current?.setAttribute(
        "d",
        getPath(activePointer.start, activePointer.latestPoint)
      );
      activeOutlinePathRef.current?.setAttribute(
        "d",
        getPath(activePointer.start, activePointer.latestPoint)
      );
      activeStartPointRef.current?.setAttribute("cx", String(activePointer.start.x));
      activeStartPointRef.current?.setAttribute("cy", String(activePointer.start.y));
      activeEndPointRef.current?.setAttribute("cx", String(activePointer.latestPoint.x));
      activeEndPointRef.current?.setAttribute("cy", String(activePointer.latestPoint.y));
    }
  }, [connections]);

  useLayoutEffect(() => {
    measureConnections();

    const board = boardRef.current;
    if (!board) return;

    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(measureConnections);
    observer?.observe(board);
    componentRefs.current.forEach((element) => observer?.observe(element));
    functionRefs.current.forEach((element) => observer?.observe(element));
    window.addEventListener("resize", measureConnections);
    window.addEventListener("orientationchange", measureConnections);
    window.addEventListener("scroll", measureConnections, true);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measureConnections);
      window.removeEventListener("orientationchange", measureConnections);
      window.removeEventListener("scroll", measureConnections, true);
    };
  }, [measureConnections]);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      activePointerRef.current = null;
    },
    []
  );

  const connect = (component: ComponentId, functionId: FunctionId) => {
    const nextConnections = [
      ...connections.filter(
        (pair) =>
          pair.component !== component && pair.function !== functionId
      ),
      { component, function: functionId },
    ];
    const isCorrect = MATCHING_ANSWERS[component] === functionId;
    setConnections(nextConnections);
    setIsChecked(false);
    setSelectedComponent(null);
    setMessage(
      isCorrect
        ? `${components.find((item) => item.id === component)?.label} terpasang dengan tepat.`
        : "Pasangan belum tepat. Kamu bisa memilih ulang komponen untuk memperbaikinya."
    );
  };

  const removeConnection = (component: ComponentId) => {
    setConnections((current) =>
      current.filter((pair) => pair.component !== component)
    );
    setSelectedComponent(component);
    setCancelledLine(null);
    setIsChecked(false);
    setMessage(
      "Pasangan dilepas. Pilih fungsi baru untuk komponen tersebut."
    );
  };

  const handlePointerDown = (
    event: PointerEvent<HTMLButtonElement>,
    component: ComponentId
  ) => {
    if (!event.isPrimary || event.button !== 0) return;
    const board = boardRef.current;
    if (!board) return;

    event.preventDefault();
    const boardRect = board.getBoundingClientRect();
    const anchor = event.currentTarget.querySelector(
      "[data-component-anchor]"
    );
    if (!anchor) return;
    const anchorRect = anchor.getBoundingClientRect();
    const start = {
      x: anchorRect.left + anchorRect.width / 2 - boardRect.left,
      y: anchorRect.top + anchorRect.height / 2 - boardRect.top,
    };
    activePointerRef.current = {
      component,
      pointerId: event.pointerId,
      start,
      latestPoint: start,
      clientX: event.clientX,
      clientY: event.clientY,
      moved: false,
    };
    setCancelledLine(null);
    setSelectedComponent(component);
    setDraggingComponent(component);
    setHoveredFunction(null);
    setDragStart(start);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const activePointer = activePointerRef.current;
    const board = boardRef.current;
    if (!activePointer || activePointer.pointerId !== event.pointerId || !board) {
      return;
    }

    const boardRect = board.getBoundingClientRect();
    const componentButton = componentRefs.current.get(activePointer.component);
    const componentAnchor = componentButton?.querySelector(
      "[data-component-anchor]"
    );
    if (componentAnchor) {
      const anchorRect = componentAnchor.getBoundingClientRect();
      activePointer.start = {
        x: anchorRect.left + anchorRect.width / 2 - boardRect.left,
        y: anchorRect.top + anchorRect.height / 2 - boardRect.top,
      };
    }
    const point = {
      x: event.clientX - boardRect.left,
      y: event.clientY - boardRect.top,
    };
    if (Math.hypot(point.x - activePointer.start.x, point.y - activePointer.start.y) > 8) {
      activePointer.moved = true;
    }
    activePointer.latestPoint = point;
    activePointer.clientX = event.clientX;
    activePointer.clientY = event.clientY;

    const element = document.elementFromPoint(event.clientX, event.clientY);
    const target = element?.closest<HTMLElement>("[data-function-id]");
    const functionId =
      functions.find(
        (functionItem) => functionItem.id === target?.dataset.functionId
      )?.id ?? null;
    setHoveredFunction((current) =>
      current === functionId ? current : functionId
    );

    if (animationFrameRef.current === null) {
      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null;
        const currentPointer = activePointerRef.current;
        const path = activePathRef.current;
        if (currentPointer && path) {
          path.setAttribute(
            "d",
            getPath(currentPointer.start, currentPointer.latestPoint)
          );
          activeOutlinePathRef.current?.setAttribute(
            "d",
            getPath(currentPointer.start, currentPointer.latestPoint)
          );
          activeStartPointRef.current?.setAttribute(
            "cx",
            String(currentPointer.start.x)
          );
          activeStartPointRef.current?.setAttribute(
            "cy",
            String(currentPointer.start.y)
          );
          activeEndPointRef.current?.setAttribute(
            "cx",
            String(currentPointer.latestPoint.x)
          );
          activeEndPointRef.current?.setAttribute(
            "cy",
            String(currentPointer.latestPoint.y)
          );
        }
      });
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const activePointer = activePointerRef.current;
    if (!activePointer || activePointer.pointerId !== event.pointerId) return;

    const board = boardRef.current;
    if (board) {
      const boardRect = board.getBoundingClientRect();
      activePointer.latestPoint = {
        x: event.clientX - boardRect.left,
        y: event.clientY - boardRect.top,
      };
      activePointer.clientX = event.clientX;
      activePointer.clientY = event.clientY;
      activePointer.moved ||= Math.hypot(
        activePointer.latestPoint.x - activePointer.start.x,
        activePointer.latestPoint.y - activePointer.start.y
      ) > 8;
    }

    const element = document.elementFromPoint(event.clientX, event.clientY);
    const target = element?.closest<HTMLElement>("[data-function-id]");
    const functionId = functions.find(
      (functionItem) => functionItem.id === target?.dataset.functionId
    )?.id;
    if (functionId && activePointer.moved) {
      connect(activePointer.component, functionId);
    } else if (activePointer.moved) {
      setCancelledLine({
        start: activePointer.start,
        end: activePointer.latestPoint,
      });
      setMessage(
        "Lepaskan pada fungsi yang ingin dipasangkan. Komponen tetap dipilih untuk dicoba lagi."
      );
    }
    if (activePointer.moved) {
      ignoreClickRef.current = true;
      window.setTimeout(() => {
        ignoreClickRef.current = false;
      }, 0);
    }

    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    activePointerRef.current = null;
    setDragStart(null);
    setDraggingComponent(null);
    setHoveredFunction(null);
  };

  const cancelDrag = () => {
    const activePointer = activePointerRef.current;
    if (activePointer?.moved) {
      setCancelledLine({
        start: activePointer.start,
        end: activePointer.latestPoint,
      });
    }
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    activePointerRef.current = null;
    setDragStart(null);
    setDraggingComponent(null);
    setHoveredFunction(null);
    setMessage(
      "Tarikan dibatalkan. Komponen tetap dipilih; pilih fungsi atau coba tarik lagi."
    );
  };

  const selectComponent = (component: ComponentId) => {
    if (ignoreClickRef.current) {
      ignoreClickRef.current = false;
      return;
    }
    setSelectedComponent(component);
    setMessage(
      `Komponen ${components.find((item) => item.id === component)?.label} dipilih. Sekarang pilih fungsi yang sesuai.`
    );
  };

  const selectFunction = (functionId: FunctionId) => {
    if (!selectedComponent) {
      setMessage("Pilih komponen terlebih dahulu.");
      return;
    }
    connect(selectedComponent, functionId);
  };

  const resultFor = (component: ComponentId) => {
    if (!isChecked) return null;
    const pair = connections.find((item) => item.component === component);
    if (!pair) return null;
    return MATCHING_ANSWERS[component] === pair.function
      ? "correct"
      : "incorrect";
  };

  const matchingScore = scoreMatchingGame(connections);
  const { complete, correctCount, scorePercent } = matchingScore;
  const canCheck = connections.length === matchingScore.total;

  useEffect(() => {
    if (!isChecked || !onAdvance || completionNotifiedRef.current) return;

    const timer = window.setTimeout(() => {
      completionNotifiedRef.current = true;
      onAdvance();
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [isChecked, onAdvance]);

  const submitAnswers = () => {
    if (isChecked) return;
    setIsChecked(true);
    if (onResult && !resultNotifiedRef.current) {
      resultNotifiedRef.current = true;
      onResult({
        correctCount,
        total: components.length,
        scorePercent,
      });
    }
  };

  return (
    <section className={styles.game} aria-labelledby="matching-title">
      <div className={styles.decorStrip} aria-hidden="true">
        {Array.from({ length: 24 }, (_, index) => (
          <span className={styles.decorTriangle} key={index} />
        ))}
      </div>
      <div className={styles.panel}>
        <header className={styles.heading}>
          <h2 id="matching-title">MISI TARIK GARIS</h2>
          <p>Evaluasi Penginderaan Jauh • Pasangkan secara tepat</p>
        </header>

        <div className={styles.instructions}>
        <span className={styles.instructionIcon} aria-hidden="true">↔</span>
        <p>
          Tarik garis dari komponen ke fungsi. Di layar sentuh, ketuk komponen
          lalu ketuk fungsi.
        </p>
        <div className={styles.instructionLegend} aria-hidden="true">
          <span><i className={styles.legendStart} /> Mulai</span>
          <span><i className={styles.legendTarget} /> Tujuan</span>
        </div>
        </div>

        <div
        className={styles.board}
        ref={boardRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={cancelDrag}
        onLostPointerCapture={cancelDrag}
      >
        <svg
          className={styles.lines}
          aria-hidden="true"
          focusable="false"
          width="100%"
          height="100%"
          viewBox={`0 0 ${Math.max(1, boardSize.width)} ${Math.max(1, boardSize.height)}`}
          preserveAspectRatio="none"
        >
          {connections.map((connection) => {
            const line = points.get(connection.component);
            if (!line) return null;
            return (
              <g key={connection.component}>
                <path
                  d={getPath(line.start, line.end)}
                  pathLength="1"
                  className={styles.connectedLineOutline}
                  aria-hidden="true"
                />
                <path
                  d={getPath(line.start, line.end)}
                  pathLength="1"
                  className={styles.connectedLine}
                />
                <circle
                  cx={line.start.x}
                  cy={line.start.y}
                  r="6"
                  className={`${styles.lineEndpoint} ${styles.connectedEndpoint}`}
                />
                <circle
                  cx={line.end.x}
                  cy={line.end.y}
                  r="6"
                  className={`${styles.lineEndpoint} ${styles.connectedEndpoint}`}
                />
              </g>
            );
          })}
          {dragStart && activePointerRef.current && (
            <g>
              <path
                ref={activeOutlinePathRef}
                d={getPath(
                  activePointerRef.current.start,
                  activePointerRef.current.latestPoint
                )}
                className={styles.activeLineOutline}
                aria-hidden="true"
              />
              <path
                ref={activePathRef}
                d={getPath(
                  activePointerRef.current.start,
                  activePointerRef.current.latestPoint
                )}
                pathLength="1"
                className={styles.activeLine}
              />
              <circle
                ref={activeStartPointRef}
                cx={activePointerRef.current.start.x}
                cy={activePointerRef.current.start.y}
                r="6"
                className={`${styles.lineEndpoint} ${styles.activeEndpoint}`}
              />
              <circle
                ref={activeEndPointRef}
                cx={activePointerRef.current.latestPoint.x}
                cy={activePointerRef.current.latestPoint.y}
                r="6"
                className={`${styles.lineEndpoint} ${styles.activeEndpoint}`}
              />
            </g>
          )}
          {cancelledLine && (
            <path
              d={getPath(cancelledLine.start, cancelledLine.end)}
              className={styles.cancelledLine}
              onAnimationEnd={() => setCancelledLine(null)}
            />
          )}
        </svg>

        <div className={styles.column}>
          <h3>KOMPONEN</h3>
          {components.map((component) => {
            const result = resultFor(component.id);
            const assigned = connections.some(
              (pair) => pair.component === component.id
            );
            const selected = selectedComponent === component.id;
return (
              <div
                className={`${styles.componentRow} ${
                  selected ? styles.selectedRow : ""
                } ${result ? styles[result] : ""} ${
                  draggingComponent === component.id ? styles.draggingRow : ""
                } ${
                  assigned ? styles.componentAssigned : ""
                }`}
                key={component.id}
              >
                <button
                  className={styles.componentButton}
                  type="button"
                  disabled={isChecked}
                  data-component-id={component.id}
                  ref={(element) => {
                    if (element) componentRefs.current.set(component.id, element);
                    else componentRefs.current.delete(component.id);
                  }}
                  onPointerDown={(event) =>
                    handlePointerDown(event, component.id)
                  }
                  onClick={() => selectComponent(component.id)}
                  aria-pressed={selected}
                  aria-label={`Pilih atau tarik dari komponen ${component.label}`}
                >
                  <span className={styles.componentCopy}>
                    <ComponentIcon type={component.icon} />
                    <span>{component.label}</span>
                  </span>
                  <span className={styles.anchor} data-component-anchor aria-hidden="true" />
                </button>
                <span className={styles.rowStatus}>
                  {result === "correct"
                    ? "Tepat"
                    : result === "incorrect"
                      ? "Belum tepat"
                      : assigned
                        ? "Terpasang"
                        : ""}
                </span>
                {assigned && (
                  <button
                    className={styles.removeButton}
                    type="button"
                    disabled={isChecked}
                    onClick={() => removeConnection(component.id)}
                    aria-label={`Lepas pasangan ${component.label}`}
                  >
                    Lepas
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.column}>
          <h3>FUNGSI / PETUNJUK</h3>
          {functions.map((functionItem) => {
            const assigned = connections.find(
              (pair) => pair.function === functionItem.id
            );
            return (
              <button
                className={`${styles.functionRow} ${
                  selectedComponent ? styles.functionReady : ""
                } ${
                  assigned ? styles.functionAssigned : ""
                } ${
                  hoveredFunction === functionItem.id
                    ? styles.functionHovered
                    : ""
                }`}
                type="button"
                disabled={isChecked}
                key={functionItem.id}
                data-function-id={functionItem.id}
                ref={(element) => {
                  if (element) functionRefs.current.set(functionItem.id, element);
                  else functionRefs.current.delete(functionItem.id);
                }}
                onClick={() => selectFunction(functionItem.id)}
                aria-label={`Pilih fungsi: ${functionItem.label}${
                  assigned
                    ? `, terhubung dengan ${
                        components.find(
                          (item) => item.id === assigned.component
                        )?.label
                      }`
                    : ""
                }`}
              >
                <span
                  className={styles.anchor}
                  data-function-anchor
                  aria-hidden="true"
                />
                <ComponentIcon type={functionIcons[functionItem.id]} />
                <span className={styles.functionText}>{functionItem.label}</span>
              </button>
            );
          })}
        </div>
        </div>

        <div className={styles.summary}>
          <strong>Misi:</strong> Pasangkan 5 komponen penginderaan jauh dengan fungsi atau petunjuk yang sesuai.
        </div>

      {isChecked ? (
        <div className={styles.result} role="status" aria-live="polite">
          <p>
            {correctCount} dari {components.length} pasangan benar · Nilai {scorePercent}%
          </p>
          <p>
            Rumus: ({correctCount} ÷ {components.length}) × 100 = {scorePercent}%
          </p>
          <p>
            {complete
              ? "Misi selesai! Semua komponen sudah dipasangkan dengan tepat."
              : "Pasangan yang belum tepat ditandai pada hasil pemeriksaan."}
          </p>
          {onAdvance && (
            <p>Hasil tersimpan. Misi Detektif Citra akan segera dimulai.</p>
          )}
        </div>
      ) : (
        <p className={styles.status} role="status" aria-live="polite">
          {message}
        </p>
      )}
      {!isChecked && (
        <button
          className={styles.resetButton}
          type="button"
          disabled={!canCheck}
          onClick={submitAnswers}
        >
          Periksa jawaban
        </button>
      )}
      </div>
    </section>
  );
}
