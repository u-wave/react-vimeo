import { expectError, expectType } from 'tsd'
import * as React from 'react'
import Vimeo from '.'

// Missing required prop `video`.
expectError(<Vimeo />)

{
  const element = (
    <Vimeo
      video={654321}
      onPlay={(event) => {
        expectType<number>(event.seconds)
        expectType<number>(event.duration)
        expectType<number>(event.percent)
      }}
    />
  )
}

{
  const element = <Vimeo video={123456} width={600} height="300px" />
}

{
  const element = (
    <Vimeo
      video={654321}
      onReady={(player) => {
        player.getCurrentTime()
      }}
    />
  )
}

{
  const element = (
    <Vimeo
      video={654321}
      autoplay
    />
  )
}
