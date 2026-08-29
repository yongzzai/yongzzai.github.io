// Hand-curated layer on top of publications.generated.json.
//
// Keys are Google Scholar's stable citation id, so edits survive a title change
// upstream. Anything set here wins over the scraped value; anything omitted
// follows Scholar automatically. New papers appear with no entry here at all.
//
// Supported keys: title, authors, venue, year, hidden.

export const overrides = {
  // arXiv preprint
  'YxFIm0AAAAAJ:qUcmZB5y_30C': {
    venue: 'ArXiv Preprint, arXiv:2605.11011',
  },

  'YxFIm0AAAAAJ:HDshCWvjkbEC': {
    venue: 'In Proceedings of the 28th International Conference on Production Research 2025 (ICPR28)',
  },

  // Title follows Scholar (currently "Rewarding Structural Conformance of
  // Reasoning using Process Mining") -- it tracks the newest arXiv revision.
  'YxFIm0AAAAAJ:JV2RwH3_ST0C': {
    venue: 'ArXiv Preprint, arXiv:2510.25065',
    year: '2026.02',
  },

  'YxFIm0AAAAAJ:W7OEmFMy1HYC': {
    title: 'JustDense: Just using Dense instead of Sequence Mixer for Time Series Analysis',
    authors: 'Park, T., Lee, Y. (co-first), Park, D., Kim, D., & Bae, H.',
    venue: 'In Proceedings of the 2025 IEEE International Conference on Big Data (IEEE BigData 2025)',
  },

  'YxFIm0AAAAAJ:YsMSGLbcyi4C': {
    title:
      'Multi-task Trained Graph Neural Network for Business Process Anomaly Detection with a Limited Number of Labeled Anomalies',
    venue: 'In Proceedings of the International Conference on Business Process Management (BPM2025)',
  },

  'YxFIm0AAAAAJ:9yKSN-GCB0IC': {
    title:
      'Identifying Key factors influencing Import Container Dwell time using eXplainable Artificial Intelligence',
  },

  'YxFIm0AAAAAJ:u5HHmVD_uO8C': {
    title: 'Predictive Process Monitoring for Remaining Time Prediction with Transfer Learning',
    authors: 'Nur, I.A., Mustafa, K.I., Hanif, R.M., Kim, D., Lee, Y., & Bae, H.',
    venue: 'ICIC Express Letters, 18(8), 851–858',
  },

  // Korean-language work -- the Publications section is English-only.
  'YxFIm0AAAAAJ:dhFuZR0502QC': { hidden: true },
  'YxFIm0AAAAAJ:LkGwnXOMwfcC': { hidden: true },
}
