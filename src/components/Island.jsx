import TextType from './ui/TextType'
import './Island.css'

// The top of the screen keeps only a greeting, in a black pill like a phone's
// Dynamic Island. The pill hugs the text, so it grows and shrinks as the
// greeting types and deletes itself.
export function Island() {
  return (
    <div className="island-bar fixed inset-x-0 top-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="island">
        <TextType
          text={['Welcome to yongzzai.com!', 'Good to See You!']}
          loop
          typingSpeed={60}
          deletingSpeed={40}
          pauseDuration={1500}
          showCursor
          cursorCharacter="|"
        />
      </div>
    </div>
  )
}
