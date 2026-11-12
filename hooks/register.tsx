import type { Register } from 'claude-code'

const MARKER = '🟨 YOUR MOVE'
// Apple's system yellow, used three ways: full for the label and numbers,
// a faint wash for the card, a soft edge for its outline.
const YELLOW = '#FFD60A'
const TINT = '#FFD60A1F'
const EDGE = '#FFD60A66'

// A small lit dot with a blurred halo around it.
const ORB = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
  <defs>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFD60A" stop-opacity="0.85"/>
      <stop offset="45%" stop-color="#FFD60A" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#FFD60A" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="core" cx="40%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#FFF6C2"/>
      <stop offset="100%" stop-color="#FFD60A"/>
    </radialGradient>
  </defs>
  <circle cx="9" cy="9" r="9" fill="url(#halo)"/>
  <circle cx="9" cy="9" r="3.4" fill="url(#core)"/>
</svg>`

const INSTRUCTION = `# Your Move block

Whenever your reply leaves the user something they must do, decide, approve or answer before work can continue, end the reply with a block in exactly this form, as the very last thing in the reply:

${MARKER}
1. <first thing the user has to do or answer, one short plain sentence>
2. <next thing>

Rules:
- The line "${MARKER}" stands alone, exactly as written, with no heading marks, bold or other text on it.
- One numbered line per action or question, in the order to do them. Plain words, no jargon. Put the exact thing to click, type or reply in the line itself.
- List only what the user personally has to do or answer. Nothing you will do yourself, no summary, no optional ideas.
- Write nothing after the block.
- If the reply needs nothing from the user, leave the block out entirely.`

/** Splits a reply into the text before the block and the block's lines. */
const split = (text: string): { before: string; lines: string[] } | null => {
  const at = text.lastIndexOf(MARKER)

  if (at === -1) {
    return null
  }

  const before = text
    .slice(0, at)
    .replace(/[#*_>\s]+$/, '')
    .trimEnd()
  const lines = text
    .slice(at + MARKER.length)
    .split('\n')
    .map(line => line.replace(/\*\*|__|`/g, '').trim())
    .filter(line => line !== '' && !/^[*_#\s]+$/.test(line))

  return { before, lines }
}

export const register: Register = on => {
  // Rides along with each prompt as a hidden note for the model. (A system
  // prompt section would be tidier, but managed setups can pass over it.)
  on('prompt.submit', ($, e, next) =>
    next({ ...e, context: [...(e.context ?? []), INSTRUCTION] }),
  )

  on('ui.render', { component: 'AssistantMessage' }, async ($, e, next) => {
    if (e.props.isSummary) {
      return next(e)
    }

    const parts = split(e.props.text)

    if (parts === null) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)

    // The glowing dot: a real blur on graphical surfaces, a plain dot in a terminal.
    let orb = <Text color={YELLOW}>●</Text>

    if (e.surface !== 'terminal') {
      const { Svg } = $.ui.resolve(e)
      orb = <Svg source={ORB} alt="Your move" width={18} height={18} />
    }

    const block = (
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={e.surface === 'terminal' ? YELLOW : EDGE}
        backgroundColor={e.surface === 'terminal' ? undefined : TINT}
        paddingX="md"
        paddingY="sm"
        marginTop="md"
        gap="xs"
      >
        <Box flexDirection="row" alignItems="center" gap="sm">
          {orb}
          <Text color={YELLOW} weight="semibold" size="caption">
            Y O U R   M O V E
          </Text>
        </Box>
        {parts.lines.map(line => {
          const numbered = /^(\d+)[.)]\s+(.*)$/.exec(line)

          if (numbered === null) {
            return <Text weight="medium">{line}</Text>
          }

          return (
            <Box flexDirection="row" gap="sm">
              <Box flexShrink={0}>
                <Text color={YELLOW} weight="semibold" tabular>
                  {numbered[1]}
                </Text>
              </Box>
              <Text weight="medium">{numbered[2]}</Text>
            </Box>
          )
        })}
      </Box>
    )

    if (parts.before === '') {
      return block
    }

    const rest = await next({ ...e, props: { ...e.props, text: parts.before } })

    return (
      <Box flexDirection="column">
        {rest}
        {block}
      </Box>
    )
  })
}
