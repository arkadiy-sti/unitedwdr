# Performance

Budgets: mobile LCP ≤2.5s, CLS ≤0.1, INP ≤200ms; initial JS ≤90KB gzip, critical house WebP ≤350KB, no third-party code except Turnstile on form interaction.

The 1600px house master is ~260KB WebP with explicit dimensions. The logo is ~10KB WebP. Below-fold imagery is lazy; the signature scene is loaded only near its section. Animation uses composited opacity/transform, IntersectionObserver, no frame sequence, and no WebGL. Reduced-motion and small-screen modes remove pinning and secondary effects.
