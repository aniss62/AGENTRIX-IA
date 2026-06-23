// Agentrix-IA — Tweaks (accent, display font, corner style)
const { useEffect } = React;
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#c2f43a",
  "displayFont": "Bricolage Grotesque",
  "corners": "soft"
}/*EDITMODE-END*/;

// swatch hex -> oklch hue (keeps derived accent tints coherent)
const ACCENT_HUE = {
  "#c2f43a": 128,  // lime
  "#42d6c4": 185,  // teal
  "#7aa2ff": 268,  // periwinkle
  "#ff8d5e": 45    // coral
};

const FONT_STACKS = {
  "Bricolage Grotesque": '"Bricolage Grotesque", sans-serif',
  "Space Grotesk": '"Space Grotesk", sans-serif',
  "Sora": '"Sora", sans-serif'
};

const CORNERS = {
  soft:  { r: "18px", lg: "26px", sm: "11px" },
  sharp: { r: "5px",  lg: "8px",  sm: "4px"  },
  round: { r: "26px", lg: "34px", sm: "16px" }
};

function AgentrixTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const { lang } = useT();

  useEffect(() => {
    const root = document.documentElement;
    const hue = ACCENT_HUE[t.accent] != null ? ACCENT_HUE[t.accent] : 128;
    root.style.setProperty("--accent-h", String(hue));
  }, [t.accent]);

  useEffect(() => {
    const root = document.documentElement;
    // Arabic always uses its dedicated face; only override for LTR
    if (lang !== "ar") {
      root.style.setProperty("--font-display", FONT_STACKS[t.displayFont] || FONT_STACKS["Bricolage Grotesque"]);
    } else {
      root.style.removeProperty("--font-display");
    }
  }, [t.displayFont, lang]);

  useEffect(() => {
    const root = document.documentElement;
    const c = CORNERS[t.corners] || CORNERS.soft;
    root.style.setProperty("--radius", c.r);
    root.style.setProperty("--radius-lg", c.lg);
    root.style.setProperty("--radius-sm", c.sm);
  }, [t.corners]);

  return (
    <TweaksPanel>
      <TweakSection label="Accent" />
      <TweakColor label="Couleur" value={t.accent}
        options={["#c2f43a", "#42d6c4", "#7aa2ff", "#ff8d5e"]}
        onChange={(v) => setTweak("accent", v)} />
      <TweakSection label="Typographie" />
      <TweakSelect label="Titres" value={t.displayFont}
        options={["Bricolage Grotesque", "Space Grotesk", "Sora"]}
        onChange={(v) => setTweak("displayFont", v)} />
      <TweakSection label="Style" />
      <TweakRadio label="Angles" value={t.corners}
        options={["sharp", "soft", "round"]}
        onChange={(v) => setTweak("corners", v)} />
    </TweaksPanel>
  );
}

window.AgentrixTweaks = AgentrixTweaks;
