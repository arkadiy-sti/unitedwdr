import { clamp01, heroStages, heroState, smoothstep } from "../../lib/heroTimeline";

type HeroState = ReturnType<typeof heroState>;
type Drop = { x: number; y: number; speed: number; length: number; depth: number };

const story = document.querySelector<HTMLElement>("[data-uwd-story]");

if (story) {
  const world = story.querySelector<HTMLElement>("[data-uwd-world]");
  const canvas = story.querySelector<HTMLCanvasElement>("[data-uwd-weather]");
  const context = canvas?.getContext("2d", { alpha: true });
  const storm = story.querySelector<HTMLElement>("[data-uwd-storm]");
  const wet = story.querySelector<HTMLElement>("[data-uwd-wet]");
  const moisture = story.querySelector<HTMLElement>("[data-uwd-moisture]");
  const damage = story.querySelector<SVGElement>("[data-uwd-damage]");
  const recovery = story.querySelector<HTMLElement>("[data-uwd-recovery]");
  const pools = story.querySelector<SVGElement>("[data-uwd-pools]");
  const airflow = story.querySelector<SVGElement>("[data-uwd-airflow]");
  const hose = story.querySelector<SVGElement>("[data-uwd-hose]");
  const monitor = story.querySelector<HTMLElement>("[data-uwd-monitor]");
  const exit = story.querySelector<HTMLElement>("[data-uwd-exit]");
  const label = story.querySelector<HTMLElement>("[data-uwd-stage-label]");
  const title = story.querySelector<HTMLElement>("[data-uwd-stage-title]");
  const copy = story.querySelector<HTMLElement>("[data-uwd-stage-copy]");
  const detail = story.querySelector<HTMLElement>("[data-uwd-stage-detail]");
  const progressBar = story.querySelector<HTMLElement>("[data-uwd-progress]");
  const progressTrack = story.querySelector<HTMLElement>(".uwd-progress");
  const scrollHint = story.querySelector<HTMLElement>(".uwd-scroll-hint");
  const visualNote = story.querySelector<HTMLElement>(".uwd-visual-note");
  const count = story.querySelector<HTMLElement>("[data-uwd-count]");
  const caption = story.querySelector<HTMLElement>(".uwd-story-caption");
  const introPanel = story.querySelector<HTMLElement>(".uwd-intro-panel");
  const mobileDetail = story.querySelector<HTMLElement>("[data-uwd-mobile-detail]");
  const objects = new Map(Array.from(story.querySelectorAll<HTMLElement | SVGElement>("[data-object]")).map((element) => [element.dataset.object, element]));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  story.classList.toggle("uwd-enhanced", !reducedMotion.matches);
  let visible = true;
  let frame = 0;
  let lastTime = 0;
  let weatherTime = 0;
  let current = 0;
  let target = 0;
  let lastStage = -1;
  let width = 0;
  let height = 0;
  let drops: Drop[] = [];

  const setOpacity = (element: Element | null, value: number) => {
    if (element instanceof HTMLElement || element instanceof SVGElement) element.style.opacity = String(clamp01(value));
  };

  const placeObject = (id: string, opacity: number, travel = 0, lift = 0) => {
    const object = objects.get(id);
    if (!object) return;
    const flip = object.classList.contains("uwd-object-flipped") ? " scaleX(-1)" : "";
    object.style.opacity = String(clamp01(opacity));
    object.style.transform = `translate(calc(-50% + ${travel.toFixed(2)}%), calc(-100% + ${lift.toFixed(2)}%))${flip}`;
  };

  function loadNeededObjects(progress: number) {
    for (const [id, object] of objects) {
      const threshold = id === "van" ? .11 : id?.startsWith("tech") ? .19 : id === "extractor" ? .28 : id === "dehu" ? .54 : .37;
      if (progress < threshold) continue;
      if (object instanceof HTMLImageElement) {
        const source = object.getAttribute("data-uwd-source");
        if (source) {
          object.setAttribute("src", source);
          object.removeAttribute("data-uwd-source");
        }
        continue;
      }
      const image = object.querySelector("image[data-uwd-source]");
      const source = image?.getAttribute("data-uwd-source");
      if (image && source) {
        image.setAttribute("href", source);
        image.removeAttribute("data-uwd-source");
      }
    }
  }

  function syncCanvas() {
    if (!world || !canvas || !context) return;
    const rect = world.getBoundingClientRect();
    width = Math.round(rect.width);
    height = Math.round(rect.height);
    const ratio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2);
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = window.innerWidth < 768 ? 130 : window.innerWidth < 1200 ? 240 : 390;
    drops = Array.from({ length: count }, (_, index) => ({
      x: ((index * 0.61803398875) % 1) * width,
      y: ((index * 0.754877666) % 1) * height,
      speed: 340 + (index % 7) * 51,
      length: 7 + (index % 5) * 3,
      depth: 0.35 + (index % 4) * 0.18
    }));
  }

  function drawWeather(state: HeroState, time: number) {
    if (!context || !canvas || !width || !height) return;
    context.clearRect(0, 0, width, height);
    if (state.rain > 0.025) {
      context.lineWidth = Math.max(0.75, width / 1900);
      for (const drop of drops) {
        const x = drop.x;
        const y = ((drop.y + time * drop.speed * drop.depth) % (height + 40)) - 30;
        const nx = x / width;
        const ny = y / height;
        // The architectural cutaway is open to the viewer; rain belongs outside it.
        if (nx > 0.505 && nx < 0.915 && ny > 0.155 && ny < 0.83) continue;
        context.strokeStyle = `rgba(205,229,238,${(0.16 + drop.depth * 0.27) * state.rain})`;
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x - drop.length * 0.15, y + drop.length);
        context.stroke();
      }
      // Sparse roof runoff, anchored to the roof edge rather than floating in a room.
      context.strokeStyle = `rgba(177,217,233,${0.27 * state.rain})`;
      context.lineWidth = Math.max(1, width / 1300);
      const runoffPoints: Array<readonly [number, number]> = [[.505, .203], [.903, .17], [.285, .455]];
      for (const [x, y] of runoffPoints) {
        const offset = (time * 90) % 34;
        for (let n = 0; n < 3; n++) {
          const sy = y * height + offset + n * 32;
          context.beginPath();
          context.moveTo(x * width, sy);
          context.lineTo(x * width - 1, sy + 11);
          context.stroke();
        }
      }
    }
    if (state.leaks > 0.025) {
      const sources: Array<readonly [number, number, number]> = [[.624, .36, .43], [.785, .415, .455], [.593, .18, .37]];
      for (const [x, start, stop] of sources) {
        const distance = (stop - start) * height;
        context.strokeStyle = `rgba(115,179,206,${0.19 * state.leaks})`;
        context.lineWidth = Math.max(0.7, width / 2000);
        context.beginPath();
        context.moveTo(x * width, start * height);
        context.lineTo(x * width - 1, stop * height);
        context.stroke();
        context.fillStyle = `rgba(151,211,233,${0.63 * state.leaks})`;
        for (let index = 0; index < 3; index++) {
          const dropY = ((time * 145 + index * distance / 3) % distance) / height;
          context.beginPath();
          context.ellipse(x * width - dropY * 2, (start + dropY) * height, Math.max(1, width / 1450), Math.max(2.2, width / 620), 0, 0, Math.PI * 2);
          context.fill();
        }
      }
    }
  }

  function render(progress: number, time: number) {
    const state = heroState(progress);
    if (introPanel) {
      const conceal = !introPanel.contains(document.activeElement)
        ? smoothstep((progress - .04) / .07) : 0;
      introPanel.style.opacity = String(1 - conceal);
      introPanel.style.visibility = conceal > .995 ? "hidden" : "visible";
      introPanel.inert = conceal > .995;
    }
    if (mobileDetail) {
      const reveal = smoothstep((progress - .09) / .05) * (1 - smoothstep((progress - .945) / .025));
      mobileDetail.style.opacity = String(reveal);
      mobileDetail.inert = reveal < .995;
    }
    loadNeededObjects(progress);
    setOpacity(storm, state.storm * .75);
    setOpacity(wet, state.wet * (1 - state.waterReduction * .45));
    setOpacity(pools, state.wet * (1 - state.waterReduction * .76));
    setOpacity(moisture, state.moisture);
    setOpacity(damage, state.moisture * (1 - state.waterReduction * .46));
    setOpacity(recovery, state.recovery * .7);
    setOpacity(airflow, state.airflow);
    setOpacity(hose, state.extraction);
    const hosePath = hose?.querySelector("path");
    if (hosePath) hosePath.style.strokeDashoffset = String(1 - state.extraction);
    story!.classList.toggle("uwd-flow-active", visible && state.airflow > .025);
    const inspectionScan = Math.max(state.monitoring, state.inspection * .8);
    setOpacity(monitor, inspectionScan);
    story!.classList.toggle("uwd-monitor-active", visible && inspectionScan > .025);
    setOpacity(exit, smoothstep((progress - .94) / .055));

    const arriving = smoothstep((progress - .16) / .075);
    const departing = smoothstep((progress - .91) / .085);
    const vanTravel = -145 * (1 - arriving) - 145 * departing;
    placeObject("van", state.van, vanTravel);
    const workerPresence = Math.max(state.inspection, state.extraction, state.monitoring);
    placeObject("techLower", workerPresence, -65 * (1 - workerPresence));
    placeObject("techUpper", workerPresence * .82, 65 * (1 - workerPresence));
    placeObject("extractor", state.extraction, -95 * (1 - state.extraction));
    for (let index = 0; index < 4; index++) {
      const installed = smoothstep((progress - (.43 + index * .015)) / .045);
      const presence = installed * (1 - smoothstep((progress - (.915 + index * .007)) / .055));
      placeObject(`am${index + 1}`, presence, (index % 2 === 0 ? -1 : 1) * 135 * (1 - installed));
    }
    const dehuInstalled = smoothstep((progress - .61) / .06);
    placeObject("dehu", state.dehumidifier, 125 * (1 - dehuInstalled));
    drawWeather(state, time);
    if (state.stageIndex !== lastStage) {
      const stage = heroStages[state.stageIndex] ?? heroStages[0];
      if (label) label.textContent = stage.label;
      if (title) title.textContent = stage.title;
      if (copy) copy.textContent = stage.copy;
      if (detail) detail.textContent = stage.detail;
      if (count) count.textContent = `${String(state.stageIndex + 1).padStart(2, "0")} / 11`;
      lastStage = state.stageIndex;
    }
    const activeStage = heroStages[state.stageIndex] ?? heroStages[0];
    const span = activeStage.end - activeStage.start;
    const local = (progress - activeStage.start) / span;
    const fadeIn = state.stageIndex === 0 ? 1 : smoothstep(local / .09);
    const fadeOut = state.stageIndex === heroStages.length - 1 ? 1 : 1 - smoothstep((local - .91) / .09);
    setOpacity(caption, fadeIn * fadeOut * (1 - smoothstep((progress - .945) / .025)));
    const interfaceExit = 1 - smoothstep((progress - .94) / .045);
    setOpacity(progressTrack, interfaceExit);
    setOpacity(scrollHint, interfaceExit);
    setOpacity(visualNote, interfaceExit);
    if (progressBar) progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;
  }

  function measureProgress() {
    const available = Math.max(1, story!.offsetHeight - window.innerHeight);
    target = clamp01(-story!.getBoundingClientRect().top / available);
  }

  function tick(timeMs: number) {
    frame = 0;
    if (!visible || document.hidden || reducedMotion.matches) return;
    const dt = Math.min((timeMs - lastTime) / 1000 || .016, .06);
    lastTime = timeMs;
    const blend = 1 - Math.exp(-dt * 12);
    current += (target - current) * blend;
    if (Math.abs(target - current) < .00015) current = target;
    weatherTime += dt;
    render(current, weatherTime);
    const active = heroState(current);
    if (current !== target || active.rain > .025 || active.leaks > .025) schedule();
  }

  function schedule() {
    if (!frame && visible && !document.hidden && !reducedMotion.matches) frame = requestAnimationFrame(tick);
  }

  function onScroll() {
    story!.classList.toggle("uwd-enhanced", !reducedMotion.matches);
    measureProgress();
    if (reducedMotion.matches || document.hidden) {
      story!.classList.remove("uwd-flow-active", "uwd-monitor-active");
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
    }
    if (reducedMotion.matches) {
      render(0, 0);
      if (introPanel) { introPanel.style.visibility = "visible"; introPanel.inert = false; }
    }
    schedule();
  }

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    if (visible) { measureProgress(); lastTime = performance.now(); schedule(); }
    else {
      story!.classList.remove("uwd-flow-active", "uwd-monitor-active");
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
    }
  });
  intersection.observe(story);
  const resize = new ResizeObserver(() => { syncCanvas(); measureProgress(); schedule(); });
  if (world) resize.observe(world);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  document.addEventListener("visibilitychange", () => { lastTime = performance.now(); onScroll(); });
  reducedMotion.addEventListener("change", onScroll);
  for (const [selector, direction] of [["[data-uwd-previous]", -1], ["[data-uwd-next]", 1]] as const) {
    story.querySelector<HTMLButtonElement>(selector)?.addEventListener("click", () => {
      const index = Math.max(0, Math.min(heroStages.length - 1, heroState(target).stageIndex + direction));
      const stage = heroStages[index]!;
      const progress = index === 0 ? 0 : (stage.start + stage.end) / 2;
      window.scrollTo({ top: window.scrollY + story.getBoundingClientRect().top + progress * (story.offsetHeight - window.innerHeight), behavior: "instant" });
    });
  }
  syncCanvas();
  measureProgress();
  if (!reducedMotion.matches) { current = target; render(current, 0); schedule(); }
}
