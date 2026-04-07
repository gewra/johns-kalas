import { useEffect, useState } from 'react'

const details = [
  {
    label: 'Plats',
    value: 'Smörsoppsvägen 19',
  },
  {
    label: 'Tid',
    value: '10:00-12:00',
  },
  {
    label: 'Bjuds på',
    value: 'Pannkaka och fika',
  },
  {
    label: 'Tema',
    value: 'Minecraft, kalas och fullt med blockig energi',
  },
]

const activities = [
  'Pannkakor vid craftingbordet',
  'Fika efter dagens äventyr',
  'Kalasstämning med Minecraft-känsla',
]

const mobConfigs = {
  chicken: {
    duration: 10000,
    delay: 0,
    topRange: [10, 56],
  },
  pig: {
    duration: 11500,
    delay: 2100,
    topRange: [42, 78],
  },
  villager: {
    duration: 12000,
    delay: 4400,
    topRange: [18, 68],
  },
}

const creeperSequenceTimings = {
  entering: 4400,
  loading: 2000,
  exploding: 1300,
}

function getRandomPercentage([min, max]) {
  return `${Math.round(min + Math.random() * (max - min))}%`
}

function createMobPlacement(config) {
  return {
    side: Math.random() < 0.5 ? 'left' : 'right',
    top: getRandomPercentage(config.topRange),
  }
}

function createInitialMobPlacements() {
  return Object.fromEntries(
    Object.entries(mobConfigs).map(([name, config]) => [
      name,
      createMobPlacement(config),
    ]),
  )
}

function App() {
  const [mobPlacements, setMobPlacements] = useState(createInitialMobPlacements)
  const [leverEnabled, setLeverEnabled] = useState(false)
  const [creeperPhase, setCreeperPhase] = useState('idle')
  const isDetonated = creeperPhase === 'detonated'

  useEffect(() => {
    if (isDetonated) {
      return undefined
    }

    const timeoutIds = []
    const intervalIds = []

    for (const [name, config] of Object.entries(mobConfigs)) {
      const timeoutId = window.setTimeout(() => {
        setMobPlacements((current) => ({
          ...current,
          [name]: createMobPlacement(config),
        }))

        const intervalId = window.setInterval(() => {
          setMobPlacements((current) => ({
            ...current,
            [name]: createMobPlacement(config),
          }))
        }, config.duration)

        intervalIds.push(intervalId)
      }, config.delay + config.duration)

      timeoutIds.push(timeoutId)
    }

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
      intervalIds.forEach((intervalId) => window.clearInterval(intervalId))
    }
  }, [isDetonated])

  useEffect(() => {
    if (!leverEnabled) {
      setCreeperPhase((current) =>
        current === 'detonated' ? current : 'idle',
      )
      return undefined
    }

    setCreeperPhase('entering')

    const loadingTimer = window.setTimeout(() => {
      setCreeperPhase('loading')
    }, creeperSequenceTimings.entering)

    const explodingTimer = window.setTimeout(() => {
      setCreeperPhase('exploding')
    }, creeperSequenceTimings.entering + creeperSequenceTimings.loading)

    const resetTimer = window.setTimeout(() => {
      setCreeperPhase('detonated')
      setLeverEnabled(false)
    }, creeperSequenceTimings.entering + creeperSequenceTimings.loading + creeperSequenceTimings.exploding)

    return () => {
      window.clearTimeout(loadingTimer)
      window.clearTimeout(explodingTimer)
      window.clearTimeout(resetTimer)
    }
  }, [leverEnabled])

  return (
    <div className={`page-shell creeper-phase-${creeperPhase}`}>
      <div className="sky-grid" aria-hidden="true" />
      <div className="cloud cloud-one" aria-hidden="true" />
      <div className="cloud cloud-two" aria-hidden="true" />
      <div className="mob-layer" aria-hidden="true">
        <div
          className={`mob mob-chicken mob-side-${mobPlacements.chicken.side}`}
          style={{ '--spawn-top': mobPlacements.chicken.top }}
        >
          <span className="mob-head" />
          <span className="mob-eye mob-eye-left" />
          <span className="mob-eye mob-eye-right" />
          <span className="mob-beak" />
          <span className="mob-wattle" />
        </div>

        <div
          className={`mob mob-pig mob-side-${mobPlacements.pig.side}`}
          style={{ '--spawn-top': mobPlacements.pig.top }}
        >
          <span className="mob-head" />
          <span className="mob-ear mob-ear-left" />
          <span className="mob-ear mob-ear-right" />
          <span className="mob-eye mob-eye-left" />
          <span className="mob-eye mob-eye-right" />
          <span className="mob-snout" />
          <span className="mob-nostril mob-nostril-left" />
          <span className="mob-nostril mob-nostril-right" />
        </div>

        <div
          className={`mob mob-villager mob-side-${mobPlacements.villager.side}`}
          style={{ '--spawn-top': mobPlacements.villager.top }}
        >
          <span className="mob-head" />
          <span className="mob-brow" />
          <span className="mob-eye mob-eye-left" />
          <span className="mob-eye mob-eye-right" />
          <span className="mob-nose" />
          <span className="mob-robe" />
        </div>
      </div>
      <main className="invitation-card">
        <div className="hero-row">
          <div>
            <p className="kicker">Nytt uppdrag upplåst</p>
            <p className="date-line">John fyller 6 år • 10:00-12:00</p>
            <h1>Välkommen på Johns 6-årskalas!</h1>
            <p className="lede">
              Packa pickaxen och kom till ett blockigt kalasäventyr. Det blir
              pannkaka, fika och massor av Minecraft-stämning när vi firar att
              John fyller sex.
            </p>
          </div>

            <article
              id="creeper"
              className={`creeper-state-${creeperPhase}`}
              data-creeper-phase={creeperPhase}
              role="img"
            >
              <header>
                <h1></h1>
              </header>
              <main>
                <p></p>
              </main>
              <footer>
                <div className="foot"><p></p></div>
                <div className="foot"><p></p></div>
                <div className="foot"><p></p></div>
                <div className="foot"><p></p></div>
              </footer>
            </article>
          
        </div>

        

        <section className="content-grid" aria-label="Kalasinformation">
          <div className="panel panel-featured">
            <span className="panel-label">Uppdragslista</span>
            <p>
              Logga in i kalasvärlden för ett förmiddagspass med bus, godsaker
              och Minecraft-känsla runt varje hörn.
            </p>
            <ul>
              {activities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="details-grid">
            <article className="panel panel-photo-placeholder">
              <span className="panel-label">Hjälteporträtt</span>
              <div className="photo-placeholder" role="img" aria-label="Platshållare för ett foto på det 6-åriga födelsedagsbarnet">
                <img src='./src/assets/john-1.jpg' alt="John, det 6-åriga födelsedagsbarnet"/>
              </div>
            </article>

            {details.map((detail) => (
              <article className="panel" key={detail.label}>
                <span className="panel-label">{detail.label}</span>
                <p>{detail.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="closing-note" aria-label="Inbjudans sidfot">
          <p>Ses på kalaset</p>
          <span>
            Plats: Smörsoppsvägen 19. Tid: 10:00-12:00. Det bjuds på pannkaka
            och fika.
          </span>
        </section>

        <section className="panel panel-lever" aria-label="Minecraft-spak">
          <div className="lever-copy">
            <span className="panel-label">Dra INTE i spaken!</span>
          </div>

          <button
            type="button"
            className={`lever-button${leverEnabled ? ' is-on' : ''}`}
            aria-pressed={leverEnabled}
            aria-label={isDetonated ? 'Spaken ar ur funktion efter explosionen' : leverEnabled ? 'Stang av spaken' : 'Sla pa spaken'}
            disabled={isDetonated}
            onClick={() => setLeverEnabled((current) => !current)}
          >
            <span className="lever-scene">
              <span className="lever-floor" />
              <span className="lever-mount">
                <span className="lever-arm">
                  <span className="lever-arm-tip" />
                </span>
                <span className="lever-pivot" />
              </span>
            </span>
          </button>
        </section>
      </main>
    </div>
  )
}

export default App