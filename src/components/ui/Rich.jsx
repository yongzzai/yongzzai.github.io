import { Fragment } from 'react'
import { parseEmphasis } from '../../lib/emphasis'

// Text from the data files with its **bold**, *italic* and ^superscript^
// rendered.
export function Rich({ text }) {
  return parseEmphasis(text).map((run, i) =>
    run.bold ? (
      <strong key={i} className="font-semibold text-ink">
        {run.text}
      </strong>
    ) : run.italic ? (
      <em key={i}>{run.text}</em>
    ) : run.sup ? (
      <sup key={i}>{run.text}</sup>
    ) : (
      <Fragment key={i}>{run.text}</Fragment>
    ),
  )
}
