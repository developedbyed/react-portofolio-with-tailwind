import { useEffect, useRef, useState, type CSSProperties } from "react"

type SpeechResult = { transcript: string }
type SpeechErrorEvent = { error?: string }
type SpeechRecognizer = {
    lang: string
    interimResults: boolean
    continuous: boolean
    onresult: ((event: { results: ArrayLike<ArrayLike<SpeechResult>> }) => void) | null
    onerror: ((event: SpeechErrorEvent) => void) | null
    onend: (() => void) | null
    onaudiostart?: (() => void) | null
    onspeechstart?: (() => void) | null
    start(): void
    stop(): void
}
type SpeechWindow = Window & { SpeechRecognition?: new () => SpeechRecognizer; webkitSpeechRecognition?: new () => SpeechRecognizer }

type Source = { title: string; detail?: string; url?: string; excerpt?: string }
type Reply = { answer: string; sources?: Source[]; suggested_sources?: Source[]; petra_speech_token?: string; processing?: string; live_source_status?: "checked" | "failed" | "not-needed"; comparison_session_id?: string | null; comparison_status?: string }

type Props = {
    apiEndpoint: string
    sampleQuestion: string
    style?: CSSProperties
}

const KAREN_LOGO = "data:image/webp;base64,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"

const demoReply: Reply = {
    answer:
        "Je voorschot is een maandelijkse inschatting van je energiekosten. Op je jaarafrekening wordt de werkelijke kost verrekend met de voorschotten die al zijn aangerekend. Heb je te veel vooruitbetaald, dan krijg je het verschil terug; anders betaal je het verschil bij.",
    sources: [
        {
            title: "Luminus · voorschotten en jaarafrekening",
            detail: "Voorbeeldlink · niet live opgehaald",
            url: "https://www.luminus.be/nl/prive/energie/energiefactuur-uitgelegd/",
        },
        {
            title: "Kennisbasis EnergyAgent",
            detail: "Voorbeeldfragment · PDF-pagina 4",
            excerpt:
                "Luminus werkt met voorschotfacturen en afrekeningen; het ideale voorschot kan op basis van digitale meterdata worden herberekend.",
        },
    ],
}

const DEMO_QUESTION = "Waarom verschilt mijn voorschot van mijn jaarafrekening?"
const normalizeQuestion = (text: string) => text.trim().toLocaleLowerCase("nl-BE").replace(/[?!.]+$/, "")

const css = `
  * { box-sizing: border-box; }
  .ea { width:100%; height:100%; min-height:590px; display:grid; grid-template-columns:minmax(0,1fr) 290px; gap:16px; padding:18px; color:#1e2b23; background:#f6f7f3; font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif; }
  .ea-panel { min-width:0; border:1px solid #e2e7df; border-radius:20px; background:#fff; }
  .ea-main { display:flex; flex-direction:column; padding:24px; }
  .ea-brand { display:flex; align-items:center; gap:10px; padding-bottom:18px; border-bottom:1px solid #e8ece7; color:#637168; font-size:12px; }
  .ea-mark { display:block; width:38px; height:38px; border:1px solid #e5e9df; border-radius:50%; object-fit:cover; background:#183d2c; }
  .ea-brand strong { color:#23342a; font-size:14px; }
  .ea-kicker { margin:27px 0 7px; color:#4b805e; font-size:10px; font-weight:750; letter-spacing:.11em; text-transform:uppercase; }
  .ea h1 { margin:0; font-size:clamp(23px,3vw,34px); line-height:1.12; letter-spacing:-.04em; }
  .ea-sub { margin:9px 0 20px; color:#69766d; font-size:14px; line-height:1.55; }
  .ea-thread { flex:1; min-height:160px; overflow:auto; padding:4px 0 16px; }
  .ea-question { width:fit-content; max-width:88%; margin:0 0 14px auto; padding:12px 15px; border-radius:16px 16px 4px 16px; color:white; background:#234f38; font-size:13px; line-height:1.5; }
  .ea-answer { max-width:94%; padding:15px 17px; border:1px solid #e8ece7; border-radius:4px 16px 16px; background:#fbfcfa; font-size:13px; line-height:1.65; white-space:pre-line; }
  .ea-state { display:flex; align-items:center; gap:8px; margin:4px 0 12px; color:#68776d; font-size:12px; }
  .ea-dot { width:8px; height:8px; border-radius:50%; background:#55a573; }
  .ea-controls { display:grid; grid-template-columns:minmax(0,1fr) 48px; gap:8px; }
  .ea-input { min-width:0; height:48px; padding:0 14px; border:1px solid #dfe5de; border-radius:14px; outline:none; color:#27372c; background:white; font:inherit; font-size:13px; }
  .ea-input:focus { border-color:#72a584; box-shadow:0 0 0 3px #72a58420; }
  .ea-button { display:grid; place-items:center; height:48px; border:0; border-radius:14px; color:white; background:#234f38; font-size:19px; cursor:pointer; }
  .ea-button:hover { background:#173d29; }
  .ea-mic { display:flex; align-items:center; justify-content:center; gap:8px; min-height:44px; margin:0 0 8px; padding:0 14px; border:1px solid #c9d9c8; border-radius:13px; color:#234f38; background:#f4f8f2; font:inherit; font-size:12px; font-weight:650; cursor:pointer; }
  .ea-mic[data-listening="true"] { color:white; background:#a84639; border-color:#a84639; }
  .ea-mic:disabled { opacity:.5; cursor:not-allowed; }
  .ea-button:disabled { opacity:.55; cursor:wait; }
  .ea-foot { margin:9px 0 0; color:#7b877e; font-size:10px; line-height:1.5; }
  .ea-rail { display:flex; flex-direction:column; gap:12px; }
  .ea-card { padding:18px; border:1px solid #e2e7df; border-radius:20px; background:#fff; }
  .ea-card h2 { margin:0 0 5px; font-size:13px; }
  .ea-card p { margin:0; color:#728076; font-size:11px; line-height:1.5; }
  .ea-source { display:block; padding:12px 0; border-top:1px solid #edf0eb; color:#25372b; text-decoration:none; }
  .ea-source:first-of-type { margin-top:12px; }
  .ea-source strong { display:block; font-size:11px; line-height:1.4; }
  .ea-source small { display:block; margin-top:3px; color:#718076; font-size:10px; }
  .ea-excerpt { margin-top:9px!important; padding:10px 11px; border-left:2px solid #9bc294; border-radius:0 9px 9px 0; color:#48594d!important; background:#f2f7ef; font-size:10px!important; }
  .ea-audio { margin-top:10px; width:100%; height:34px; }
  .ea-voice-play { margin-top:10px; padding:8px 12px; border:1px solid #c9d9c8; border-radius:10px; color:#234f38; background:#f4f8f2; font:inherit; font-size:12px; cursor:pointer; }
  .ea-voice-play:disabled { opacity:.6; cursor:wait; }
  @media (max-width:680px) { .ea { grid-template-columns:1fr; min-height:0; padding:10px; gap:10px; } .ea-main { min-height:490px; padding:18px; } .ea-rail { display:grid; grid-template-columns:1fr; } }
`

export default function EnergyAgentConversation({
    apiEndpoint = "",
    sampleQuestion = DEMO_QUESTION,
    style,
}: Props) {
    const [question, setQuestion] = useState("")
    const [asked, setAsked] = useState("")
    const [reply, setReply] = useState<Reply | null>(null)
    const [status, setStatus] = useState("Klaar om te helpen")
    const [busy, setBusy] = useState(false)
    const [answerError, setAnswerError] = useState("")
    const [uploading, setUploading] = useState(false)
    const [sessionId, setSessionId] = useState("")
    const [comparisonSessionId, setComparisonSessionId] = useState("")
    const [uploadName, setUploadName] = useState("")
    const [uploadError, setUploadError] = useState("")
    const [listening, setListening] = useState(false)
    const [voiceDraft, setVoiceDraft] = useState(false)
    const [voiceError, setVoiceError] = useState("")
    const [petraBusy, setPetraBusy] = useState(false)
    const [petraError, setPetraError] = useState("")
    const [petraAudioUrl, setPetraAudioUrl] = useState("")
    const [recognition, setRecognition] = useState<SpeechRecognizer | null>(null)
    const voiceTimeout = useRef<number | null>(null)
    const petraAbort = useRef<AbortController | null>(null)
    const petraPlayer = useRef<HTMLAudioElement | null>(null)
    const petraAudioUrlRef = useRef("")

    useEffect(() => () => {
        petraAbort.current?.abort()
        petraPlayer.current?.pause()
        if (petraAudioUrlRef.current) URL.revokeObjectURL(petraAudioUrlRef.current)
    }, [])

    function endpointFor(path: "upload" | "session" | "comparison-session" | "petra-speech"): string {
        const url = new URL(apiEndpoint.trim())
        url.pathname = url.pathname.replace(/\/api\/answer\/?$/, `/api/${path}`)
        if (!url.pathname.endsWith(`/api/${path}`)) {
            url.pathname = `${url.pathname.replace(/\/$/, "")}/api/${path}`
        }
        url.search = ""
        return url.toString().replace(/\/$/, "")
    }

    function clearPetra() {
        petraAbort.current?.abort()
        petraAbort.current = null
        petraPlayer.current?.pause()
        petraPlayer.current = null
        if (petraAudioUrlRef.current) URL.revokeObjectURL(petraAudioUrlRef.current)
        petraAudioUrlRef.current = ""
        setPetraAudioUrl("")
        setPetraBusy(false)
        setPetraError("")
    }

    async function playPetra(token: string) {
        clearPetra()
        const controller = new AbortController()
        petraAbort.current = controller
        setPetraBusy(true)
        try {
            const response = await fetch(endpointFor("petra-speech"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
                signal: controller.signal,
            })
            if (!response.ok) throw new Error(`Petra is niet beschikbaar (${response.status})`)
            const blob = await response.blob()
            if (controller.signal.aborted || !blob.type.includes("audio/")) return
            const url = URL.createObjectURL(blob)
            petraAudioUrlRef.current = url
            setPetraAudioUrl(url)
            const player = new Audio(url)
            petraPlayer.current = player
            try {
                await player.play()
            } catch {
                setPetraError("Druk op afspelen om Karen te horen.")
            }
        } catch {
            if (!controller.signal.aborted) {
                setPetraError("Karens stem is nu niet beschikbaar. Je kunt het antwoord hierboven lezen.")
            }
        } finally {
            if (petraAbort.current === controller) {
                petraAbort.current = null
                setPetraBusy(false)
            }
        }
    }

    async function uploadPdf(file?: File) {
        if (!file) return
        clearPetra()
        if (listening) stopVoice()
        setVoiceDraft(false)
        setUploadError("")
        if (!apiEndpoint.trim()) {
            setUploadError("Verbind eerst Karen’s backend om een PDF te analyseren.")
            return
        }
        if (file.size > 15 * 1024 * 1024) {
            setUploadError("Kies een PDF kleiner dan 15 MB.")
            return
        }
        const previousSession = sessionId
        if (comparisonSessionId) {
            void fetch(`${endpointFor("comparison-session")}/${encodeURIComponent(comparisonSessionId)}`, { method: "DELETE" }).catch(() => undefined)
            setComparisonSessionId("")
        }
        setUploading(true)
        setStatus("PDF wordt op Karen’s backend gelezen…")
        if (previousSession) {
            void fetch(`${endpointFor("session")}/${encodeURIComponent(previousSession)}`, { method: "DELETE" }).catch(() => undefined)
        }
        try {
            const form = new FormData()
            form.set("file", file)
            const response = await fetch(endpointFor("upload"), { method: "POST", body: form })
            if (!response.ok) {
                const errorData = (await response.json().catch(() => null)) as { detail?: string } | null
                throw new Error(errorData?.detail || `Upload mislukt (${response.status})`)
            }
            const data = (await response.json()) as Reply & { session_id: string; filename: string; processing?: string }
            if (!data.session_id || !data.answer) throw new Error("De PDF-analyse ontbreekt in de API-respons")
            setSessionId(data.session_id)
            setUploadName(data.filename || file.name)
            setAsked(`Eerste analyse · ${data.filename || file.name}`)
            setReply(data)
            setStatus("PDF verwerkt op Karen’s backend · geen externe modelverwerking")
        } catch (error) {
            setSessionId("")
            setUploadName("")
            setUploadError(error instanceof Error ? error.message : "Uploaden is mislukt")
            setStatus("PDF niet geanalyseerd")
        } finally {
            setUploading(false)
        }
    }

    async function clearPdf() {
        clearPetra()
        if (sessionId && apiEndpoint.trim()) {
            try {
                await fetch(`${endpointFor("session")}/${encodeURIComponent(sessionId)}`, { method: "DELETE" })
            } catch {
                // The server-side session also expires automatically.
            }
        }
        setSessionId("")
        setUploadName("")
        setUploadError("")
        setVoiceError("")
        setVoiceDraft(false)
        setReply(null)
        setAsked("")
        setStatus("PDF-sessie gewist")
    }

    async function ask(text: string) {
        const clean = text.trim()
        if (!clean || busy || uploading) return
        clearPetra()
        if (listening) stopVoice()
        setAnswerError("")
        setAsked(clean)
        setQuestion("")
        setVoiceDraft(false)
        setReply(null)
        setBusy(true)
        setStatus("Karen haalt relevante bronpassages op…")
        try {
            if (apiEndpoint.trim()) {
                const response = await fetch(apiEndpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ question: clean, ...(sessionId ? { session_id: sessionId } : {}), ...(comparisonSessionId ? { comparison_session_id: comparisonSessionId } : {}) }),
                })
                if (!response.ok) {
                    const errorData = (await response.json().catch(() => null)) as { detail?: string } | null
                    throw new Error(errorData?.detail || `Verzoek mislukt (${response.status})`)
                }
                const data = (await response.json()) as Reply
                if (!data.answer) throw new Error("Het antwoord ontbreekt in de API-respons")
                if ("comparison_session_id" in data) setComparisonSessionId(data.comparison_session_id || "")
                setReply(data)
                if (!sessionId && data.processing !== "local-only") {
                    if (data.petra_speech_token) void playPetra(data.petra_speech_token)
                    else setPetraError("Voor dit antwoord is geen audio beschikbaar. Je kunt het antwoord hierboven lezen.")
                }
                setStatus(data.comparison_status === "collecting"
                    ? "Vergelijking actief · Karen vraagt ontbrekende gegevens"
                    : data.processing === "local-only"
                    ? "Antwoord uit PDF-passage · op Karen’s backend verwerkt"
                    : data.live_source_status === "failed"
                    ? "Antwoord klaar · live controle niet volledig bevestigd"
                        : data.sources?.length ? "Antwoord klaar · bewijs bijgevoegd" : "Antwoord klaar · geen bronfragment gevonden")
            } else {
                if (normalizeQuestion(clean) !== normalizeQuestion(DEMO_QUESTION)) {
                    throw new Error("Karen is hier nog niet verbonden met haar live backend. De voorbeeldmodus ondersteunt alleen de vraag over voorschot en jaarafrekening.")
                }
                await new Promise((resolve) => setTimeout(resolve, 800))
                setReply(demoReply)
                setStatus("Voorbeeldweergave · geen live AI-antwoord")
            }
        } catch (error) {
            setAnswerError(error instanceof Error ? error.message : "Karen kon de vraag niet beantwoorden.")
        } finally {
            setBusy(false)
        }
    }

    function startVoice() {
        setVoiceError("")
        setVoiceDraft(false)
        if (sessionId) {
            setVoiceError("Schakel de PDF-sessie uit voor je spreekt. Deel geen factuurgegevens via voice.")
            return
        }
        const speechWindow = window as SpeechWindow
        const SpeechRecognitionCtor = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition
        if (!SpeechRecognitionCtor) {
            setVoiceError("Spraakherkenning is niet beschikbaar in deze browser. Typ je vraag hieronder.")
            return
        }
        clearPetra()
        const nextRecognition = new SpeechRecognitionCtor()
        nextRecognition.lang = "nl-BE"
        nextRecognition.interimResults = false
        nextRecognition.continuous = false
        let hasTranscript = false
        nextRecognition.onresult = (event) => {
            const transcript = event.results[0]?.[0]?.transcript?.trim()
            if (!transcript) {
                setVoiceError("De spraakdienst gaf geen herkende tekst terug. Typ je vraag of probeer opnieuw.")
                return
            }
            hasTranscript = true
            if (voiceTimeout.current !== null) window.clearTimeout(voiceTimeout.current)
            voiceTimeout.current = null
            nextRecognition.stop()
            setListening(false)
            setQuestion(transcript)
            setVoiceDraft(true)
            setStatus("Controleer de herkende vraag en druk op verzenden. Je kunt woorden zoals CREG eerst verbeteren.")
        }
        nextRecognition.onaudiostart = () => {
            setStatus("Microfoon actief · spreek je publieke vraag in…")
        }
        nextRecognition.onspeechstart = () => {
            setStatus("Spraak gehoord · Karen herkent je vraag…")
        }
        nextRecognition.onerror = (event) => {
            if (hasTranscript) return
            setListening(false)
            if (voiceTimeout.current !== null) window.clearTimeout(voiceTimeout.current)
            voiceTimeout.current = null
            const messages: Record<string, string> = {
                "no-speech": "Geen spraak ontvangen. Spreek meteen na het indrukken van de microfoon.",
                "not-allowed": "Microfoontoegang geweigerd. Sta microfoontoegang toe voor Framer in je browserinstellingen.",
                "service-not-allowed": "De browser blokkeert zijn spraakherkenningsdienst voor deze pagina.",
                "audio-capture": "De browser vindt geen werkende microfoon. Controleer je invoerapparaat.",
                network: "De browser-spraakdienst is niet bereikbaar. Controleer je verbinding en probeer opnieuw.",
                "language-not-supported": "Deze browser-spraakdienst ondersteunt nl-BE niet. Typ je vraag hieronder.",
                aborted: "Spraakherkenning is gestopt. Typ je vraag of probeer opnieuw.",
            }
            setVoiceError(messages[event.error || ""] || `Spraakherkenning mislukte${event.error ? ` (${event.error})` : ""}. Typ je vraag of probeer opnieuw.`)
        }
        nextRecognition.onend = () => {
            setListening(false)
            if (voiceTimeout.current !== null) window.clearTimeout(voiceTimeout.current)
            voiceTimeout.current = null
            setRecognition(null)
        }
        try {
            setRecognition(nextRecognition)
            setListening(true)
            setStatus("Karen luistert… Spreek nu je publieke vraag in.")
            nextRecognition.start()
            voiceTimeout.current = window.setTimeout(() => {
                nextRecognition.stop()
                setListening(false)
                setVoiceError("Geen vraag herkend. Typ je vraag of probeer de microfoon opnieuw.")
            }, 15000)
        } catch {
            setListening(false)
            setRecognition(null)
            setVoiceError("De microfoon kon niet starten. Controleer de browsertoestemming.")
        }
    }

    function stopVoice() {
        recognition?.stop()
        setListening(false)
        if (voiceTimeout.current !== null) window.clearTimeout(voiceTimeout.current)
        voiceTimeout.current = null
    }

    const sources = reply?.sources ?? []

    return (
        <div className="ea" style={style}>
            <style dangerouslySetInnerHTML={{ __html: css }} />
            <section className="ea-panel ea-main">
                <div className="ea-brand"><img className="ea-mark" src={KAREN_LOGO} alt="Karen-logo" /><span><strong>EnergyAgent</strong><br />EEN HELDERE KIJK OP ENERGIE</span></div>
                <div className="ea-kicker">Energy co-pilot</div>
                <h1>Praat met Karen.<br />Begrijp je energie.</h1>
                <p className="ea-sub">Vraag naar je factuur, energieverbruik of verwarming. Karen laat zien waarop haar antwoord steunt.</p>
                <div className="ea-thread" aria-live="polite">
                    {asked && <div className="ea-question">{asked}</div>}
                    {(busy || uploading || listening) && <div className="ea-state"><span className="ea-dot" />{status}</div>}
                    {reply && <><div className="ea-answer">{reply.answer}</div>{!apiEndpoint.trim() && <div className="ea-foot">Gesimuleerd antwoord om de interface te bekijken.</div>}{reply.petra_speech_token && !sessionId && !petraAudioUrl && (petraBusy ? <p className="ea-foot" role="status">Antwoord klaar. Audio wordt voorbereid; dit kan even duren.</p> : <button className="ea-voice-play" onClick={() => void playPetra(reply.petra_speech_token!)}>Beluister Karen</button>)}{petraAudioUrl && <audio className="ea-audio" controls src={petraAudioUrl} />}{petraError && <p className="ea-foot" role="status">{petraError}</p>}</>}
                </div>
                {!asked && <button className="ea-source" onClick={() => void ask(sampleQuestion)} style={{ border: 0, background: "#f2f7ef", borderRadius: 12, padding: 12, marginBottom: 12, textAlign: "left", cursor: "pointer" }}><strong>Probeer de voorbeeldvraag</strong><small>{sampleQuestion}</small></button>}
                <button className="ea-mic" type="button" data-listening={listening} onClick={() => listening ? stopVoice() : startVoice()} disabled={busy || uploading || Boolean(sessionId)} aria-label={listening ? "Stop luisteren" : "Stel je vraag met je stem"}>
                    <span aria-hidden="true">{listening ? "■" : "🎙"}</span>{listening ? "Stop luisteren" : "Stel je vraag met je stem"}
                </button>
                {voiceError && <p className="ea-foot" role="alert" style={{ color: "#a13333" }}>{voiceError}</p>}
                {voiceDraft && <p className="ea-foot" role="status">Controleer de herkende vraag hieronder. Je kunt die aanpassen voordat Karen zoekt.</p>}
                <div className="ea-controls">
                    <input className="ea-input" value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => event.key === "Enter" && void ask(question)} placeholder="Vraag aan Karen…" aria-label="Vraag aan Karen" disabled={busy || uploading} />
                    <button className="ea-button" onClick={() => void ask(question)} disabled={busy || uploading || !question.trim()} aria-label="Verstuur vraag">↗</button>
                </div>
                {answerError && <p className="ea-foot" role="alert" style={{ color: "#a13333" }}>{answerError}</p>}
                <p className="ea-foot">Je browser herkent je gesproken vraag. Controleer de tekst voor je die verstuurt; Karen verwerkt en beantwoordt de vraag. Voor aanbiedingen deelt Karen je gewest, postcode, energietype, jaarverbruik en eventueel expliciet opgegeven meter- en prosumentgegevens met Browser Use en de officiële vergelijker; deze invoer blijft maximaal 60 minuten in sessiegeheugen. Deel geen factuurgegevens via voice. Voice is uitgeschakeld bij een actieve PDF. Publieke energievragen gebruiken Gemma en zo nodig officiële webbronnen via Browserbase. Alleen om Karens publieke antwoord uit te spreken gaat de antwoordtekst naar de Babbeldoos-stemservice, met de Vlaamse Petra-stem; PDF-antwoorden blijven op Karen’s backend.</p>
            </section>
            <aside className="ea-rail">
                <section className="ea-card"><h2>Jouw factuur</h2><p>Optioneel · PDF naar Karen’s backend; tekst tijdelijk in sessiegeheugen (max. 60 min), zonder extern model. Maximaal 15 MB en 30 pagina’s.</p>
                    <input type="file" accept="application/pdf,.pdf" aria-label="Upload je energiefactuur als PDF" disabled={uploading || busy || listening} onChange={(event) => { void uploadPdf(event.target.files?.[0]); event.target.value = "" }} style={{ marginTop: 12, width: "100%", fontSize: 11 }} />
                    {uploadName && <p style={{ marginTop: 8 }}>Sessie actief · {uploadName}<button type="button" onClick={() => void clearPdf()} disabled={uploading || busy} style={{ marginLeft: 8 }}>Verwijder</button></p>}
                    {uploadError && <p role="alert" style={{ marginTop: 8, color: "#a13333" }}>{uploadError}</p>}
                    {uploading && <p role="status" style={{ marginTop: 8 }}>{status}</p>}
                </section>
                <section className="ea-card"><h2>{reply ? "Bronnen bij dit antwoord" : "Bronnen in de demo"}</h2><p>{reply?.live_source_status === "failed" ? "De live controle is niet volledig bevestigd. Gebruikte passages en links om zelf te raadplegen staan apart." : reply ? "Bronnen die Karen voor dit antwoord gebruikte." : "Officiële uitleg en relevante PDF-passage."}</p>
                    {sources.map((source, index) => <div className="ea-source" key={`${source.title}-${index}`}>
                        {source.url ? <a href={source.url} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}><strong>{source.title} ↗</strong><small>{source.detail || "Bron geraadpleegd"}</small></a> : <><strong>{source.title}</strong><small>{source.detail || "Bron geraadpleegd"}</small></>}
                        {source.excerpt && <p className="ea-excerpt">“{source.excerpt}”</p>}
                    </div>)}
                    {!sources.length && <p style={{ marginTop: 14 }}>{reply ? "Geen bronpassage bevestigd voor dit antwoord." : "Na de vraag toont Karen hier de gebruikte bronnen."}</p>}
                    {Boolean(reply?.suggested_sources?.length) && <div style={{ marginTop: 18 }}><h3 style={{ fontSize: 12 }}>Zelf raadplegen · niet als bewijs gebruikt</h3>{reply?.suggested_sources?.map((source, index) => <div className="ea-source" key={`suggested-${index}`}><a href={source.url} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}><strong>{source.title} ↗</strong><small>{source.detail}</small></a></div>)}</div>}
                </section>
            </aside>
        </div>
    )
}

