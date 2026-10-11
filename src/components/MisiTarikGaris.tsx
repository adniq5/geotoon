"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
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
type Point = { x: number; y: number };
type Connection = { component: ComponentId; function: FunctionId };

const answers: Record<ComponentId, FunctionId> = {
  sun: "source",
  satellite: "orbit",
  aircraft: "carrier",
  atmosphere: "air-layer",
  sensor: "records",
};

function getPath(start: Point, end: Point) {
  const direction = end.x >= start.x ? 1 : -1;
  const bend = Math.max(36, Math.abs(end.x - start.x) * 0.42);
  return `M ${start.x} ${start.y} C ${
    start.x + bend * direction
  } ${start.y}, ${end.x - bend * direction} ${end.y}, ${end.x} ${end.y}`;
}

function ComponentIcon({ type }: { type: (typeof components)[number]["icon"] }) {
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
  }
}

export default function MisiTarikGaris() {
  const boardRef = useRef<HTMLDivElement>(null);
  const componentRefs = useRef(new Map<ComponentId, HTMLButtonElement>());
  const functionRefs = useRef(new Map<FunctionId, HTMLButtonElement>());
  const activePointerRef = useRef<{
    component: ComponentId;
    pointerId: number;
    start: Point;
    latestPoint: Point;
    moved: boolean;
  } | null>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const ignoreClickRef = useRef(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentId | null>(null);
  const [points, setPoints] = useState<
    Map<string, { start: Point; end: Point }>
  >(new Map());
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [draggingComponent, setDraggingComponent] =
    useState<ComponentId | null>(null);
  const [hoveredFunction, setHoveredFunction] =
    useState<FunctionId | null>(null);
  const [message, setMessage] = useState(
    "Pilih komponen lalu pilih fungsi, atau tarik garis ke fungsi yang sesuai."
  );

  const measureConnections = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;

    const boardRect = board.getBoundingClientRect();
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

    setPoints(nextPoints);
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

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measureConnections);
      window.removeEventListener("orientationchange", measureConnections);
    };
  }, [measureConnections]);

  const connect = (component: ComponentId, functionId: FunctionId) => {
    const nextConnections = [
      ...connections.filter(
        (pair) =>
          pair.component !== component && pair.function !== functionId
      ),
      { component, function: functionId },
    ];
    const isCorrect = answers[component] === functionId;
    setConnections(nextConnections);
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
      moved: false,
    };
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
    const point = {
      x: event.clientX - boardRect.left,
      y: event.clientY - boardRect.top,
    };
    if (Math.hypot(point.x - activePointer.start.x, point.y - activePointer.start.y) > 8) {
      activePointer.moved = true;
    }
    activePointer.latestPoint = point;

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
        }
      });
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const activePointer = activePointerRef.current;
    if (!activePointer || activePointer.pointerId !== event.pointerId) return;

    const element = document.elementFromPoint(event.clientX, event.clientY);
    const target = element?.closest<HTMLElement>("[data-function-id]");
    const functionId = functions.find(
      (functionItem) => functionItem.id === target?.dataset.functionId
    )?.id;
    if (functionId && activePointer.moved) {
      connect(activePointer.component, functionId);
    } else if (activePointer.moved) {
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
    const pair = connections.find((item) => item.component === component);
    if (!pair) return null;
    return answers[component] === pair.function ? "correct" : "incorrect";
  };

  const complete =
    connections.length === components.length &&
    components.every((item) =>
      connections.some(
        (pair) =>
          pair.component === item.id && pair.function === answers[item.id]
      )
    );

  return (
    <section className={styles.game} aria-labelledby="matching-title">
      <header className={styles.heading}>
        <h2 id="matching-title">MISI TARIK GARIS</h2>
        <p>Evaluasi Penginderaan Jauh • Pasangkan secara tepat</p>
      </header>

      <div className={styles.instructions}>
        <span aria-hidden="true">↔</span>
        <p>
          Tarik garis dari komponen ke fungsi. Di layar sentuh, ketuk komponen
          lalu ketuk fungsi.
        </p>
      </div>

      <div
        className={styles.board}
        ref={boardRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={cancelDrag}
      >
        <svg
          className={styles.lines}
          aria-hidden="true"
          focusable="false"
          width="100%"
          height="100%"
        >
          {connections.map((connection) => {
            const line = points.get(connection.component);
            if (!line) return null;
            const isCorrect = answers[connection.component] === connection.function;
            return (
              <path
                key={connection.component}
                d={getPath(line.start, line.end)}
                className={isCorrect ? styles.correctLine : styles.incorrectLine}
              />
            );
          })}
          {dragStart && activePointerRef.current && (
            <path
              ref={activePathRef}
              d={getPath(
                dragStart,
                activePointerRef.current.latestPoint
              )}
              className={styles.activeLine}
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
                }`}
                key={component.id}
              >
                <button
                  className={styles.componentButton}
                  type="button"
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
                  hoveredFunction === functionItem.id
                    ? styles.functionHovered
                    : ""
                }`}
                type="button"
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
                <span className={styles.functionText}>{functionItem.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.status} role="status" aria-live="polite">
        {complete
          ? "Misi selesai! Semua komponen sudah dipasangkan dengan tepat."
          : message}
      </p>
      {complete && (
        <button
          className={styles.resetButton}
          type="button"
          onClick={() => {
            setConnections([]);
            setSelectedComponent(null);
            setMessage("Pilih komponen lalu pilih fungsi, atau tarik garis ke fungsi yang sesuai.");
          }}
        >
          Coba lagi
        </button>
      )}
    </section>
  );
}
